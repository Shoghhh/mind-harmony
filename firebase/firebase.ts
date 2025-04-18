import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBjkKm4a7PhpZzhFgTS5CHj2BlE1ByRVR8",
  authDomain: "mind--harmony.firebaseapp.com",
  projectId: "mind--harmony",
  storageBucket: "mind--harmony.appspot.com",
  messagingSenderId: "602928549917",
  appId: "1:602928549917:web:60447a0c03cf2b094e76f4",
  measurementId: "G-RMZXFMFE2J"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

const db = getFirestore(app);
const storage = getStorage(app); 

export { app, auth, db, storage};
