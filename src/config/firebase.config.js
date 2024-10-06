import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDeSyRuRKPARoYvyGccWJBMPKixPAgz3TA",
  authDomain: "kitab-kunj.firebaseapp.com",
  projectId: "kitab-kunj",
  storageBucket: "kitab-kunj.appspot.com",
  messagingSenderId: "269233793162",
  appId: "1:269233793162:web:471d7122f7826c51762573",
  measurementId: "G-F0PPP4MMKD",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, storage, db, auth };
