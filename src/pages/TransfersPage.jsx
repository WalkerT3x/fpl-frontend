import { useState, useEffect } from 'react';

export default function TransfersPage({ 
  teamId, 
  manualTransfers, 
  setManualTransfers, 
  fetchTeam, 
  loading,
  error,
  freeTransfers,
  setFreeTransfers,
  transferAdvice
}) {
  const [transfers, setTransfers] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [allPlayers, setAllPlayers] = useState([]);

  // 1. Fetch player list for searchable dropdowns
  useEffect(() => {
    fetch('https://fpl-backend-c25x.onrender.com/api/players')
      .then(res => res.json())
      .then(data => {
        if (data.players) setAllPlayers(data.players);
      })
      .catch(err => console.error("Failed to load players", err));
  }, []);

  // 2. Fetch transfer history
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

  // Group transfer history by Gameweek
  const groupedHistory = transfers.reduce((acc, t) => {
    if (!acc[t.gw]) acc[t.gw] = [];
    acc[t.gw].push(t);
    return acc;
  }, {});

  if (!teamId) {
    return <div className="text-center text-gray-400 mt-32 text-xl font-bold">Load a team on the Home page to see transfers.</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in-up mt-4">
      
      {/* ========================================================
          SECTION 1: MID-WEEK TRANSFERS (MANUAL)
      ======================================================== */}
      <div className="bg-[#250028] rounded-xl p-6 shadow-2xl border border-[#4a0050]">
        <h2 className="text-lg font-black text-[#00ff87] mb-2 uppercase tracking-widest">
          1. Mid-Week Transfers
        </h2>
        <p className="text-xs text-gray-400 mb-4">If you made transfers this week that the FPL API hasn't updated yet, add them here.</p>
        
        <div className="bg-[#37003c] p-4 rounded-lg border border-[#4a0050]">
          {manualTransfers.length === 0 && (
            <p className="text-xs text-gray-400 mb-3 italic text-center py-2">No manual transfers added.</p>
          )}

          {manualTransfers.map((t, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input 
                type="text" 
                list="playerNames"
                placeholder="Player OUT" 
                className="flex-1 p-2 rounded bg-white text-black text-xs md:text-sm outline-none font-bold"
                value={t.out_player}
                onChange={(e) => handleTransferChange(i, 'out_player', e.target.value)}
              />
              <span className="text-[#00ff87] font-bold text-sm">➡️</span>
              <input 
                type="text" 
                list="playerNames"
                placeholder="Player IN" 
                className="flex-1 p-2 rounded bg-white text-black text-xs md:text-sm outline-none font-bold"
                value={t.in_player}
                onChange={(e) => handleTransferChange(i, 'in_player', e.target.value)}
              />
              <button onClick={() => removeTransfer(i)} className="text-red-500 font-bold px-1 hover:text-red-400 text-sm">✕</button>
            </div>
          ))}
          
          <button 
            onClick={addTransfer} 
            disabled={manualTransfers.length >= 5}
            className="mt-2 text-xs bg-[#00ff87] text-[#37003c] font-black px-3 py-1.5 rounded hover:bg-green-400 transition-colors disabled:opacity-50"
          >
            + Add Transfer
          </button>
          
          <datalist id="playerNames">
            {allPlayers.map((name, index) => (
              <option key={index} value={name} />
            ))}
          </datalist>
        </div>
      </div>

      {/* ========================================================
          SECTION 2: TRANSFER PLANNER (AI BRAIN)
      ======================================================== */}
      <div className="bg-[#250028] rounded-xl p-6 shadow-2xl border border-[#4a0050]">
        <h2 className="text-lg font-black text-[#00ff87] mb-4 uppercase tracking-widest">
          2. Transfer Planner
        </h2>
        
        {/* Free Transfers Slider */}
        <div className="mb-6 bg-[#37003c] p-4 rounded-lg border border-[#4a0050] flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold text-gray-300 block mb-1">Available Free Transfers</span>
            <span className="text-xs text-gray-500">Adjust this so the AI knows your limits.</span>
          </div>
          <div className="flex items-center gap-4 w-full md:w-1/2">
            <input 
              type="range" 
              min="0" 
              max="5" 
              step="1"
              value={freeTransfers}
              onChange={(e) => setFreeTransfers(parseInt(e.target.value))}
              className="flex-1 accent-[#00ff87] cursor-pointer"
            />
            <span className="bg-[#00ff87] text-[#37003c] font-black text-lg w-10 h-10 flex items-center justify-center rounded-lg">
              {freeTransfers}
            </span>
          </div>
        </div>

        {/* AI Advice Box */}
        {transferAdvice ? (
          <div className={`p-4 rounded-lg border ${transferAdvice.decision === 'ROLL' ? 'bg-yellow-900/20 border-yellow-700' : 'bg-green-900/20 border-green-700'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-black text-lg uppercase tracking-wider ${transferAdvice.decision === 'ROLL' ? 'text-yellow-400' : 'text-green-400'}`}>
                {transferAdvice.decision === 'ROLL' ? '⏸️ HOLD YOUR TRANSFER' : '✅ TRANSFER RECOMMENDED'}
              </h3>
              <span className="text-xs font-bold bg-[#37003c] px-2 py-1 rounded text-white">
                +{transferAdvice.gain.toFixed(1)} pts
              </span>
            </div>
            <p className="text-sm text-gray-300 mb-4">
              {transferAdvice.reason || "The math has found a mathematically perfect transfer for your team this week."}
            </p>

            {transferAdvice.decision === 'RECOMMENDED' && (
              <div className="flex flex-col gap-2">
                {transferAdvice.out.map((p, i) => {
                   // Match the out and in players by index
                   const inPlayer = transferAdvice.in[i];
                   return (
                     <div key={i} className="flex items-center justify-between bg-[#37003c] p-2 rounded text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-red-400 font-bold">{p.name}</span>
                          <span className="text-gray-500 text-xs">£{p.price10/10}m</span>
                        </div>
                        <span className="text-[#00ff87] font-bold mx-2">➡️</span>
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 font-bold">{inPlayer.name}</span>
                          <span className="text-gray-500 text-xs">£{inPlayer.price10/10}m</span>
                        </div>
                     </div>
                   );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-[#37003c] p-6 rounded-lg border border-[#4a0050] text-center text-gray-400 text-sm">
            Click "Apply & Update Team" below to run the transfer math.
          </div>
        )}

        <button 
          onClick={fetchTeam}
          disabled={loading}
          className="w-full mt-4 bg-[#00ff87] hover:bg-green-400 text-[#37003c] font-black py-3 rounded-lg transition-transform hover:scale-105 disabled:opacity-50"
        >
          {loading ? 'Running Math...' : 'Apply & Update Team'}
        </button>

        {error && <div className="mt-2 text-red-400 font-bold text-center text-sm">{error}</div>}
      </div>

      {/* ========================================================
          SECTION 3: TRANSFER HISTORY (COMPACT & GROUPED)
      ======================================================== */}
      <div className="bg-[#250028] rounded-xl p-6 shadow-2xl border border-[#4a0050]">
        <h2 className="text-lg font-black text-[#00ff87] mb-4 uppercase tracking-widest">
          3. Transfer History
        </h2>

        {historyLoading ? (
          <div className="text-center text-gray-400 py-6 animate-pulse text-sm">Loading history...</div>
        ) : historyError ? (
          <div className="text-center text-red-400 font-bold bg-red-900/30 p-3 rounded border border-red-500 text-sm">{historyError}</div>
        ) : Object.keys(groupedHistory).length === 0 ? (
          <div className="text-center text-gray-400 py-6 text-sm">No transfers found for this season.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.keys(groupedHistory).map((gw) => (
              <div key={gw} className="bg-[#37003c] rounded-lg border border-[#4a0050] overflow-hidden">
                
                {/* Gameweek Header */}
                <div className="bg-[#250028] px-3 py-1.5 border-b border-[#4a0050]">
                  <span className="text-[#00ff87] font-black text-xs uppercase tracking-wider">
                    Gameweek {gw} ({groupedHistory[gw].length} transfers)
                  </span>
                </div>

                {/* Transfers List for this GW */}
                <div className="flex flex-col divide-y divide-[#4a0050]">
                  {groupedHistory[gw].map((t, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 text-xs">
                      <div className="flex items-center gap-2 w-1/3 justify-end">
                        <span className="text-red-400 font-bold truncate">{t.out_name}</span>
                        <span className="text-gray-500 font-mono">£{t.out_cost.toFixed(1)}</span>
                      </div>
                      
                      <div className="text-[#00ff87] font-bold px-2 text-[10px]">➡️</div>
                      
                      <div className="flex items-center gap-2 w-1/3 justify-start">
                        <span className="text-green-400 font-bold truncate">{t.in_name}</span>
                        <span className="text-gray-500 font-mono">£{t.in_cost.toFixed(1)}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}