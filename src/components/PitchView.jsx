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
        THE 3D PITCH WRAPPER (Stadium Style)
        We use a dark stadium gradient for the background, and scale the pitch up so 
        it fills the whole container when tilted, removing the purple gap.
      */}
      <div className="relative w-full max-w-4xl mx-auto h-[750px] md:h-[850px] [perspective:1200px] overflow-hidden rounded-2xl border-2 border-[#008f2d] bg-gradient-to-b from-[#0a0e14] via-[#0e1f17] to-[#189c3a]">
        
        {/* Stadium Floodlights / Atmosphere */}
        <div className="absolute top-0 left-0 w-full h-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none z-0"></div>

        {/* THE PITCH (Tilted back and scaled up to fill the screen) */}
        <div className="absolute inset-0 w-full h-full bg-[#189c3a] [transform:rotateX(25deg)_scale(1.4)] origin-bottom shadow-[inset_0_0_100px_rgba(0,0,0,0.6)] z-10">
          
          {/* Grass Stripes */}
          <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_60px,rgba(0,0,0,0.08)_60px,rgba(0,0,0,0.08)_120px)] pointer-events-none"></div>

          {/* --- PITCH MARKINGS --- */}
          {/* Outer boundary */}
          <div className="absolute inset-8 border-2 border-white/30 pointer-events-none"></div>
          
          {/* --- TOP 3D GOAL (Behind GK) --- */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-72 md:w-96 h-20 [transform-style:preserve-3d]">
            {/* Back Net */}
            <div className="absolute inset-0 bg-[#1c3d23]/50 border border-white/40 rounded-t-sm" style={{ backgroundImage: 'radial-gradient(circle, transparent 20%, rgba(255,255,255,0.3) 21%, rgba(255,255,255,0.3) 22%, transparent 23%)', backgroundSize: '8px 8px' }}></div>
            {/* Left Post & Net */}
            <div className="absolute top-0 bottom-0 -left-4 w-4 bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.3)_49%,rgba(255,255,255,0.3)_51%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.3)_49%,rgba(255,255,255,0.3)_51%,transparent_51%)] bg-[length:8px_8px] border-l-2 border-white/70 [transform:skewY(45deg)] origin-top-left"></div>
            {/* Right Post & Net */}
            <div className="absolute top-0 bottom-0 -right-4 w-4 bg-[linear-gradient(90deg,transparent_49%,rgba(255,255,255,0.3)_49%,rgba(255,255,255,0.3)_51%,transparent_51%),linear-gradient(0deg,transparent_49%,rgba(255,255,255,0.3)_49%,rgba(255,255,255,0.3)_51%,transparent_51%)] bg-[length:8px_8px] border-r-2 border-white/70 [transform:skewY(-45deg)] origin-top-right"></div>
            {/* Crossbar */}
            <div className="absolute -top-1 left-0 right-0 h-1 bg-white/80 shadow-md"></div>
            {/* Post Shadows/Thickness */}
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-white"></div>
            <div className="absolute top-0 bottom-0 right-0 w-1 bg-white"></div>
          </div>

          {/* Top Penalty Box */}
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-3/4 md:w-1/2 h-40 md:h-52 border-b-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>
          <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1/2 md:w-1/3 h-16 md:h-24 border-b-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>
          <div className="absolute top-[224px] md:top-[272px] left-1/2 -translate-x-1/2 w-32 md:w-48 h-12 md:h-16 border-b-2 border-l-2 border-r-2 border-white/30 rounded-b-full pointer-events-none"></div>

          {/* Halfway Line */}
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-white/30 pointer-events-none"></div>
          
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 border-2 border-white/30 rounded-full pointer-events-none flex items-center justify-center">
            <div className="w-2 h-2 bg-white/50 rounded-full"></div>
          </div>

          {/* Bottom Penalty Box */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-3/4 md:w-1/2 h-40 md:h-52 border-t-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-1/2 md:w-1/3 h-16 md:h-24 border-t-2 border-l-2 border-r-2 border-white/30 pointer-events-none"></div>
          <div className="absolute bottom-[192px] md:bottom-[240px] left-1/2 -translate-x-1/2 w-32 md:w-48 h-12 md:h-16 border-t-2 border-l-2 border-r-2 border-white/30 rounded-t-full pointer-events-none"></div>
        </div>

        {/* 
          PLAYERS OVERLAY 
          Placed absolutely over the tilted pitch, counter-rotated to face the camera.
        */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          
          {/* GK Row */}
          <div className="absolute top-[6%] w-full flex justify-center gap-4 [transform:rotateX(-25deg)] scale-[0.6] md:scale-[0.7] pointer-events-auto origin-top">
            {getPlayers(squad, 'GK').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* DEF Row */}
          <div className="absolute top-[26%] w-full flex justify-center gap-2 md:gap-8 [transform:rotateX(-25deg)] scale-[0.75] md:scale-[0.85] pointer-events-auto origin-top">
            {getPlayers(squad, 'DEF').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* MID Row */}
          <div className="absolute top-[50%] w-full flex justify-center gap-2 md:gap-10 [transform:rotateX(-25deg)] scale-90 md:scale-95 pointer-events-auto origin-top">
            {getPlayers(squad, 'MID').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
            ))}
          </div>

          {/* FWD Row */}
          <div className="absolute top-[74%] w-full flex justify-center gap-2 md:gap-12 [transform:rotateX(-25deg)] scale-100 md:scale-105 pointer-events-auto origin-top">
            {getPlayers(squad, 'FWD').map((p, i) => (
              <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
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