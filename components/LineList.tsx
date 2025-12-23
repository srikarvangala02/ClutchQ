
import React from 'react';
import { Clock, MapPin, ChevronRight, Star } from 'lucide-react';
import { Vendor, VendorType } from '../types';
import { VENDOR_ICONS } from '../constants';

interface LineListProps {
  vendors: Vendor[];
  onReport: (vendor: Vendor) => void;
}

const LineList: React.FC<LineListProps> = ({ vendors, onReport }) => {
  const getWaitColor = (wait: number) => {
    if (wait < 5) return 'text-green-400';
    if (wait < 15) return 'text-amber-400';
    return 'text-red-400';
  };

  const getProgressColor = (wait: number) => {
    if (wait < 5) return 'bg-green-500';
    if (wait < 15) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-4">
      {vendors.map((vendor) => (
        <div key={vendor.id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-5 hover:bg-slate-800 transition-colors group">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="p-3 bg-slate-900 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                {VENDOR_ICONS[vendor.type]}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{vendor.name}</h3>
                <div className="flex items-center gap-3 text-slate-400 text-sm mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    Sec {vendor.section}
                  </span>
                  <span className="w-1 h-1 bg-slate-600 rounded-full" />
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-500" />
                    {vendor.reportsCount} reports
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className={`text-2xl font-black ${getWaitColor(vendor.currentWaitMinutes)}`}>
                {vendor.currentWaitMinutes} min
              </div>
              <div className="text-xs font-medium text-slate-500 uppercase mt-1">Wait Time</div>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="flex-1 bg-slate-900 h-2 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${getProgressColor(vendor.currentWaitMinutes)}`}
                style={{ width: `${Math.min((vendor.currentWaitMinutes / 30) * 100, 100)}%` }}
              />
            </div>
            <button
              onClick={() => onReport(vendor)}
              className="px-4 py-2 bg-slate-700 hover:bg-blue-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2"
            >
              Report Line
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LineList;
