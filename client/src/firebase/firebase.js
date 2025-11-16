// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDF9RH2GrQkvKVDgBlDgxRE2D4RH5qXHRk",
  authDomain: "databanklog.firebaseapp.com",
  projectId: "databanklog",
  storageBucket: "databanklog.firebasestorage.app",
  messagingSenderId: "105550405268",
  appId: "1:105550405268:web:cb64ae254dce1b9278de81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
