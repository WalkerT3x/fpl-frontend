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
      
      {/* 1. THE PITCH CONTAINER */}
      <div className="relative w-full rounded-t-2xl overflow-hidden shadow-2xl border border-white/20 border-b-0">
        
        {/* THE CROPPED PITCH IMAGE */}
        <img 
          src="/pitch.png" 
          alt="FPL Pitch" 
          className="w-full h-auto block pointer-events-none"
        />

        {/* PLAYERS OVERLAY */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* GK Row */}
          <div className="absolute top-[8%] w-full flex justify-center gap-2 pointer-events-auto">
            {getPlayers(squad, 'GK').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* DEF Row */}
          <div className="absolute top-[30%] w-full flex justify-center gap-1 md:gap-4 pointer-events-auto">
            {getPlayers(squad, 'DEF').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* MID Row */}
          <div className="absolute top-[50%] w-full flex justify-center gap-1 md:gap-6 pointer-events-auto">
            {getPlayers(squad, 'MID').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* FWD Row - Moved up to 68% to clear the bottom box */}
          <div className="absolute top-[68%] w-full flex justify-center gap-1 md:gap-8 pointer-events-auto">
            {getPlayers(squad, 'FWD').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

        </div>
      </div>

      {/* 2. THE BENCH CONTAINER (Completely separate, below the pitch) */}
      <div className="w-full bg-[#120016]/90 backdrop-blur-xl rounded-b-2xl border border-white/20 p-6 shadow-2xl flex flex-col items-center">
        <h3 className="text-center text-[#00ff87] font-black mb-6 uppercase tracking-widest text-xs md:text-sm drop-shadow-[0_0_10px_rgba(0,255,135,0.4)]">
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