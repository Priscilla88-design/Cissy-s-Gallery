import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

import { handleFirestoreError, OperationType } from './firestoreErrors';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Validation connection as per instructions
async function testConnection() {
  const path = 'test/connection';
  try {
    await getDocFromServer(doc(db, path));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is reporting as offline.");
    } else {
      // Log path and auth status as per instructions
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (e) {
        // Suppress re-throw for initial connection test to avoid crashing app on boot
        console.warn("Initial connectivity test failed (this is non-blocking):", e instanceof Error ? e.message : e);
      }
    }
  }
}

testConnection();

export { signInWithPopup, onAuthStateChanged, type User };
