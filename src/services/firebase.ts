import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyB7vIuYo3b_TBTJhxzveFbStdYuhfpQTLc',
  authDomain: 'taskmanager-88ca3.firebaseapp.com',
  projectId: 'taskmanager-88ca3',
  storageBucket: 'taskmanager-88ca3.firebasestorage.app',
  messagingSenderId: '214947440570',
  appId: '1:214947440570:web:230253e5b6845288c65f83',
  measurementId: 'G-39725FG8YT',
};

const app = initializeApp(firebaseConfig);

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache(),
});

export const auth = getAuth(app);
export const storage = getStorage(app);
