import PlayerCard from './PlayerCard';

export default function PitchView({ 
  squad, 
  subs, 
  currentGw, 
  captain, 
  vice, 
  benchLabels 
}) {
  const getPlayers = (arr, pos) => {
    if (!Array.isArray(arr)) return [];
    return arr.filter(p => p && p.position === pos);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in-up mt-4">
      
      {/* SEPARATE PITCH CONTAINER (Only Starting 11) */}
      <div className="relative w-full aspect-[4/5] sm:aspect-[4/5] md:aspect-[16/10] rounded-t-2xl overflow-hidden shadow-2xl bg-[#189c3a]">
        
        {/* THE PITCH IMAGE */}
        <img 
          src="/pitch.png" 
          alt="FPL Pitch" 
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* STARTING 11 OVERLAY */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* GK Row */}
          <div className="absolute top-[10%] w-full flex justify-center gap-2 pointer-events-auto">
            {getPlayers(squad, 'GK').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* DEF Row */}
          <div className="absolute top-[32%] w-full flex justify-center gap-1 md:gap-4 pointer-events-auto">
            {getPlayers(squad, 'DEF').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* MID Row */}
          <div className="absolute top-[54%] w-full flex justify-center gap-1 md:gap-6 pointer-events-auto">
            {getPlayers(squad, 'MID').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* FWD Row */}
          <div className="absolute top-[76%] w-full flex justify-center gap-1 md:gap-8 pointer-events-auto">
            {getPlayers(squad, 'FWD').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

        </div>
      </div>

      {/* SEPARATE BENCH CONTAINER */}
      <div className="w-full bg-[#120016]/95 rounded-b-2xl border-t border-white/10 p-4 pb-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <h3 className="text-center text-[#00ff87] font-black mb-4 uppercase tracking-widest text-xs md:text-sm drop-shadow-md">
          Substitutes
        </h3>
        <div className="flex justify-center gap-2 md:gap-8">
          {Array.isArray(subs) && subs.map((p, i) => (
            <PlayerCard 
              key={i} 
              player={p} 
              currentGw={currentGw}
              benchLabel={benchLabels && benchLabels[i] ? benchLabels[i] : undefined}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
}