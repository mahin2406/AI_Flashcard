// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);