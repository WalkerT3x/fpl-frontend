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
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-4 animate-fade-in-up">
        
        {/* THE GLASS CARD */}
        <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-8 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.8)] border-2 border-white/20 overflow-hidden">
          
          {/* INNER GLOWING HUES */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00ff87] rounded-full mix-blend-screen filter blur-[80px] opacity-50 pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#9d00ff] rounded-full mix-blend-screen filter blur-[80px] opacity-50 pointer-events-none"></div>

          <div className="relative z-10">
            
            {/* BRANDING HEADER */}
            <div className="text-center mb-8 flex flex-col items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" 
                alt="Premier League" 
                referrerPolicy="no-referrer"
                className="w-48 md:w-56 h-auto mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                style={{ filter: 'brightness(0) invert(1)' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-3">
                <span className="text-white">FPL</span> <span className="text-[#00ff87] drop-shadow-[0_0_15px_rgba(0,255,135,0.5)]">Assistant</span>
              </h1>
              
              <p className="text-gray-300 font-medium tracking-wide text-sm md:text-base drop-shadow-md">
                Take your team to the next level.
              </p>
            </div>

            <div className="w-full h-px bg-white/10 mb-8"></div>

            {/* MODERN INPUT SECTION */}
            <div className="mb-8">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                Add Team ID
              </label>
              <div className="flex gap-3">
                <input 
                  type="number" 
                  placeholder="e.g. 1112720" 
                  className="flex-1 p-4 rounded-xl text-white bg-black/30 border border-white/10 outline-none focus:border-[#00ff87]/50 focus:ring-1 focus:ring-[#00ff87]/50 font-black text-lg placeholder-gray-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
                  value={newTeamId}
                  onChange={(e) => setNewTeamId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTeam(); }}
                />
                <button 
                  onClick={handleSaveTeam}
                  disabled={!newTeamId}
                  className="bg-gradient-to-b from-[#00ff87] to-[#00cc6a] text-[#37003c] font-black px-8 rounded-xl border-b-4 border-[#00994f] hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:hover:brightness-100 disabled:active:border-b-4 disabled:active:translate-y-0 shadow-[0_0_15px_rgba(0,255,135,0.3)] disabled:shadow-none"
                >
                  Save
                </button>
              </div>
            </div>

            {/* MODERN SAVED TEAMS LIST */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                Saved Teams
              </label>
              
              <div className="bg-[#1a001f]/60 rounded-2xl border border-white/10 overflow-hidden backdrop-blur-md">
                {teamHistory.length === 0 ? (
                  <div className="text-center text-gray-500 py-8 text-sm font-medium">
                    No teams saved yet.
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {teamHistory.map((id, index) => (
                      <div 
                        key={id} 
                        className={`flex items-center justify-between p-4 hover:bg-white/5 transition-colors ${index !== teamHistory.length - 1 ? 'border-b border-white/5' : ''}`}
                      >
                        
                        <div className="flex items-center gap-4">
                          {/* GLOWING ID BADGE */}
                          <div className="w-10 h-10 rounded-xl bg-transparent border-2 border-[#00ff87] flex items-center justify-center shadow-[0_0_12px_rgba(0,255,135,0.4)]">
                            <span className="text-[#00ff87] text-xs font-black tracking-wider drop-shadow-[0_0_4px_rgba(0,255,135,0.8)]">ID</span>
                          </div>
                          <span className="font-black text-xl text-white tracking-wide">{id}</span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => handleRemoveTeam(id)}
                            className="text-gray-400 hover:text-red-400 text-xs font-bold px-2 py-2 transition-colors hover:bg-red-500/10 rounded-lg"
                          >
                            Remove
                          </button>
                          
                          {/* 3D LOAD BUTTON */}
                          <button 
                            onClick={() => fetchTeam(id)}
                            disabled={loading}
                            className="bg-gradient-to-b from-[#00ff87] to-[#00cc6a] text-[#37003c] font-black text-sm px-6 py-2.5 rounded-xl border-b-4 border-[#00994f] hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:hover:brightness-100 disabled:active:border-b-4 disabled:active:translate-y-0 shadow-[0_0_15px_rgba(0,255,135,0.3)] disabled:shadow-none"
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
              <div className="mt-6 text-red-300 font-bold bg-red-900/30 p-4 rounded-xl border border-red-500/30 text-center text-sm backdrop-blur-md">
                {error}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}