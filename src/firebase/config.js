// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from 'firebase/auth'
import {getFirestore} from 'firebase/firestore'
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAqSNBrqQ9o_VLdv0HL5ur6pJuPNZcuinw",
  authDomain: "whatsapp-replica-19f81.firebaseapp.com",
  projectId: "whatsapp-replica-19f81",
  storageBucket: "whatsapp-replica-19f81.firebasestorage.app",
  messagingSenderId: "260682067733",
  appId: "1:260682067733:web:914461b5eb00ff472c831c",
  measurementId: "G-5F1J41780Y"
};

// Initialize Firebase
export const FirebaseApp = initializeApp(firebaseConfig);
export const FirebaseAuth = getAuth(FirebaseApp);
export const FirebaseDB = getFirestore(FirebaseApp);


// const analytics = getAnalytics(app);