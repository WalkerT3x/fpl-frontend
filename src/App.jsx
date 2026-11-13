import { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import PickTeamPage from './pages/PickTeamPage';
import TokensPage from './pages/TokensPage';

function App() {
  const savedId = localStorage.getItem('fplTeamId') || '';
  const [teamId, setTeamId] = useState(savedId);
  
  const [starting11, setStarting11] = useState(null);
  const [bench, setBench] = useState(null);
  const [currentGw, setCurrentGw] = useState(11);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('Home'); 
  const [showPopup, setShowPopup] = useState(false);
  
  const [chips, setChips] = useState(null);
  const [loadingChips, setLoadingChips] = useState(false);
  const [chipsError, setChipsError] = useState('');

  const fetchTeam = async () => {
    if (!teamId) return;
    setLoading(true);
    setError('');
    setChips(null);
    setChipsError('');
    
    localStorage.setItem('fplTeamId', teamId);

    try {
      const response = await fetch('https://fpl-backend-c25x.onrender.com/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ team_id: parseInt(teamId), free_transfers: 1, manual_transfers: [] })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      if (!response.ok) throw new Error('Failed to optimize team');
      
      setStarting11(data.starting_11);
      setBench(data.bench);
      setCurrentGw(data.current_gw);
      
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChips = async (force = false) => {
    if (!teamId || (chips && !force)) return;
    setLoadingChips(true);
    setChipsError('');

    try {
      const response = await fetch(`https://fpl-backend-c25x.onrender.com/api/chips/${teamId}`);
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      if (!response.ok) throw new Error('Failed to fetch chips');
      
      setChips(data);
    } catch (err) {
      setChipsError(err.message);
    } finally {
      setLoadingChips(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'Tokens' && teamId && !chips && !loadingChips) {
      fetchChips();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#37003c] text-white font-sans pb-10 relative">
      
      {showPopup && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#00ff87] text-[#37003c] px-8 py-3 rounded-full font-black text-lg shadow-2xl z-[100] animate-bounce">
          ✅ Team Loaded Successfully!
        </div>
      )}

      <nav className="bg-[#250028] border-b border-[#4a0050] shadow-xl mb-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('Home')}>
            <div className="w-8 h-8 bg-[#00ff87] rounded-full flex items-center justify-center">
              <span className="text-[#37003c] font-black text-xl">G</span>
            </div>
            <span className="font-black text-xl tracking-wider">FPL GENIUS</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-bold text-gray-300">
            {['Home', 'Pick Team', 'Points', 'Transfers', 'Tokens'].map(tab => (
              <span 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer transition-colors ${activeTab === tab ? 'text-[#00ff87]' : 'hover:text-white'}`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        
        {activeTab === 'Home' && (
          <HomePage 
            teamId={teamId} 
            setTeamId={setTeamId} 
            fetchTeam={fetchTeam} 
            loading={loading} 
            error={error} 
            starting11={starting11} 
          />
        )}

        {activeTab === 'Pick Team' && (
          <PickTeamPage 
            starting11={starting11} 
            bench={bench} 
            currentGw={currentGw} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'Tokens' && (
          <TokensPage 
            chips={chips} 
            currentGw={currentGw} 
            loadingChips={loadingChips} 
            chipsError={chipsError}
            retryFetch={() => fetchChips(true)}
          />
        )}
      </div>
    </div>
  );
}

export default App;