// app/utils/firebaseClient.ts

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase config pulled from env vars
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Export the Auth instance for use in your components
export const auth = getAuth(firebaseApp);

// (Optional) export the app if you need it elsewhere
export default firebaseApp;
