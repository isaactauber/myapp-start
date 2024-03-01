import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

//! REPLACE VALUES BELOW WITH YOUR OWN FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCAyadKsPY4wapmcXv8_cspB57G6fBcvfg",
  authDomain: "itauber-project.firebaseapp.com",
  databaseURL: "https://itauber-project-default-rtdb.firebaseio.com",
  projectId: "itauber-project",
  storageBucket: "itauber-project.appspot.com",
  messagingSenderId: "769777157556",
  appId: "1:769777157556:web:b62e31461efc60fcbc1ee1",
  measurementId: "G-2HXJKY9TT0"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
