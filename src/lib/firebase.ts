// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "portfoliopilot-m9bij",
  "appId": "1:327873669711:web:92aa79c384581d1c8e583a",
  "storageBucket": "portfoliopilot-m9bij.firebasestorage.app",
  "apiKey": "AIzaSyCDRCRblbOUesO4WBg4Aj9TdDq4F3_RHU8",
  "authDomain": "portfoliopilot-m9bij.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "327873669711"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
