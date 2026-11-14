import { useState, useEffect, useRef } from 'react';

const unaccent = (str) => {
  return str
    .replace(/Ø/g, 'O').replace(/ø/g, 'o')
    .replace(/Æ/g, 'AE').replace(/æ/g, 'ae')
    .replace(/Å/g, 'A').replace(/å/g, 'a')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

function pairByPosition(outList = [], inList = []) {
  const pairs = [];
  const inByPos = {};
  inList.forEach(p => {
    inByPos[p.position] = inByPos[p.position] || [];
    inByPos[p.position].push(p);
  });
  outList.forEach(p => {
    const match = (inByPos[p.position] || []).shift();
    if (match) pairs.push({ out: p, in: match });
  });
  return pairs;
}

function SearchableSelect({ value, onChange, options, placeholder }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState(value || '');
  const wrapperRef = useRef(null);

  useEffect(() => { setSearch(value || ''); }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
        if (!value) setSearch('');
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const filtered = options.filter(opt =>
    unaccent(opt).toLowerCase().includes(unaccent(search).toLowerCase())
  );

  return (
    <div className="relative flex-1" ref={wrapperRef}>
      <input
        type="text"
        className="w-full p-2 rounded bg-white text-black text-xs md:text-sm outline-none font-bold"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setIsOpen(true);
          if (e.target.value === '') onChange('');
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && filtered.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
          {filtered.slice(0, 50).map((opt, idx) => (
            <li
              key={idx}
              className="px-3 py-2 text-black text-xs md:text-sm font-bold hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                onChange(opt);
                setSearch(opt);
                setIsOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function TransferPlannerPage({ 
  teamId,
  starting11,
  manualTransfers, 
  setManualTransfers, 
  applyManualTransfers,
  fetchTransfers,
  loadingManual,
  loadingTransfers,
  error,
  freeTransfers,
  setFreeTransfers,
  transferAdvice,
  bank,
  bankAfter
}) {
  const [transfers, setTransfers] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [allPlayers, setAllPlayers] = useState([]);
  const [playersLoading, setPlayersLoading] = useState(true);

  const [formOut, setFormOut] = useState('');
  const [formIn, setFormIn] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = (attempt = 0) => {
      setPlayersLoading(true);
      fetch('https://fpl-backend-c25x.onrender.com/api/players')
        .then(res => res.json())
        .then(data => {
          if (cancelled) return;
          if (data.players && data.players.length > 0) {
            setAllPlayers(data.players);
          } else if (attempt < 2) {
            setTimeout(() => load(attempt + 1), 3000);
            return;
          }
        })
        .catch(() => {
          if (!cancelled && attempt < 2) setTimeout(() => load(attempt + 1), 3000);
        })
        .finally(() => { if (!cancelled) setPlayersLoading(false); });
    };
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!teamId || !starting11) return;
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
  }, [teamId, starting11]);

  const handleApply = () => {
    if (!formOut || !formIn) return;
    
    const newTransfer = { out_player: formOut, in_player: formIn };
    const updatedTransfers = [...manualTransfers, newTransfer];
    
    setManualTransfers(updatedTransfers);
    
    setFormOut('');
    setFormIn('');
    
    applyManualTransfers(updatedTransfers);
  };

  const handleRemove = (index) => {
    const updatedTransfers = manualTransfers.filter((_, i) => i !== index);
    setManualTransfers(updatedTransfers);
    applyManualTransfers(updatedTransfers);
  };

  const groupedHistory = transfers.reduce((acc, t) => {
    if (!acc[t.gw]) acc[t.gw] = [];
    acc[t.gw].push(t);
    return acc;
  }, {});

  if (!teamId || !starting11) {
    return <div className="text-center text-gray-400 mt-32 text-xl font-bold">Load a team on the Dashboard to see transfers.</div>;
  }

  const thisWeekPairs = transferAdvice ? pairByPosition(transferAdvice.this_week_out, transferAdvice.this_week_in) : [];
  const dreamPairs = transferAdvice ? pairByPosition(transferAdvice.dream_out, transferAdvice.dream_in) : [];
  const isRoll = !transferAdvice || thisWeekPairs.length === 0 || transferAdvice.gain < 1;

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in-up mt-4">

      {/* SECTION 1: MID-WEEK TRANSFERS */}
      <div className="bg-[#250028] rounded-xl p-6 shadow-2xl border border-[#4a0050]">
        <h2 className="text-lg font-black text-[#00ff87] mb-2 uppercase tracking-widest flex items-center justify-between">
          <span>1. Mid-Week Transfers</span>
        </h2>
        <p className="text-xs text-gray-400 mb-4">If you made transfers this week that the FPL API hasn't updated yet, add them here and apply them.</p>
        
        <div className="bg-[#37003c] p-4 rounded-lg border border-[#4a0050]">
          
          <div className="flex flex-col md:flex-row gap-2 items-center mb-4">
            <SearchableSelect 
              value={formOut} 
              onChange={setFormOut} 
              options={allPlayers} 
              placeholder={playersLoading ? "Loading players..." : "Transfer OUT"} 
            />
            <span className="text-[#00ff87] font-bold text-sm">➡️</span>
            <SearchableSelect 
              value={formIn} 
              onChange={setFormIn} 
              options={allPlayers} 
              placeholder={playersLoading ? "Loading players..." : "Transfer IN"} 
            />
            <button 
              onClick={handleApply}
              disabled={!formOut || !formIn || loadingManual}
              className="w-full md:w-auto mt-2 md:mt-0 text-sm bg-white text-[#37003c] font-black px-6 py-2 rounded hover:bg-gray-200 transition-transform disabled:opacity-50"
            >
              {loadingManual ? 'Applying...' : 'Apply to My Squad'}
            </button>
          </div>

          {manualTransfers.length > 0 && (
            <div className="bg-[#250028] rounded-lg border border-[#4a0050] overflow-hidden mt-4">
              <div className="bg-[#250028] px-3 py-1.5 border-b border-[#4a0050]">
                <span className="text-[#00ff87] font-black text-xs uppercase tracking-wider">
                  Applied Mid-Week Transfers
                </span>
              </div>
              <div className="flex flex-col divide-y divide-[#4a0050]">
                {manualTransfers.map((t, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 text-xs">
                    <div className="flex items-center gap-2 w-1/3 justify-end">
                      <span className="text-red-400 font-bold truncate">{t.out_player}</span>
                    </div>
                    <div className="text-[#00ff87] font-bold px-2 text-[10px]">➡️</div>
                    <div className="flex items-center justify-between w-1/3 gap-2">
                      <span className="text-green-400 font-bold truncate">{t.in_player}</span>
                      <button onClick={() => handleRemove(i)} className="text-red-500 hover:text-red-400 font-bold px-2">✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: TRANSFER PLANNER */}
      <div className="bg-[#250028] rounded-xl p-6 shadow-2xl border border-[#4a0050]">
        <h2 className="text-lg font-black text-[#00ff87] mb-4 uppercase tracking-widest">2. Transfer Planner</h2>
        
        <div className="mb-6 bg-[#37003c] p-4 rounded-lg border border-[#4a0050] flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-sm font-bold text-gray-300 block mb-1">Available Free Transfers</span>
            <span className="text-xs text-gray-500">Adjust this so the AI knows your limits.</span>
          </div>
          <div className="flex items-center gap-4 w-full md:w-1/2">
            <input 
              type="range" min="0" max="5" step="1"
              value={freeTransfers}
              onChange={(e) => setFreeTransfers(parseInt(e.target.value))}
              className="flex-1 accent-[#00ff87] cursor-pointer"
            />
            <span className="bg-[#00ff87] text-[#37003c] font-black text-lg w-10 h-10 flex items-center justify-center rounded-lg">
              {freeTransfers}
            </span>
          </div>
        </div>

        <button 
          onClick={fetchTransfers}
          disabled={loadingTransfers}
          className="w-full bg-[#00ff87] hover:bg-green-400 text-[#37003c] font-black py-3 rounded-lg transition-transform hover:scale-105 disabled:opacity-50 mb-6"
        >
          {loadingTransfers ? 'Running Math...' : 'Run AI Transfer Math'}
        </button>

        {error && <div className="mb-4 text-red-400 font-bold text-center text-sm">{error}</div>}

        {transferAdvice ? (
          <>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-[#37003c] p-3 rounded-lg border border-[#4a0050] text-center">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Current Bank</span>
                <span className="text-xl font-black text-white">£{(bank ?? 0).toFixed(1)}m</span>
              </div>
              <div className="bg-[#37003c] p-3 rounded-lg border border-[#4a0050] text-center">
                <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Bank After Transfers</span>
                <span className={`text-xl font-black ${(bankAfter ?? bank ?? 0) >= 0 ? 'text-[#00ff87]' : 'text-red-400'}`}>
                  £{(bankAfter ?? bank ?? 0).toFixed(1)}m
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-lg border ${isRoll ? 'bg-yellow-900/20 border-yellow-700' : 'bg-green-900/20 border-green-700'}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className={`font-black text-lg uppercase tracking-wider ${isRoll ? 'text-yellow-400' : 'text-green-400'}`}>
                  {isRoll ? '⏸️ HOLD YOUR TRANSFER' : '✅ TRANSFER RECOMMENDED'}
                </h3>
                <span className="text-xs font-bold bg-[#37003c] px-2 py-1 rounded text-white">
                  +{transferAdvice.gain.toFixed(1)} pts
                </span>
              </div>
              <p className="text-sm text-gray-300 mb-4">
                {isRoll
                  ? (thisWeekPairs.length === 0
                      ? "Your team is mathematically optimal for the next 5 weeks. Roll your transfer."
                      : `The best available move only gains ${transferAdvice.gain.toFixed(1)} pts. Hold your transfer for a bigger upgrade.`)
                  : `Make ${thisWeekPairs.length} transfer${thisWeekPairs.length > 1 ? 's' : ''} this week to gain ${transferAdvice.gain.toFixed(1)} projected points.`}
              </p>

              {!isRoll && thisWeekPairs.length > 0 && (
                <div className="flex flex-col gap-2">
                  {thisWeekPairs.map((pair, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#37003c] p-2 rounded text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-red-400 font-bold">{pair.out.name}</span>
                        <span className="text-gray-500 text-xs">£{pair.out.price10/10}m</span>
                      </div>
                      <span className="text-[#00ff87] font-bold mx-2">➡️</span>
                      <div className="flex items-center gap-2">
                        <span className="text-green-400 font-bold">{pair.in.name}</span>
                        <span className="text-gray-500 text-xs">£{pair.in.price10/10}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {dreamPairs.length > 0 && (
              <div className="bg-[#37003c] rounded-lg border border-[#4a0050] overflow-hidden mt-4">
                <div className="bg-[#250028] px-3 py-1.5 border-b border-[#4a0050]">
                  <span className="text-[#00ff87] font-black text-xs uppercase tracking-wider">
                    5-Week Dream Target (Max 5 Moves)
                  </span>
                </div>
                <div className="flex flex-col divide-y divide-[#4a0050]">
                  {dreamPairs.map((pair, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 text-xs">
                      <div className="flex items-center gap-2 w-1/3 justify-end">
                        <span className="text-red-400 font-bold truncate">{pair.out.name}</span>
                        <span className="text-gray-500 font-mono">£{pair.out.price10/10}m</span>
                      </div>
                      <div className="text-[#00ff87] font-bold px-2 text-[10px]">➡️</div>
                      <div className="flex items-center gap-2 w-1/3 justify-start">
                        <span className="text-green-400 font-bold truncate">{pair.in.name}</span>
                        <span className="text-gray-500 font-mono">£{pair.in.price10/10}m</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-[#37003c] p-6 rounded-lg border border-[#4a0050] text-center text-gray-400 text-sm">
            Click "Run AI Transfer Math" above to find your best moves.
          </div>
        )}
      </div>

      {/* SECTION 3: TRANSFER HISTORY */}
      <div className="bg-[#250028] rounded-xl p-6 shadow-2xl border border-[#4a0050]">
        <h2 className="text-lg font-black text-[#00ff87] mb-4 uppercase tracking-widest">3. Transfer History</h2>

        {historyLoading ? (
          <div className="text-center text-gray-400 py-6 animate-pulse text-sm">Loading history...</div>
        ) : historyError ? (
          <div className="text-center text-red-400 font-bold bg-red-900/30 p-3 rounded border border-red-500 text-sm">{historyError}</div>
        ) : Object.keys(groupedHistory).length === 0 ? (
          <div className="text-center text-gray-400 py-6 text-sm">No transfers found for this season.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.keys(groupedHistory).sort((a, b) => Number(b) - Number(a)).map((gw) => (
              <div key={gw} className="bg-[#37003c] rounded-lg border border-[#4a0050] overflow-hidden">
                <div className="bg-[#250028] px-3 py-1.5 border-b border-[#4a0050]">
                  <span className="text-[#00ff87] font-black text-xs uppercase tracking-wider">
                    Gameweek {gw} ({groupedHistory[gw].length} transfers)
                  </span>
                </div>
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