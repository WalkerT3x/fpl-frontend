import PitchView from '../components/PitchView';

export default function PickTeamPage({ starting11, bench, currentGw, setActiveTab }) {
  return (
    <div className="w-full flex flex-col items-center animate-fade-in-up">
      <div className="bg-[#00ff87] text-[#37003c] px-6 py-2 rounded-full font-black uppercase tracking-widest mb-6 shadow-lg">
        Gameweek {currentGw} Optimizer
      </div>
      
      {starting11 ? (
        <PitchView squad={starting11} subs={bench} currentGw={currentGw} />
      ) : (
        <div className="text-center mt-20">
          <p className="text-xl text-gray-300 mb-4">No team loaded yet.</p>
          <button onClick={() => setActiveTab('Home')} className="bg-[#00ff87] text-[#37003c] font-bold py-2 px-6 rounded-lg hover:scale-105 transition-transform">Go to Home</button>
        </div>
      )}
    </div>
  );
}