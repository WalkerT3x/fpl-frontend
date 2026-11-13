import { useState, useEffect } from 'react';

export default function HomePage({ 
  teamId, 
  setTeamId, 
  fetchTeam, 
  loading, 
  error, 
  starting11, 
  manualTransfers, 
  setManualTransfers,
  bank,
  teamValue
}) {
  const [allPlayers, setAllPlayers] = useState([]);

  useEffect(() => {
    // Fetch all player names from our backend for the searchable dropdown
    fetch('https://fpl-backend-c25x.onrender.com/api/players')
      .then(res => res.json())
      .then(data => {
        if (data.players) setAllPlayers(data.players);
      })
      .catch(err => console.error("Failed to load players", err));
  }, []);

  const handleTransferChange = (index, field, value) => {
    const newTransfers = [...manualTransfers];
    newTransfers[index][field] = value;
    setManualTransfers(newTransfers);
  };

  const addTransfer = () => {
    setManualTransfers([...manualTransfers, { out_player: "", in_player: "" }]);
  };

  const removeTransfer = (index) => {
    const newTransfers = manualTransfers.filter((_, i) => i !== index);
    setManualTransfers(newTransfers);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-16 animate-fade-in-up w-full max-w-md mx-auto">
      
      <div className="bg-[#250028] p-8 rounded-xl shadow-2xl border border-[#4a0050] w-full text-center mb-6">
        <h2 className="text-2xl font-black mb-6 text-white">Load Your Team</h2>
        
        <input 
          type="number" 
          placeholder="Enter Team ID" 
          className="w-full p-4 rounded-lg text-black bg-white outline-none focus:ring-2 focus:ring-[#00ff87] font-bold text-lg mb-6"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />
        
        {/* MANUAL TRANSFERS UI */}
        <div className="text-left mb-6 bg-[#37003c] p-4 rounded-lg border border-[#4a0050]">
          <label className="text-sm font-bold text-[#00ff87] mb-3 block uppercase tracking-wider">Manual Transfers (Mid-week)</label>
          
          {manualTransfers.length === 0 && (
            <p className="text-xs text-gray-400 mb-3 italic">No manual transfers added. The API will use your last saved squad.</p>
          )}

          {manualTransfers.map((t, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input 
                type="text" 
                list="playerNames"
                placeholder="OUT" 
                className="flex-1 p-2 rounded bg-white text-black text-sm outline-none font-bold"
                value={t.out_player}
                onChange={(e) => handleTransferChange(i, 'out_player', e.target.value)}
              />
              <span className="text-[#00ff87] font-bold text-lg">➡️</span>
              <input 
                type="text" 
                list="playerNames"
                placeholder="IN" 
                className="flex-1 p-2 rounded bg-white text-black text-sm outline-none font-bold"
                value={t.in_player}
                onChange={(e) => handleTransferChange(i, 'in_player', e.target.value)}
              />
              <button onClick={() => removeTransfer(i)} className="text-red-500 font-bold px-1 hover:text-red-400 text-lg">✕</button>
            </div>
          ))}
          
          <button onClick={addTransfer} className="text-xs bg-[#00ff87] text-[#37003c] font-black px-3 py-1.5 rounded mt-2 hover:bg-green-400 transition-colors">
            + Add Transfer
          </button>
          
          {/* The datalist provides the searchable dropdown for all players */}
          <datalist id="playerNames">
            {allPlayers.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
        </div>

        <button 
          onClick={fetchTeam}
          className="w-full bg-[#00ff87] hover:bg-green-400 text-[#37003c] font-black py-4 rounded-lg transition-transform hover:scale-105 disabled:opacity-50 text-lg shadow-lg"
          disabled={loading}
        >
          {loading ? 'Waking Server & Fetching Data...' : 'Load Team'}
        </button>
        
        {error && <div className="mt-4 text-red-400 font-bold bg-red-900/30 p-3 rounded border border-red-500">{error}</div>}
        
        {/* MONEY DISPLAY */}
        {starting11 && !loading && (
          <div className="mt-6 pt-6 border-t border-[#4a0050]">
            <p className="text-[#00ff87] font-bold text-sm mb-3">✅ Data loaded! Check the tabs above.</p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="bg-[#37003c] px-4 py-2 rounded border border-[#4a0050]">
                <span className="text-gray-400 block text-xs uppercase">Bank</span>
                <span className="font-black text-white text-lg">£{bank}m</span>
              </div>
              <div className="bg-[#37003c] px-4 py-2 rounded border border-[#4a0050]">
                <span className="text-gray-400 block text-xs uppercase">Squad Value</span>
                <span className="font-black text-white text-lg">£{teamValue}m</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}