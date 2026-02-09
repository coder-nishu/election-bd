// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, onSnapshot, increment, updateDoc, collection, query, where, getDocs } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDfkR25VHMfwwLT2iB9p7DOjBfCkw6EwYY",
  authDomain: "election-prediction-bd.firebaseapp.com",
  projectId: "election-prediction-bd",
  storageBucket: "election-prediction-bd.firebasestorage.app",
  messagingSenderId: "930113825750",
  appId: "1:930113825750:web:26c045534c8685bd741277"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export database and functions
export { db, doc, setDoc, getDoc, onSnapshot, increment, updateDoc, collection, query, where, getDocs };
