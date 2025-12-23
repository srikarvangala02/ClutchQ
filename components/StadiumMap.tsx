
import React, { useState } from 'react';
import { MapPin, Info, Users, Clock, Coffee, Pizza, Beer, User } from 'lucide-react';
import { Vendor, SportType } from '../types';
import { VENDOR_ICONS } from '../constants';

interface StadiumMapProps {
  vendors: Vendor[];
  onSelectVendor: (vendor: Vendor) => void;
  sport: SportType;
}

const StadiumMap: React.FC<StadiumMapProps> = ({ vendors, onSelectVendor, sport }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  // Simplified stadium coordinates for the SVG
  const stadiumPath = "M 250,50 A 200,150 0 1,1 250,350 A 200,150 0 1,1 250,50 Z";

  const renderField = () => {
    switch (sport) {
      case SportType.FOOTBALL:
        return (
          <g>
            <rect x="150" y="140" width="200" height="120" fill="#064e3b" stroke="#065f46" strokeWidth="2" />
            {[...Array(9)].map((_, i) => (
              <line key={i} x1={150 + (i + 1) * 20} y1="140" x2={150 + (i + 1) * 20} y2="260" stroke="#065f46" strokeWidth="1" />
            ))}
            <rect x="135" y="140" width="15" height="120" fill="#064e3b" stroke="#065f46" />
            <rect x="350" y="140" width="15" height="120" fill="#064e3b" stroke="#065f46" />
          </g>
        );
      case SportType.BASEBALL:
        return (
          <g transform="translate(250, 200)">
            <path d="M 0,-60 L 60,0 L 0,60 L -60,0 Z" fill="#2d5a27" stroke="#3f6212" strokeWidth="2" />
            <circle cx="0" cy="0" r="15" fill="#78350f" opacity="0.4" />
            <rect x="-3" y="-63" width="6" height="6" fill="white" />
            <rect x="57" y="-3" width="6" height="6" fill="white" />
            <rect x="-3" y="57" width="6" height="6" fill="white" />
            <rect x="-63" y="-3" width="6" height="6" fill="white" />
          </g>
        );
      case SportType.BASKETBALL:
        return (
          <g>
            <rect x="170" y="140" width="160" height="120" fill="#92400e" stroke="#78350f" strokeWidth="3" />
            <line x1="250" y1="140" x2="250" y2="260" stroke="#78350f" strokeWidth="1" />
            <circle cx="250" cy="200" r="20" fill="none" stroke="#78350f" strokeWidth="1" />
            <path d="M 170,165 A 35,35 0 0,1 170,235" fill="none" stroke="#fb923c" strokeWidth="1" />
            <path d="M 330,165 A 35,35 0 0,0 330,235" fill="none" stroke="#fb923c" strokeWidth="1" />
          </g>
        );
      case SportType.SOCCER:
        return (
          <g>
            <rect x="160" y="140" width="180" height="120" fill="#15803d" stroke="#166534" strokeWidth="2" />
            <line x1="250" y1="140" x2="250" y2="260" stroke="white" strokeWidth="1" opacity="0.3" />
            <circle cx="250" cy="200" r="25" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
            <rect x="160" y="175" width="20" height="50" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
            <rect x="320" y="175" width="20" height="50" fill="none" stroke="white" strokeWidth="1" opacity="0.3" />
          </g>
        );
      default:
        return <circle cx="250" cy="200" r="80" fill="#1e293b" />;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{sport} Layout</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Empower Field Level 1</p>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">Live Flow</span>
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full max-w-2xl mx-auto">
          <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-2xl">
            {/* Outer Seating Ring */}
            <path
              d={stadiumPath}
              fill="none"
              stroke="#1e293b"
              strokeWidth="40"
              className="transition-colors duration-300"
            />
            
            {/* Dynamic Field */}
            {renderField()}
            
            {/* Vendor Interactive Points */}
            {vendors.map((vendor, idx) => {
              const angle = (idx / vendors.length) * 2 * Math.PI;
              const x = 250 + 200 * Math.cos(angle);
              const y = 200 + 150 * Math.sin(angle);
              
              const isHighWait = vendor.currentWaitMinutes > 15;
              const isMedWait = vendor.currentWaitMinutes > 5 && vendor.currentWaitMinutes <= 15;

              return (
                <g 
                  key={vendor.id} 
                  className="cursor-pointer group/pin"
                  onClick={() => onSelectVendor(vendor)}
                  onMouseEnter={() => setHoveredSection(vendor.section)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  <circle 
                    cx={x} cy={y} r="16" 
                    className={`${isHighWait ? 'fill-rose-500' : isMedWait ? 'fill-amber-500' : 'fill-emerald-500'} opacity-20 animate-pulse`} 
                  />
                  <circle 
                    cx={x} cy={y} r="10" 
                    className={`${isHighWait ? 'fill-rose-500' : isMedWait ? 'fill-amber-500' : 'fill-emerald-500'} stroke-white/20 stroke-2 transition-transform group-hover/pin:scale-125`} 
                  />
                  <text 
                    x={x} y={y - 18} 
                    textAnchor="middle" 
                    className="fill-white text-[10px] font-black pointer-events-none opacity-0 group-hover/pin:opacity-100 transition-opacity"
                  >
                    {vendor.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <button className="p-3 bg-slate-800 rounded-xl border border-slate-700 text-white hover:bg-slate-700 transition-all shadow-xl">
              <Info size={18} />
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-800 pt-8">
          <div className="text-center">
            <div className="text-emerald-500 font-black text-xl">Low</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Under 5m</div>
          </div>
          <div className="text-center">
            <div className="text-amber-500 font-black text-xl">Med</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">5-15m</div>
          </div>
          <div className="text-center">
            <div className="text-rose-500 font-black text-xl">High</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">15m+</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h4 className="text-white font-bold mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-500" />
          Nearby Vendors
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vendors.slice(0, 4).map(v => (
            <div 
              key={v.id} 
              onClick={() => onSelectVendor(v)}
              className="flex items-center gap-4 p-3 bg-slate-950/50 rounded-2xl border border-slate-800 hover:border-blue-500/50 cursor-pointer transition-all group"
            >
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                {VENDOR_ICONS[v.type]}
              </div>
              <div>
                <div className="text-sm font-bold text-white">{v.name}</div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">Section {v.section} • {v.currentWaitMinutes}m</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StadiumMap;
