import PitchView from '../components/PitchView';

export default function MySquadPage({ 
  starting11, 
  bench, 
  currentGw, 
  gwName,
  deadline,
  captain, 
  vice, 
  setActiveTab 
}) {
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

  const benchGK = (bench || []).filter(p => p.position === 'GK');
  const benchOut = (bench || [])
    .filter(p => p.position !== 'GK')
    .sort((a, b) => (b.GWProjection || 0) - (a.GWProjection || 0));
  const orderedBench = [...benchGK, ...benchOut];

  // Format the deadline nicely (e.g., "Sat 21 Nov, 11:00")
  const formatDeadline = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', { 
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  return (
    <div className="w-full flex flex-col items-center animate-fade-in-up mt-4">
      
      {/* HEADER: GW & DEADLINE */}
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2">
          {gwName} <span className="text-gray-400 mx-2">•</span> 
          <span className="text-[#00ff87]">Deadline: {formatDeadline(deadline) || 'TBD'}</span>
        </h1>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <div className="bg-[#120016]/80 border border-white/10 rounded-xl px-5 py-2 text-center shadow-lg">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-0.5">Captain</span>
          <span className="font-black text-white tracking-wide">{captain || '—'}</span>
        </div>
        <div className="bg-[#120016]/80 border border-white/10 rounded-xl px-5 py-2 text-center shadow-lg">
          <span className="text-[10px] uppercase tracking-widest text-gray-400 block mb-0.5">Vice Captain</span>
          <span className="font-black text-white tracking-wide">{vice || '—'}</span>
        </div>
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