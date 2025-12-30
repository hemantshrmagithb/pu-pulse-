import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowLeft, Mail, Loader2 } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // We use actual Firebase Auth here so the user context changes to one
      // that (presumably) has write permissions in Firestore.
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No admin account found with this email.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password.');
      } else {
        setError('Login failed. Check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-200 p-8 animate-in fade-in zoom-in duration-300">
        
        <button onClick={onBack} className="text-slate-400 hover:text-slate-600 mb-6 flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Back to User App
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-slate-300">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Admin Panel</h2>
          <p className="text-slate-500 text-sm mt-1">Authorized Personnel Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Admin Email</label>
            <div className="relative">
              <input 
                type="email" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-800/10 text-slate-800 pl-10"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@pupulse.com"
                required
              />
              <Mail className="absolute left-3 top-3.5 text-slate-400" size={16} />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <input 
                type="password" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-800/10 text-slate-800 pl-10"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
              <Lock className="absolute left-3 top-3.5 text-slate-400" size={16} />
            </div>
          </div>

          {error && <p className="text-red-500 text-xs text-center font-medium">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white font-bold py-3 rounded-lg hover:bg-slate-900 transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;