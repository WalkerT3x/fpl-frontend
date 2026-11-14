import { useState, useEffect } from 'react';

export default function TransfersPage({ teamId }) {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!teamId) return;
    
    setLoading(true);
    setError('');

    fetch(`https://fpl-backend-c25x.onrender.com/api/transfers/${teamId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        // Sort transfers by Gameweek descending (most recent first)
        const sorted = (data.transfers || []).sort((a, b) => b.gw - a.gw);
        setTransfers(sorted);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [teamId]);

  if (!teamId) {
    return <div className="text-center text-gray-400 mt-32 text-xl font-bold">Load a team on the Home page to see transfer history.</div>;
  }

  if (loading) {
    return <div className="text-center text-[#00ff87] animate-pulse mt-32 text-xl font-bold">Fetching transfer history...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 font-bold mt-32 bg-red-900/30 p-4 rounded border border-red-500">{error}</div>;
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fade-in-up mt-8">
      <div className="bg-[#250028] rounded-xl p-6 md:p-8 shadow-2xl border border-[#4a0050]">
        <h2 className="text-2xl font-black text-[#00ff87] mb-6 text-center uppercase tracking-widest">
          Transfer History
        </h2>

        {transfers.length === 0 ? (
          <div className="text-center text-gray-400 py-10">
            No transfers found for this season.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transfers.map((t, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center justify-between bg-[#37003c] p-4 rounded-lg border border-[#4a0050] shadow-md">
                
                {/* Gameweek Badge */}
                <div className="flex-shrink-0 mb-2 md:mb-0 md:mr-6">
                  <div className="bg-[#00ff87] text-[#37003c] font-black px-4 py-1 rounded-full text-sm">
                    GW {t.gw}
                  </div>
                </div>

                {/* Transfer Info */}
                <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 w-full">
                  
                  {/* Player OUT */}
                  <div className="flex flex-col items-center md:items-end w-full md:w-1/3">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Out</span>
                    <span className="text-red-400 font-bold text-lg truncate w-full text-center md:text-right">{t.out_name}</span>
                    <span className="text-xs text-gray-500 font-medium">£{t.out_cost}m</span>
                  </div>

                  {/* Arrow */}
                  <div className="text-[#00ff87] font-black text-2xl hidden md:block">
                    ➡️
                  </div>

                  {/* Player IN */}
                  <div className="flex flex-col items-center md:items-start w-full md:w-1/3">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">In</span>
                    <span className="text-green-400 font-bold text-lg truncate w-full text-center md:text-left">{t.in_name}</span>
                    <span className="text-xs text-gray-500 font-medium">£{t.in_cost}m</span>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}