import { useState, useEffect } from 'react';

export default function TransfersPage({ 
  teamId, 
  manualTransfers, 
  setManualTransfers, 
  fetchTeam, 
  loading,
  error 
}) {
  const [transfers, setTransfers] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [allPlayers, setAllPlayers] = useState([]);

  // Fetch player list for the searchable dropdown
  useEffect(() => {
    fetch('https://fpl-backend-c25x.onrender.com/api/players')
      .then(res => res.json())
      .then(data => {
        if (data.players) setAllPlayers(data.players);
      })
      .catch(err => console.error("Failed to load players", err));
  }, []);

  // Fetch transfer history
  useEffect(() => {
    if (!teamId) return;
    
    setHistoryLoading(true);
    setHistoryError('');

    fetch(`https://fpl-backend-c25x.onrender.com/api/transfers/${teamId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        const sorted = (data.transfers || []).sort((a, b) => b.gw - a.gw);
        setTransfers(sorted);
      })
      .catch(err => setHistoryError(err.message))
      .finally(() => setHistoryLoading(false));
  }, [teamId]);

  const handleTransferChange = (index, field, value) => {
    const newTransfers = [...manualTransfers];
    newTransfers[index][field] = value;
    setManualTransfers(newTransfers);
  };

  const addTransfer = () => {
    if (manualTransfers.length < 5) {
      setManualTransfers([...manualTransfers, { out_player: "", in_player: "" }]);
    }
  };

  const removeTransfer = (index) => {
    const newTransfers = manualTransfers.filter((_, i) => i !== index);
    setManualTransfers(newTransfers);
  };

  if (!teamId) {
    return <div className="text-center text-gray-400 mt-32 text-xl font-bold">Load a team on the Home page to see transfers.</div>;
  }

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in-up mt-8">
      
      {/* --- PLANNER SECTION --- */}
      <div className="bg-[#250028] rounded-xl p-6 md:p-8 shadow-2xl border border-[#4a0050]">
        <h2 className="text-2xl font-black text-[#00ff87] mb-2 text-center uppercase tracking-widest">
          Transfer Planner
        </h2>
        <p className="text-center text-sm text-gray-400 mb-6">Plan up to 5 transfers to see how they affect your squad.</p>
        
        <div className="bg-[#37003c] p-4 rounded-lg border border-[#4a0050]">
          {manualTransfers.length === 0 && (
            <p className="text-xs text-gray-400 mb-3 italic text-center">No transfers planned. Click "Add Transfer" below.</p>
          )}

          {manualTransfers.map((t, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input 
                type="text" 
                list="playerNames"
                placeholder="Player OUT" 
                className="flex-1 p-2 rounded bg-white text-black text-sm outline-none font-bold"
                value={t.out_player}
                onChange={(e) => handleTransferChange(i, 'out_player', e.target.value)}
              />
              <span className="text-[#00ff87] font-bold text-lg">➡️</span>
              <input 
                type="text" 
                list="playerNames"
                placeholder="Player IN" 
                className="flex-1 p-2 rounded bg-white text-black text-sm outline-none font-bold"
                value={t.in_player}
                onChange={(e) => handleTransferChange(i, 'in_player', e.target.value)}
              />
              <button onClick={() => removeTransfer(i)} className="text-red-500 font-bold px-1 hover:text-red-400 text-lg">✕</button>
            </div>
          ))}
          
          <div className="flex justify-between items-center mt-4">
            <button 
              onClick={addTransfer} 
              disabled={manualTransfers.length >= 5}
              className="text-xs bg-[#00ff87] text-[#37003c] font-black px-3 py-1.5 rounded hover:bg-green-400 transition-colors disabled:opacity-50"
            >
              + Add Transfer ({manualTransfers.length}/5)
            </button>

            <button 
              onClick={fetchTeam}
              disabled={loading || manualTransfers.length === 0}
              className="bg-[#00ff87] hover:bg-green-400 text-[#37003c] font-black py-2 px-6 rounded-lg transition-transform hover:scale-105 disabled:opacity-50 text-sm"
            >
              {loading ? 'Optimizing...' : 'Apply & Update Team'}
            </button>
          </div>

          {error && <div className="mt-4 text-red-400 font-bold bg-red-900/30 p-3 rounded border border-red-500 text-center">{error}</div>}

          <datalist id="playerNames">
            {allPlayers.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
        </div>
      </div>

      {/* --- HISTORY SECTION --- */}
      <div className="bg-[#250028] rounded-xl p-6 md:p-8 shadow-2xl border border-[#4a0050]">
        <h2 className="text-2xl font-black text-[#00ff87] mb-6 text-center uppercase tracking-widest">
          Transfer History
        </h2>

        {historyLoading ? (
          <div className="text-center text-gray-400 py-10 animate-pulse">Loading history...</div>
        ) : historyError ? (
          <div className="text-center text-red-400 font-bold bg-red-900/30 p-4 rounded border border-red-500">{historyError}</div>
        ) : transfers.length === 0 ? (
          <div className="text-center text-gray-400 py-10">No transfers found for this season.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {transfers.map((t, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center justify-between bg-[#37003c] p-4 rounded-lg border border-[#4a0050] shadow-md">
                <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-6">
                  <div className="bg-[#00ff87] text-[#37003c] font-black px-4 py-1 rounded-full text-sm">
                    GW {t.gw}
                  </div>
                </div>

                <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full">
                  <div className="flex flex-col items-center md:items-end w-full md:w-1/3">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Out</span>
                    <span className="text-red-400 font-bold text-lg truncate w-full text-center md:text-right">{t.out_name}</span>
                    <span className="text-xs text-gray-500 font-medium">£{t.out_cost}m</span>
                  </div>

                  <div className="text-[#00ff87] font-black text-2xl hidden md:block">
                    ➡️
                  </div>

                  <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-uppercase mb-1">In</span>
                    <span className="text-green-400 font-bold text-lg truncate w-full text-center md:text-left">{t.in_name}</span>
                    <span className="text-xs text-gray-500 font-medium">£{t.in_cost}m</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </div>
  );
}