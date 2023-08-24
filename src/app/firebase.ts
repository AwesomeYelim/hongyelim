import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBsbD2IosaTfZg0wHrzG-q-FwahLvVbHmI",
  authDomain: "yelimblog.firebaseapp.com",
  projectId: "yelimblog",
  storageBucket: "yelimblog.appspot.com",
  messagingSenderId: "464398630588",
  appId: "1:464398630588:web:7552dec494e85e1c241ab9",
  measurementId: "G-2NYEYV515J",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
