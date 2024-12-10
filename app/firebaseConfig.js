import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

export const firebaseConfig = {
  apiKey: "AIzaSyCqtDARM5L1g7U08qMhZ4r-CZnftbsYBe4",
  authDomain: "wattpod-16c57.firebaseapp.com",
  projectId: "wattpod-16c57",
  storageBucket: "wattpod-16c57.firebasestorage.app",
  messagingSenderId: "587424071520",
  appId: "1:587424071520:web:a08acd3f87fd868936e805"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
