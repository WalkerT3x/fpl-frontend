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
      <div className="relative w-full h-[650px] md:h-[800px] rounded-t-xl overflow-hidden bg-[#0e0a1f]">
        
        {/* SPONSOR BANNER (Top Blue Bar) */}
        <div className="absolute top-0 left-0 w-full h-12 md:h-16 bg-gradient-to-r from-[#04f5ff] to-[#00a8ff] flex items-center justify-center z-20">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/en/f/f2/Premier_League_Logo.svg" alt="PL" className="w-6 h-6 md:w-8 md:h-8 drop-shadow-md" style={{ filter: 'brightness(0)' }} />
            <span className="text-[#37003c] font-black text-lg md:text-xl tracking-tight">Fantasy</span>
          </div>
        </div>

        {/* THE PITCH (Trapezoid Shape) */}
        <div className="absolute top-12 md:top-16 left-0 w-full h-[calc(100%-3rem)] md:h-[calc(100%-4rem)] bg-[#1e8a34] [clip-path:polygon(10%_0,90%_0,100%_100%,0%_100%)] overflow-hidden z-10">
          
          {/* Grass Stripes */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(0,0,0,0.06)_40px,rgba(0,0,0,0.06)_80px)] pointer-events-none"></div>
          {/* Vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.4)] pointer-events-none"></div>

          {/* --- PITCH MARKINGS --- */}
          {/* Goal Net & Top Penalty Box */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 md:w-64 h-16 md:h-24 border-b-2 border-l-2 border-r-2 border-white/40 pointer-events-none">
            {/* Goal Net Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.2)_49%,rgba(255,255,255,0.2)_51%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.2)_49%,rgba(255,255,255,0.2)_51%,transparent_51%)] bg-[length:12px_12px]"></div>
            {/* Crossbar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/80"></div>
          </div>

          {/* Top 6-Yard Box */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] md:w-1/2 h-32 md:h-40 border-b-2 border-l-2 border-r-2 border-white/40 pointer-events-none"></div>
          
          {/* Top D-Arc */}
          <div className="absolute top-[128px] md:top-[160px] left-1/2 -translate-x-1/2 w-32 md:w-48 h-12 md:h-16 border-b-2 border-l-2 border-r-2 border-white/40 rounded-b-full pointer-events-none"></div>

          {/* Halfway Line */}
          <div className="absolute top-[45%] left-0 right-0 h-0.5 bg-white/40 pointer-events-none"></div>
          
          {/* Center Circle (Half) */}
          <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-48 h-48 md:w-64 md:h-64 border-2 border-white/40 rounded-full pointer-events-none mt-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/60 rounded-full"></div>
          </div>

          {/* Bottom Penalty Box (Cut off by the bench) */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] md:w-1/2 h-32 md:h-40 border-t-2 border-l-2 border-r-2 border-white/40 pointer-events-none"></div>
        </div>

        {/* --- PLAYERS OVERLAY --- */}
        <div className="absolute top-12 md:top-16 left-0 w-full h-[calc(100%-3rem)] md:h-[calc(100%-4rem)] z-30 pointer-events-none flex flex-col justify-between py-4 md:py-8">
          
          {/* GK Row */}
          <div className="w-full flex justify-center scale-[0.65] md:scale-75 pointer-events-auto origin-top mt-2">
            {getPlayers(squad, 'GK').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* DEF Row */}
          <div className="w-full flex justify-center gap-2 md:gap-6 scale-75 md:scale-90 pointer-events-auto origin-top">
            {getPlayers(squad, 'DEF').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* MID Row */}
          <div className="w-full flex justify-center gap-2 md:gap-10 scale-90 md:scale-100 pointer-events-auto origin-top">
            {getPlayers(squad, 'MID').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* FWD Row */}
          <div className="w-full flex justify-center gap-2 md:gap-12 scale-100 md:scale-110 pointer-events-auto origin-top">
            {getPlayers(squad, 'FWD').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

        </div>
      </div>

      {/* THE BENCH (Overlapping the pitch) */}
      <div className="relative z-40 w-full -mt-10 md:-mt-16 bg-black/60 backdrop-blur-xl rounded-t-2xl md:rounded-2xl border border-white/20 p-4 pb-6 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
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