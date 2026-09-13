import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCbhFHTivoLQwQ5LNgOl5NCtCuK2tOXT3s',
  authDomain: 'login-screen-2tdspx.firebaseapp.com',
  projectId: 'login-screen-2tdspx',
  storageBucket: 'login-screen-2tdspx.firebasestorage.app',
  messagingSenderId: '56038513662',
  appId: '1:56038513662:web:7ad3c83bd9d69f4aa23eaf',
  measurementId: 'G-4WNG7ZG3LR',
};

const app = initializeApp(firebaseConfig);

export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: require('@firebase/auth').getReactNativePersistence(AsyncStorage),
      });
