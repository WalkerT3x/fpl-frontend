import { useState, useEffect } from 'react';

function App() {
  const savedId = localStorage.getItem('fplTeamId') || '';
  const [teamId, setTeamId] = useState(savedId);
  const [starting11, setStarting11] = useState(null);
  const [bench, setBench] = useState(null);
  const [currentGw, setCurrentGw] = useState(11);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('Pick Team');
  const [chips, setChips] = useState(null);
  const [loadingChips, setLoadingChips] = useState(false);

  // State to hold the ACTUAL teams from the FPL API
  const [leagueTeams, setLeagueTeams] = useState([]);

  useEffect(() => {
    // Fetch the real teams from the API on load
    fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
      .then(res => res.json())
      .then(data => {
        setLeagueTeams(data.teams);
      })
      .catch(err => console.error("Error fetching teams:", err));
  }, []);

  const fetchTeam = async () => {
    if (!teamId) return;
    setLoading(true);
    setError('');
    setStarting11(null);
    setBench(null);
    localStorage.setItem('fplTeamId', teamId);

    try {
      const response = await fetch('https://fpl-backend-c25x.onrender.com/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: parseInt(teamId), free_transfers: 1, manual_transfers: [] })
      });
      
      if (!response.ok) throw new Error('Failed to optimize team');
      const data = await response.json();
      
      setStarting11(data.starting_11);
      setBench(data.bench);
      setCurrentGw(data.current_gw);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChips = async () => {
    if (!teamId) return;
    setLoadingChips(true);
    setError('');

    try {
      const response = await fetch(`https://fpl-backend-c25x.onrender.com/api/chips/${teamId}`);
      if (!response.ok) throw new Error('Failed to fetch chips');
      const data = await response.json();
      setChips(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingChips(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Tokens' && teamId && !chips) {
      fetchChips();
    }
  }, [activeTab]);

  const PlayerCard = ({ player }) => {
    const points = player.proj && player.proj[String(currentGw)] !== undefined 
      ? parseFloat(player.proj[String(currentGw)]).toFixed(1) 
      : '0.0';

    return (
      <div className="flex flex-col items-center w-[76px] md:w-24 group cursor-pointer relative mt-10">
        
        <div className="absolute -top-10 md:-top-14 w-16 h-16 md:w-20 md:h-20 z-10 transition-transform group-hover:-translate-y-1">
          <img 
            src={player.shirt_url}
            alt={player.team}
            className="w-full h-full object-contain drop-shadow-md"
            onError={(e) => { e.target.src = 'https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0_1-110.png'; }} 
          />
        </div>

        <div className="bg-white text-black w-full pt-6 pb-1 rounded shadow-md border-b-4 border-gray-300 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#37003c] text-white w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-50">
            <span className="font-bold text-xs md:text-sm">{points}</span>
          </div>

          <div className="font-bold text-[11px] md:text-sm truncate px-1 leading-tight text-center">{player.name}</div>
          <div className="text-[9px] md:text-xs text-gray-500 font-bold text-center">{player.position}</div>
        </div>
      </div>
    );
  };

  const getPlayers = (arr, pos) => {
    if (!arr) return [];
    return arr.filter(p => p.position === pos);
  };

  const PitchView = ({ squad, subs }) => (
    <div className="w-full flex flex-col gap-6 animate-fade-in-up">
      <div className="relative overflow-hidden rounded-xl shadow-2xl border-4 border-[#008f2d]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#00a838] to-[#00c943]"></div>
        <div className="absolute inset-4 border-2 border-white/20 rounded pointer-events-none"></div>
        <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 border-2 border-white/20 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-6 md:gap-10 py-12 px-2">
          <div className="flex justify-center gap-2 md:gap-10">
            {getPlayers(squad, 'FWD').map((p, i) => <PlayerCard key={i} player={p} />)}
          </div>
          <div className="flex justify-center gap-2 md:gap-8">
            {getPlayers(squad, 'MID').map((p, i) => <PlayerCard key={i} player={p} />)}
          </div>
          <div className="flex justify-center gap-2 md:gap-8">
            {getPlayers(squad, 'DEF').map((p, i) => <PlayerCard key={i} player={p} />)}
          </div>
          <div className="flex justify-center">
            {getPlayers(squad, 'GK').map((p, i) => <PlayerCard key={i} player={p} />)}
          </div>
        </div>
      </div>

      <div className="bg-[#250028] rounded-xl p-4 pt-8 shadow-xl border border-[#4a0050]">
        <h3 className="text-center text-[#00ff87] font-black mb-6 uppercase tracking-widest text-sm">Substitutes</h3>
        <div className="flex justify-center gap-4 md:gap-12">
          {subs && subs.map((p, i) => <PlayerCard key={i} player={p} />)}
        </div>
      </div>
    </div>
  );

  const KitTester = () => (
    <div className="w-full mt-16 bg-[#250028] p-4 md:p-6 rounded-xl border border-[#4a0050]">
      <h2 className="text-2xl font-black text-[#00ff87] mb-2 text-center uppercase tracking-widest">Visual Kit Tester</h2>
      <p className="text-center text-gray-300 mb-6 text-sm">Base = Home Kit. _1 = Goalkeeper. _2 = Away. _3 = Third.</p>
      
      <div className="flex flex-col gap-4">
        {leagueTeams.map(t => (
          <div key={t.id} className="flex flex-col md:flex-row items-center bg-[#37003c] p-3 rounded shadow border border-[#4a0050]">
            <div className="w-full md:w-32 font-bold text-[#00ff87] text-sm md:text-base mb-2 md:mb-0 border-b md:border-b-0 md:border-r border-[#4a0050] pb-1 md:pb-0 pr-2">
              {t.name} <span className="text-gray-500 text-xs text-normal">(Code: {t.code})</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-8 flex-1 justify-around w-full">
              
              {/* BASE URL (HOME) */}
              <div className="flex flex-col items-center w-[30px] md:w-12">
                <img 
                  src={`https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${t.code}-110.png`}
                  alt={`${t.name} Home`}
                  className="w-8 h-8 md:w-12 md:h-12 object-contain"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                <span className="text-[10px] md:text-xs text-green-400 mt-1 font-bold">Base</span>
              </div>

              {/* SUFFIXES (GK, AWAY, THIRD) */}
              {[1, 2, 3].map(kitNum => (
                <div key={kitNum} className="flex flex-col items-center w-[30px] md:w-12">
                  <img 
                    src={`https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${t.code}_${kitNum}-110.png`}
                    alt={`${t.name} ${kitNum}`}
                    className="w-8 h-8 md:w-12 md:h-12 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-[10px] md:text-xs text-gray-400 mt-1">_{kitNum}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#37003c] text-white font-sans pb-10">
      
      <nav className="bg-[#250028] border-b border-[#4a0050] shadow-xl mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00ff87] rounded-full flex items-center justify-center">
              <span className="text-[#37003c] font-black text-xl">G</span>
            </div>
            <span className="font-black text-xl tracking-wider">FPL GENIUS</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-bold text-gray-300">
            {['Pick Team', 'Points', 'Transfers', 'Tokens'].map(tab => (
              <span 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer transition-colors ${activeTab === tab ? 'text-[#00ff87]' : 'hover:text-white'}`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        
        <div className="flex gap-2 w-full max-w-md mb-8 bg-[#250028] p-4 rounded-xl shadow-lg border border-[#4a0050]">
          <input 
            type="number" 
            placeholder="Enter Team ID" 
            className="flex-1 p-3 rounded-lg text-black bg-white outline-none focus:ring-2 focus:ring-[#00ff87] font-bold"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
          />
          <button 
            onClick={activeTab === 'Tokens' ? fetchChips : fetchTeam}
            className="bg-[#00ff87] hover:bg-green-400 text-[#37003c] font-black py-3 px-6 rounded-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            disabled={loading || loadingChips}
          >
            {loading || loadingChips ? '...' : 'Optimize'}
          </button>
        </div>

        {error && <div className="text-red-400 font-bold mb-4 bg-red-900/30 p-3 rounded-lg border border-red-500">{error}</div>}

        {activeTab === 'Pick Team' && (
          <>
            {starting11 && <PitchView squad={starting11} subs={bench} />}
            <KitTester />
          </>
        )}

        {activeTab === 'Tokens' && chips && (
          <div className="w-full flex flex-col gap-8 animate-fade-in-up">
            <div className="bg-[#250028] rounded-xl p-6 shadow-xl border border-[#4a0050]">
              <h2 className="text-2xl font-black text-[#00ff87] mb-4 text-center">Chip Strategy</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#37003c] p-4 rounded border border-[#4a0050]">
                  <h3 className="font-bold text-yellow-400">Bench Boost</h3>
                  <p className="text-sm text-gray-300">Target: <strong className="text-white">GW {chips.chip_advice.bench_boost.gw}</strong></p>
                  <p className="text-xs text-gray-400 mt-1">{chips.chip_advice.bench_boost.reason}</p>
                </div>
                <div className="bg-[#37003c] p-4 rounded border border-[#4a0050]">
                  <h3 className="font-bold text-yellow-400">Triple Captain</h3>
                  <p className="text-sm text-gray-300">Target: <strong className="text-white">GW {chips.chip_advice.triple_captain.gw}</strong></p>
                  <p className="text-xs text-gray-400 mt-1">{chips.chip_advice.triple_captain.reason}</p>
                </div>
                <div className="bg-[#37003c] p-4 rounded border border-[#4a0050]">
                  <h3 className="font-bold text-yellow-400">Free Hit</h3>
                  <p className="text-sm text-gray-300">Target: <strong className="text-white">GW {chips.chip_advice.free_hit.gw}</strong></p>
                  <p className="text-xs text-gray-400 mt-1">{chips.chip_advice.free_hit.reason}</p>
                </div>
                <div className="bg-[#37003c] p-4 rounded border border-[#4a0050]">
                  <h3 className="font-bold text-yellow-400">Wildcard</h3>
                  <p className="text-sm text-gray-300">Target: <strong className="text-white">GW {chips.chip_advice.wildcard.gw}</strong></p>
                  <p className="text-xs text-gray-400 mt-1">{chips.chip_advice.wildcard.reason}</p>
                </div>
              </div>
            </div>

            <div className="bg-[#250028] rounded-xl p-6 shadow-xl border border-[#4a0050]">
              <h2 className="text-xl font-black text-[#00ff87] mb-2 text-center uppercase tracking-widest">Free Hit Draft</h2>
              <p className="text-center text-sm text-gray-400 mb-6">The mathematically perfect 11 for this week.</p>
              <PitchView squad={chips.free_hit_team.starting_11} subs={chips.free_hit_team.bench} />
            </div>
          </div>
        )}

        {activeTab !== 'Pick Team' && activeTab !== 'Tokens' && (
          <div className="text-center text-gray-400 mt-20">
            <h2 className="text-2xl font-bold mb-2">{activeTab} Page</h2>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}} />
    </div>
  );
}

export default App;