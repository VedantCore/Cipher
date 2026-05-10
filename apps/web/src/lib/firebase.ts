import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCbr4RtUwTRstjbGR-dQDsEA1tanZebWHA",
  authDomain: "cipher-web-d6026.firebaseapp.com",
  projectId: "cipher-web-d6026",
  storageBucket: "cipher-web-d6026.firebasestorage.app",
  messagingSenderId: "528803651024",
  appId: "1:528803651024:web:5face6db184ebdb2bcedd5",
  measurementId: "G-N418T7XZD7"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);