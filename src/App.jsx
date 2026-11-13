import { useState, useEffect } from 'react';

function App() {
  // Check if we have a saved Team ID in the browser's memory
  const savedId = localStorage.getItem('fplTeamId') || '';
  
  const [teamId, setTeamId] = useState(savedId);
  const [starting11, setStarting11] = useState(null);
  const [bench, setBench] = useState(null);
  const [currentGw, setCurrentGw] = useState(11);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTeam = async () => {
    if (!teamId) return;
    setLoading(true);
    setError('');
    setStarting11(null);
    setBench(null);

    // Save the Team ID to the browser's memory
    localStorage.setItem('fplTeamId', teamId);

    try {
      const response = await fetch('https://fpl-backend-c25x.onrender.com/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          team_id: parseInt(teamId), 
          free_transfers: 1, 
          manual_transfers: [] 
        })
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

  const PlayerCard = ({ player }) => (
    <div className="flex flex-col items-center w-[72px] md:w-20 lg:w-24">
      <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-white rounded-full flex items-center justify-center border-b-4 border-gray-300 shadow-md mb-1">
        <span className="text-[#37003c] font-bold text-sm md:text-lg">
          {player.proj ? parseFloat(player.proj[currentGw] || 0).toFixed(1) : '0.0'}
        </span>
      </div>
      <div className="bg-white text-black w-full text-center py-1 rounded shadow-sm border border-gray-200">
        <div className="font-bold text-[10px] md:text-xs lg:text-sm truncate px-1 leading-tight">{player.name}</div>
        <div className="text-[8px] md:text-[10px] lg:text-xs text-gray-500 font-semibold">{player.position}</div>
      </div>
    </div>
  );

  const getPlayers = (arr, pos) => {
    if (!arr) return [];
    return arr.filter(p => p.position === pos);
  };

  return (
    <div className="min-h-screen bg-[#37003c] text-white flex flex-col items-center pt-10 px-4 font-sans pb-10">
      
      <h1 className="text-4xl font-bold mb-2">FPL Genius</h1>
      <p className="text-[#00ff87] mb-6 font-semibold">Your Mathematical Assistant</p>

      <div className="flex gap-2 w-full max-w-md mb-8">
        <input 
          type="number" 
          placeholder="Enter Team ID" 
          className="flex-1 p-3 rounded text-black bg-white outline-none focus:ring-2 focus:ring-[#00ff87]"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />
        <button 
          onClick={fetchTeam}
          className="bg-[#00ff87] hover:bg-green-400 text-[#37003c] font-bold py-3 px-6 rounded transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Optimizing...' : 'Optimize Team'}
        </button>
      </div>

      {error && <div className="text-red-400 font-bold mb-4">{error}</div>}

      {starting11 && (
        <div className="w-full max-w-5xl flex flex-col gap-6">
          
          {/* THE PITCH */}
          <div className="bg-[#00b83b] rounded-lg p-2 md:p-6 relative overflow-hidden shadow-2xl border-4 border-[#008f2d]">
            <div className="absolute inset-2 border-2 border-white/30 rounded pointer-events-none"></div>
            <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-white/30 pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 border-2 border-white/30 rounded-full pointer-events-none"></div>

            <div className="relative z-10 flex flex-col gap-4 md:gap-8 py-4">
              <div className="flex justify-center gap-2 md:gap-8">
                {getPlayers(starting11, 'FWD').map((p, i) => <PlayerCard key={i} player={p} />)}
              </div>
              <div className="flex justify-center gap-2 md:gap-6">
                {getPlayers(starting11, 'MID').map((p, i) => <PlayerCard key={i} player={p} />)}
              </div>
              <div className="flex justify-center gap-2 md:gap-6">
                {getPlayers(starting11, 'DEF').map((p, i) => <PlayerCard key={i} player={p} />)}
              </div>
              <div className="flex justify-center">
                {getPlayers(starting11, 'GK').map((p, i) => <PlayerCard key={i} player={p} />)}
              </div>
            </div>
          </div>

          {/* THE BENCH */}
          <div className="bg-[#250028] rounded-lg p-4 shadow-xl border border-[#4a0050]">
            <h3 className="text-center text-[#00ff87] font-bold mb-4 uppercase tracking-wider text-sm">Bench</h3>
            <div className="flex justify-center gap-4 md:gap-12">
              {bench && bench.map((p, i) => <PlayerCard key={i} player={p} />)}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default App;