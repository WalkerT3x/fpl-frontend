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
    if (!arr) return [];
    return arr.filter(p => p.position === pos);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center animate-fade-in-up mt-4">
      
      {/* PITCH CONTAINER */}
      <div className="relative w-full rounded-t-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/10">
        
        {/* THE PITCH IMAGE */}
        <img 
          src="/pitch.png" 
          alt="FPL Pitch" 
          className="w-full h-auto block pointer-events-none"
          onError={(e) => { 
            // Fallback if image isn't found
            e.target.style.display = 'none'; 
            e.target.parentElement.style.height = '800px';
            e.target.parentElement.style.backgroundColor = '#189c3a';
          }}
        />

        {/* PLAYERS OVERLAY (Absolute positioning mapped to the image) */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* GK Row */}
          <div className="absolute top-[18%] w-full flex justify-center gap-2 md:gap-4 pointer-events-auto">
            {getPlayers(squad, 'GK').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* DEF Row */}
          <div className="absolute top-[36%] w-full flex justify-center gap-1 md:gap-6 pointer-events-auto">
            {getPlayers(squad, 'DEF').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* MID Row */}
          <div className="absolute top-[56%] w-full flex justify-center gap-1 md:gap-8 pointer-events-auto">
            {getPlayers(squad, 'MID').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* FWD Row */}
          <div className="absolute top-[76%] w-full flex justify-center gap-1 md:gap-10 pointer-events-auto">
            {getPlayers(squad, 'FWD').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

        </div>
      </div>

      {/* THE BENCH (Clean layout below the pitch) */}
      <div className="w-full bg-[#120016]/80 backdrop-blur-md rounded-b-2xl border border-white/10 border-t-0 p-4 md:p-6 shadow-xl">
        <h3 className="text-center text-white font-black mb-4 uppercase tracking-widest text-xs md:text-sm">
          Substitutes
        </h3>
        <div className="flex justify-center gap-2 md:gap-8">
          {subs && subs.map((p, i) => (
            <PlayerCard 
              key={i} 
              player={p} 
              currentGw={currentGw}
              benchLabel={benchLabels ? benchLabels[i] : undefined}
            />
          ))}
        </div>
      </div>
      
    </div>
  );
}