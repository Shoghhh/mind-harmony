import { getApp, initializeApp } from '@react-native-firebase/app';
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
    const firebaseConfig = {
        apiKey: "AIzaSyBjkKm4a7PhpZzhFgTS5CHj2BlE1ByRVR8",
        authDomain: "mind--harmony.firebaseapp.com",
        projectId: "mind--harmony",
        storageBucket: "mind--harmony.firebasestorage.app",
        messagingSenderId: "602928549917",
        appId: "1:602928549917:web:60447a0c03cf2b094e76f4",
        measurementId: "G-RMZXFMFE2J"
    };

  initializeApp(firebaseConfig);
}

const firebaseApp = getApp();

export default firebaseApp;