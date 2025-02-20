// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your own Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBaVd1TADjjcBplugauUFLiHhDNurF8zow",
    authDomain: "siddarth-cc380.firebaseapp.com",
    projectId: "siddarth-cc380",
    storageBucket: "siddarth-cc380.firebasestorage.app",
    messagingSenderId: "1034502980339",
    appId: "1:1034502980339:web:4af32c3befbcc8e9126d86",
    measurementId: "G-VV907CLP3T"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
