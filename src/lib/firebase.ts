
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "aarambhai-youth-wellness",
  appId: "1:552156856845:web:295aa03f56fe6a82b50b44",
  storageBucket: "aarambhai-youth-wellness.firebasestorage.app",
  apiKey: "AIzaSyAOq08ykTrFQY9lvCUrD6i5GwszFCkBRZ0",
  authDomain: "aarambhai-youth-wellness.firebaseapp.com",
  messagingSenderId: "552156856845",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
