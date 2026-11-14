import { useEffect } from 'react';
import PitchView from '../components/PitchView';

export default function MySquadPage({ 
  starting11, 
  bench, 
  currentGw, 
  deadline,
  chips,
  fetchChips,
  captain, 
  vice, 
  setActiveTab 
}) {
  // Fetch chips when the page loads so we can display their status
  useEffect(() => {
    if (fetchChips) fetchChips();
  }, [fetchChips]);

  if (!starting11) {
    return (
      <div className="text-center mt-20 animate-fade-in-up">
        <p className="text-xl text-gray-300 mb-4">No team loaded yet.</p>
        <button
          onClick={() => setActiveTab('Dashboard')}
          className="bg-[#00ff87] text-[#37003c] font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Format Deadline (e.g. "2026-11-21T11:00:00Z" -> "Sat 21 Nov, 11:00")
  const formatDeadline = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', { 
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false 
    }).format(date);
  };

  // Reusable Chip Status Card
  const ChipStatus = ({ title, used, used_gw }) => (
    <div className={`flex flex-col items-center justify-center p-2 md:p-3 rounded-xl border ${used ? 'bg-black/40 border-white/5 opacity-60' : 'bg-[#00ff87]/10 border-[#00ff87]/30 shadow-[0_0_15px_rgba(0,255,135,0.1)]'}`}>
      <span className={`text-[10px] md:text-xs font-black uppercase tracking-wider ${used ? 'text-gray-500' : 'text-[#00ff87]'}`}>
        {title}
      </span>
      <span className={`text-[9px] md:text-[10px] font-bold mt-1 ${used ? 'text-gray-500' : 'text-white'}`}>
        {used ? `Played GW${used_gw}` : 'Available'}
      </span>
    </div>
  );

  const benchGK = (bench || []).filter(p => p.position === 'GK');
  const benchOut = (bench || [])
    .filter(p => p.position !== 'GK')
    .sort((a, b) => (b.GWProjection || 0) - (a.GWProjection || 0));
  const orderedBench = [...benchGK, ...benchOut];

  return (
    <div className="w-full flex flex-col items-center animate-fade-in-up mt-4">
      
      {/* HEADER INFO */}
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight mb-1">
          Gameweek {currentGw} <span className="text-gray-500 mx-2">•</span> Deadline: <span className="text-[#00ff87]">{formatDeadline(deadline)}</span>
        </h2>
      </div>

      {/* CHIP STATUS BOARD */}
      {chips && chips.chip_advice && (
        <div className="w-full max-w-2xl grid grid-cols-4 gap-2 mb-8">
          <ChipStatus 
            title="Bench Boost" 
            used={chips.chip_advice.bench_boost.used} 
            used_gw={chips.chip_advice.bench_boost.used_gw} 
          />
          <ChipStatus 
            title="Triple C" 
            used={chips.chip_advice.triple_captain.used} 
            used_gw={chips.chip_advice.triple_captain.used_gw} 
          />
          <ChipStatus 
            title="Wildcard" 
            used={chips.chip_advice.wildcard.used} 
            used_gw={chips.chip_advice.wildcard.used_gw} 
          />
          <ChipStatus 
            title="Free Hit" 
            used={chips.chip_advice.free_hit.used} 
            used_gw={chips.chip_advice.free_hit.used_gw} 
          />
        </div>
      )}

      {/* TOP PICK PILL */}
      <div className="border border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87] px-6 py-2 rounded-full font-black uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,255,135,0.3)]">
        Top Pick — Gameweek {currentGw}
      </div>

      <PitchView 
        squad={starting11} 
        subs={orderedBench} 
        currentGw={currentGw}
        captain={captain}
        vice={vice}
        benchLabels={['GK', 'Sub 1', 'Sub 2', 'Sub 3']}
      />
    </div>
  );
}