// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBQMuZCWEMI5RBZlldSL4dDLOMVpv_7Dzs",
  authDomain: "web1-bcc30.firebaseapp.com",
  projectId: "web1-bcc30",
  storageBucket: "web1-bcc30.appspot.com",
  messagingSenderId: "448068791334",
  appId: "1:448068791334:web:fccc3e09b35af40915cae7",
  measurementId: "G-YGTTFPZ00T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;