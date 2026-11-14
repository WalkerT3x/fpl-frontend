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
      
      {/* OUTER BACKGROUND GRAPHICS */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#37003c] via-[#2a0030] to-[#004d2a] opacity-90"></div>
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#00ff87] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#04f5ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* MAIN CONTENT - SINGLE BOX */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 animate-fade-in-up">
        
        {/* THE GLASS CARD WITH INNER GLOWS AND BOLDER BORDER */}
        <div className="relative bg-[#0d0010]/80 backdrop-blur-2xl rounded-3xl p-8 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.8)] border-2 border-white/20 overflow-hidden">
          
          {/* INNER GLOWING HUES */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00ff87] rounded-full mix-blend-screen filter blur-[80px] opacity-20 pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#9d00ff] rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none"></div>

          {/* CONTENT WRAPPER (Keeps content above the glows) */}
          <div className="relative z-10">
            
            {/* BRANDING HEADER */}
            <div className="text-center mb-8 flex flex-col items-center">
              {/* Premier League Logo - MASSIVE */}
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" 
                alt="Premier League" 
                referrerPolicy="no-referrer"
                className="w-48 md:w-56 h-auto mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                style={{ filter: 'brightness(0) invert(1)' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              {/* Title: FPL in White, Assistant in Green */}
              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">
                <span className="text-white">FPL</span> <span className="text-[#00ff87]">Assistant</span>
              </h1>
              
              {/* Subtitle: White text */}
              <p className="text-white font-medium tracking-wide text-sm md:text-base drop-shadow-md">
                Take your team to the next level.
              </p>
            </div>

            {/* DIVIDER */}
            <div className="w-full h-px bg-white/10 mb-8"></div>

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
              <div className="bg-black/40 rounded-xl border border-white/10 overflow-hidden">
                {teamHistory.length === 0 ? (
                  <div className="text-center text-gray-400 py-6 text-sm italic">
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
              <div className="mt-4 text-red-300 font-bold bg-red-900/50 p-3 rounded-lg border border-red-500/50 text-center text-sm">
                {error}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}