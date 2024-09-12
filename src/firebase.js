// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCcPeF_1uLpuXByZCJOY_o5jRLALaQivBc",
    authDomain: "commuterapp-58155.firebaseapp.com",
    projectId: "commuterapp-58155",
    storageBucket: "commuterapp-58155.appspot.com",
    messagingSenderId: "311309977676",
    appId: "1:311309977676:web:6bdd631245649331ab8ce9",
    measurementId: "G-F4DRF0J0FE"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();


export const db = getFirestore(app);

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};
