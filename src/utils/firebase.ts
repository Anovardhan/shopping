import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCqYxy24RxFB6oogC7q1rE1V-xBLGEZBu8",
  authDomain: "ecommerce-9da70.firebaseapp.com",
  databaseURL: "https://ecommerce-9da70-default-rtdb.firebaseio.com",
  projectId: "ecommerce-9da70",
  storageBucket: "ecommerce-9da70.firebasestorage.app",
  messagingSenderId: "610703520890",
  appId: "1:610703520890:web:b80a61bfa95549a1e877c3",
  measurementId: "G-DFYQDCLW7D"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
