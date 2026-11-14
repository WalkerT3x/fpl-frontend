export default function HomePage({ 
  teamId, 
  setTeamId, 
  fetchTeam, 
  loading, 
  error, 
  starting11, 
  bank, 
  teamValue
}) {
  return (
    <div className="flex flex-col items-center justify-center mt-32 animate-fade-in-up w-full max-w-md mx-auto">
      
      <div className="bg-[#250028] p-8 rounded-xl shadow-2xl border border-[#4a0050] w-full text-center mb-6">
        <h2 className="text-2xl font-black mb-6 text-white">Load Your Team</h2>
        
        <input 
          type="number" 
          placeholder="Enter Team ID" 
          className="w-full p-4 rounded-lg text-black bg-white outline-none focus:ring-2 focus:ring-[#00ff87] font-bold text-lg mb-6"
          value={teamId}
          onChange={(e) => setTeamId(e.target.value)}
        />

        <button 
          onClick={fetchTeam}
          className="w-full bg-[#00ff87] hover:bg-green-400 text-[#37003c] font-black py-4 rounded-lg transition-transform hover:scale-105 disabled:opacity-50 text-lg shadow-lg"
          disabled={loading}
        >
          {loading ? 'Waking Server & Fetching Data...' : 'Load Team'}
        </button>
        
        {error && <div className="mt-4 text-red-400 font-bold bg-red-900/30 p-3 rounded border border-red-500">{error}</div>}
        
        {starting11 && !loading && (
          <div className="mt-6 pt-6 border-t border-[#4a0050]">
            <p className="text-[#00ff87] font-bold text-sm mb-3">✅ Data loaded! Check the tabs above.</p>
            <div className="flex justify-center gap-6 text-sm">
              <div className="bg-[#37003c] px-4 py-2 rounded border border-[#4a0050]">
                <span className="text-gray-400 block text-xs uppercase">Bank</span>
                <span className="font-black text-white text-lg">£{bank}m</span>
              </div>
              <div className="bg-[#37003c] px-4 py-2 rounded border border-[#4a0050]">
                <span className="text-gray-400 block text-xs uppercase">Squad Value</span>
                <span className="font-black text-white text-lg">£{teamValue}m</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}