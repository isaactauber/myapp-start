import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//! REPLACE VALUES BELOW WITH YOUR OWN FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB8keIn0wYG6p_18cNBGx4t-56F6TNPEk0",
  authDomain: "usher-backend.firebaseapp.com",
  databaseURL: "https://usher-backend-default-rtdb.firebaseio.com",
  projectId: "usher-backend",
  storageBucket: "usher-backend.appspot.com",
  messagingSenderId: "60089943989",
  appId: "1:60089943989:web:0f8d8f4ce41851efbc7bfc",
  measurementId: "G-BR5EMKCZ76"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
