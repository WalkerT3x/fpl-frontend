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
    <div className="w-full max-w-lg mx-auto animate-fade-in-up mt-12 px-4">
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black text-[#00ff87] tracking-wider mb-2">FPL GENIUS</h1>
        <p className="text-gray-400">Add your FPL Team ID to begin</p>
      </div>

      <div className="bg-[#250028] rounded-xl p-6 shadow-2xl border border-[#4a0050]">
        
        {/* Input Section */}
        <div className="flex gap-2 mb-6">
          <input 
            type="number" 
            placeholder="Enter Team ID (e.g. 1112720)" 
            className="flex-1 p-3 rounded-lg text-black bg-white outline-none focus:ring-2 focus:ring-[#00ff87] font-bold"
            value={newTeamId}
            onChange={(e) => setNewTeamId(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTeam(); }}
          />
          <button 
            onClick={handleSaveTeam}
            disabled={!newTeamId}
            className="bg-white text-[#37003c] font-black px-6 rounded-lg hover:bg-gray-200 transition-transform disabled:opacity-50"
          >
            + Save
          </button>
        </div>

        {/* Saved Teams List */}
        <div className="bg-[#37003c] rounded-lg border border-[#4a0050] overflow-hidden">
          <div className="bg-[#250028] px-3 py-2 border-b border-[#4a0050]">
            <span className="text-[#00ff87] font-black text-xs uppercase tracking-wider">
              Saved Teams
            </span>
          </div>
          
          {teamHistory.length === 0 ? (
            <div className="text-center text-gray-400 py-6 text-sm italic">
              No teams saved yet.
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[#4a0050]">
              {teamHistory.map((id) => (
                <div key={id} className="flex items-center justify-between px-4 py-3">
                  <span className="font-bold text-lg">{id}</span>
                  
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => handleRemoveTeam(id)}
                      className="text-red-500 hover:text-red-400 text-xs font-bold px-2"
                    >
                      Remove
                    </button>
                    <button 
                      onClick={() => fetchTeam(id)}
                      disabled={loading}
                      className="bg-[#00ff87] text-[#37003c] font-black text-sm px-4 py-1.5 rounded hover:bg-green-400 transition-transform disabled:opacity-50"
                    >
                      {loading ? 'Loading...' : 'Load Team'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 text-red-400 font-bold bg-red-900/30 p-3 rounded border border-red-500 text-center text-sm">
            {error}
          </div>
        )}
      </div>

    </div>
  );
}