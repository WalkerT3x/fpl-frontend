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
    <div className="w-full flex flex-col gap-10 animate-fade-in-up mt-4">
      
      {/* 3D PITCH WRAPPER */}
      <div className="w-full flex justify-center [perspective:1200px] px-2 overflow-hidden">
        
        {/* THE PITCH */}
        <div className="relative w-full rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-2 border-[#008f2d] bg-[#00a838] [transform:rotateX(18deg)] origin-top overflow-hidden">
          
          {/* 3D Grass Stripes & Vignette */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(0,0,0,0.06)_40px,rgba(0,0,0,0.06)_80px)] pointer-events-none"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] pointer-events-none"></div>

          {/* Pitch Markings */}
          <div className="absolute inset-3 border-2 border-white/20 pointer-events-none rounded-sm"></div>
          
          {/* Halfway line */}
          <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-white/20 pointer-events-none"></div>
          
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 border-2 border-white/20 rounded-full pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full"></div>
          </div>

          {/* Top Penalty Box */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 h-32 md:h-40 border-b-2 border-l-2 border-r-2 border-white/20 pointer-events-none"></div>
          {/* Top 6-Yard Box */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1/3 md:w-1/4 h-12 md:h-16 border-b-2 border-l-2 border-r-2 border-white/20 pointer-events-none"></div>

          {/* Bottom Penalty Box */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 h-32 md:h-40 border-t-2 border-l-2 border-r-2 border-white/20 pointer-events-none"></div>
          {/* Bottom 6-Yard Box */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/3 md:w-1/4 h-12 md:h-16 border-t-2 border-l-2 border-r-2 border-white/20 pointer-events-none"></div>

          {/* PLAYERS CONTAINER (Counter-rotated to face the camera) */}
          <div className="relative z-10 flex flex-col gap-6 md:gap-12 py-14 px-2 [transform:rotateX(-18deg)] scale-[1.02]">
            <div className="flex justify-center gap-2 md:gap-10">
              {getPlayers(squad, 'FWD').map((p, i) => (
                <PlayerCard 
                  key={i} 
                  player={p} 
                  currentGw={currentGw}
                  isCaptain={p.name === captain}
                  isVice={p.name === vice}
                />
              ))}
            </div>
            <div className="flex justify-center gap-2 md:gap-8">
              {getPlayers(squad, 'MID').map((p, i) => (
                <PlayerCard 
                  key={i} 
                  player={p} 
                  currentGw={currentGw}
                  isCaptain={p.name === captain}
                  isVice={p.name === vice}
                />
              ))}
            </div>
            <div className="flex justify-center gap-2 md:gap-8">
              {getPlayers(squad, 'DEF').map((p, i) => (
                <PlayerCard 
                  key={i} 
                  player={p} 
                  currentGw={currentGw}
                  isCaptain={p.name === captain}
                  isVice={p.name === vice}
                />
              ))}
            </div>
            <div className="flex justify-center">
              {getPlayers(squad, 'GK').map((p, i) => (
                <PlayerCard 
                  key={i} 
                  player={p} 
                  currentGw={currentGw}
                  isCaptain={p.name === captain}
                  isVice={p.name === vice}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* THE BENCH */}
      <div className="bg-black/40 backdrop-blur-xl rounded-2xl p-4 pt-8 shadow-2xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00ff87] to-transparent opacity-50"></div>
        <h3 className="text-center text-[#00ff87] font-black mb-8 uppercase tracking-widest text-sm drop-shadow-[0_0_10px_rgba(0,255,135,0.5)]">
          Substitutes
        </h3>
        <div className="flex justify-center gap-2 md:gap-10">
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