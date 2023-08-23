import { initializeApp } from "firebase/app";
import "firebase/firestore";
import firebase from "firebase/compat/app";
// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import {
  collection,
  getFirestore,
  addDoc,
  updateDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyBOmaW7EjNE4SYY3K7g9HJ5NJy-lRo9epo",
  authDomain: "picto-chat-24b2b.firebaseapp.com",
  projectId: "picto-chat-24b2b",
  storageBucket: "picto-chat-24b2b.appspot.com",
  messagingSenderId: "650107256571",
  appId: "1:650107256571:web:87d95841159a4c40cd7a5e",
  measurementId: "G-PTKRJ4LP4F",
};

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyBOmaW7EjNE4SYY3K7g9HJ5NJy-lRo9epo",
  authDomain: "picto-chat-24b2b.firebaseapp.com",
  projectId: "picto-chat-24b2b",
  storageBucket: "picto-chat-24b2b.appspot.com",
  messagingSenderId: "650107256571",
  appId: "1:650107256571:web:87d95841159a4c40cd7a5e",
  measurementId: "G-PTKRJ4LP4F",
});
const firestore = getFirestore(app);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const curcollection = collection(firestore, "AllMessages");
const userCollection = collection(firestore, "Users");
export {
  firestore,
  curcollection,
  userCollection,
  addDoc,
  updateDoc,
  auth,
  firebase,
  useAuthState,
  getDocs,
  serverTimestamp,
};
