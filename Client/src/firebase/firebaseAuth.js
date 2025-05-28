import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import app from "./firebase.js";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);  
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { auth, googleProvider, db }; 