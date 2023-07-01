// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCUSD4PipCLcx4mHHrO-MxXiDPCLxNuQD8",
  authDomain: "yano-travel.firebaseapp.com",
  projectId: "yano-travel",
  storageBucket: "yano-travel.appspot.com",
  messagingSenderId: "760416725785",
  appId: "1:760416725785:web:7f6a8ff9b7bd419071f388",
  measurementId: "G-MX8J29TRPR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app;
