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
      
      <div className="w-full flex flex-col items-center">
        
        {/* 1. THE PITCH (Increased radius to rounded-[2rem] to clip the white corners) */}
        <div className="relative w-full rounded-[2rem] overflow-hidden shadow-2xl z-20">
          <img 
            src="/pitch.png" 
            alt="FPL Pitch" 
            className="w-full h-auto block pointer-events-none"
          />

          {/* PLAYERS OVERLAY */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            
            {/* GK Row */}
            <div className="absolute top-[10%] w-full flex justify-evenly items-center pointer-events-auto">
              {getPlayers(squad, 'GK').map((p, i) => (
                <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
              ))}
            </div>

            {/* DEF Row */}
            <div className="absolute top-[30%] w-full flex justify-evenly items-center pointer-events-auto">
              {getPlayers(squad, 'DEF').map((p, i) => (
                <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
              ))}
            </div>

            {/* MID Row */}
            <div className="absolute top-[52%] w-full flex justify-evenly items-center pointer-events-auto">
              {getPlayers(squad, 'MID').map((p, i) => (
                <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
              ))}
            </div>

            {/* FWD Row */}
            <div className="absolute top-[74%] w-full flex justify-evenly items-center pointer-events-auto">
              {getPlayers(squad, 'FWD').map((p, i) => (
                <PlayerCard key={i} player={p} currentGw={currentGw} isCaptain={p.name === captain} isVice={p.name === vice} />
              ))}
            </div>

          </div>
        </div>

        {/* 2. THE BENCH (Matched with rounded-[2rem] to mirror the pitch) */}
        <div className="relative w-full mt-4 bg-white/5 backdrop-blur-2xl rounded-[2rem] p-6 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 overflow-hidden z-20">
          
          {/* GLOWING HUES */}
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00ff87] rounded-full mix-blend-screen filter blur-[80px] opacity-50 pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#9d00ff] rounded-full mix-blend-screen filter blur-[80px] opacity-50 pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-center text-[#00ff87] font-black mb-6 uppercase tracking-widest text-xs md:text-sm drop-shadow-[0_0_10px_rgba(0,255,135,0.4)]">
              Substitutes
            </h3>
            
            {/* Subs Spread Evenly */}
            <div className="w-full flex justify-evenly items-center">
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
      
    </div>
  );
}