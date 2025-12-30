
import React from 'react';
import { Product, Outlet } from '../types';
import { ArrowLeft, MapPin } from 'lucide-react';

interface ProductListProps {
  outlet: Outlet;
  products: Product[];
  addToCart: (product: Product, outletName: string) => void;
  onBack: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ outlet, products, addToCart, onBack }) => {
  return (
    <div className="pb-24 pt-24 min-h-screen bg-[#030303]">
      
      {/* Outlet Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-16">
        <button onClick={onBack} className="group flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-neutral-500 hover:text-indigo-400 transition-colors mb-12">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div>
            <div className={`inline-block px-3 py-1 text-[10px] font-bold uppercase tracking-widest mb-4 text-white rounded-full ${outlet.type === 'food' ? 'bg-indigo-600' : 'bg-cyan-600'}`}>
              {outlet.type}
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neutral-200 to-neutral-400 mb-6">
              {outlet.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-neutral-400">
               <span className="flex items-center gap-2 text-indigo-300">
                 <MapPin size={16} /> {outlet.location}
               </span>
               <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
               <span>{outlet.tags.join(', ')}</span>
            </div>
          </div>
          
          <div className="h-64 w-full bg-neutral-900 overflow-hidden relative rounded-2xl border border-white/5 shadow-2xl shadow-indigo-500/5">
             {outlet.imageUrl && (
               <img src={outlet.imageUrl} className="w-full h-full object-cover grayscale opacity-80" alt="Header" />
             )}
             <div className="absolute inset-0 bg-gradient-to-t from-[#030303] to-transparent opacity-60"></div>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="border-t border-white/10 mb-12"></div>
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400 mb-12">Menu Selection</h2>
        
        {products.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-neutral-800 rounded-lg">
            <p className="text-neutral-500 font-light">Menu currently unavailable.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product) => (
              <div key={product.id} className="group flex flex-col h-full">
                {/* Image Aspect Ratio 1:1 or 4:3 */}
                <div className="relative aspect-[4/3] bg-neutral-900 mb-6 overflow-hidden rounded-2xl border border-white/5 group-hover:border-indigo-500/30 transition-colors">
                   {product.imageUrl ? (
                     <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100 group-hover:scale-105" />
                   ) : (
                     <div className="w-full h-full bg-neutral-900"></div>
                   )}
                   
                   <button 
                      onClick={() => addToCart(product, outlet.name)}
                      className="absolute bottom-0 right-0 bg-indigo-600 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest opacity-0 translate-y-full group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-indigo-500 rounded-tl-xl"
                   >
                      Add +
                   </button>
                </div>

                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">{product.name}</h3>
                  <span className="text-lg font-medium text-white/90">₹{product.price}</span>
                </div>
                <p className="text-sm text-neutral-500 leading-relaxed font-light">{product.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
