
import React from 'react';
// Added missing Beer and Coffee icon imports to fix compilation errors
import { Trophy, Star, History, ArrowUpRight, Gift, Medal, Crown, Beer, Coffee } from 'lucide-react';
import { UserReward } from '../types';

interface EarnSectionProps {
  rewards: UserReward;
}

const EarnSection: React.FC<EarnSectionProps> = ({ rewards }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Hero Points Card */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group border border-white/10">
        <div className="absolute -right-12 -top-12 opacity-10 group-hover:scale-110 transition-transform duration-1000 rotate-12">
          <Crown size={300} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Authenticated Fan Profile</h3>
            <div className="text-6xl md:text-7xl font-black text-white tracking-tighter italic mb-4">
              {rewards.points.toLocaleString()}
              <span className="text-xl align-top ml-2 opacity-60">PTS</span>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/20">
                Level: {rewards.level}
              </span>
              <span className="px-4 py-1.5 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-900/40">
                Top 5% Fan
              </span>
            </div>
          </div>

          <div className="w-full md:w-64 bg-slate-950/40 backdrop-blur-2xl rounded-3xl p-6 border border-white/10">
            <div className="flex justify-between text-xs font-bold text-blue-200 mb-2">
              <span>Next Reward</span>
              <span>85%</span>
            </div>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/5 shadow-inner mb-4">
              <div className="h-full bg-white rounded-full shadow-[0_0_15px_white]" style={{ width: '85%' }} />
            </div>
            <p className="text-[10px] font-medium text-blue-100 leading-relaxed text-center italic">
              "You're just 2 more reports away from a <span className="font-black underline">Free Drink</span> voucher!"
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-black text-white italic uppercase flex items-center gap-3">
              <History className="text-blue-500" />
              Activity History
            </h4>
            <button className="text-[10px] font-black text-blue-500 uppercase tracking-widest hover:text-blue-400 transition-colors">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {rewards.history.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800 group hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                    <ArrowUpRight size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{item.action}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase">{item.date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
                <div className="text-emerald-500 font-black">+{item.points}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Redemption Store Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-xl font-black text-white italic uppercase flex items-center gap-3">
              <Gift className="text-rose-500" />
              Fan Store
            </h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Cold Brew', pts: 500, icon: <Beer size={20} /> },
              { name: 'Large Popcorn', pts: 800, icon: <Coffee size={20} /> },
              { name: 'Foam Finger', pts: 1200, icon: <Star size={20} /> },
              { name: 'VIP Pass', pts: 5000, icon: <Medal size={20} /> },
            ].map((prize, idx) => (
              <div key={idx} className="p-4 bg-slate-950/50 border border-slate-800 rounded-3xl hover:border-blue-500/40 cursor-pointer transition-all flex flex-col items-center text-center group">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-400 transition-colors mb-3">
                  {prize.icon}
                </div>
                <div className="text-xs font-black text-white uppercase tracking-tight mb-1">{prize.name}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{prize.pts} PTS</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EarnSection;
