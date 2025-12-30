import React from 'react';
import { User } from 'firebase/auth';

interface VerificationScreenProps {
  user: User;
  onSignOut: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ user, onSignOut }) => {
  return (
    <div className="min-h-screen w-full bg-white flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center animate-in fade-in zoom-in duration-500">
        <h2 className="text-2xl font-bold text-slate-750 mb-4">Verify your email</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          We have sent you a verification email to <span className="font-semibold text-slate-800">{user.email}</span>. Verify it and log in.
        </p>
        
        <button 
          onClick={onSignOut}
          className="w-full bg-slate-800 text-white font-medium py-3 rounded-lg hover:bg-slate-700 transition-colors shadow-lg shadow-slate-200"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default VerificationScreen;