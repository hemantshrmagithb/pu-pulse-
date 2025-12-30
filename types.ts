export type OutletType = 'food' | 'stationery';

export interface Outlet {
  id: string;
  name: string;
  location: string;
  type: OutletType;
  tags: string[]; // e.g., ["North Indian", "Chinese"] or ["Books", "Art"]
  imageUrl?: string;
}

export interface Product {
  id: string;
  outletId: string;
  name: string;
  description: string;
  price: number;
  category?: string; // Grouping inside menu: "Starters", "Mains"
  imageUrl?: string;
  isAvailable: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  outletName: string; // Helper for display
}

export interface PrintOptions {
  paperSize: 'A4' | 'A5';
  colorType: 'black_white' | 'color';
  sides: 'single' | 'double';
  copies: number;
  pageRange: 'all' | string;
  binding: boolean;
}

export interface PrintOrder {
  id: string;
  userId: string;
  userEmail: string;
  fileName: string;
  fileType: string;
  fileBase64: string; // Storing as base64 for prototype simplicity
  options: PrintOptions;
  totalPrice: number;
  status: 'pending' | 'printed' | 'delivered';
  timestamp: number;
  deliveryLocation?: string;
}

export enum ViewState {
  HOME = 'HOME',
  OUTLET_DETAILS = 'OUTLET_DETAILS',
  ADMIN = 'ADMIN',
  ADMIN_LOGIN = 'ADMIN_LOGIN',
  CHECKOUT = 'CHECKOUT',
  ABOUT = 'ABOUT',
  CONTACT = 'CONTACT',
  PRINT_SERVICE = 'PRINT_SERVICE'
}