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
      <div className="relative w-full rounded-t-xl overflow-hidden shadow-2xl border-2 border-b-0 border-[#008f2d] bg-[#189c3a]">
        
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

        {/* PLAYERS OVERLAY (Absolute positioning on top of the image) */}
        <div className="absolute inset-0 z-20 flex flex-col justify-between py-[5%] pointer-events-none">
          
          {/* GK Row (Top 10%) */}
          <div className="w-full flex justify-center gap-2 md:gap-4 scale-[0.8] md:scale-90 pointer-events-auto origin-top">
            {getPlayers(squad, 'GK').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* DEF Row (Top 30%) */}
          <div className="w-full flex justify-center gap-2 md:gap-6 scale-[0.85] md:scale-95 pointer-events-auto origin-top mt-[5%]">
            {getPlayers(squad, 'DEF').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* MID Row (Top 55%) */}
          <div className="w-full flex justify-center gap-2 md:gap-8 scale-90 md:scale-100 pointer-events-auto origin-top mt-[5%]">
            {getPlayers(squad, 'MID').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* FWD Row (Top 80%) */}
          <div className="w-full flex justify-center gap-2 md:gap-10 scale-95 md:scale-105 pointer-events-auto origin-top mt-[5%] mb-[5%]">
            {getPlayers(squad, 'FWD').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

        </div>
      </div>

      {/* THE BENCH (Overlapping the bottom of the image) */}
      <div className="relative z-30 w-[95%] -mt-12 md:-mt-16 bg-[#120016]/95 backdrop-blur-xl rounded-xl border border-white/20 p-4 pb-6 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <h3 className="text-center text-white font-black mb-4 uppercase tracking-widest text-xs md:text-sm drop-shadow-md">
          Substitutes
        </h3>
        <div className="flex justify-center gap-2 md:gap-6">
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