import { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import MySquadPage from './pages/MySquadPage';
import TransferPlannerPage from './pages/TransferPlannerPage';
import ChipStrategyPage from './pages/ChipStrategyPage';

function App() {
  const savedId = localStorage.getItem('fplTeamId') || '';
  const [teamId, setTeamId] = useState(savedId);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Keep track of previously used Team IDs
  const [teamHistory, setTeamHistory] = useState(() => {
    const saved = localStorage.getItem('fplTeamHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Squad State
  const [starting11, setStarting11] = useState(null);
  const [bench, setBench] = useState(null);
  const [currentGw, setCurrentGw] = useState(11);
  const [bank, setBank] = useState(null);
  const [teamValue, setTeamValue] = useState(null);
  const [captain, setCaptain] = useState('');
  const [vice, setVice] = useState('');

  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [loadingTransfers, setLoadingTransfers] = useState(false);
  const [error, setError] = useState('');

  // Tabs & Popup
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  // Chips State
  const [chips, setChips] = useState(null);
  const [loadingChips, setLoadingChips] = useState(false);
  const [chipsError, setChipsError] = useState('');

  // Transfer State
  const [manualTransfers, setManualTransfers] = useState(() => {
    const saved = localStorage.getItem('fplManualTransfersV2');
    return saved ? JSON.parse(saved) : [];
  });
  const [freeTransfers, setFreeTransfers] = useState(1);
  const [transferAdvice, setTransferAdvice] = useState(null);
  const [bankAfter, setBankAfter] = useState(null);

  useEffect(() => {
    localStorage.setItem('fplManualTransfersV2', JSON.stringify(manualTransfers));
  }, [manualTransfers]);

  const triggerPopup = (msg) => {
    setPopupMessage(msg);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const fetchTeam = async () => {
    if (!teamId) return;
    setLoading(true);
    setError('');
    setChips(null);
    setChipsError('');
    setTransferAdvice(null);
    localStorage.setItem('fplTeamId', teamId);

    try {
      const response = await fetch('https://fpl-backend-c25x.onrender.com/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          team_id: parseInt(teamId), 
          free_transfers: freeTransfers, 
          manual_transfers: manualTransfers 
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setStarting11(data.starting_11);
      setBench(data.bench);
      setCurrentGw(data.current_gw);
      setBank(data.bank);
      setTeamValue(data.team_value);
      setCaptain(data.captain || '');
      setVice(data.vice || '');
      
      // UNLOCK THE APP
      setHasLoaded(true);

      // Save to history if it's a new ID
      if (teamId && !teamHistory.includes(teamId)) {
        const newHistory = [...teamHistory, teamId];
        setTeamHistory(newHistory);
        localStorage.setItem('fplTeamHistory', JSON.stringify(newHistory));
      }

      triggerPopup("✅ Team Loaded Successfully!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const applyManualTransfers = async (transfersToApply) => {
    if (!teamId) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://fpl-backend-c25x.onrender.com/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          team_id: parseInt(teamId), 
          free_transfers: freeTransfers, 
          manual_transfers: transfersToApply 
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setStarting11(data.starting_11);
      setBench(data.bench);
      setBank(data.bank);
      setCaptain(data.captain || '');
      setVice(data.vice || '');
      
      setTransferAdvice(null);
      setBankAfter(null);
      
      triggerPopup("✅ Squad Updated with Manual Transfers!");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransfers = async () => {
    if (!teamId) return;
    setLoadingTransfers(true);
    setError('');

    try {
      const response = await fetch('https://fpl-backend-c25x.onrender.com/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          team_id: parseInt(teamId), 
          free_transfers: freeTransfers, 
          manual_transfers: manualTransfers 
        })
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setTransferAdvice(data.transfer_advice);
      setBankAfter(data.bank_after);
      setBank(data.bank);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTransfers(false);
    }
  };

  const fetchChips = async (force = false) => {
    if (!teamId || (chips && !force)) return;
    setLoadingChips(true);
    setChipsError('');

    try {
      const response = await fetch('https://fpl-backend-c25x.onrender.com/api/chips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          team_id: parseInt(teamId), 
          free_transfers: freeTransfers, 
          manual_transfers: manualTransfers 
        })
      });
      
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      
      setChips(data);
    } catch (err) {
      setChipsError(err.message);
    } finally {
      setLoadingChips(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#37003c] text-white font-sans pb-10 relative">
      
      {showPopup && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#00ff87] text-[#37003c] px-8 py-3 rounded-full font-black text-lg shadow-2xl z-[100] animate-bounce whitespace-nowrap">
          {popupMessage}
        </div>
      )}

      <nav className="bg-[#250028] border-b border-[#4a0050] shadow-xl mb-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('Dashboard')}>
            <div className="w-8 h-8 bg-[#00ff87] rounded-full flex items-center justify-center">
              <span className="text-[#37003c] font-black text-xl">G</span>
            </div>
            <span className="font-black text-xl tracking-wider">FPL GENIUS</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm font-bold text-gray-300">
            {['Dashboard', 'My Squad', 'Transfer Planner', 'Chip Strategy'].map(tab => (
              <span 
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  if (tab === 'Chip Strategy' && hasLoaded) fetchChips();
                }}
                className={`cursor-pointer transition-colors ${activeTab === tab ? 'text-[#00ff87]' : 'hover:text-white'}`}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        
        {activeTab === 'Dashboard' && (
          <DashboardPage 
            teamId={teamId} 
            setTeamId={setTeamId} 
            fetchTeam={fetchTeam} 
            loading={loading} 
            error={error} 
            starting11={starting11} 
            teamHistory={teamHistory}
          />
        )}

        {/* LOCKOUT SCREEN: If they haven't loaded a team, block the other tabs */}
        {activeTab !== 'Dashboard' && !hasLoaded && (
          <div className="text-center mt-32 animate-fade-in-up">
            <p className="text-xl text-gray-300 mb-4">No team loaded yet.</p>
            <button 
              onClick={() => setActiveTab('Dashboard')} 
              className="bg-[#00ff87] text-[#37003c] font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {/* ONLY RENDER THESE IF hasLoaded IS TRUE */}
        {hasLoaded && activeTab === 'My Squad' && (
          <MySquadPage 
            starting11={starting11} 
            bench={bench} 
            currentGw={currentGw} 
            captain={captain} 
            vice={vice} 
            setActiveTab={setActiveTab} 
          />
        )}

        {hasLoaded && activeTab === 'Transfer Planner' && (
          <TransferPlannerPage 
            teamId={teamId} 
            starting11={starting11}
            manualTransfers={manualTransfers}
            setManualTransfers={setManualTransfers}
            applyManualTransfers={applyManualTransfers}
            fetchTransfers={fetchTransfers}
            loadingManual={loading}
            loadingTransfers={loadingTransfers}
            error={error}
            freeTransfers={freeTransfers}
            setFreeTransfers={setFreeTransfers}
            transferAdvice={transferAdvice}
            bank={bank}
            bankAfter={bankAfter}
          />
        )}

        {hasLoaded && activeTab === 'Chip Strategy' && (
          <ChipStrategyPage 
            chips={chips} 
            starting11={starting11}
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