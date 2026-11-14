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
      
      {/* 
        THE 3D PITCH 
        We use a h-[750px] container. The pitch is a div clipped into a trapezoid using clip-path.
        This creates the perspective effect without distorting the player cards.
      */}
      <div className="relative w-full max-w-4xl mx-auto h-[750px] md:h-[850px] bg-[#37003c] overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/10">
        
        {/* The Green Trapezoid Pitch */}
        <div className="absolute inset-0 bg-[#0e8c31] [clip-path:polygon(15%_0,85%_0,100%_100%,0%_100%)]">
          
          {/* Grass Stripes */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_60px,rgba(0,0,0,0.1)_60px,rgba(0,0,0,0.1)_120px)] mix-blend-multiply pointer-events-none"></div>
          
          {/* Vignette / Shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)] pointer-events-none"></div>

          {/* --- PITCH MARKINGS --- */}
          
          {/* Outer boundary */}
          <div className="absolute top-4 left-[15%] right-[15%] bottom-4 border-2 border-white/40 pointer-events-none [clip-path:polygon(2%_0,98%_0,100%_100%,0%_100%)]"></div>
          
          {/* Top Goal Net */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-6 md:w-64 md:h-8 bg-[#1c3d23] border-b-2 border-l-2 border-r-2 border-white/50 pointer-events-none bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.3)_49%,rgba(255,255,255,0.3)_51%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.3)_49%,rgba(255,255,255,0.3)_51%,transparent_51%)] bg-[length:8px_8px]"></div>

          {/* Top Penalty Box */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 h-[22%] border-b-2 border-l-2 border-r-2 border-white/40 pointer-events-none"></div>
          
          {/* Top Goal Area (6-yard box) */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1/3 md:w-1/4 h-[10%] border-b-2 border-l-2 border-r-2 border-white/40 pointer-events-none"></div>
          
          {/* Top D-Arc */}
          <div className="absolute top-[26%] left-1/2 -translate-x-1/2 w-32 md:w-48 h-16 md:h-24 border-b-2 border-l-2 border-r-2 border-white/40 rounded-b-full pointer-events-none"></div>

          {/* Halfway Line */}
          <div className="absolute top-1/2 left-[15%] right-[15%] h-0.5 bg-white/40 pointer-events-none"></div>
          
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 border-2 border-white/40 rounded-full pointer-events-none flex items-center justify-center">
            <div className="w-2 h-2 bg-white/60 rounded-full"></div>
          </div>

          {/* Bottom Penalty Box */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-2/3 md:w-1/2 h-[22%] border-t-2 border-l-2 border-r-2 border-white/40 pointer-events-none"></div>
          
          {/* Bottom Goal Area (6-yard box) */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1/3 md:w-1/4 h-[10%] border-t-2 border-l-2 border-r-2 border-white/40 pointer-events-none"></div>
          
          {/* Bottom D-Arc */}
          <div className="absolute bottom-[26%] left-1/2 -translate-x-1/2 w-32 md:w-48 h-16 md:h-24 border-t-2 border-l-2 border-r-2 border-white/40 rounded-t-full pointer-events-none"></div>

          {/* Bottom Goal Net */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-6 md:w-64 md:h-8 bg-[#1c3d23] border-t-2 border-l-2 border-r-2 border-white/50 pointer-events-none bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.3)_49%,rgba(255,255,255,0.3)_51%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.3)_49%,rgba(255,255,255,0.3)_51%,transparent_51%)] bg-[length:8px_8px]"></div>

        </div>

        {/* --- PLAYERS CONTAINER --- */}
        {/* We use absolute positioning to place the rows, and scale them slightly to simulate depth */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          
          {/* GK Row */}
          <div className="absolute top-[8%] left-0 w-full flex justify-center gap-4 scale-75 pointer-events-auto">
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

          {/* DEF Row */}
          <div className="absolute top-[28%] left-0 w-full flex justify-center gap-2 md:gap-8 scale-90 pointer-events-auto">
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

          {/* MID Row */}
          <div className="absolute top-[52%] left-0 w-full flex justify-center gap-2 md:gap-10 scale-100 pointer-events-auto">
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

          {/* FWD Row */}
          <div className="absolute top-[76%] left-0 w-full flex justify-center gap-2 md:gap-12 scale-105 pointer-events-auto">
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