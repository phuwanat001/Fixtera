import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDdXufRVxHp242YMcOUREYXQ-AIUWCaclg",
  authDomain: "fixtera-auth.firebaseapp.com",
  projectId: "fixtera-auth",
  storageBucket: "fixtera-auth.firebasestorage.app",
  messagingSenderId: "563138832044",
  appId: "1:563138832044:web:5558f77c59d006384f2109",
  measurementId: "G-LTVYVC0MXS",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
