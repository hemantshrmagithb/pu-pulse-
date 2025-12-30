
import React from 'react';
import { Search, X } from 'lucide-react';
import { HeroGeometric } from './ui/shape-landing-hero';

interface HeroProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const Hero: React.FC<HeroProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <HeroGeometric 
      badge="PU PULSE"
      title1="Campus Essentials"
      title2="Delivered Fast"
    >
        {/* High Contrast Search Form Injected into Hero */}
        <div className="w-full max-w-md mx-auto mt-8">
          <div className="relative flex items-center group">
            <input 
              type="text" 
              placeholder="Search outlets or items..."
              className="w-full pl-6 pr-28 py-4 bg-white/5 border border-white/10 text-lg text-white outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all placeholder-neutral-500 rounded-full backdrop-blur-md group-hover:bg-white/10"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-all"
                aria-label="Clear search"
              >
                <X size={18} />
              </button>
            )}

            <button 
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full hover:from-indigo-500 hover:to-purple-500 transition-all shadow-lg shadow-indigo-500/20"
            >
              <Search size={20} strokeWidth={2} />
            </button>
          </div>
        </div>
    </HeroGeometric>
  );
};

export default Hero;
