import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot, updateDoc, query, orderBy } from 'firebase/firestore';
import { Outlet, Product, PrintOrder } from '../types';

// --- Real-time Subscriptions ---

export const subscribeOutlets = (onUpdate: (outlets: Outlet[]) => void) => {
  return onSnapshot(collection(db, 'outlets'), (snapshot) => {
    const outlets = snapshot.docs.map(doc => doc.data() as Outlet);
    onUpdate(outlets);
  }, (error) => {
    // Only log if it's NOT a permission error, to keep console clean during auth transitions
    if (error.code === 'permission-denied') {
        onUpdate([]); // Clear data if permission lost
    } else {
        console.error("Error subscribing to outlets:", error.message);
    }
  });
};

export const subscribeProducts = (onUpdate: (products: Product[]) => void) => {
  return onSnapshot(collection(db, 'products'), (snapshot) => {
    const products = snapshot.docs.map(doc => doc.data() as Product);
    onUpdate(products);
  }, (error) => {
    if (error.code === 'permission-denied') {
        onUpdate([]); // Clear data if permission lost
    } else {
        console.error("Error subscribing to products:", error.message);
    }
  });
};

export const subscribePrintOrders = (onUpdate: (orders: PrintOrder[]) => void) => {
  const q = query(collection(db, 'print_orders'), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => doc.data() as PrintOrder);
    onUpdate(orders);
  }, (error) => {
    console.error("Error subscribing to print orders:", error);
  });
};

// --- CRUD Operations ---

// Outlet
export const addOutletToDb = async (outlet: Outlet) => {
  await setDoc(doc(db, 'outlets', outlet.id), outlet);
};

export const updateOutletInDb = async (outlet: Outlet) => {
  await setDoc(doc(db, 'outlets', outlet.id), outlet, { merge: true });
};

export const deleteOutletFromDb = async (id: string) => {
  await deleteDoc(doc(db, 'outlets', id));
  // Note: In a production app, you would also query and delete all sub-products here.
  // For this implementation, we handle UI filtering, but the data remains orphaned in DB 
  // unless we add a cloud function or client-side batch delete.
};

// Product
export const addProductToDb = async (product: Product) => {
  await setDoc(doc(db, 'products', product.id), product);
};

export const updateProductInDb = async (product: Product) => {
  await setDoc(doc(db, 'products', product.id), product, { merge: true });
};

export const deleteProductFromDb = async (id: string) => {
  await deleteDoc(doc(db, 'products', id));
};

// Print Orders
export const addPrintOrderToDb = async (order: PrintOrder) => {
  await setDoc(doc(db, 'print_orders', order.id), order);
};

export const updatePrintOrderStatus = async (id: string, status: 'pending' | 'printed' | 'delivered') => {
  await updateDoc(doc(db, 'print_orders', id), { status });
};