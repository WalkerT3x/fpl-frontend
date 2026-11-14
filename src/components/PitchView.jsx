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
    <div className="w-full flex flex-col gap-8 animate-fade-in-up">
      
      {/* THE PITCH */}
      <div className="relative overflow-hidden rounded-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] border border-white/20 bg-[#28a745]">
        
        {/* Pitch Texture */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grass.png')] opacity-30 mix-blend-multiply pointer-events-none"></div>
        
        {/* Pitch Markings */}
        {/* Outer boundary */}
        <div className="absolute inset-2 md:inset-4 border-2 border-white/30 pointer-events-none rounded-sm"></div>
        
        {/* Halfway line */}
        <div className="absolute top-1/2 left-2 right-2 md:left-4 md:right-4 h-0.5 bg-white/30 pointer-events-none"></div>
        
        {/* Center Circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 border-2 border-white/30 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/50 rounded-full pointer-events-none"></div>

        {/* Top Penalty Box */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 md:top-4 w-1/2 md:w-1/3 h-24 md:h-32 border-b-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>
        {/* Top 6-Yard Box */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 md:top-4 w-1/4 md:w-1/6 h-10 md:h-14 border-b-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>

        {/* Bottom Penalty Box */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-4 w-1/2 md:w-1/3 h-24 md:h-32 border-t-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>
        {/* Bottom 6-Yard Box */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 md:bottom-4 w-1/4 md:w-1/6 h-10 md:h-14 border-t-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>


        <div className="relative z-10 flex flex-col gap-8 md:gap-12 py-10 px-2">
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