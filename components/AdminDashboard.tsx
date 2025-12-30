import React, { useState, useEffect } from 'react';
import { Outlet, Product, OutletType, PrintOrder } from '../types';
import { Trash2, Plus, MapPin, Store, Upload, Image as ImageIcon, Edit, ArrowLeft, Loader2, Utensils, PenTool, Printer, FileText, Download, CheckCircle, Clock } from 'lucide-react';
import { subscribePrintOrders, updatePrintOrderStatus } from '../services/db';

interface AdminDashboardProps {
  outlets: Outlet[];
  products: Product[];
  addOutlet: (outlet: Outlet) => Promise<void>;
  updateOutlet: (outlet: Outlet) => Promise<void>;
  removeOutlet: (id: string) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
}

// Helper to convert file to Base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const handleDbError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  if (error.code === 'permission-denied') {
    alert(`Permission Denied: Unable to ${context}. Please check your Firebase Firestore Security Rules. Ensure your account is authorized to write to the database.`);
  } else {
    alert(`Failed to ${context}. ${error.message}`);
  }
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  outlets, 
  products, 
  addOutlet, 
  updateOutlet,
  removeOutlet,
  addProduct,
  updateProduct,
  removeProduct
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'outlets' | 'print'>('outlets');
  
  // Outlet/Product State
  const [selectedOutletId, setSelectedOutletId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isOutletFormOpen, setIsOutletFormOpen] = useState(false);
  const [editingOutletId, setEditingOutletId] = useState<string | null>(null);
  const [newOutlet, setNewOutlet] = useState<Partial<Outlet>>({ name: '', location: '', tags: [], type: 'food' });
  const [outletTagsInput, setOutletTagsInput] = useState('');
  const [outletImageFile, setOutletImageFile] = useState<File | null>(null);
  const [outletImageUrl, setOutletImageUrl] = useState('');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({ name: '', price: 0, description: '' });
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productImageUrl, setProductImageUrl] = useState('');

  // Print Orders State
  const [printOrders, setPrintOrders] = useState<PrintOrder[]>([]);

  // Subscribe to Print Orders
  useEffect(() => {
    const unsub = subscribePrintOrders(setPrintOrders);
    return () => unsub();
  }, []);

  const selectedOutlet = outlets.find(o => o.id === selectedOutletId);
  const outletProducts = products.filter(p => p.outletId === selectedOutletId);

  // --- Handlers: Outlet ---

  const handleOpenAddOutlet = () => {
    setEditingOutletId(null);
    setNewOutlet({ name: '', location: '', tags: [], type: 'food' });
    setOutletTagsInput('');
    setOutletImageUrl('');
    setOutletImageFile(null);
    setIsOutletFormOpen(true);
    setSelectedOutletId(null);
  };

  const handleOpenEditOutlet = (outlet: Outlet) => {
    setEditingOutletId(outlet.id);
    setNewOutlet(outlet);
    setOutletTagsInput(outlet.tags.join(', '));
    setOutletImageUrl(outlet.imageUrl || '');
    setOutletImageFile(null);
    setIsOutletFormOpen(true);
  };

  const handleSaveOutlet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutlet.name) return;

    if (outletImageFile && outletImageFile.size > 800 * 1024) {
      alert("Image is too large. Please select an image under 800KB.");
      return;
    }

    setIsSaving(true);

    try {
      let finalImageUrl = outletImageUrl;
      if (outletImageFile) {
        finalImageUrl = await convertFileToBase64(outletImageFile);
      } else if (!finalImageUrl && !editingOutletId) {
        finalImageUrl = `https://source.unsplash.com/random/800x600?${newOutlet.type === 'food' ? 'restaurant' : 'stationery'}`;
      }

      const tags = outletTagsInput.split(',').map(t => t.trim()).filter(t => t);

      if (editingOutletId) {
        await updateOutlet({
          ...newOutlet as Outlet,
          id: editingOutletId,
          tags,
          imageUrl: finalImageUrl
        });
        setSelectedOutletId(editingOutletId);
      } else {
        const newId = `outlet-${Date.now()}`;
        const outlet: Outlet = {
          id: newId,
          name: newOutlet.name!,
          location: newOutlet.location || 'Campus',
          type: newOutlet.type as OutletType,
          tags,
          imageUrl: finalImageUrl
        };
        await addOutlet(outlet);
      }
      
      setIsOutletFormOpen(false);
      setEditingOutletId(null);
    } catch (error: any) {
      handleDbError(error, 'save outlet');
    } finally {
      setIsSaving(false);
    }
  };

  // --- Handlers: Product ---

  const handleOpenAddProduct = () => {
    setEditingProductId(null);
    setNewProduct({ name: '', price: 0, description: '' });
    setProductImageUrl('');
    setProductImageFile(null);
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProductId(product.id);
    setNewProduct(product);
    setProductImageUrl(product.imageUrl || '');
    setProductImageFile(null);
    setIsProductFormOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !selectedOutletId) return;

    if (productImageFile && productImageFile.size > 800 * 1024) {
      alert("Image is too large. Please select an image under 800KB.");
      return;
    }

    setIsSaving(true);

    try {
      let finalImageUrl = productImageUrl;
      if (productImageFile) {
        finalImageUrl = await convertFileToBase64(productImageFile);
      }

      if (editingProductId) {
        await updateProduct({
          ...newProduct as Product,
          id: editingProductId,
          outletId: selectedOutletId,
          imageUrl: finalImageUrl
        });
      } else {
        const product: Product = {
          id: `prod-${Date.now()}`,
          outletId: selectedOutletId,
          name: newProduct.name!,
          description: newProduct.description || '',
          price: Number(newProduct.price),
          isAvailable: true,
          imageUrl: finalImageUrl,
        };
        await addProduct(product);
      }

      setIsProductFormOpen(false);
      setEditingProductId(null);
      setNewProduct({ name: '', price: 0, description: '' });
      setProductImageFile(null);
      setProductImageUrl('');
    } catch (error: any) {
      handleDbError(error, 'save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteOutlet = async (id: string) => {
    if (!confirm("Are you sure you want to delete this outlet?")) return;
    try {
      await removeOutlet(id);
      setSelectedOutletId(null);
    } catch (error: any) {
      handleDbError(error, 'delete outlet');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    try {
      await removeProduct(id);
    } catch (error: any) {
      handleDbError(error, 'delete product');
    }
  };

  // --- Handlers: Print ---
  const handleUpdatePrintStatus = async (id: string, status: 'pending' | 'printed' | 'delivered') => {
    try {
        await updatePrintOrderStatus(id, status);
    } catch (error: any) {
        handleDbError(error, 'update status');
    }
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-slate-50 pt-20">
      
      {/* SIDEBAR NAVIGATION */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-slate-100">
           <h2 className="text-xl font-bold text-slate-800">Admin Panel</h2>
        </div>
        <div className="p-4 space-y-2">
            <button 
                onClick={() => setActiveTab('outlets')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'outlets' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
                <Store size={20} /> Manage Outlets
            </button>
            <button 
                onClick={() => setActiveTab('print')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'print' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
            >
                <Printer size={20} /> Print Orders
            </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-grow flex bg-slate-50 overflow-hidden">
        
        {/* ======================= PRINT ORDERS TAB ======================= */}
        {activeTab === 'print' && (
            <div className="w-full h-full overflow-y-auto p-8">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Incoming Print Jobs</h1>
                
                <div className="space-y-4">
                    {printOrders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-bold text-slate-800 text-lg">{order.userEmail}</h3>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : order.status === 'printed' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500 text-sm">
                                        <Clock size={14} /> {new Date(order.timestamp).toLocaleString()}
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500 text-sm mt-1">
                                        <MapPin size={14} /> {order.deliveryLocation}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-slate-800">₹{order.totalPrice}</p>
                                    <a 
                                        href={order.fileBase64} 
                                        download={order.fileName}
                                        className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-800 mt-1"
                                    >
                                        <Download size={14} /> Download File
                                    </a>
                                </div>
                            </div>
                            
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="block text-slate-400 text-xs font-bold uppercase">File Name</span>
                                    <span className="font-medium text-slate-700 truncate block" title={order.fileName}>{order.fileName}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-400 text-xs font-bold uppercase">Config</span>
                                    <span className="font-medium text-slate-700">{order.options.paperSize}, {order.options.colorType === 'color' ? 'Color' : 'B&W'}</span>
                                </div>
                                <div>
                                    <span className="block text-slate-400 text-xs font-bold uppercase">Details</span>
                                    <span className="font-medium text-slate-700">{order.options.sides} sided, {order.options.copies} copies</span>
                                </div>
                                <div>
                                    <span className="block text-slate-400 text-xs font-bold uppercase">Binding</span>
                                    <span className="font-medium text-slate-700">{order.options.binding ? 'Yes' : 'No'}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2">
                                {order.status === 'pending' && (
                                    <button 
                                        onClick={() => handleUpdatePrintStatus(order.id, 'printed')}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <Printer size={16} /> Mark as Printed
                                    </button>
                                )}
                                {order.status === 'printed' && (
                                    <button 
                                        onClick={() => handleUpdatePrintStatus(order.id, 'delivered')}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                                    >
                                        <CheckCircle size={16} /> Mark as Delivered
                                    </button>
                                )}
                                {order.status === 'delivered' && (
                                    <span className="text-green-600 font-bold flex items-center gap-2 text-sm px-4 py-2">
                                        <CheckCircle size={16} /> Completed
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                    {printOrders.length === 0 && (
                        <div className="text-center py-20 text-slate-400">
                            <Printer size={48} className="mx-auto mb-4 opacity-20" />
                            <p>No print jobs received yet.</p>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* ======================= OUTLETS TAB (Existing Code) ======================= */}
        {activeTab === 'outlets' && (
            <>
                {/* LEFT LIST */}
                <div className="w-1/3 min-w-[320px] bg-white border-r border-slate-200 flex flex-col h-full">
                    <div className="p-4 border-b border-slate-100">
                    <button 
                        onClick={handleOpenAddOutlet}
                        disabled={isSaving}
                        className="w-full bg-slate-800 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-700 transition-colors disabled:opacity-50"
                    >
                        <Plus size={18} /> Add New Outlet
                    </button>
                    </div>

                    <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    {outlets.map(outlet => (
                        <div 
                        key={outlet.id}
                        onClick={() => { if(!isSaving) { setSelectedOutletId(outlet.id); setIsOutletFormOpen(false); } }}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex gap-4 ${selectedOutletId === outlet.id ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800' : 'border-slate-100 bg-white hover:border-slate-300'}`}
                        >
                        <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                            {outlet.imageUrl ? (
                            <img src={outlet.imageUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                {outlet.type === 'food' ? <Utensils size={20} /> : <PenTool size={20} />}
                            </div>
                            )}
                        </div>
                        <div className="flex-grow">
                            <h3 className="font-bold text-slate-800">{outlet.name}</h3>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">{outlet.type}</p>
                            <div className="flex items-center text-xs text-slate-400 gap-1">
                            <MapPin size={10} /> {outlet.location}
                            </div>
                        </div>
                        </div>
                    ))}
                    </div>
                </div>

                {/* RIGHT DETAILS */}
                <div className="flex-grow overflow-y-auto h-full relative">
                    {/* (Insert existing forms logic here, simplified for brevity but functionally identical to previous file) */}
                     {/* VIEW: OUTLET FORM (Add or Edit) */}
                    {isOutletFormOpen && (
                    <div className="max-w-2xl mx-auto py-12 px-8">
                        {/* ... Existing form ... */}
                        <div className="flex items-center gap-4 mb-6">
                        {editingOutletId && (
                            <button onClick={() => setIsOutletFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                            <ArrowLeft size={24} />
                            </button>
                        )}
                        <h2 className="text-2xl font-bold text-slate-800">
                            {editingOutletId ? 'Edit Outlet Details' : 'Add New Restaurant / Shop'}
                        </h2>
                        </div>
                        
                        <form onSubmit={handleSaveOutlet} className="space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        {/* Form Inputs (Same as before) */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Outlet Type</label>
                            <div className="flex gap-4">
                            <button 
                                type="button"
                                onClick={() => setNewOutlet({...newOutlet, type: 'food'})}
                                className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${newOutlet.type === 'food' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
                            >
                                Food Court
                            </button>
                            <button 
                                type="button"
                                onClick={() => setNewOutlet({...newOutlet, type: 'stationery'})}
                                className={`flex-1 py-3 rounded-lg border font-medium transition-colors ${newOutlet.type === 'stationery' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}`}
                            >
                                Stationery Shop
                            </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Outlet Name</label>
                            <input 
                            required
                            className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-100"
                            placeholder={newOutlet.type === 'food' ? "e.g. Spicy Bites" : "e.g. Student Center Books"}
                            value={newOutlet.name}
                            onChange={e => setNewOutlet({...newOutlet, name: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                            <input 
                            className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-100"
                            placeholder="e.g. Block 5"
                            value={newOutlet.location}
                            onChange={e => setNewOutlet({...newOutlet, location: e.target.value})}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tags (Comma separated)</label>
                            <input 
                            className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-slate-100"
                            placeholder={newOutlet.type === 'food' ? "Chinese, Indian, Snacks" : "Books, Pens, Prints"}
                            value={outletTagsInput}
                            onChange={e => setOutletTagsInput(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Cover Image</label>
                            <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <input 
                                type="text" 
                                placeholder="Paste Image URL..." 
                                className="flex-grow border border-slate-200 rounded-lg p-3 outline-none text-sm"
                                value={outletImageUrl}
                                onChange={e => { setOutletImageUrl(e.target.value); setOutletImageFile(null); }}
                                />
                                <span className="text-slate-400 text-xs uppercase font-bold">OR</span>
                                <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                                    <Upload size={16} /> Upload
                                    <input type="file" className="hidden" accept="image/*" onChange={e => { if(e.target.files?.[0]) { setOutletImageFile(e.target.files[0]); setOutletImageUrl(''); } }} />
                                </label>
                            </div>
                            {outletImageFile && <p className="text-xs text-green-600 font-medium">Selected: {outletImageFile.name} ({(outletImageFile.size / 1024).toFixed(0)} KB)</p>}
                            {outletImageUrl && !outletImageFile && (
                                <div className="h-40 w-full rounded-lg bg-slate-100 overflow-hidden">
                                <img src={outletImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                            </div>
                        </div>

                        <div className="pt-4">
                            <button 
                            type="submit" 
                            disabled={isSaving}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2"
                            >
                            {isSaving && <Loader2 className="animate-spin" size={20} />}
                            {editingOutletId ? 'Save Changes' : 'Create Outlet'}
                            </button>
                        </div>
                        </form>
                    </div>
                    )}

                    {/* VIEW: MANAGE SELECTED OUTLET */}
                    {selectedOutlet && !isOutletFormOpen && (
                    <div className="max-w-4xl mx-auto py-8 px-8">
                        
                        {/* Header */}
                        <div className="mb-8 flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800">{selectedOutlet.name}</h1>
                            <p className="text-slate-500 mt-1 flex items-center gap-2">
                            <MapPin size={16} /> {selectedOutlet.location} • {selectedOutlet.tags.join(', ')}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <button 
                            onClick={() => handleOpenEditOutlet(selectedOutlet)}
                            disabled={isSaving}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                            >
                            <Edit size={16} /> Edit Details
                            </button>
                            <button 
                            onClick={() => handleDeleteOutlet(selectedOutlet.id)}
                            disabled={isSaving}
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                            >
                            <Trash2 size={16} /> Delete
                            </button>
                        </div>
                        </div>

                        {/* Menu Management Section */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <h2 className="text-lg font-bold text-slate-700">Menu / Inventory</h2>
                            <button 
                            onClick={handleOpenAddProduct}
                            disabled={isSaving}
                            className={`bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center gap-2 disabled:opacity-50 ${isProductFormOpen ? 'hidden' : ''}`}
                            >
                            <Plus size={16} /> Add Item
                            </button>
                        </div>

                        {/* Product Form Inline */}
                        {isProductFormOpen && (
                            <div className="p-6 bg-slate-50 border-b border-slate-100 animate-in slide-in-from-top-2">
                            <h3 className="text-sm font-bold uppercase text-slate-500 mb-4 tracking-wider">
                                {editingProductId ? 'Edit Item' : 'New Item Details'}
                            </h3>
                            <form onSubmit={handleSaveProduct} className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-2">
                                    <input 
                                    required
                                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none" 
                                    placeholder="Item Name" 
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <input 
                                    required
                                    type="number"
                                    className="w-full border border-slate-200 rounded-lg p-2.5 outline-none" 
                                    placeholder="Price" 
                                    value={newProduct.price || ''}
                                    onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})}
                                    />
                                </div>
                                </div>
                                <textarea 
                                className="w-full border border-slate-200 rounded-lg p-2.5 outline-none" 
                                placeholder="Description..." 
                                rows={2}
                                value={newProduct.description}
                                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                                />
                                
                                {/* Image Input for Product */}
                                <div className="flex items-center gap-2">
                                    <input 
                                    type="text" 
                                    placeholder="Image URL..." 
                                    className="flex-grow border border-slate-200 rounded-lg p-2.5 outline-none text-sm"
                                    value={productImageUrl}
                                    onChange={e => { setProductImageUrl(e.target.value); setProductImageFile(null); }}
                                    />
                                    <span className="text-xs font-bold text-slate-400">OR</span>
                                    <label className="cursor-pointer bg-white border border-slate-200 hover:bg-slate-50 px-3 py-2.5 rounded-lg flex items-center gap-2 text-sm text-slate-600 transition-colors">
                                        <Upload size={14} /> Upload
                                        <input type="file" className="hidden" accept="image/*" onChange={e => { if(e.target.files?.[0]) { setProductImageFile(e.target.files[0]); setProductImageUrl(''); } }} />
                                    </label>
                                    {productImageFile && <span className="text-xs text-green-600">File attached</span>}
                                </div>

                                <div className="flex gap-3 pt-2">
                                <button 
                                    type="submit" 
                                    disabled={isSaving}
                                    className="flex-1 bg-slate-800 text-white py-2 rounded-lg font-medium text-sm disabled:opacity-50 flex justify-center items-center gap-2"
                                >
                                    {isSaving && <Loader2 className="animate-spin" size={14} />}
                                    {editingProductId ? 'Save Changes' : 'Add Item'}
                                </button>
                                <button 
                                    type="button" 
                                    disabled={isSaving}
                                    onClick={() => { setIsProductFormOpen(false); setEditingProductId(null); }} 
                                    className="px-4 text-slate-500 text-sm font-medium hover:text-slate-800"
                                >
                                    Cancel
                                </button>
                                </div>
                            </form>
                            </div>
                        )}

                        {/* Items List */}
                        <div className="divide-y divide-slate-100">
                            {outletProducts.length === 0 ? (
                            <div className="p-10 text-center text-slate-400">
                                <p>No items in this menu yet.</p>
                            </div>
                            ) : (
                            outletProducts.map(product => (
                                <div key={product.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4 group">
                                <div className="w-16 h-16 bg-slate-100 rounded-md overflow-hidden flex-shrink-0 border border-slate-200">
                                    {product.imageUrl ? <img src={product.imageUrl} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><ImageIcon size={20} /></div>}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-slate-800 truncate">{product.name}</h4>
                                    <span className="font-bold text-slate-900">₹{product.price}</span>
                                    </div>
                                    <p className="text-sm text-slate-500 truncate">{product.description}</p>
                                </div>
                                
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                    onClick={() => handleOpenEditProduct(product)}
                                    disabled={isSaving}
                                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                                    title="Edit Item"
                                    >
                                    <Edit size={18} />
                                    </button>
                                    <button 
                                    onClick={() => handleDeleteProduct(product.id)}
                                    disabled={isSaving}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Delete Item"
                                    >
                                    <Trash2 size={18} />
                                    </button>
                                </div>
                                </div>
                            ))
                            )}
                        </div>
                        </div>

                    </div>
                    )}

                    {/* EMPTY STATE OUTLETS */}
                    {!selectedOutletId && !isOutletFormOpen && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400">
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                        <Store size={48} className="opacity-50" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-600">Select an Outlet to Manage</h2>
                        <p className="max-w-xs text-center mt-2">Choose an outlet from the left sidebar or create a new one to add menus and inventory.</p>
                    </div>
                    )}
                </div>
            </>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;