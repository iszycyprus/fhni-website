// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDc2SnByiIrQSaqLkFStp7ETIiOeveSwso",
  authDomain: "fire-hive-db.firebaseapp.com",
  projectId: "fire-hive-db",
  storageBucket: "fire-hive-db.firebasestorage.app",
  messagingSenderId: "317867361692",
  appId: "1:317867361692:web:fc11cd46687a0a1b61b459"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it
export const db = getFirestore(app);