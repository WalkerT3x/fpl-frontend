import { useState } from 'react';

export default function DashboardPage({ 
  teamHistory, 
  setTeamHistory, 
  fetchTeam, 
  loading, 
  error 
}) {
  const [newTeamId, setNewTeamId] = useState('');

  const handleSaveTeam = () => {
    if (!newTeamId || teamHistory.includes(newTeamId)) return;
    const updated = [...teamHistory, newTeamId];
    setTeamHistory(updated);
    localStorage.setItem('fplTeamHistory', JSON.stringify(updated));
    setNewTeamId('');
  };

  const handleRemoveTeam = (idToRemove) => {
    const updated = teamHistory.filter(id => id !== idToRemove);
    setTeamHistory(updated);
    localStorage.setItem('fplTeamHistory', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col items-center justify-center overflow-hidden bg-[#37003c]">
      
      {/* BACKGROUND GRAPHICS - Mimicking the FPL Banner */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#37003c] via-[#2a0030] to-[#004d2a] opacity-90"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00ff87] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#04f5ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 animate-fade-in-up">
        
        {/* LOGOS & HEADER */}
        <div className="text-center mb-10 flex flex-col items-center">
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" 
            alt="Premier League" 
            className="w-20 h-20 mb-4 drop-shadow-2xl"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2 italic">
            FPL <span className="text-[#00ff87]">GENIUS</span>
          </h1>
          <p className="text-gray-300 font-medium tracking-wide text-sm md:text-base">
            The ultimate AI mathematical optimizer.
          </p>
        </div>

        {/* THE GLASS CARD */}
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20">
          
          {/* INPUT SECTION */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Add Team ID
            </label>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="e.g. 1112720" 
                className="flex-1 p-3 rounded-xl text-black bg-white/90 outline-none focus:ring-4 focus:ring-[#00ff87]/50 font-black text-lg placeholder-gray-400 transition-all shadow-inner"
                value={newTeamId}
                onChange={(e) => setNewTeamId(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTeam(); }}
              />
              <button 
                onClick={handleSaveTeam}
                disabled={!newTeamId}
                className="bg-[#00ff87] text-[#37003c] font-black px-6 rounded-xl hover:bg-green-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg"
              >
                Save
              </button>
            </div>
          </div>

          {/* SAVED TEAMS LIST */}
          <div>
            <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">
              Saved Teams
            </label>
            <div className="bg-black/20 rounded-xl border border-white/10 overflow-hidden">
              {teamHistory.length === 0 ? (
                <div className="text-center text-gray-400 py-8 text-sm italic">
                  No teams saved yet. Enter an ID above.
                </div>
              ) : (
                <div className="flex flex-col divide-y divide-white/10">
                  {teamHistory.map((id) => (
                    <div key={id} className="flex items-center justify-between p-3 hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#00ff87]/20 flex items-center justify-center">
                          <span className="text-[#00ff87] text-xs font-black">ID</span>
                        </div>
                        <span className="font-black text-lg text-white">{id}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleRemoveTeam(id)}
                          className="text-red-400 hover:text-red-300 text-xs font-bold px-2 py-1 transition-colors"
                        >
                          Remove
                        </button>
                        <button 
                          onClick={() => fetchTeam(id)}
                          disabled={loading}
                          className="bg-[#00ff87] text-[#37003c] font-black text-sm px-5 py-2 rounded-lg hover:bg-green-400 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-md"
                        >
                          {loading ? 'Loading...' : 'Load Team'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 text-red-300 font-bold bg-red-900/50 backdrop-blur-sm p-3 rounded-lg border border-red-500/50 text-center text-sm animate-shake">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}