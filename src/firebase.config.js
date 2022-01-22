// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAvCM0VB5hZgDC9c97upHpS_RZidBGkQiA',
  authDomain: 'home-marketplace-8f348.firebaseapp.com',
  projectId: 'home-marketplace-8f348',
  storageBucket: 'home-marketplace-8f348.appspot.com',
  messagingSenderId: '680354774185',
  appId: '1:680354774185:web:35dbe16f71accfb56b3db8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
