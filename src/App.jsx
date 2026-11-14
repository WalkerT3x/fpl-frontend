import { useState, useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import MySquadPage from './pages/MySquadPage';
import TransferPlannerPage from './pages/TransferPlannerPage';
import ChipStrategyPage from './pages/ChipStrategyPage';

const APP_VERSION = "v1.0.5"; 

function App() {
  if (localStorage.getItem('fplAppVersion') !== APP_VERSION) {
    localStorage.clear();
    localStorage.setItem('fplAppVersion', APP_VERSION);
  }

  const [teamId, setTeamId] = useState(() => localStorage.getItem('fplTeamId') || '');
  const [hasLoaded, setHasLoaded] = useState(() => localStorage.getItem('fplHasLoaded') === 'true');
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('fplActiveTab') || 'My Squad');
  
  const [isRestoring, setIsRestoring] = useState(() => localStorage.getItem('fplHasLoaded') === 'true');

  const [teamHistory, setTeamHistory] = useState(() => {
    const saved = localStorage.getItem('fplTeamHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const [starting11, setStarting11] = useState(null);
  const [bench, setBench] = useState(null);
  const [currentGw, setCurrentGw] = useState(11);
  const [bank, setBank] = useState(null);
  const [teamValue, setTeamValue] = useState(null);
  const [captain, setCaptain] = useState('');
  const [vice, setVice] = useState('');

  const [loading, setLoading] = useState(false);
  const [loadingTransfers, setLoadingTransfers] = useState(false);
  const [error, setError] = useState('');

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const [chips, setChips] = useState(null);
  const [loadingChips, setLoadingChips] = useState(false);
  const [chipsError, setChipsError] = useState('');

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

  useEffect(() => {
    if (isRestoring && teamId) {
      fetchTeam(teamId, true);
    }
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    localStorage.setItem('fplActiveTab', tab);
  };

  const triggerPopup = (msg) => {
    setPopupMessage(msg);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const fetchTeam = async (idToLoad, isRestore = false) => {
    if (!idToLoad) return;
    setLoading(true);
    setError('');
    
    if (!isRestore) {
      setChips(null);
      setChipsError('');
      setTransferAdvice(null);
    }

    try {
      const response = await fetch('https://fpl-backend-c25x.onrender.com/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          team_id: parseInt(idToLoad), 
          free_transfers: freeTransfers, 
          manual_transfers: manualTransfers,
          run_math: false 
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
      
      setTeamId(idToLoad);
      setHasLoaded(true);
      localStorage.setItem('fplHasLoaded', 'true');
      localStorage.setItem('fplTeamId', idToLoad);
      
      if (!isRestore) {
        handleTabChange('My Squad');
        triggerPopup("✅ Team Loaded Successfully!");
      }
      
    } catch (err) {
      setError(err.message);
      if (isRestore) {
        setHasLoaded(false);
        localStorage.setItem('fplHasLoaded', 'false');
      }
    } finally {
      setLoading(false);
      setIsRestoring(false);
    }
  };

  const handleLogout = () => {
    setHasLoaded(false);
    setStarting11(null);
    handleTabChange('My Squad'); 
    localStorage.setItem('fplHasLoaded', 'false');
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
          manual_transfers: transfersToApply,
          run_math: false 
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
          manual_transfers: manualTransfers,
          run_math: true 
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

  if (isRestoring) {
    return (
      <div className="min-h-screen bg-[#37003c] text-white flex flex-col justify-center items-center">
        <div className="text-[#00ff87] font-black text-2xl animate-pulse mb-2">Restoring Session...</div>
        <p className="text-gray-400 text-sm">Fetching your squad.</p>
      </div>
    );
  }

  if (!hasLoaded) {
    return (
      <div className="min-h-screen bg-[#37003c] text-white font-sans flex flex-col justify-center items-center">
        <DashboardPage 
          teamHistory={teamHistory}
          setTeamHistory={setTeamHistory}
          fetchTeam={fetchTeam}
          loading={loading} 
          error={error} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#37003c] text-white font-sans pb-10 relative">
      
      {showPopup && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 bg-[#00ff87] text-[#37003c] px-8 py-3 rounded-full font-black text-lg shadow-[0_0_20px_rgba(0,255,135,0.5)] z-[100] animate-bounce whitespace-nowrap">
          {popupMessage}
        </div>
      )}

      <nav className="bg-[#120016]/80 backdrop-blur-xl border-b border-white/10 shadow-2xl mb-8 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabChange('My Squad')}>
            <div className="w-8 h-8 bg-[#00ff87] rounded-full flex items-center justify-center shadow-[0_0_10px_rgba(0,255,135,0.4)]">
              <span className="text-[#37003c] font-black text-xl">A</span>
            </div>
            <span className="font-black text-xl tracking-wider text-white">FPL <span className="text-[#00ff87]">ASSISTANT</span></span>
          </div>
          
          <div className="hidden md:flex gap-6 text-sm font-bold items-center">
            {['My Squad', 'Transfer Planner', 'Chip Strategy'].map(tab => (
              <span 
                key={tab}
                onClick={() => {
                  handleTabChange(tab);
                  if (tab === 'Chip Strategy') fetchChips();
                }}
                className={`cursor-pointer transition-colors uppercase tracking-widest text-xs ${activeTab === tab ? 'text-[#00ff87] drop-shadow-[0_0_5px_rgba(0,255,135,0.5)]' : 'text-gray-400 hover:text-white'}`}
              >
                {tab}
              </span>
            ))}

            <button 
              onClick={handleLogout}
              className="ml-4 text-[#ff4a4a]/80 hover:text-[#ff4a4a] uppercase tracking-wider text-xs font-bold px-4 py-2 rounded-lg border border-[#ff4a4a]/30 hover:bg-[#ff4a4a]/10 transition-colors"
            >
              Switch Team
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center">
        
        {activeTab === 'My Squad' && (
          <MySquadPage 
            starting11={starting11} 
            bench={bench} 
            currentGw={currentGw} 
            captain={captain} 
            vice={vice} 
            setActiveTab={handleTabChange} 
          />
        )}

        {activeTab === 'Transfer Planner' && (
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

        {activeTab === 'Chip Strategy' && (
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