// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA_NYDDK6dHTfqegunSo35PyG0dNZWyj5g",
  authDomain: "rtti-96e17.firebaseapp.com",
  projectId: "rtti-96e17",
  storageBucket: "rtti-96e17.firebasestorage.app",
  messagingSenderId: "978691003361",
  appId: "1:978691003361:web:3801a811687bc106c3b8a0",
  measurementId: "G-PRRHDR12LF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);