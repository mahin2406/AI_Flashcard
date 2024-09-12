import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnd05rh0HvedeWpwiSMXrJkFsNdwk0LNM",
  authDomain: "flashcard-adb95.firebaseapp.com",
  projectId: "flashcard-adb95",
  storageBucket: "flashcard-adb95.appspot.com",
  messagingSenderId: "19971598124",
  appId: "1:19971598124:web:2b51a5e473fc88dd8dee89",
  measurementId: "G-FQZ9P105BV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Analytics only on the client-side
let analytics;
if (typeof window !== 'undefined') {
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { db, analytics };
