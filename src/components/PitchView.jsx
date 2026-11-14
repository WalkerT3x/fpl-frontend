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
      
      {/* PITCH CONTAINER (Height is dictated by the image) */}
      <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl border border-white/20">
        
        {/* YOUR PITCH IMAGE */}
        <img 
          src="/pitch.png" 
          alt="FPL Pitch" 
          className="w-full h-auto block pointer-events-none"
        />

        {/* 
          PLAYERS OVERLAY 
          Absolutely positioned percentages to sit perfectly over your image.
        */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* GK Row */}
          <div className="absolute top-[14%] w-full flex justify-center gap-2 pointer-events-auto">
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
          <div className="absolute top-[46%] w-full flex justify-center gap-1 md:gap-6 pointer-events-auto">
            {getPlayers(squad, 'MID').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* FWD Row */}
          {/* Pulled up to 64% so it doesn't overlap the "Substitutes" text baked into the image */}
          <div className="absolute top-[64%] w-full flex justify-center gap-1 md:gap-8 pointer-events-auto">
            {getPlayers(squad, 'FWD').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* THE BENCH (Placed exactly inside the dark box in your image) */}
          <div className="absolute bottom-[6%] w-full flex justify-center gap-2 md:gap-8 pointer-events-auto">
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
      
    </div>
  );
}