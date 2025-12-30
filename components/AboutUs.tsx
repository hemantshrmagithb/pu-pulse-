import React from 'react';
import { Linkedin, ArrowLeft } from 'lucide-react';

interface AboutUsProps {
  onBack: () => void;
}

const teamMembers = [
  { name: "Arpita Mishra", linkedin: "https://www.linkedin.com/in/arpita-mishra-112b23322?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
  { name: "Praneel Pandey", linkedin: "https://www.linkedin.com/in/praneel-pandey" },
  { name: "Aditya Raj", linkedin: "https://www.linkedin.com/in/aditya-raj-70b495376?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
  { name: "Sharma Hemant Kumar", linkedin: "https://www.linkedin.com/in/sharma-hemant-k-854710376?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
  { name: "Ashish Singh", linkedin: "https://www.linkedin.com/in/ashish-singh-bb29b639a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" },
];

const AboutUs: React.FC<AboutUsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 px-6 md:px-12 pb-20">
      <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <button onClick={onBack} className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-indigo-400 transition-colors mb-12">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-neutral-200 to-neutral-400">
          About PU Pulse.
        </h1>

        {/* Purpose */}
        <section className="mb-20">
          <p className="text-xl md:text-2xl text-neutral-400 leading-relaxed font-light border-l-2 border-indigo-500 pl-6">
            PU Pulse is a campus delivery prototype website created to provide fast access to food, stationery, and essential items for Parul University students. It is currently a project developed for learning and demonstration purposes.
          </p>
          <div className="mt-8 inline-block px-4 py-2 border border-white/10 rounded-full bg-white/5">
            <span className="text-sm font-bold uppercase tracking-widest text-indigo-400">Project Batch: 1A5</span>
          </div>
        </section>

        {/* Team Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-10 flex items-center gap-4 text-white tracking-tight">
            <span className="w-8 h-1 bg-indigo-600 rounded-full"></span>
            Meet The Team
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, idx) => (
              <div key={idx} className="group p-6 rounded-2xl bg-neutral-900/50 border border-white/5 hover:border-indigo-500/50 hover:bg-neutral-900 transition-all duration-300 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">{member.name}</h3>
                    <p className="text-sm text-neutral-500 mt-1">Project Team Member</p>
                </div>
                <a 
                  href={member.linkedin} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-neutral-400 hover:bg-[#0077b5] hover:text-white transition-all duration-300"
                  title="Connect on LinkedIn"
                >
                  <Linkedin size={18} />
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;