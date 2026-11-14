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
      <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-white/20 bg-gradient-to-b from-[#00a838] to-[#00c943]">
        
        {/* Pitch Markings */}
        <div className="absolute inset-4 border border-white/20 rounded-2xl pointer-events-none"></div>
        <div className="absolute top-1/2 left-4 right-4 h-px bg-white/20 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-48 md:h-48 border border-white/20 rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-6 md:gap-10 py-12 px-2">
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
      <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-6 pt-8 shadow-2xl border border-white/10">
        <h3 className="text-center text-[#00ff87] font-black mb-8 uppercase tracking-widest text-sm drop-shadow-[0_0_10px_rgba(0,255,135,0.5)]">
          Substitutes
        </h3>
        <div className="flex justify-center gap-2 md:gap-12">
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