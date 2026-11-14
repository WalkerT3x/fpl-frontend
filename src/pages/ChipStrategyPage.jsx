import PitchView from '../components/PitchView';

export default function ChipStrategyPage({ chips, starting11, currentGw, loadingChips, chipsError, retryFetch }) {
  
  if (!starting11) {
    return <div className="text-center text-gray-400 mt-32 text-xl font-bold">Load a team on the Dashboard to see chip strategy.</div>;
  }

  if (loadingChips) {
    return (
      <div className="flex flex-col items-center mt-32">
        <div className="text-center text-[#00ff87] animate-pulse text-xl font-bold mb-2">
          Running Chip Mathematical Simulation...
        </div>
        <div className="text-gray-400 text-sm">Optimising the best weeks for your chips.</div>
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
    return (
      <div className="text-center mt-32 animate-fade-in-up">
        <button onClick={retryFetch} className="bg-[#00ff87] text-[#37003c] font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform">
          Run Chip Strategy
        </button>
      </div>
    );
  }

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
      {!advice.used && (
        <p className="text-sm text-gray-300">Target: <strong className="text-white text-lg">GW {advice.gw}</strong></p>
      )}
      <p className="text-xs text-gray-400 mt-1">{advice.reason}</p>
    </div>
  );

  return (
    <div className="w-full flex flex-col gap-8 animate-fade-in-up">
      
      <div className="bg-[#250028] rounded-xl p-6 shadow-xl border border-[#4a0050]">
        <h2 className="text-2xl font-black text-[#00ff87] mb-4 text-center">Chip Strategy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ChipCard title="Bench Boost" advice={chips.chip_advice.bench_boost} />
          <ChipCard title="Triple Captain" advice={chips.chip_advice.triple_captain} />
          <ChipCard title="Free Hit" advice={chips.chip_advice.free_hit} />
          <ChipCard title="Wildcard" advice={chips.chip_advice.wildcard} />
        </div>
      </div>

      {/* WILDCARD DRAFT TEAM */}
      {!chips.chip_advice.wildcard.used && chips.wildcard_team && chips.wildcard_team.starting_11.length > 0 && (
        <div className="bg-[#250028] rounded-xl p-6 shadow-xl border border-[#4a0050]">
          <h2 className="text-xl font-black text-[#00ff87] mb-2 text-center uppercase tracking-widest">Wildcard Draft</h2>
          <p className="text-center text-sm text-gray-400 mb-6">
            The optimal 15-man squad for Gameweek {chips.chip_advice.wildcard.gw}.
          </p>
          <PitchView 
            squad={chips.wildcard_team.starting_11} 
            subs={chips.wildcard_team.bench} 
            currentGw={chips.chip_advice.wildcard.gw} 
          />
        </div>
      )}

      {/* FREE HIT DRAFT TEAM */}
      {!chips.chip_advice.free_hit.used && chips.free_hit_team && chips.free_hit_team.starting_11.length > 0 && (
        <div className="bg-[#250028] rounded-xl p-6 shadow-xl border border-[#4a0050]">
          <h2 className="text-xl font-black text-[#00ff87] mb-2 text-center uppercase tracking-widest">Free Hit Draft</h2>
          <p className="text-center text-sm text-gray-400 mb-6">
            The mathematically perfect 11 for Gameweek {chips.chip_advice.free_hit.gw}.
          </p>
          <PitchView 
            squad={chips.free_hit_team.starting_11} 
            subs={chips.free_hit_team.bench} 
            currentGw={chips.chip_advice.free_hit.gw} 
          />
        </div>
      )}
      
    </div>
  );
}