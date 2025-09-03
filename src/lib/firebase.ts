
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

/**
 * Firebase Configuration using Environment Variables
 * 
 * SECURITY BEST PRACTICES:
 * 
 * 1. KEY ROTATION:
 *    - Rotate your Firebase API key every 90 days
 *    - To rotate: Go to Firebase Console > Project Settings > General > Web API Key
 *    - Generate new key, update .env.local, then delete old key
 * 
 * 2. ENVIRONMENT VARIABLE SECURITY:
 *    - Never commit .env.local to version control
 *    - Use different Firebase projects for dev/staging/production
 *    - Limit API key usage with HTTP referrer restrictions in Firebase Console
 * 
 * 3. FIREBASE SECURITY RULES:
 *    - Always implement proper Firestore security rules
 *    - Never rely solely on client-side validation
 *    - Test your security rules thoroughly
 * 
 * 4. MONITORING:
 *    - Enable Firebase usage monitoring
 *    - Set up billing alerts to detect unusual activity
 *    - Monitor authentication logs for suspicious patterns
 * 
 * 5. ACCESS CONTROL:
 *    - Use principle of least privilege for Firebase IAM
 *    - Regularly audit project members and their permissions
 *    - Enable 2FA for all Firebase project administrators
 */

// Validate required environment variables
const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID', 
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}. Please check your .env.local file.`);
  }
}

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { app, db };
