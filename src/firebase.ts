// Firebase config for Eventra_Bihar
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAxP4pl6q6Zl84-KXAD-ikj9oqEAeUWcfo",
  authDomain: "eventra-ec344.firebaseapp.com",
  projectId: "eventra-ec344",
  storageBucket: "eventra-ec344.firebasestorage.app",
  messagingSenderId: "4291094550",
  appId: "1:4291094550:web:aec407bc22993948362d37",
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export { signInWithPopup };
