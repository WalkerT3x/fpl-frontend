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
    
  // Get fixture text (e.g., "H FUL" -> "FUL (H)")
  const fixtureRaw = player.fixtures && player.fixtures[String(currentGw)] ? player.fixtures[String(currentGw)] : "";
  const fixtureText = fixtureRaw ? fixtureRaw.replace("H ", "").replace("A ", "") + (fixtureRaw.startsWith("H") ? " (H)" : " (A)") : "";

  return (
    <div className="flex flex-col items-center w-[74px] md:w-[90px] group cursor-pointer relative mt-8">
      
      {/* CARD CONTAINER */}
      <div className="w-full bg-[#120016]/60 backdrop-blur-md rounded-t-lg border border-white/20 border-b-0 relative flex flex-col items-center pt-2 pb-1 transition-transform group-hover:-translate-y-1">
        
        {/* TOP LEFT ICONS (C / VC) */}
        <div className="absolute top-1 left-1 z-20 flex flex-col gap-1">
          {isCaptain && (
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#ffd700] text-black flex items-center justify-center font-black text-[10px] md:text-xs shadow-[0_0_10px_rgba(255,215,0,0.6)] border border-white">
              C
            </div>
          )}
          {isVice && !isCaptain && (
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-300 text-black flex items-center justify-center font-black text-[8px] md:text-[10px] shadow-[0_0_10px_rgba(209,213,219,0.6)] border border-white">
              VC
            </div>
          )}
        </div>

        {/* TOP RIGHT POINTS */}
        <div className="absolute top-1 right-1 z-20 bg-[#37003c] text-white w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center shadow-lg border border-white">
          <span className="font-bold text-[9px] md:text-xs">{points}</span>
        </div>

        {/* Shirt */}
        <div className="w-10 h-10 md:w-14 md:h-14 z-10 mt-3 mb-1">
          <img 
            src={player.shirt_url}
            alt={player.team}
            className="w-full h-full object-contain drop-shadow-md"
            onError={(e) => { e.target.src = 'https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0_1-110.png'; }} 
          />
        </div>

      </div>

      {/* WHITE BOTTOM BOX */}
      <div className="bg-white text-black w-full rounded-b-md shadow-md flex flex-col items-center py-1">
        <div className="font-black text-[10px] md:text-xs truncate px-1 leading-tight text-center w-full">
          {player.name}
        </div>
        <div className="text-[8px] md:text-[10px] text-gray-500 font-bold text-center uppercase tracking-wide">
          {fixtureText}
        </div>
      </div>

      {/* BENCH LABEL */}
      {benchLabel && (
        <div className="absolute -bottom-2 -right-2 z-30 px-1.5 py-0.5 rounded bg-[#37003c] text-[#00ff87] font-black text-[8px] md:text-[9px] shadow-lg border border-[#00ff87]">
          {benchLabel}
        </div>
      )}
    </div>
  );
}