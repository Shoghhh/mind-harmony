// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';


// const firebaseConfig = {
//     apiKey: "AIzaSyBjkKm4a7PhpZzhFgTS5CHj2BlE1ByRVR8",
//     authDomain: "mind--harmony.firebaseapp.com",
//     projectId: "mind--harmony",
//     storageBucket: "mind--harmony.firebasestorage.app",
//     messagingSenderId: "602928549917",
//     appId: "1:602928549917:web:60447a0c03cf2b094e76f4",
//     measurementId: "G-RMZXFMFE2J"
// };


// const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);

// export { auth };


import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence, GoogleAuthProvider, Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp } from 'firebase/app';
import { Platform } from 'react-native';

import { getAuth } from 'firebase/auth';

// Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBjkKm4a7PhpZzhFgTS5CHj2BlE1ByRVR8",
    authDomain: "mind--harmony.firebaseapp.com",
    projectId: "mind--harmony",
    storageBucket: "mind--harmony.firebasestorage.app",
    messagingSenderId: "602928549917",
    appId: "1:602928549917:web:60447a0c03cf2b094e76f4",
    measurementId: "G-RMZXFMFE2J"
};


const app: FirebaseApp = initializeApp(firebaseConfig);

let auth: Auth;
if (Platform.OS === 'web') {
    // For Expo Go (Web), we don’t need AsyncStorage persistence.
    auth = getAuth(app);
} else {
    // For native iOS/Android, use AsyncStorage persistence
    auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
    });
}

const googleProvider = new GoogleAuthProvider();

export { auth };