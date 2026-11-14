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
      
      {/* THE PITCH */}
      <div className="relative w-full max-w-3xl mx-auto rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-2 border-[#008f2d] bg-[#2d8a39] overflow-hidden">
        
        {/* 3D Grass Stripes & Vignette */}
        <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(0,0,0,0.08)_40px,rgba(0,0,0,0.08)_80px)] pointer-events-none"></div>
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] pointer-events-none"></div>

        {/* --- PITCH MARKINGS --- */}
        {/* Outer boundary */}
        <div className="absolute inset-3 border-2 border-white/20 pointer-events-none rounded-sm"></div>
        
        {/* Top Goal Area (Behind Keeper) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-8 border-b-2 border-l-2 border-r-2 border-white/30 bg-[#1c3d23] bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.2)_49%,rgba(255,255,255,0.2)_51%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.2)_49%,rgba(255,255,255,0.2)_51%,transparent_51%)] bg-[length:10px_10px] pointer-events-none"></div>
        
        {/* Top Penalty Box */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 h-28 md:h-36 border-b-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-1/3 md:w-1/4 h-12 md:h-16 border-b-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>

        {/* Halfway line */}
        <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-white/30 pointer-events-none"></div>
        
        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-56 md:h-56 border-2 border-white/30 rounded-full pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full"></div>
        </div>

        {/* Bottom Penalty Box */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 h-28 md:h-36 border-t-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-1/3 md:w-1/4 h-12 md:h-16 border-t-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>

        {/* --- PLAYERS (GK Top, FWD Bottom) --- */}
        <div className="relative z-10 flex flex-col gap-6 md:gap-10 py-10 px-2">
          
          {/* GK */}
          <div className="flex justify-center mb-2">
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

          {/* DEF */}
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

          {/* MID */}
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

          {/* FWD */}
          <div className="flex justify-center gap-2 md:gap-10 mb-2">
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