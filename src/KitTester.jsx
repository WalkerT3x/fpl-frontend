import { useState, useEffect } from 'react';

export default function KitTester() {
  const [leagueTeams, setLeagueTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(true);
  const [teamError, setTeamError] = useState('');

  useEffect(() => {
    fetch('https://fpl-backend-c25x.onrender.com/api/teams')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data && data.teams) {
          setLeagueTeams(data.teams);
        } else {
          setTeamError("Data received but no 'teams' array found.");
        }
      })
      .catch(err => {
        setTeamError(err.message);
      })
      .finally(() => setLoadingTeams(false));
  }, []);

  return (
    <div className="w-full mt-16 bg-[#250028] p-4 md:p-6 rounded-xl border border-[#4a0050]">
      <h2 className="text-2xl font-black text-[#00ff87] mb-2 text-center uppercase tracking-widest">Visual Kit Tester</h2>
      <p className="text-center text-gray-300 mb-6 text-sm">Base = Home Kit. _1 = Goalkeeper. _2 = Away. _3 = Third.</p>
      
      {teamError && (
        <div className="bg-red-900/50 text-red-300 p-4 rounded border border-red-500 mb-4 text-center">
          <strong>Failed to load teams from API:</strong><br/>{teamError}
        </div>
      )}

      {loadingTeams ? (
        <div className="text-center text-gray-400 py-10 animate-pulse">Waking up server and fetching teams...</div>
      ) : (
        <div className="flex flex-col gap-4">
          {leagueTeams.map(t => (
            <div key={t.id} className="flex flex-col md:flex-row items-center bg-[#37003c] p-3 rounded shadow border border-[#4a0050]">
              <div className="w-full md:w-32 font-bold text-[#00ff87] text-sm md:text-base mb-2 md:mb-0 border-b md:border-b-0 md:border-r border-[#4a0050] pb-1 md:pb-0 pr-2">
                {t.name} <span className="text-gray-500 text-xs text-normal">(Code: {t.code})</span>
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-8 flex-1 justify-around w-full">
                
                <div className="flex flex-col items-center w-[30px] md:w-12">
                  <img 
                    src={`https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${t.code}-110.png`}
                    alt={`${t.name} Home`}
                    className="w-8 h-8 md:w-12 md:h-12 object-contain"
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                  <span className="text-[10px] md:text-xs text-green-400 mt-1 font-bold">Base</span>
                </div>

                {[1, 2, 3].map(kitNum => (
                  <div key={kitNum} className="flex flex-col items-center w-[30px] md:w-12">
                    <img 
                      src={`https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${t.code}_${kitNum}-110.png`}
                      alt={`${t.name} ${kitNum}`}
                      className="w-8 h-8 md:w-12 md:h-12 object-contain"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                    <span className="text-[10px] md:text-xs text-gray-400 mt-1">_{kitNum}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}