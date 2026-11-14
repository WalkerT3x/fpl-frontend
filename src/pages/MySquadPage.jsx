import PitchView from '../components/PitchView';

export default function MySquadPage({ 
  starting11, 
  bench, 
  currentGw, 
  gwName,
  deadline,
  captain, 
  vice, 
  chipStatus,
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

  const formatDeadline = (isoString) => {
    if (!isoString) return null;
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-GB', { 
      weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' 
    }).format(date);
  };

  const renderChip = (label, used) => (
    <div className={`flex flex-col items-center justify-center p-2 rounded-lg border w-full ${used ? 'bg-[#120016]/40 border-white/5 opacity-50' : 'bg-[#00ff87]/10 border-[#00ff87]/50 shadow-[0_0_10px_rgba(0,255,135,0.2)]'}`}>
      <span className={`text-[8px] md:text-[10px] text-center font-black uppercase tracking-wider ${used ? 'text-gray-500' : 'text-[#00ff87]'}`}>{label}</span>
      <span className={`text-[7px] md:text-[9px] font-bold ${used ? 'text-gray-600' : 'text-white'}`}>{used ? 'Used' : 'Available'}</span>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center animate-fade-in-up mt-4">
      
      <div className="text-center mb-6">
        <h1 className="text-xl md:text-3xl font-black text-white tracking-tight mb-2 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3">
          <span>{gwName}</span>
          <span className="hidden md:block text-gray-500">•</span>
          <span className="text-[#00ff87]">Deadline: {formatDeadline(deadline) || 'TBD'}</span>
        </h1>
      </div>

      {/* INSTANT CHIP STATUS ROW */}
      {chipStatus && (
        <div className="grid grid-cols-4 gap-2 md:gap-4 mb-6 w-full max-w-4xl">
          {renderChip('Bench Boost', chipStatus.bench_boost)}
          {renderChip('Triple Capt', chipStatus.triple_captain)}
          {renderChip('Wildcard', chipStatus.wildcard)}
          {renderChip('Free Hit', chipStatus.free_hit)}
        </div>
      )}

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