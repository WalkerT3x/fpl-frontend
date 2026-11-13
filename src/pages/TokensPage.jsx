import PitchView from '../components/PitchView';

export default function TokensPage({ chips, currentGw, loadingChips, chipsError, retryFetch }) {
  
  if (loadingChips) {
    return (
      <div className="flex flex-col items-center mt-32">
        <div className="text-center text-[#00ff87] animate-pulse text-xl font-bold mb-2">
          Running 9-week mathematical simulation...
        </div>
        <div className="text-gray-400 text-sm">This takes about 15 seconds on the free server.</div>
      </div>
    );
  }

  if (chipsError) {
    return (
      <div className="text-center mt-32 animate-fade-in-up">
        <div className="bg-red-900/30 border border-red-500 text-red-400 p-6 rounded-xl inline-block max-w-2xl">
          <p className="font-bold text-lg mb-2">Backend Error:</p>
          <p className="text-sm mb-4 font-mono bg-red-950 p-2 rounded text-left overflow-auto">{chipsError}</p>
          <button onClick={retryFetch} className="bg-[#00ff87] text-[#37003c] font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!chips) {
    return <div className="text-center text-gray-400 mt-32 text-xl font-bold">Load a team on the Home page to see chip strategy.</div>;
  }

  // Reusable Chip Card component to handle the "USED" styling
  const ChipCard = ({ title, advice }) => (
    <div className={`p-4 rounded border ${advice.used ? 'bg-[#1a001c] border-red-900/50 opacity-60' : 'bg-[#37003c] border-[#4a0050] shadow-lg'}`}>
      <div className="flex justify-between items-center mb-1">
        <h3 className="font-bold text-yellow-400">{title}</h3>
        {advice.used && (
          <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow">
            USED {advice.used_gw ? `GW${advice.used_gw}` : ''}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-300">Target: <strong className="text-white text-lg">GW {advice.gw}</strong></p>
      <p className="text-xs text-gray-400 mt-1">{advice.reason}</p>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in-up">
      
      {/* CHIP STRATEGY CARDS */}
      <div className="bg-[#250028] rounded-xl p-6 shadow-xl border border-[#4a0050]">
        <h2 className="text-2xl font-black text-[#00ff87] mb-4 text-center">Chip Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChipCard title="Bench Boost" advice={chips.chip_advice.bench_boost} />
          <ChipCard title="Triple Captain" advice={chips.chip_advice.triple_captain} />
          <ChipCard title="Free Hit" advice={chips.chip_advice.free_hit} />
          <ChipCard title="Wildcard" advice={chips.chip_advice.wildcard} />
        </div>
      </div>

      {/* FREE HIT DRAFT TEAM */}
      <div className="bg-[#250028] rounded-xl p-6 shadow-xl border border-[#4a0050]">
        <h2 className="text-xl font-black text-[#00ff87] mb-2 text-center uppercase tracking-widest">Free Hit Draft</h2>
        <p className="text-center text-sm text-gray-400 mb-6">The mathematically perfect 11 for your Free Hit week.</p>
        <PitchView 
          squad={chips.free_hit_team.starting_11} 
          subs={chips.free_hit_team.bench} 
          currentGw={chips.chip_advice.free_hit.gw} 
        />
      </div>
      
    </div>
  );
}