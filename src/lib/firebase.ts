import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';

export const firebaseConfig = {
  projectId: rawConfig?.projectId || 'beaming-hawk-f07pf',
  appId: rawConfig?.appId || '1:88243527838:web:243cf75ac8004a607f9b8f',
  apiKey: rawConfig?.apiKey || 'AIzaSyCjWoeFHiOqyg9eXKXbOcDPjpxh8Lv5qbI',
  authDomain: rawConfig?.authDomain || 'beaming-hawk-f07pf.firebaseapp.com',
  firestoreDatabaseId: rawConfig?.firestoreDatabaseId || 'ai-studio-leadfinderai-8c8dbdf8-0a7f-4cc6-981a-e1edbee3c741',
  storageBucket: rawConfig?.storageBucket || 'beaming-hawk-f07pf.firebasestorage.app',
  messagingSenderId: rawConfig?.messagingSenderId || '88243527838',
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
