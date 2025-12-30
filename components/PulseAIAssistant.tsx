import React, { useState } from 'react';
import { MessageSquare, Send, X, Sparkles } from 'lucide-react';
import { getGeminiRecommendations } from '../services/geminiService';
import { Product } from '../types';

interface PulseAIAssistantProps {
  products: Product[];
}

const PulseAIAssistant: React.FC<PulseAIAssistantProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    setResponse('');
    const answer = await getGeminiRecommendations(query, products);
    setResponse(answer);
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-slate-800 text-white p-4 rounded-full shadow-xl transition-all hover:scale-110 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles size={24} />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-40 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[500px]">
          {/* Header */}
          <div className="bg-slate-800 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-accent-200" />
              <h3 className="font-semibold">Pulse AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-300">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-grow p-4 overflow-y-auto bg-slate-50 min-h-[300px]">
             {!response && !loading && (
               <div className="text-center text-slate-400 mt-10 text-sm">
                 <p>Hi! I can help you find food or stationery.</p>
                 <p className="mt-2">Try: "I have 50 rupees, what can I eat?"</p>
               </div>
             )}

             {loading && (
               <div className="flex justify-center py-8">
                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700"></div>
               </div>
             )}

             {response && (
               <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm text-slate-700 text-sm whitespace-pre-wrap">
                 {response}
               </div>
             )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Ask me anything..."
              className="flex-grow text-sm outline-none text-slate-700"
            />
            <button 
              onClick={handleAsk}
              disabled={loading}
              className="bg-accent-100 text-slate-800 p-2 rounded-lg hover:bg-accent-200 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PulseAIAssistant;