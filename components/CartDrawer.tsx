import React from 'react';
import { CartItem } from '../types';
import { X, Minus, Plus } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, cartItems, updateQuantity, onCheckout }) => {
  if (!isOpen) return null;

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-750">Your Cart</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X size={24} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cartItems.length === 0 ? (
            <div className="text-center text-slate-400 py-10">
              <p>Your cart is empty.</p>
              <button 
                onClick={onClose}
                className="mt-4 text-sm text-accent-900 underline"
              >
                Start Ordering
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-slate-700">{item.name}</h3>
                  <p className="text-sm text-slate-500">₹{item.price}</p>
                </div>
                <div className="flex items-center space-x-3 bg-slate-50 rounded px-2 py-1">
                  <button 
                    onClick={() => updateQuantity(item.id, -1)}
                    className="text-slate-500 hover:text-slate-800 p-1"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, 1)}
                    className="text-slate-500 hover:text-slate-800 p-1"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-100 bg-slate-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-500">Total</span>
              <span className="text-xl font-bold text-slate-800">₹{total}</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-slate-750 text-white py-4 rounded font-medium hover:bg-slate-600 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;