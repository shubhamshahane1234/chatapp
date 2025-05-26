// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

///auth imports
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBRqYLd9yenaBA6L2HM8EtPFQPyWnOeD8c",
  authDomain: "chatapp-7ae84.firebaseapp.com",
  databaseURL: "https://chatapp-7ae84-default-rtdb.firebaseio.com",
  projectId: "chatapp-7ae84",
  storageBucket: "chatapp-7ae84.firebasestorage.app",
  messagingSenderId: "95124947552",
  appId: "1:95124947552:web:0d9bcfa715c7d884aeb905",
  measurementId: "G-51GKHYCVFS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);
export { database };

/////////////////////////////////////////////////////////////////////// Initialize Firebase Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };

// Function to handle Google login
export const signinWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

// Function to handle log out
export const logout = () => {
  return signOut(auth);
};
