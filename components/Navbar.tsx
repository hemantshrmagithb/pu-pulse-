
import React from 'react';
import { ShoppingBag, Menu, X, LogOut, Printer } from 'lucide-react';
import { ViewState } from '../types';
import { User } from 'firebase/auth';

interface NavbarProps {
  cartCount: number;
  setView: (view: ViewState) => void;
  toggleCart: () => void;
  user: User | null;
  onAuthClick: () => void;
  onLogoutClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, setView, toggleCart, user, onAuthClick, onLogoutClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-black/50 backdrop-blur-md border-b border-white/5 z-50 flex items-center justify-between px-6 md:px-12">
      {/* Logo */}
      <div 
        className="text-2xl font-black tracking-tighter cursor-pointer select-none bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-white to-cyan-400 hover:opacity-80 transition-opacity"
        onClick={() => setView(ViewState.HOME)}
      >
        PU PULSE.
      </div>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center space-x-12">
        <button 
          onClick={() => setView(ViewState.HOME)}
          className="text-xs font-medium uppercase tracking-widest text-neutral-400 hover:text-cyan-400 transition-colors"
        >
          Home
        </button>
        <button 
          onClick={() => setView(ViewState.ABOUT)}
          className="text-xs font-medium uppercase tracking-widest text-neutral-400 hover:text-purple-400 transition-colors"
        >
          About Us
        </button>
        <button 
          onClick={() => setView(ViewState.CONTACT)}
          className="text-xs font-medium uppercase tracking-widest text-neutral-400 hover:text-rose-400 transition-colors"
        >
          Contact Us
        </button>
        <button 
          onClick={() => setView(ViewState.ADMIN)}
          className="text-xs font-medium uppercase tracking-widest text-neutral-400 hover:text-indigo-400 transition-colors"
        >
          Admin
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-8">
        <div className="hidden md:block">
           {user ? (
             <div className="flex items-center gap-6">
                <span className="text-xs text-neutral-400 truncate max-w-[150px]">
                  {user.email?.split('@')[0]}
                </span>
                <button 
                  onClick={onLogoutClick}
                  className="text-neutral-400 hover:text-rose-400 transition-colors"
                  title="Logout"
                >
                  <LogOut size={18} strokeWidth={1.5} />
                </button>
             </div>
           ) : (
             <button 
               onClick={onAuthClick}
               className="text-white text-xs font-bold uppercase tracking-widest hover:text-cyan-400 transition-colors"
              >
               Login
             </button>
           )}
        </div>

        <button onClick={toggleCart} className="relative group">
          <ShoppingBag size={20} strokeWidth={1.5} className="text-white transition-transform group-hover:scale-110 group-hover:text-indigo-400" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center bg-indigo-500 text-[9px] font-bold text-white rounded-full">
              {cartCount}
            </span>
          )}
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#0a0a0a] border-b border-white/10 p-8 flex flex-col space-y-6 md:hidden shadow-2xl animate-in slide-in-from-top-2">
          <button onClick={() => { setView(ViewState.HOME); setIsMobileMenuOpen(false); }} className="text-left text-2xl font-bold text-white tracking-tight hover:text-cyan-400 transition-colors">Home</button>
          <button onClick={() => { setView(ViewState.ABOUT); setIsMobileMenuOpen(false); }} className="text-left text-2xl font-bold text-white tracking-tight hover:text-purple-400 transition-colors">About Us</button>
          <button onClick={() => { setView(ViewState.CONTACT); setIsMobileMenuOpen(false); }} className="text-left text-2xl font-bold text-white tracking-tight hover:text-rose-400 transition-colors">Contact Us</button>
          <button onClick={() => { setView(ViewState.ADMIN); setIsMobileMenuOpen(false); }} className="text-left text-2xl font-bold text-white tracking-tight hover:text-indigo-400 transition-colors">Admin</button>
          
          <div className="pt-6 border-t border-white/10">
            {user ? (
              <div className="flex items-center justify-between">
                 <p className="text-sm text-neutral-400">{user.email}</p>
                 <button onClick={() => { onLogoutClick(); setIsMobileMenuOpen(false); }} className="text-white hover:text-rose-400">
                   <LogOut size={20} />
                 </button>
              </div>
            ) : (
              <button onClick={() => { onAuthClick(); setIsMobileMenuOpen(false); }} className="w-full bg-indigo-600 text-white py-4 text-sm font-bold uppercase tracking-widest rounded-sm">Login</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
