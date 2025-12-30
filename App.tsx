
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import OutletCard from './components/OutletCard';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import LoginScreen from './components/LoginScreen';
import VerificationScreen from './components/VerificationScreen';
import AdminLogin from './components/AdminLogin';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import PrintService from './components/PrintService';
import { Product, ViewState, CartItem, Outlet, OutletType } from './types';
import { auth } from './firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Loader2, ArrowRight, Utensils, PenTool, ArrowLeft, Printer } from 'lucide-react';
import { 
  subscribeOutlets, 
  subscribeProducts, 
  addOutletToDb, 
  updateOutletInDb, 
  deleteOutletFromDb, 
  addProductToDb, 
  updateProductInDb, 
  deleteProductFromDb 
} from './services/db';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.HOME);
  
  // Data State - Sync with Firestore
  const [outlets, setOutlets] = useState<Outlet[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  
  // UI State
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OutletType | null>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Separate Admin State

  // --- Auth Listener ---
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoadingAuth(false);
    });

    return () => unsubAuth();
  }, []);

  // --- Data Subscription (Only when authenticated and verified) ---
  useEffect(() => {
    if (!user || !user.emailVerified) {
      setOutlets([]);
      setProducts([]);
      return; 
    }

    const unsubOutlets = subscribeOutlets(setOutlets);
    const unsubProducts = subscribeProducts(setProducts);

    return () => {
      unsubOutlets();
      unsubProducts();
    };
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false); 
      setView(ViewState.HOME);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // --- Cart Actions ---
  const addToCart = (product: Product, outletName: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...product, quantity: 1, outletName }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(0, item.quantity + delta) };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  // --- Admin Actions ---
  const handleAdminAccess = () => {
    if (isAdmin) {
      setView(ViewState.ADMIN);
    } else {
      setView(ViewState.ADMIN_LOGIN);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setView(ViewState.ADMIN);
  };

  const addOutlet = async (outlet: Outlet) => {
    await addOutletToDb(outlet);
  };

  const updateOutlet = async (outlet: Outlet) => {
    await updateOutletInDb(outlet);
  };

  const removeOutlet = async (id: string) => {
    await deleteOutletFromDb(id);
  };

  const addProduct = async (product: Product) => {
    await addProductToDb(product);
  };

  const updateProduct = async (product: Product) => {
    await updateProductInDb(product);
  };

  const removeProduct = async (id: string) => {
    await deleteProductFromDb(id);
  };

  // --- Navigation Helpers ---
  const openOutlet = (outletId: string) => {
    setSelectedOutletId(outletId);
    setView(ViewState.OUTLET_DETAILS);
    window.scrollTo(0, 0);
  };

  // Filter outlets based on search and category
  const getFilteredOutlets = () => {
    let filtered = outlets;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(o => 
        o.name.toLowerCase().includes(term) || 
        o.tags.some(t => t.toLowerCase().includes(term)) ||
        o.location.toLowerCase().includes(term)
      );
    } else if (selectedCategory) {
      filtered = filtered.filter(o => o.type === selectedCategory);
    }

    return filtered;
  };

  const renderView = () => {
    switch(view) {
      case ViewState.HOME:
        const isSearching = searchTerm.trim().length > 0;
        const displayedOutlets = getFilteredOutlets();

        return (
          <>
            <Hero searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            
            <section id="content" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-white/5 bg-[#030303]">
              
              {/* STATE 1: CATEGORY SELECTION (Default Landing) */}
              {!isSearching && !selectedCategory && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h2 className="text-3xl font-bold text-white tracking-tighter mb-12 text-center">Select Category</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Food Court Card */}
                    <div 
                      onClick={() => setSelectedCategory('food')}
                      className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-indigo-500/50 transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-neutral-900">
                        <img 
                          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1000&auto=format&fit=crop" 
                          alt="Food Court" 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 p-10">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
                          <Utensils className="text-white" size={32} />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2">Food Court</h3>
                        <p className="text-neutral-400 font-light flex items-center gap-2">
                          Explore Campus Dining <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </p>
                      </div>
                    </div>

                    {/* Stationery Card */}
                    <div 
                      onClick={() => setSelectedCategory('stationery')}
                      className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-cyan-500/50 transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-neutral-900">
                        <img 
                          src="https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=1000&auto=format&fit=crop" 
                          alt="Stationery" 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 p-10">
                         <div className="w-16 h-16 rounded-2xl bg-cyan-600 flex items-center justify-center mb-6 group-hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20">
                          <PenTool className="text-white" size={32} />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2">Stationery Shop</h3>
                        <p className="text-neutral-400 font-light flex items-center gap-2">
                          Books, Prints & Supplies <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </p>
                      </div>
                    </div>

                    {/* Print Store Card */}
                    <div 
                      onClick={() => setView(ViewState.PRINT_SERVICE)}
                      className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-purple-500/50 transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-neutral-900">
                        <img 
                          src="https://images.unsplash.com/photo-1562564055-71e051d33c19?q=80&w=1000&auto=format&fit=crop" 
                          alt="Print Store" 
                          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700"
                        />
                         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                      </div>
                      <div className="absolute bottom-0 left-0 p-10">
                         <div className="w-16 h-16 rounded-2xl bg-purple-600 flex items-center justify-center mb-6 group-hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20">
                          <Printer className="text-white" size={32} />
                        </div>
                        <h3 className="text-4xl font-bold text-white mb-2">Print Store</h3>
                        <p className="text-neutral-400 font-light flex items-center gap-2">
                          Upload & Print Documents <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STATE 2: OUTLET LIST (Filtered) */}
              {(isSearching || selectedCategory) && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                      {!isSearching && selectedCategory && (
                        <button 
                          onClick={() => setSelectedCategory(null)}
                          className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors mb-4"
                        >
                          <ArrowLeft size={16} /> Back to Categories
                        </button>
                      )}
                      <h2 className="text-4xl font-bold text-white tracking-tighter">
                        {isSearching ? `Search: "${searchTerm}"` : selectedCategory === 'food' ? 'Food Court Outlets' : 'Stationery Shops'}
                      </h2>
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">{displayedOutlets.length} Available</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {displayedOutlets.map(outlet => (
                      <OutletCard 
                        key={outlet.id} 
                        outlet={outlet} 
                        onClick={() => openOutlet(outlet.id)} 
                      />
                    ))}
                    {displayedOutlets.length === 0 && (
                      <div className="col-span-full text-center py-32 border border-dashed border-neutral-800 text-neutral-500 rounded-lg">
                        <p className="text-lg font-light">No outlets found.</p>
                        {isSearching && (
                           <button onClick={() => setSearchTerm('')} className="mt-4 text-indigo-400 hover:text-indigo-300">Clear Search</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </section>
          </>
        );

      case ViewState.OUTLET_DETAILS:
        const currentOutlet = outlets.find(o => o.id === selectedOutletId);
        if (!currentOutlet) return <div className="p-20 text-center text-white">Outlet not found</div>;
        return (
          <ProductList 
            outlet={currentOutlet}
            products={products.filter(p => p.outletId === currentOutlet.id)}
            addToCart={addToCart}
            onBack={() => setView(ViewState.HOME)}
          />
        );
      
      case ViewState.PRINT_SERVICE:
        return <PrintService user={user} onBack={() => setView(ViewState.HOME)} />;

      case ViewState.ABOUT:
        return <AboutUs onBack={() => setView(ViewState.HOME)} />;

      case ViewState.CONTACT:
        return <ContactUs onBack={() => setView(ViewState.HOME)} />;

      case ViewState.ADMIN_LOGIN:
        return (
          <AdminLogin 
            onLoginSuccess={handleAdminLoginSuccess}
            onBack={() => setView(ViewState.HOME)}
          />
        );

      case ViewState.ADMIN:
        if (!isAdmin) {
          return (
             <AdminLogin 
                onLoginSuccess={handleAdminLoginSuccess}
                onBack={() => setView(ViewState.HOME)}
              />
          );
        }
        return (
          <AdminDashboard 
            outlets={outlets}
            products={products}
            addOutlet={addOutlet}
            updateOutlet={updateOutlet}
            removeOutlet={removeOutlet}
            addProduct={addProduct}
            updateProduct={updateProduct}
            removeProduct={removeProduct}
          />
        );

      default:
        return <div>Page Not Found</div>;
    }
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  // FORCE USER LOGIN FIRST
  if (!user) {
    return <LoginScreen />;
  }

  // CHECK EMAIL VERIFICATION
  if (!user.emailVerified) {
    return <VerificationScreen user={user} onSignOut={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans selection:bg-white selection:text-black">
      {view !== ViewState.ADMIN_LOGIN && (
        <Navbar 
          cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
          setView={(v) => {
             if (v === ViewState.ADMIN) handleAdminAccess();
             else {
               setView(v);
               // Reset category selection when going Home via navbar
               if (v === ViewState.HOME) {
                 setSelectedCategory(null);
                 setSearchTerm('');
               }
             }
          }}
          toggleCart={() => setIsCartOpen(true)}
          user={user}
          onAuthClick={() => {}} 
          onLogoutClick={handleLogout}
        />
      )}
      
      <main>
        {renderView()}
      </main>

      {view !== ViewState.ADMIN && view !== ViewState.ADMIN_LOGIN && view !== ViewState.ABOUT && view !== ViewState.CONTACT && (
        <footer className="py-20 bg-[#030303] border-t border-white/5 text-center text-xs text-neutral-500 uppercase tracking-widest">
          <p>&copy; 2025 PU Pulse. All Rights Reserved.</p>
        </footer>
      )}

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cartItems={cart}
        updateQuantity={updateQuantity}
        onCheckout={() => alert('Order Placed! (Demo)')}
      />
    </div>
  );
};

export default App;
