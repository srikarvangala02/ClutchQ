
import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  MapPin, 
  Zap, 
  Clock, 
  Menu, 
  Settings, 
  Bell,
  Search,
  Filter,
  PlusCircle,
  X,
  Target,
  BarChart3,
  LayoutDashboard,
  Navigation,
  Sparkles
} from 'lucide-react';
import { SportType, Vendor, UserReward } from './types';
import { MOCK_VENDORS, SPORT_ICONS } from './constants';
import PitStopPredictor from './components/PitStopPredictor';
import LineList from './components/LineList';
import StadiumMap from './components/StadiumMap';
import EarnSection from './components/EarnSection';

type ActiveTab = 'map' | 'flow' | 'earn';

const App: React.FC = () => {
  const [activeSport, setActiveSport] = useState<SportType>(SportType.FOOTBALL);
  const [activeTab, setActiveTab] = useState<ActiveTab>('map');
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [rewards, setRewards] = useState<UserReward>({
    points: 1250,
    level: 'All-Star',
    history: [
      { date: new Date(), points: 50, action: 'Wait time report: Big League Burgers' },
      { date: new Date(Date.now() - 1000 * 60 * 15), points: 25, action: 'Daily login bonus' }
    ]
  });
  const [isReporting, setIsReporting] = useState<Vendor | null>(null);
  const [reportValue, setReportValue] = useState(5);
  const [showNotification, setShowNotification] = useState(false);

  const handleReportSubmit = () => {
    if (!isReporting) return;
    
    const updated = vendors.map(v => 
      v.id === isReporting.id 
        ? { ...v, currentWaitMinutes: reportValue, reportsCount: v.reportsCount + 1, lastUpdated: new Date() }
        : v
    );
    setVendors(updated);
    
    setRewards(prev => ({
      ...prev,
      points: prev.points + 50,
      history: [
        { date: new Date(), points: 50, action: `Reported ${reportValue}m at ${isReporting.name}` },
        ...prev.history
      ]
    }));

    setIsReporting(null);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const getSportThemeClass = () => {
    switch (activeSport) {
      case SportType.FOOTBALL: return 'bg-gradient-to-br from-[#020617] via-[#020617] to-emerald-900/20';
      case SportType.BASEBALL: return 'bg-gradient-to-br from-[#020617] via-[#020617] to-amber-900/20';
      case SportType.BASKETBALL: return 'bg-gradient-to-br from-[#020617] via-[#020617] to-orange-900/20';
      case SportType.SOCCER: return 'bg-gradient-to-br from-[#020617] via-[#020617] to-green-900/20';
      default: return 'bg-[#020617]';
    }
  };

  return (
    <div className={`min-h-screen pb-24 lg:pb-0 lg:pl-64 flex flex-col transition-colors duration-1000 ${getSportThemeClass()} text-slate-200 selection:bg-blue-500/30`}>
      {/* Global Notifications */}
      {showNotification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-10">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-emerald-400">
            <Trophy className="w-5 h-5" />
            <span className="font-black text-sm uppercase tracking-tight">+50 Points Awarded!</span>
          </div>
        </div>
      )}

      {/* Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-slate-950/40 border-r border-slate-800/60 flex-col p-6 backdrop-blur-3xl z-40">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/40 border border-blue-500/50">
            <Target className="text-white w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white leading-none italic uppercase">FANFLOW</h1>
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live Connect</span>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveTab('map')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all border ${
              activeTab === 'map' 
                ? 'bg-blue-600/10 border-blue-500/30 text-blue-400' 
                : 'text-slate-500 border-transparent hover:bg-slate-800/50'
            }`}
          >
            <Navigation className="w-5 h-5" />
            Stadium Map
          </button>
          <button 
            onClick={() => setActiveTab('flow')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all border ${
              activeTab === 'flow' 
                ? 'bg-amber-600/10 border-amber-500/30 text-amber-400' 
                : 'text-slate-500 border-transparent hover:bg-slate-800/50'
            }`}
          >
            <Zap className="w-5 h-5" />
            Game Flow AI
          </button>
          <button 
            onClick={() => setActiveTab('earn')}
            className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all border ${
              activeTab === 'earn' 
                ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400' 
                : 'text-slate-500 border-transparent hover:bg-slate-800/50'
            }`}
          >
            <Trophy className="w-5 h-5" />
            Rewards Hub
          </button>
        </nav>

        <div className="mt-auto bg-slate-900/80 rounded-[2rem] p-5 border border-slate-800 shadow-xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">My XP</span>
              <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded border border-emerald-500/20">{rewards.level}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center border border-white/10 shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-black text-white">{rewards.points.toLocaleString()}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Fan Rank Points</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-600/10 border border-blue-500/20 text-blue-400 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-900/20">
              <Target className="w-3.5 h-3.5" />
              Empower Field Connected • {activeSport} Mode
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase leading-none">
              {activeTab === 'map' ? 'Stadium View' : activeTab === 'flow' ? 'Game Intelligence' : 'Fan Rewards'}
            </h2>
          </div>

          <div className="flex items-center gap-2 p-2 bg-slate-900/80 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-2xl">
            {Object.values(SportType).map((sport) => (
              <button
                key={sport}
                onClick={() => setActiveSport(sport)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl transition-all text-xs font-black uppercase tracking-widest ${
                  activeSport === sport 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/40 border border-blue-500/50 scale-105' 
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                <span className="text-lg">{SPORT_ICONS[sport]}</span>
                <span className="hidden md:inline">{sport}</span>
              </button>
            ))}
          </div>
        </header>

        {/* Tab Content Rendering */}
        <div className="animate-in fade-in slide-in-from-top-4 duration-500">
          {activeTab === 'map' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-8">
                <StadiumMap 
                  vendors={vendors} 
                  onSelectVendor={(v) => setIsReporting(v)} 
                  sport={activeSport}
                />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="text-blue-500" />
                    <h4 className="text-lg font-black text-white italic uppercase">Busiest Lines</h4>
                  </div>
                  <LineList vendors={vendors.sort((a,b) => b.currentWaitMinutes - a.currentWaitMinutes).slice(0, 3)} onReport={setIsReporting} />
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-3xl p-6">
                  <h4 className="text-white font-bold mb-2">Pro Tip</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">Concourse B restrooms currently have the shortest wait. Head there at the next break!</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-black text-white mb-2 italic">Pit Stop Predictor</h3>
                <p className="text-slate-500 font-medium">Automated AI monitoring of live game feed and broadcast signals</p>
              </div>
              <PitStopPredictor currentSport={activeSport} />
            </div>
          )}

          {activeTab === 'earn' && (
            <EarnSection rewards={rewards} />
          )}
        </div>
      </main>

      {/* Mobile Tab Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/90 border-t border-slate-800/60 backdrop-blur-3xl flex justify-around p-4 pb-8 z-40">
        <button 
          onClick={() => setActiveTab('map')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'map' ? 'text-blue-500' : 'text-slate-500'}`}
        >
          <Navigation className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Map</span>
        </button>
        <button 
          onClick={() => setActiveTab('flow')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'flow' ? 'text-amber-500' : 'text-slate-500'}`}
        >
          <Zap className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Flow</span>
        </button>
        <button 
          onClick={() => setActiveTab('earn')}
          className={`flex flex-col items-center gap-1.5 transition-colors ${activeTab === 'earn' ? 'text-emerald-500' : 'text-slate-500'}`}
        >
          <Trophy className="w-6 h-6" />
          <span className="text-[9px] font-black uppercase tracking-widest">Earn</span>
        </button>
      </nav>

      {/* Reporting Modal */}
      {isReporting && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 border border-slate-800 rounded-[3rem] w-full max-w-md p-10 shadow-2xl animate-in slide-in-from-bottom-20 duration-500 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Submit Intel</h3>
              <button onClick={() => setIsReporting(null)} className="p-3 hover:bg-slate-800 rounded-2xl transition-all text-slate-400 active:scale-90">
                <X className="w-7 h-7" />
              </button>
            </div>

            <div className="flex items-center gap-5 mb-10 p-5 bg-slate-950/60 rounded-3xl border border-slate-800">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/30">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Live Status for</p>
                <p className="text-xl font-black text-white leading-tight">{isReporting.name}</p>
              </div>
            </div>

            <div className="space-y-10">
              <div>
                <div className="flex justify-between items-center mb-6">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Wait Time</label>
                  <span className="text-4xl font-black text-blue-500 tabular-nums">{reportValue} min</span>
                </div>
                <div className="px-2">
                  <input 
                    type="range" min="0" max="45" step="5"
                    value={reportValue}
                    onChange={(e) => setReportValue(parseInt(e.target.value))}
                    className="w-full h-4 bg-slate-800 rounded-full appearance-none cursor-pointer accent-blue-600 border border-slate-700"
                  />
                </div>
              </div>

              <button 
                onClick={handleReportSubmit}
                className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-[1.5rem] shadow-2xl shadow-blue-900/40 transition-all flex items-center justify-center gap-4 text-lg hover:scale-[1.02] active:scale-95 group"
              >
                <PlusCircle className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" />
                Submit Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
