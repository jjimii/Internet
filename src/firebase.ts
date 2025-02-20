// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with your own Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB8mYuIofbzNH36QyWtzExFkyGUS4Jsk-M",
  authDomain: "jimee-19e8a.firebaseapp.com",
  projectId: "jimee-19e8a",
  storageBucket: "jimee-19e8a.firebasestorage.app",
  messagingSenderId: "972992849433",
  appId: "1:972992849433:web:9425940a6f5fd974972c88",
  measurementId: "G-PMH4PJJDEF"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
