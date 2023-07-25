import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDxIM0W0Gfv5NNhTI-9Q4pbfleXWzjXLNs",
  authDomain: "pokedex-71706.firebaseapp.com",
  projectId: "pokedex-71706",
  storageBucket: "pokedex-71706.appspot.com",
  messagingSenderId: "207681850964",
  appId: "1:207681850964:web:ad2a11a93b30ed3fda27c1",
  measurementId: "G-CJXZYWB5RK"
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(app);
export const firebaseDB = getFirestore(app);

export const usersRef = collection(firebaseDB, "users");
export const pokemonListRef = collection(firebaseDB, "pokemonList");
