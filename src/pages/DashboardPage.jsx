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
        
        {/* THE GLASS CARD - Reduced padding on mobile */}
        <div className="relative bg-black/40 backdrop-blur-xl rounded-3xl p-5 sm:p-8 md:p-10 shadow-[0_0_40px_rgba(0,0,0,0.8)] border border-white/10 overflow-hidden">
          
          {/* INNER GLOWING HUES */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00ff87] rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#9d00ff] rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none"></div>

          <div className="relative z-10">
            
            {/* BRANDING HEADER - Smaller logo and text on mobile */}
            <div className="text-center mb-6 sm:mb-8 flex flex-col items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" 
                alt="Premier League" 
                referrerPolicy="no-referrer"
                className="w-32 sm:w-48 md:w-56 h-auto mb-4 sm:mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                style={{ filter: 'brightness(0) invert(1)' }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter mb-2 sm:mb-3">
                <span className="text-white">FPL</span> <span className="text-[#00ff87] drop-shadow-[0_0_15px_rgba(0,255,135,0.5)]">Assistant</span>
              </h1>
              
              <p className="text-gray-300 font-medium tracking-wide text-xs sm:text-sm md:text-base drop-shadow-md">
                Take your team to the next level.
              </p>
            </div>

            <div className="w-full h-px bg-white/10 mb-6 sm:mb-8"></div>

            {/* UNIFIED INPUT SECTION */}
            <div className="mb-6 sm:mb-8">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
                Add Team ID
              </label>
              
              <div className="flex bg-[#120016]/80 border border-white/10 rounded-xl p-1.5 sm:p-2 focus-within:border-[#00ff87] focus-within:shadow-[0_0_15px_rgba(0,255,135,0.3)] transition-all items-center w-full">
                <input 
                  type="number" 
                  placeholder="e.g. 1112720" 
                  className="min-w-0 flex-1 bg-transparent text-white px-2 sm:px-3 outline-none font-black text-base sm:text-lg placeholder-gray-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={newTeamId}
                  onChange={(e) => setNewTeamId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTeam(); }}
                />
                <button 
                  onClick={handleSaveTeam}
                  disabled={!newTeamId}
                  className="shrink-0 bg-[#00ff87]/10 border border-[#00ff87] text-[#00ff87] font-black tracking-wider uppercase text-[10px] sm:text-xs px-3 sm:px-6 py-2 sm:py-2.5 rounded-lg shadow-[0_0_10px_rgba(0,255,135,0.3)] hover:bg-[#00ff87]/20 hover:shadow-[0_0_15px_rgba(0,255,135,0.5)] active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none disabled:hover:bg-[#00ff87]/10"
                >
                  Save
                </button>
              </div>
            </div>

            {/* MODERN SAVED TEAMS LIST */}
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 sm:mb-3">
                Saved Teams
              </label>
              
              <div className="bg-[#120016]/80 rounded-2xl border border-white/10 overflow-hidden">
                {teamHistory.length === 0 ? (
                  <div className="text-center text-gray-500 py-6 sm:py-8 text-xs sm:text-sm font-medium">
                    No teams saved yet.
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {teamHistory.map((id, index) => (
                      <div 
                        key={id} 
                        className={`flex items-center justify-between p-3 sm:p-4 hover:bg-white/5 transition-colors ${index !== teamHistory.length - 1 ? 'border-b border-white/5' : ''}`}
                      >
                        
                        <div className="flex items-center gap-2 sm:gap-3">
                          {/* TINY NEON PURPLE ID BADGE */}
                          <div className="w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center border border-[#d946ef] shadow-[0_0_8px_rgba(217,70,239,0.4)]">
                            <span className="text-[#d946ef] text-[7px] sm:text-[8px] font-black tracking-widest drop-shadow-[0_0_2px_rgba(217,70,239,0.8)]">ID</span>
                          </div>
                          <span className="font-black text-base sm:text-lg text-white tracking-wide">{id}</span>
                        </div>
                        
                        <div className="flex items-center gap-1 sm:gap-3">
                          <button 
                            onClick={() => handleRemoveTeam(id)}
                            className="text-[#ff4a4a]/60 hover:text-[#ff4a4a] text-[10px] sm:text-xs font-bold px-1 sm:px-2 py-2 transition-colors uppercase tracking-wider"
                          >
                            Remove
                          </button>
                          
                          <button 
                            onClick={() => fetchTeam(id)}
                            disabled={loading}
                            className="px-3 sm:px-6 py-2 rounded-xl bg-[#00ff87]/10 border-2 border-[#00ff87] text-[#00ff87] font-black tracking-wider uppercase text-[10px] sm:text-xs shadow-[0_0_15px_rgba(0,255,135,0.4),inset_0_0_10px_rgba(0,255,135,0.2)] hover:bg-[#00ff87]/20 hover:shadow-[0_0_25px_rgba(0,255,135,0.8),inset_0_0_15px_rgba(0,255,135,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none"
                          >
                            {loading ? '...' : 'Load'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-4 sm:mt-6 text-red-300 font-bold bg-red-900/30 p-3 sm:p-4 rounded-xl border border-red-500/30 text-center text-xs sm:text-sm backdrop-blur-md">
                {error}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}