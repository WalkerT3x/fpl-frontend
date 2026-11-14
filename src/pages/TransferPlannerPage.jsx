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
    <div className="relative flex-1 min-w-0" ref={wrapperRef}>
      <input
        type="text"
        className="w-full p-3 rounded-xl bg-white text-black text-xs md:text-sm outline-none font-black placeholder-gray-500 border border-transparent focus:border-[#00ff87] transition-all"
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
        <ul className="absolute top-full left-0 z-50 w-full mt-1 bg-white border border-gray-300 rounded shadow-xl max-h-48 overflow-y-auto">
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
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fade-in-up mt-4 px-2 md:px-0">

      {/* SECTION 1: MID-WEEK TRANSFERS */}
      <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#00ff87] rounded-full mix-blend-screen filter blur-[40px] opacity-20 pointer-events-none"></div>
        
        <div className="relative z-10">
          <h2 className="text-lg font-black text-[#00ff87] mb-2 uppercase tracking-widest">1. Mid-Week Transfers</h2>
          <p className="text-xs text-gray-300 mb-6">If you made transfers this week that the FPL API hasn't updated yet, add them here and apply them.</p>
          
          <div className="flex flex-col gap-4">
            {/* INPUTS */}
            <div className="flex flex-col md:flex-row gap-3 items-center relative z-20">
              <SearchableSelect 
                value={formOut} 
                onChange={setFormOut} 
                options={allPlayers} 
                placeholder={playersLoading ? "Loading..." : "Transfer OUT"} 
              />
              <span className="text-[#00ff87] font-bold text-lg hidden md:block">➡️</span>
              <span className="text-[#00ff87] font-bold text-lg md:hidden">⬇️</span>
              <SearchableSelect 
                value={formIn} 
                onChange={setFormIn} 
                options={allPlayers} 
                placeholder={playersLoading ? "Loading..." : "Transfer IN"} 
              />
              <button 
                onClick={handleApply}
                disabled={!formOut || !formIn || loadingManual}
                className="w-full md:w-auto shrink-0 px-6 py-3 rounded-xl bg-[#00ff87]/10 border-2 border-[#00ff87] text-[#00ff87] font-black tracking-wider uppercase text-xs md:text-sm shadow-[0_0_15px_rgba(0,255,135,0.4),inset_0_0_10px_rgba(0,255,135,0.2)] hover:bg-[#00ff87]/20 hover:shadow-[0_0_25px_rgba(0,255,135,0.8),inset_0_0_15px_rgba(0,255,135,0.4)] active:scale-95 transition-all disabled:opacity-30 disabled:shadow-none"
              >
                {loadingManual ? 'Applying...' : 'Apply to Squad'}
              </button>
            </div>

            {/* APPLIED LIST */}
            {manualTransfers.length > 0 && (
              <div className="flex flex-col mt-4 border-t border-white/10 pt-4 gap-2">
                <span className="text-[#00ff87] font-black text-xs uppercase tracking-wider mb-1">Applied Transfers</span>
                {manualTransfers.map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-3 text-sm gap-2 w-full">
                    <span className="text-red-400 font-bold truncate flex-1 text-right">{t.out_player}</span>
                    <span className="text-[#00ff87] font-bold text-[10px] shrink-0">➡️</span>
                    <span className="text-green-400 font-bold truncate flex-1 text-left">{t.in_player}</span>
                    <button onClick={() => handleRemove(i)} className="text-red-500 hover:text-red-400 font-bold px-2 shrink-0">✕</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 2: TRANSFER PLANNER */}
      <div className="relative bg-black/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20 overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#9d00ff] rounded-full mix-blend-screen filter blur-[40px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
          <h2 className="text-lg font-black text-[#00ff87] mb-6 uppercase tracking-widest">2. Transfer Planner</h2>
          
          <div className="mb-8 bg-[#120016]/60 p-5 rounded-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <span className="text-sm font-bold text-white block mb-1">Available Free Transfers</span>
              <span className="text-xs text-gray-400">Adjust this so the AI knows your limits.</span>
            </div>
            <div className="flex items-center gap-4 w-full md:w-1/2">
              <input 
                type="range" min="0" max="5" step="1"
                value={freeTransfers}
                onChange={(e) => setFreeTransfers(parseInt(e.target.value))}
                className="flex-1 accent-[#00ff87] cursor-pointer"
              />
              <span className="bg-[#00ff87] text-[#37003c] font-black text-lg w-10 h-10 flex items-center justify-center rounded-lg shadow-[0_0_10px_rgba(0,255,135,0.4)]">
                {freeTransfers}
              </span>
            </div>
          </div>

          <button 
            onClick={fetchTransfers}
            disabled={loadingTransfers}
            className="w-full py-4 rounded-xl bg-[#00ff87]/10 border-2 border-[#00ff87] text-[#00ff87] font-black tracking-widest uppercase text-sm shadow-[0_0_15px_rgba(0,255,135,0.4),inset_0_0_10px_rgba(0,255,135,0.2)] hover:bg-[#00ff87]/20 hover:shadow-[0_0_25px_rgba(0,255,135,0.8),inset_0_0_15px_rgba(0,255,135,0.4)] active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none mb-6"
          >
            {loadingTransfers ? 'Running Math...' : 'Run AI Transfer Math'}
          </button>

          {error && <div className="mb-4 text-red-400 font-bold text-center text-sm">{error}</div>}

          {transferAdvice ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#120016]/60 p-4 rounded-xl border border-white/10 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Current Bank</span>
                  <span className="text-xl font-black text-white">£{(bank ?? 0).toFixed(1)}m</span>
                </div>
                <div className="bg-[#120016]/60 p-4 rounded-xl border border-white/10 text-center">
                  <span className="text-[10px] uppercase tracking-wider text-gray-400 block mb-1">Bank After Transfers</span>
                  <span className={`text-xl font-black ${(bankAfter ?? bank ?? 0) >= 0 ? 'text-[#00ff87]' : 'text-red-400'}`}>
                    £{(bankAfter ?? bank ?? 0).toFixed(1)}m
                  </span>
                </div>
              </div>

              <div className={`p-5 rounded-xl border ${isRoll ? 'bg-yellow-900/20 border-yellow-700/50' : 'bg-[#00ff87]/10 border-[#00ff87]/50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`font-black text-lg uppercase tracking-wider ${isRoll ? 'text-yellow-400' : 'text-[#00ff87]'}`}>
                    {isRoll ? '⏸️ HOLD YOUR TRANSFER' : '✅ TRANSFER RECOMMENDED'}
                  </h3>
                  <span className="text-xs font-bold bg-black/40 px-3 py-1 rounded-lg text-white border border-white/10">
                    +{transferAdvice.gain.toFixed(1)} pts
                  </span>
                </div>
                <p className="text-sm text-gray-200 mb-4">
                  {isRoll
                    ? (thisWeekPairs.length === 0
                        ? "Your team is mathematically optimal for the next 5 weeks. Roll your transfer."
                        : `The best available move only gains ${transferAdvice.gain.toFixed(1)} pts. Hold your transfer for a bigger upgrade.`)
                    : `Make ${thisWeekPairs.length} transfer${thisWeekPairs.length > 1 ? 's' : ''} this week to gain ${transferAdvice.gain.toFixed(1)} projected points.`}
                </p>

                {!isRoll && thisWeekPairs.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {thisWeekPairs.map((pair, i) => (
                      <div key={i} className="flex items-center justify-between bg-black/30 p-3 rounded-lg text-sm w-full gap-2">
                        <span className="text-red-400 font-bold truncate flex-1 text-right">{pair.out.name}</span>
                        <span className="text-[#00ff87] font-bold text-[10px] shrink-0">➡️</span>
                        <span className="text-green-400 font-bold truncate flex-1 text-left">{pair.in.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {dreamPairs.length > 0 && (
                <div className="bg-[#120016]/60 rounded-xl border border-white/10 overflow-hidden mt-6">
                  <div className="bg-black/40 px-4 py-2 border-b border-white/10">
                    <span className="text-[#00ff87] font-black text-xs uppercase tracking-wider">
                      5-Week Dream Target (Max 5 Moves)
                    </span>
                  </div>
                  <div className="flex flex-col divide-y divide-white/5">
                    {dreamPairs.map((pair, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-3 text-sm w-full gap-2">
                        <span className="text-red-400 font-bold truncate flex-1 text-right">{pair.out.name}</span>
                        <span className="text-[#00ff87] font-bold text-[10px] shrink-0">➡️</span>
                        <span className="text-green-400 font-bold truncate flex-1 text-left">{pair.in.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-[#120016]/60 p-6 rounded-xl border border-white/10 text-center text-gray-400 text-sm">
              Click "Run AI Transfer Math" above to find your best moves.
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: TRANSFER HISTORY */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/20">
        <h2 className="text-lg font-black text-[#00ff87] mb-6 uppercase tracking-widest">3. Transfer History</h2>

        {historyLoading ? (
          <div className="text-center text-gray-400 py-6 animate-pulse text-sm">Loading history...</div>
        ) : historyError ? (
          <div className="text-center text-red-400 font-bold bg-red-900/30 p-4 rounded-xl border border-red-500/50 text-sm">{historyError}</div>
        ) : Object.keys(groupedHistory).length === 0 ? (
          <div className="text-center text-gray-400 py-6 text-sm">No transfers found for this season.</div>
        ) : (
          <div className="flex flex-col gap-4">
            {Object.keys(groupedHistory).sort((a, b) => Number(b) - Number(a)).map((gw) => (
              <div key={gw} className="bg-[#120016]/60 rounded-xl border border-white/10 overflow-hidden">
                <div className="bg-black/40 px-4 py-2 border-b border-white/10">
                  <span className="text-[#00ff87] font-black text-xs uppercase tracking-wider">
                    Gameweek {gw} ({groupedHistory[gw].length} transfers)
                  </span>
                </div>
                <div className="flex flex-col divide-y divide-white/5">
                  {groupedHistory[gw].map((t, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 text-sm w-full gap-2">
                      <span className="text-red-400 font-bold truncate flex-1 text-right">{t.out_name}</span>
                      <span className="text-[#00ff87] font-bold text-[10px] shrink-0">➡️</span>
                      <span className="text-green-400 font-bold truncate flex-1 text-left">{t.in_name}</span>
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