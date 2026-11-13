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

  // The new, premium Player Card
  const PlayerCard = ({ player }) => {
    // Determine shirt color based on team (simplified for demo)
    const shirtColor = player.team === 'Arsenal' ? 'bg-red-600' : 
                       player.team === 'Man City' ? 'bg-sky-400' : 
                       player.team === 'Brighton' ? 'bg-blue-600' : 'bg-gray-700';

    return (
      <div className="flex flex-col items-center w-[76px] md:w-24 group cursor-pointer">
        
        {/* Shirt Graphic */}
        <div className="relative w-14 h-14 md:w-20 md:h-20 mb-1 flex justify-center items-center">
          {/* The Shirt Shape (CSS) */}
          <div className={`absolute inset-0 ${shirtColor} shadow-lg`} style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 20%, 90% 100%, 10% 100%, 0% 20%)' }}></div>
          
          {/* The Points Bubble overlapping the shirt */}
          <div className="absolute -bottom-2 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-gray-100 z-10 transition-transform group-hover:scale-110">
            <span className="text-[#37003c] font-bold text-xs md:text-sm">
              {player.proj ? parseFloat(player.proj[currentGw] || 0).toFixed(1) : '0.0'}
            </span>
          </div>
        </div>

        {/* Player Name Card */}
        <div className="bg-gradient-to-b from-white to-gray-100 text-black w-full text-center pt-3 pb-1 rounded shadow-md border-b-2 border-gray-300 z-0 transition-transform group-hover:-translate-y-1">
          <div className="font-extrabold text-[11px] md:text-sm truncate px-1 leading-tight">{player.name}</div>
          <div className="text-[9px] md:text-xs text-gray-500 font-semibold">{player.position}</div>
        </div>
      </div>
    );
  };

  const getPlayers = (arr, pos) => {
    if (!arr) return [];
    return arr.filter(p => p.position === pos);
  };

  return (
    <div className="min-h-screen bg-[#37003c] text-white font-sans pb-10">
      
      {/* Navigation Bar */}
      <nav className="bg-[#250028] border-b border-[#4a0050] shadow-xl mb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#00ff87] rounded-full flex items-center justify-center">
              <span className="text-[#37003c] font-black text-xl">G</span>
            </div>
            <span className="font-black text-xl tracking-wider">FPL GENIUS</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-bold text-gray-300">
            <span className="text-[#00ff87] cursor-pointer">Pick Team</span>
            <span className="hover:text-white cursor-pointer transition-colors">Points</span>
            <span className="hover:text-white cursor-pointer transition-colors">Transfers</span>
            <span className="hover:text-white cursor-pointer transition-colors">Tokens</span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        
        {/* Input Section */}
        <div className="flex gap-2 w-full max-w-md mb-8 bg-[#250028] p-4 rounded-xl shadow-lg border border-[#4a0050]">
          <input 
            type="number" 
            placeholder="Enter Team ID" 
            className="flex-1 p-3 rounded-lg text-black bg-white outline-none focus:ring-2 focus:ring-[#00ff87] font-bold"
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
          />
          <button 
            onClick={fetchTeam}
            className="bg-[#00ff87] hover:bg-green-400 text-[#37003c] font-black py-3 px-6 rounded-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            disabled={loading}
          >
            {loading ? '...' : 'Optimize'}
          </button>
        </div>

        {error && <div className="text-red-400 font-bold mb-4 bg-red-900/30 p-3 rounded-lg border border-red-500">{error}</div>}

        {starting11 && (
          <div className="w-full flex flex-col gap-6 animate-fade-in-up">
            
            {/* THE PITCH */}
            <div className="relative overflow-hidden rounded-xl shadow-2xl border-4 border-[#008f2d]">
              
              {/* Pitch Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#00a838] to-[#00c943]"></div>
              
              {/* Pitch Markings */}
              <div className="absolute inset-4 border-2 border-white/20 rounded pointer-events-none"></div>
              <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/20 pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 border-2 border-white/20 rounded-full pointer-events-none"></div>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-t-0 border-white/20 rounded-b-lg pointer-events-none"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-b-0 border-white/20 rounded-t-lg pointer-events-none"></div>

              {/* Players Container */}
              <div className="relative z-10 flex flex-col gap-6 md:gap-10 py-8 px-2">
                <div className="flex justify-center gap-2 md:gap-10">
                  {getPlayers(starting11, 'FWD').map((p, i) => <PlayerCard key={i} player={p} />)}
                </div>
                <div className="flex justify-center gap-2 md:gap-8">
                  {getPlayers(starting11, 'MID').map((p, i) => <PlayerCard key={i} player={p} />)}
                </div>
                <div className="flex justify-center gap-2 md:gap-8">
                  {getPlayers(starting11, 'DEF').map((p, i) => <PlayerCard key={i} player={p} />)}
                </div>
                <div className="flex justify-center">
                  {getPlayers(starting11, 'GK').map((p, i) => <PlayerCard key={i} player={p} />)}
                </div>
              </div>
            </div>

            {/* THE BENCH */}
            <div className="bg-[#250028] rounded-xl p-4 shadow-xl border border-[#4a0050]">
              <h3 className="text-center text-[#00ff87] font-black mb-4 uppercase tracking-widest text-sm">Substitutes</h3>
              <div className="flex justify-center gap-4 md:gap-12">
                {bench && bench.map((p, i) => <PlayerCard key={i} player={p} />)}
              </div>
            </div>

          </div>
        )}
      </div>
      
      {/* Basic CSS animation for loading */}
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