import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBhVeJJYE88opPBaWxW2tzjyGVN6ukG8ZA",
  authDomain: "maze-master-debdd.firebaseapp.com",
  projectId: "maze-master-debdd",
  storageBucket: "maze-master-debdd.firebasestorage.app",
  messagingSenderId: "618352825680",
  appId: "1:618352825680:web:fe7f112a13957d09748855",
  measurementId: "G-CEFBZTGQPH"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;