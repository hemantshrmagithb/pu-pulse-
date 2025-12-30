import React from 'react';
import { Mail, MapPin, Clock, AlertTriangle, HelpCircle, ArrowLeft } from 'lucide-react';

interface ContactUsProps {
  onBack: () => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 px-6 md:px-12 pb-20">
       <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button onClick={onBack} className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-indigo-400 transition-colors mb-12">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </button>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
            Contact Us.
          </h1>
          <p className="text-xl text-neutral-400 font-light mb-16">
            We're here to help you with any issues or queries.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email */}
            <div className="group p-8 rounded-3xl bg-neutral-900/30 border border-white/5 hover:border-indigo-500/50 hover:bg-neutral-900/60 transition-all duration-300">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-6 text-indigo-400 group-hover:text-indigo-300 group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Email Support</h3>
                <p className="text-neutral-500 text-sm mb-4">Send us an email and we'll get back to you.</p>
                <a href="mailto:pu.pulse1a5@gmail.com" className="text-lg font-medium text-indigo-300 hover:text-white transition-colors border-b border-indigo-500/30 hover:border-white">
                    pu.pulse1a5@gmail.com
                </a>
            </div>

             {/* Location */}
            <div className="group p-8 rounded-3xl bg-neutral-900/30 border border-white/5 hover:border-cyan-500/50 hover:bg-neutral-900/60 transition-all duration-300">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-6 text-cyan-400 group-hover:text-cyan-300 group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Campus Location</h3>
                <p className="text-neutral-500 text-sm mb-4">Visit our main office for direct assistance.</p>
                <p className="text-lg font-medium text-neutral-200">
                    Parul University, Vadodara
                </p>
            </div>

            {/* Support Timings */}
             <div className="group p-8 rounded-3xl bg-neutral-900/30 border border-white/5 hover:border-purple-500/50 hover:bg-neutral-900/60 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-transform">
                    <Clock size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2 text-white">Support Timings</h3>
                <p className="text-neutral-500 text-sm mb-4">Our team is available during these hours.</p>
                <p className="text-lg font-medium text-neutral-200">Monday - Saturday</p>
                <p className="text-neutral-400">9:00 AM - 6:00 PM</p>
            </div>

            {/* Actions */}
            <div className="p-8 rounded-3xl bg-neutral-900/30 border border-white/5 flex flex-col justify-center gap-4">
               <h3 className="text-xl font-bold text-white mb-2">Quick Actions</h3>
               
               <a 
                 href="mailto:pu.pulse1a5@gmail.com?subject=Issue Report: [Brief Description]"
                 className="flex items-center gap-4 w-full p-4 bg-rose-500/10 hover:bg-rose-500/20 rounded-xl text-left transition-all border border-rose-500/20 hover:border-rose-500/40 group"
               >
                 <AlertTriangle size={20} className="text-rose-400 group-hover:text-rose-300" /> 
                 <div>
                    <span className="block font-bold text-rose-200 group-hover:text-white">Report an Issue</span>
                    <span className="text-xs text-rose-400/70">Found a bug or problem? Let us know.</span>
                 </div>
               </a>

               <button 
                 onClick={() => alert("FAQ section coming soon!")}
                 className="flex items-center gap-4 w-full p-4 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl text-left transition-all border border-amber-500/20 hover:border-amber-500/40 group"
               >
                 <HelpCircle size={20} className="text-amber-400 group-hover:text-amber-300" /> 
                 <div>
                    <span className="block font-bold text-amber-200 group-hover:text-white">FAQs</span>
                    <span className="text-xs text-amber-400/70">Common questions & answers.</span>
                 </div>
               </button>
            </div>
          </div>
       </div>
    </div>
  );
};

export default ContactUs;