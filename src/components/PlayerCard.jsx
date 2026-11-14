export default function PlayerCard({ 
  player, 
  currentGw, 
  isCaptain = false, 
  isVice = false, 
  benchLabel = null,
  isBench = false
}) {
  if (!player) return null;

  const points = player.proj && player.proj[String(currentGw)] !== undefined 
    ? parseFloat(player.proj[String(currentGw)]).toFixed(1) 
    : '0.0';
    
  const fixtureRaw = player.fixtures && player.fixtures[String(currentGw)] ? String(player.fixtures[String(currentGw)]) : "";
  const fixtureText = fixtureRaw ? fixtureRaw.replace("H ", "").replace("A ", "") + (fixtureRaw.startsWith("H") ? " (H)" : " (A)") : "";

  // Dynamic classes based on whether it's a bench player
  const cardWidth = isBench ? "w-[55px] sm:w-[65px] md:w-[75px]" : "w-[70px] sm:w-[85px] md:w-[105px]";
  const shirtSize = isBench ? "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 mt-2 mb-0.5" : "w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 mt-3 md:mt-4 mb-1";
  const pointSize = isBench ? "w-4 h-4 md:w-5 md:h-5" : "w-5 h-5 md:w-7 md:h-7";
  const pointText = isBench ? "text-[7px] md:text-[9px]" : "text-[8px] md:text-[11px]";
  const nameText = isBench ? "text-[8px] md:text-[10px]" : "text-[9px] md:text-xs";
  const fixtureTextSize = isBench ? "text-[6px] md:text-[7px]" : "text-[7px] md:text-[9px]";

  return (
    <div className={`flex flex-col items-center group cursor-pointer relative ${cardWidth}`}>
      
      {/* CARD CONTAINER */}
      <div className="w-full bg-[#150f18]/95 rounded-t-md border border-white/10 border-b-0 relative flex flex-col items-center pt-1 pb-0 transition-transform group-hover:-translate-y-1 shadow-lg">
        
        {/* TOP LEFT ICONS (C / VC) */}
        <div className="absolute top-1 left-1 z-20 flex flex-col gap-1">
          {isCaptain && (
            <div className={`${isBench ? 'w-3 h-3 text-[6px]' : 'w-4 h-4 md:w-6 md:h-6 text-[8px] md:text-xs'} rounded-full bg-[#ffd700] text-black flex items-center justify-center font-black shadow-[0_0_8px_rgba(255,215,0,0.6)] border border-white`}>
              C
            </div>
          )}
          {isVice && !isCaptain && (
            <div className={`${isBench ? 'w-3 h-3 text-[5px]' : 'w-4 h-4 md:w-6 md:h-6 text-[7px] md:text-[10px]'} rounded-full bg-gray-300 text-black flex items-center justify-center font-black shadow-[0_0_8px_rgba(209,213,219,0.6)] border border-white`}>
              VC
            </div>
          )}
        </div>

        {/* TOP RIGHT POINTS */}
        <div className={`absolute top-1 right-1 z-20 bg-[#37003c] text-white ${pointSize} rounded-full flex items-center justify-center shadow-lg border border-white/50`}>
          <span className={`font-bold ${pointText}`}>{points}</span>
        </div>

        {/* Shirt */}
        <div className={`${shirtSize} z-10`}>
          <img 
            src={player.shirt_url || 'https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0_1-110.png'}
            alt={player.team || 'Team'}
            className="w-full h-full object-contain drop-shadow-xl"
            onError={(e) => { e.target.src = 'https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0_1-110.png'; }} 
          />
        </div>

      </div>

      {/* WHITE BOTTOM BOX */}
      <div className="bg-white text-black w-full rounded-b-md shadow-md flex flex-col items-center py-0.5 z-20 relative">
        <div className={`font-black ${nameText} truncate px-1 leading-tight text-center w-full mt-1`}>
          {player.name || 'Player'}
        </div>
        <div className={`${fixtureTextSize} text-gray-500 font-bold text-center uppercase tracking-wide mb-1`}>
          {fixtureText}
        </div>
      </div>

      {/* BENCH LABEL */}
      {benchLabel && (
        <div className={`absolute -bottom-2 -right-2 z-30 px-1 md:px-1.5 py-0.5 rounded bg-[#37003c] text-[#00ff87] font-black ${isBench ? 'text-[6px] md:text-[7px]' : 'text-[7px] md:text-[9px]'} shadow-lg border border-[#00ff87]`}>
          {benchLabel}
        </div>
      )}
    </div>
  );
}