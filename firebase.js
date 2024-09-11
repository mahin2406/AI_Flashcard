import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db};