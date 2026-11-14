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
    <div className="flex flex-col items-center w-[76px] md:w-24 group cursor-pointer relative mt-10">
      {/* Shirt */}
      <div className="absolute -top-10 md:-top-14 w-16 h-16 md:w-20 md:h-20 z-10 transition-transform group-hover:-translate-y-1">
        <img 
          src={player.shirt_url}
          alt={player.team}
          className="w-full h-full object-contain drop-shadow-md"
          onError={(e) => { e.target.src = 'https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_0_1-110.png'; }} 
        />
      </div>

      {/* Card body */}
      <div className="bg-white text-black w-full pt-6 pb-1 rounded shadow-md border-b-4 border-gray-300 relative">
        
        {/* Captain / Vice badges */}
        {isCaptain && (
          <div className="absolute -top-2 -left-2 z-20 w-6 h-6 rounded-full bg-[#00ff87] text-[#37003c] flex items-center justify-center font-black text-[10px] shadow border border-white">
            C
          </div>
        )}
        {isVice && !isCaptain && (
          <div className="absolute -top-2 -left-2 z-20 w-6 h-6 rounded-full bg-gray-300 text-black flex items-center justify-center font-black text-[8px] shadow border border-white">
            VC
          </div>
        )}

        {/* Bench label */}
        {benchLabel && (
          <div className="absolute -top-2 -right-2 z-20 px-1.5 py-0.5 rounded bg-[#37003c] text-[#00ff87] font-black text-[8px] shadow border border-[#00ff87]">
            {benchLabel}
          </div>
        )}

        {/* Points circle */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#37003c] text-white w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center shadow-lg border-2 border-white z-50">
          <span className="font-bold text-xs md:text-sm">{points}</span>
        </div>

        <div className="font-bold text-[11px] md:text-sm truncate px-1 leading-tight text-center">
          {player.name}
        </div>
        <div className="text-[9px] md:text-xs text-gray-500 font-bold text-center">
          {player.position}
        </div>
      </div>
    </div>
  );
}