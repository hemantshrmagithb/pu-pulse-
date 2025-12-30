// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCzfj-IFQPynFPFNmuhSn7Dr4k5_Jlg5g8",
  authDomain: "pu-pluse.firebaseapp.com",
  projectId: "pu-pluse",
  storageBucket: "pu-pluse.firebasestorage.app",
  messagingSenderId: "1040128078068",
  appId: "1:1040128078068:web:04b870ae140252ab0deea1",
  measurementId: "G-P0NPH9XXFX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);