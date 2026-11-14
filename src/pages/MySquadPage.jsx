import PitchView from '../components/PitchView';

export default function MySquadPage({ 
  starting11, 
  bench, 
  currentGw, 
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

  return (
    <div className="w-full flex flex-col items-center animate-fade-in-up mt-4">
      
      <div className="border border-[#00ff87] bg-[#00ff87]/10 text-[#00ff87] px-6 py-2 rounded-full font-black uppercase tracking-widest mb-6 shadow-[0_0_15px_rgba(0,255,135,0.3)]">
        Optimal XI — Gameweek {currentGw}
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