
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "aarambhai-youth-wellness",
  appId: "1:552156856845:web:295aa03f56fe6a82b50b44",
  storageBucket: "aarambhai-youth-wellness.firebasestorage.app",
  apiKey: "AIzaSyD6iawfGPy2UMAuqWdwhO9i8dtnWLbjH1k",
  authDomain: "aarambhai-youth-wellness.firebaseapp.com",
  messagingSenderId: "552156856845",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
