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

  return (
    <div className="flex flex-col items-center w-[72px] md:w-24 group cursor-pointer relative mt-10">
      
      {/* Shirt */}
      <div className="absolute -top-10 md:-top-14 w-14 h-14 md:w-20 md:h-20 z-10 transition-transform group-hover:-translate-y-1">
        <img 
          src={player.shirt_url}
          alt={player.team}
          className="w-full h-full object-contain drop-shadow-lg"
          onError={(e) => { e.target.src = 'https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0_1-110.png'; }} 
        />
      </div>

      {/* Card Body */}
      <div className="bg-white text-black w-full pt-5 pb-1.5 rounded-lg shadow-xl relative">
        
        {/* CAPTAIN (GOLD) / VICE (SILVER) BADGES - Top Left */}
        {isCaptain && (
          <div className="absolute -top-3 -left-2 z-20 w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#ffd700] text-black flex items-center justify-center font-black text-[10px] md:text-xs shadow-[0_0_10px_rgba(255,215,0,0.6)] border-2 border-white">
            C
          </div>
        )}
        {isVice && !isCaptain && (
          <div className="absolute -top-3 -left-2 z-20 w-6 h-6 md:w-7 md:h-7 rounded-full bg-gray-300 text-black flex items-center justify-center font-black text-[8px] md:text-[10px] shadow-[0_0_10px_rgba(209,213,219,0.6)] border-2 border-white">
            VC
          </div>
        )}

        {/* PREDICTED POINTS - Top Right */}
        <div className="absolute -top-3 -right-2 z-20 bg-[#37003c] text-white w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <span className="font-bold text-[10px] md:text-xs">{points}</span>
        </div>

        {/* BENCH LABEL - Bottom Right */}
        {benchLabel && (
          <div className="absolute -bottom-2 -right-2 z-20 px-1.5 py-0.5 rounded bg-[#37003c] text-[#00ff87] font-black text-[8px] md:text-[9px] shadow-lg border border-[#00ff87]">
            {benchLabel}
          </div>
        )}

        {/* Text */}
        <div className="font-black text-[10px] md:text-sm truncate px-1 leading-tight text-center">
          {player.name}
        </div>
        <div className="text-[8px] md:text-[10px] text-gray-500 font-bold text-center uppercase tracking-wider">
          {player.position}
        </div>
      </div>
    </div>
  );
}