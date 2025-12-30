
import React from 'react';
import { Outlet } from '../types';
import { MapPin, Utensils, PenTool, ArrowUpRight } from 'lucide-react';

interface OutletCardProps {
  outlet: Outlet;
  onClick: () => void;
}

const OutletCard: React.FC<OutletCardProps> = ({ outlet, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="group bg-neutral-900/50 border border-white/5 cursor-pointer flex flex-col h-full hover:border-indigo-500/50 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.15)] transition-all duration-300 rounded-xl overflow-hidden"
    >
      {/* Image Section */}
      <div className="h-64 overflow-hidden relative bg-neutral-800">
        {outlet.imageUrl ? (
          <img 
            src={outlet.imageUrl} 
            alt={outlet.name} 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-out opacity-80 group-hover:opacity-100 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-700 group-hover:text-indigo-400 transition-colors">
            {outlet.type === 'food' ? <Utensils size={32} strokeWidth={1} /> : <PenTool size={32} strokeWidth={1} />}
          </div>
        )}
        
        {/* Type Badge */}
        <div className={`absolute top-4 left-4 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 ${outlet.type === 'food' ? 'bg-indigo-600/90' : 'bg-cyan-600/90'}`}>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white">
            {outlet.type}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="flex justify-between items-start mb-4 relative z-10">
          <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-indigo-200 transition-all">
            {outlet.name}
          </h3>
          <ArrowUpRight size={18} strokeWidth={1.5} className="text-neutral-600 group-hover:text-indigo-400 transition-colors" />
        </div>
        
        <p className="text-sm text-neutral-400 mb-6 font-light line-clamp-2 relative z-10">
          {outlet.tags.join('  •  ')}
        </p>
        
        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between text-xs text-neutral-500 font-medium uppercase tracking-wider relative z-10">
          <span className="flex items-center gap-2 group-hover:text-neutral-300 transition-colors">
            <MapPin size={12} className="text-indigo-500" /> {outlet.location}
          </span>
          <span className="text-neutral-500">
            20 MIN
          </span>
        </div>
      </div>
    </div>
  );
};

export default OutletCard;
