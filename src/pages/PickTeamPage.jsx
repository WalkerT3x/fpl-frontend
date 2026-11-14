import PitchView from '../components/PitchView';

export default function PickTeamPage({ 
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
          onClick={() => setActiveTab('Home')}
          className="bg-[#00ff87] text-[#37003c] font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // Ensure bench order: GK first, then outfield subs by projection
  const benchGK = (bench || []).filter(p => p.position === 'GK');
  const benchOut = (bench || [])
    .filter(p => p.position !== 'GK')
    .sort((a, b) => (b.GWProjection || 0) - (a.GWProjection || 0));
  const orderedBench = [...benchGK, ...benchOut];

  return (
    <div className="w-full flex flex-col items-center animate-fade-in-up">
      <div className="bg-[#00ff87] text-[#37003c] px-6 py-2 rounded-full font-black uppercase tracking-widest mb-4 shadow-lg">
        Optimal XI — Gameweek {currentGw}
      </div>

      <div className="flex items-center gap-6 mb-6 text-sm">
        <div className="bg-[#250028] border border-[#4a0050] rounded-lg px-3 py-1.5">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Captain</span>
          <span className="font-black text-[#00ff87]">{captain || '—'}</span>
        </div>
        <div className="bg-[#250028] border border-[#4a0050] rounded-lg px-3 py-1.5">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Vice Captain</span>
          <span className="font-black text-[#00ff87]">{vice || '—'}</span>
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