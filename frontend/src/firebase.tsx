// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "proxima-e-learn.firebaseapp.com",
  projectId: "proxima-e-learn",
  storageBucket: "proxima-e-learn.appspot.com",
  messagingSenderId: "644645746029",
  appId: "1:644645746029:web:ce602f71c08a986ab0d664"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);