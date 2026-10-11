import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
export const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'beaming-hawk-f07pf',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:88243527838:web:243cf75ac8004a607f9b8f',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyCjWoeFHiOqyg9eXKXbOcDPjpxh8Lv5qbI',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'beaming-hawk-f07pf.firebaseapp.com',
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || 'ai-studio-leadfinderai-8c8dbdf8-0a7f-4cc6-981a-e1edbee3c741',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'beaming-hawk-f07pf.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '88243527838',
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Please check your Firebase configuration: client is offline');
    }
  }
}

// Initial connection test
testFirestoreConnection();
