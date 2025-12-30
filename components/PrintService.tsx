import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, Check, X, Printer, FileType, Info, AlertCircle, ArrowLeft } from 'lucide-react';
import { PrintOptions, PrintOrder } from '../types';
import { User } from 'firebase/auth';
import { addPrintOrderToDb } from '../services/db';

interface PrintServiceProps {
  user: User;
  onBack: () => void;
}

const PrintService: React.FC<PrintServiceProps> = ({ user, onBack }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Options
  const [options, setOptions] = useState<PrintOptions>({
    paperSize: 'A4',
    colorType: 'black_white',
    sides: 'single',
    copies: 1,
    pageRange: 'all',
    binding: false
  });

  const [location, setLocation] = useState('');
  const [price, setPrice] = useState(0);

  // Calculate Price
  useEffect(() => {
    let basePrice = options.paperSize === 'A4' ? 2 : 1.5; // A4=2rs, A5=1.5rs
    if (options.colorType === 'color') basePrice *= 5; // Color is 5x cost
    if (options.sides === 'double') basePrice *= 1.8; // Double sided discount
    
    let total = basePrice * options.copies;
    if (options.binding) total += 20; // Binding cost

    // Round to 2 decimals
    setPrice(Math.round(total * 100) / 100);
  }, [options]);

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile: File) => {
    // Size check (Limit to 2MB for Firestore Base64 limits)
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("File is too large. Max size is 2MB for this prototype.");
      return;
    }
    
    setFile(selectedFile);

    // Create preview
    if (selectedFile.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(selectedFile);
    } else {
      setFilePreview(null);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async () => {
    if (!file) return;
    if (!location.trim()) {
      alert("Please enter a delivery location (e.g., Hostel Block A)");
      return;
    }

    setIsUploading(true);

    try {
      const base64File = await convertFileToBase64(file);
      
      const order: PrintOrder = {
        id: `print-${Date.now()}`,
        userId: user.uid,
        userEmail: user.email || 'Anonymous',
        fileName: file.name,
        fileType: file.type,
        fileBase64: base64File,
        options,
        totalPrice: price,
        status: 'pending',
        timestamp: Date.now(),
        deliveryLocation: location
      };

      await addPrintOrderToDb(order);
      alert("Order placed successfully! Visit the Print Store to collect or wait for delivery.");
      onBack();
    } catch (error) {
      console.error(error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-28 px-4 md:px-12 pb-20">
      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <button onClick={onBack} className="group flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-neutral-500 hover:text-cyan-400 transition-colors mb-8">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
        </button>

        <div className="flex items-end justify-between mb-12">
            <div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                Print Store.
                </h1>
                <p className="text-neutral-400 font-light max-w-xl">
                Upload documents, customize print settings, and get them delivered to your block. 
                Supported formats: PDF, DOCX, PNG, JPG.
                </p>
            </div>
            <div className="hidden md:block">
                <Printer size={64} className="text-neutral-800" strokeWidth={1} />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: Upload Section */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Dropzone */}
            <div 
              className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all duration-300 ${isDragOver ? 'border-cyan-500 bg-cyan-500/10' : 'border-neutral-800 bg-neutral-900/30'}`}
              onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleFileDrop}
            >
              {!file ? (
                <>
                  <div className="w-20 h-20 bg-neutral-800 rounded-full flex items-center justify-center mb-6 text-neutral-400">
                    <Upload size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Upload your Document</h3>
                  <p className="text-neutral-500 mb-6 text-center">Drag & drop or click to browse<br/>(Max 2MB)</p>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileSelect} 
                    className="hidden" 
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-colors"
                  >
                    Select File
                  </button>
                </>
              ) : (
                <div className="w-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-cyan-900/50 text-cyan-400 rounded-lg flex items-center justify-center">
                            <FileText size={24} />
                        </div>
                        <div>
                            <p className="font-bold text-white truncate max-w-[200px] md:max-w-md">{file.name}</p>
                            <p className="text-xs text-neutral-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                    </div>
                    <button onClick={() => setFile(null)} className="text-neutral-500 hover:text-red-400">
                        <X size={20} />
                    </button>
                  </div>
                  
                  {/* Preview Area */}
                  <div className="w-full bg-neutral-950 rounded-xl border border-white/5 p-4 min-h-[200px] flex items-center justify-center overflow-hidden">
                    {filePreview ? (
                        <img src={filePreview} alt="Preview" className="max-h-[300px] object-contain rounded" />
                    ) : (
                        <div className="text-center text-neutral-600">
                            <FileType size={48} className="mx-auto mb-2 opacity-50" />
                            <p>Preview not available for this file type</p>
                        </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Print Configuration Form */}
            {file && (
                <div className="bg-neutral-900/30 border border-white/5 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Printer size={20} className="text-cyan-400" /> Print Configuration
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Paper Size */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Paper Size</label>
                            <div className="flex gap-2">
                                {['A4', 'A5'].map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setOptions({...options, paperSize: size as 'A4' | 'A5'})}
                                        className={`flex-1 py-3 rounded-lg border font-medium text-sm transition-all ${options.paperSize === size ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Color Mode</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOptions({...options, colorType: 'black_white'})}
                                    className={`flex-1 py-3 rounded-lg border font-medium text-sm transition-all ${options.colorType === 'black_white' ? 'bg-white text-black border-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                                >
                                    B&W
                                </button>
                                <button
                                    onClick={() => setOptions({...options, colorType: 'color'})}
                                    className={`flex-1 py-3 rounded-lg border font-medium text-sm transition-all ${options.colorType === 'color' ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white border-transparent' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                                >
                                    Color
                                </button>
                            </div>
                        </div>

                        {/* Sides */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Sides</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setOptions({...options, sides: 'single'})}
                                    className={`flex-1 py-3 rounded-lg border font-medium text-sm transition-all ${options.sides === 'single' ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                                >
                                    Single
                                </button>
                                <button
                                    onClick={() => setOptions({...options, sides: 'double'})}
                                    className={`flex-1 py-3 rounded-lg border font-medium text-sm transition-all ${options.sides === 'double' ? 'bg-cyan-600 border-cyan-600 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500'}`}
                                >
                                    Duplex
                                </button>
                            </div>
                        </div>

                        {/* Copies */}
                        <div>
                            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Copies</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="100"
                                value={options.copies}
                                onChange={(e) => setOptions({...options, copies: Math.max(1, parseInt(e.target.value) || 1)})}
                                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-3 text-white outline-none focus:border-cyan-500"
                            />
                        </div>

                        {/* Page Range */}
                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">Page Range</label>
                             <div className="flex gap-4 items-center">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-white">
                                    <input 
                                        type="radio" 
                                        name="range" 
                                        checked={options.pageRange === 'all'} 
                                        onChange={() => setOptions({...options, pageRange: 'all'})}
                                        className="accent-cyan-500"
                                    />
                                    All Pages
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-white flex-grow">
                                    <input 
                                        type="radio" 
                                        name="range" 
                                        checked={options.pageRange !== 'all'} 
                                        onChange={() => setOptions({...options, pageRange: ''})}
                                        className="accent-cyan-500"
                                    />
                                    Custom: 
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 1-5, 8" 
                                        disabled={options.pageRange === 'all'}
                                        value={options.pageRange === 'all' ? '' : options.pageRange}
                                        onChange={(e) => setOptions({...options, pageRange: e.target.value})}
                                        className="bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs w-full disabled:opacity-50 outline-none focus:border-cyan-500"
                                    />
                                </label>
                             </div>
                        </div>

                        {/* Binding */}
                         <div className="md:col-span-2">
                             <label className="flex items-center gap-3 p-4 bg-neutral-800 rounded-lg cursor-pointer hover:bg-neutral-750 transition-colors">
                                <input 
                                    type="checkbox"
                                    checked={options.binding}
                                    onChange={(e) => setOptions({...options, binding: e.target.checked})}
                                    className="w-5 h-5 accent-cyan-500 rounded"
                                />
                                <div>
                                    <span className="block font-bold text-white text-sm">Add Binding / Stapling</span>
                                    <span className="text-xs text-neutral-500">+ ₹20.00</span>
                                </div>
                             </label>
                        </div>
                    </div>
                </div>
            )}
          </div>

          {/* RIGHT: Price & Checkout */}
          <div className="lg:col-span-1">
             <div className="sticky top-28 space-y-6">
                
                {/* Location Input */}
                <div className="bg-neutral-900/50 border border-white/5 rounded-3xl p-6">
                    <h3 className="font-bold text-white mb-4">Delivery Location</h3>
                    <div className="relative">
                         <input 
                           type="text" 
                           placeholder="e.g. Hostel BH-1, Room 302"
                           value={location}
                           onChange={(e) => setLocation(e.target.value)}
                           className="w-full bg-neutral-800 border border-neutral-700 rounded-xl p-4 pl-10 text-white outline-none focus:border-cyan-500 focus:bg-neutral-800 transition-all placeholder-neutral-500 text-sm"
                         />
                         <div className="absolute left-3 top-4 text-neutral-500">
                             <Check size={18} />
                         </div>
                    </div>
                </div>

                {/* Bill Summary */}
                <div className="bg-white text-neutral-900 rounded-3xl p-6 shadow-xl shadow-cyan-900/20">
                    <h3 className="font-bold text-lg mb-6 border-b border-neutral-100 pb-4">Order Summary</h3>
                    
                    <div className="space-y-3 mb-6 text-sm">
                        <div className="flex justify-between">
                            <span className="text-neutral-500">Document</span>
                            <span className="font-medium truncate max-w-[120px]">{file ? file.name : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-500">Config</span>
                            <span className="font-medium">
                                {options.paperSize}, {options.colorType === 'black_white' ? 'B&W' : 'Color'}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-neutral-500">Copies</span>
                            <span className="font-medium">x{options.copies}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-neutral-500">Binding</span>
                            <span className="font-medium">{options.binding ? 'Yes' : 'No'}</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mb-6 pt-4 border-t border-neutral-100">
                        <span className="font-bold text-xl">Total</span>
                        <span className="font-black text-2xl text-cyan-600">₹{price.toFixed(2)}</span>
                    </div>

                    {file ? (
                        <button 
                            onClick={handleSubmit}
                            disabled={isUploading}
                            className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isUploading ? (
                                <>Processing...</>
                            ) : (
                                <>Order Print <ArrowLeft className="rotate-180" size={18} /></>
                            )}
                        </button>
                    ) : (
                        <div className="bg-neutral-100 text-neutral-400 py-3 rounded-xl text-center text-sm font-medium flex items-center justify-center gap-2">
                            <AlertCircle size={16} /> Upload file to proceed
                        </div>
                    )}
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex gap-3 items-start">
                    <Info className="text-blue-400 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-blue-200 leading-relaxed">
                        Prices are estimated based on standard rates. Final adjustments may occur upon verification. Delivery usually within 2 hours.
                    </p>
                </div>

             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PrintService;