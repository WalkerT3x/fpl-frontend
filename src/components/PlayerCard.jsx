export default function PlayerCard({ 
  player, 
  currentGw, 
  isCaptain = false, 
  isVice = false, 
  benchLabel = null 
}) {
  const points = player.proj && player.proj[String(currentGw)] !== undefined 
    ? parseFloat(player.proj[String(currentGw)]).toFixed(1) 
    : '0.0';
    
  const fixtureRaw = player.fixtures && player.fixtures[String(currentGw)] ? player.fixtures[String(currentGw)] : "";
  const fixtureText = fixtureRaw ? fixtureRaw.replace("H ", "").replace("A ", "") + (fixtureRaw.startsWith("H") ? " (H)" : " (A)") : "";

  return (
    <div className="flex flex-col items-center w-[60px] sm:w-[72px] md:w-[88px] group cursor-pointer relative">
      
      {/* CARD CONTAINER */}
      <div className="w-full bg-[#150f18]/95 rounded-t-md border border-white/10 border-b-0 relative flex flex-col items-center pt-1 pb-0 transition-transform group-hover:-translate-y-1 shadow-lg">
        
        {/* TOP LEFT ICONS (C / VC) */}
        <div className="absolute top-1 left-1 z-20 flex flex-col gap-1">
          {isCaptain && (
            <div className="w-3 h-3 md:w-5 md:h-5 rounded-full bg-[#ffd700] text-black flex items-center justify-center font-black text-[6px] md:text-[10px] shadow-[0_0_8px_rgba(255,215,0,0.6)] border border-white">
              C
            </div>
          )}
          {isVice && !isCaptain && (
            <div className="w-3 h-3 md:w-5 md:h-5 rounded-full bg-gray-300 text-black flex items-center justify-center font-black text-[5px] md:text-[8px] shadow-[0_0_8px_rgba(209,213,219,0.6)] border border-white">
              VC
            </div>
          )}
        </div>

        {/* TOP RIGHT POINTS */}
        <div className="absolute top-1 right-1 z-20 bg-[#37003c] text-white w-4 h-4 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-lg border border-white/50">
          <span className="font-bold text-[6px] md:text-[9px]">{points}</span>
        </div>

        {/* Shirt */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 z-10 mt-2 md:mt-3 mb-1">
          <img 
            src={player.shirt_url}
            alt={player.team}
            className="w-full h-full object-contain drop-shadow-xl"
            onError={(e) => { e.target.src = 'https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0_1-110.png'; }} 
          />
        </div>

      </div>

      {/* WHITE BOTTOM BOX */}
      <div className="bg-white text-black w-full rounded-b-md shadow-md flex flex-col items-center py-0.5 z-20 relative">
        <div className="font-black text-[8px] md:text-[10px] truncate px-1 leading-tight text-center w-full mt-0.5">
          {player.name}
        </div>
        <div className="text-[6px] md:text-[8px] text-gray-500 font-bold text-center uppercase tracking-wide mb-0.5">
          {fixtureText}
        </div>
      </div>

      {/* BENCH LABEL */}
      {benchLabel && (
        <div className="absolute -bottom-2 -right-2 z-30 px-1 md:px-1.5 py-0.5 rounded bg-[#37003c] text-[#00ff87] font-black text-[6px] md:text-[8px] shadow-lg border border-[#00ff87]">
          {benchLabel}
        </div>
      )}
    </div>
  );
}