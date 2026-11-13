export default function HomePage({ teamId, setTeamId, fetchTeam, loading, error, starting11, manualTransfers, setManualTransfers }) {
  
  const handleTransferChange = (index, field, value) => {
    const newTransfers = [...manualTransfers];
    newTransfers[index][field] = value;
    setManualTransfers(newTransfers);
  };

  const addTransfer = () => {
    setManualTransfers([...manualTransfers, { out_player: "", in_player: "" }]);
  };

  return (
    <div className="flex flex-col items-center justify-center mt-16 animate-fade-in-up w-full max-w-md mx-auto">
      
      <div className="bg-[#250028] p-8 rounded-xl shadow-2xl border border-[#4a0050] w-full text-center mb-6">
        <h2 className="text-2xl font-black mb-6 text-white">Load Your Team</h2>
        <input 
          type="number" 
          placeholder="Enter Team ID" 
          className="w-full p-4 rounded-lg text-black bg-white outline-none focus:ring-2 focus:ring-[#00ff87] font-bold text-lg mb-4"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />
        
        {/* MANUAL TRANSFERS UI */}
        <div className="text-left mb-4">
          <label className="text-sm font-bold text-gray-300 mb-2 block">Manual Transfers (Mid-week)</label>
          {manualTransfers.map((t, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input 
                type="text" 
                placeholder="OUT (e.g. Neto)" 
                className="flex-1 p-2 rounded text-sm text-black"
                value={t.out_player}
                onChange={(e) => handleTransferChange(i, 'out_player', e.target.value)}
              />
              <input 
                type="text" 
                placeholder="IN (e.g. Ødegaard)" 
                className="flex-1 p-2 rounded text-sm text-black"
                value={t.in_player}
                onChange={(e) => handleTransferChange(i, 'in_player', e.target.value)}
              />
            </div>
          ))}
          <button onClick={addTransfer} className="text-xs text-[#00ff87] font-bold mt-1 hover:underline">+ Add another transfer</button>
        </div>

        <button 
          onClick={fetchTeam}
          className="w-full bg-[#00ff87] hover:bg-green-400 text-[#37003c] font-black py-4 rounded-lg transition-transform hover:scale-105 disabled:opacity-50 text-lg mt-2"
          disabled={loading}
        >
          {loading ? 'Waking Server & Fetching Data...' : 'Load Team'}
        </button>
        
        {error && <div className="mt-4 text-red-400 font-bold bg-red-900/30 p-3 rounded border border-red-500">{error}</div>}
        
        {starting11 && !loading && (
          <p className="mt-4 text-[#00ff87] font-bold text-sm">Data loaded! Check the tabs above.</p>
        )}
      </div>
    </div>
  );
}