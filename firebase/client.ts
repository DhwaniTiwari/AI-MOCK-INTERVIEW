// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDwmwqyZnixh6x95v2adAHpFNDNnVw3uPE",
    authDomain: "mockmuse-5e635.firebaseapp.com",
    projectId: "mockmuse-5e635",
    storageBucket: "mockmuse-5e635.firebasestorage.app",
    messagingSenderId: "1019495803280",
    appId: "1:1019495803280:web:809436a3e904cc9b406b15",
    measurementId: "G-TMPYE88F97"
};

// Initialize Firebase
const app = !getApps.length ?  initializeApp(firebaseConfig): getApp();

export const auth= getAuth(app);
export const db= getFirestore(app);









// const analytics = getAnalytics(app);