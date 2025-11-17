import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDy9ieIv2MLh8720uuxsDQQqxGB-bU1j8I",
  authDomain: "uhunter-b6f95.firebaseapp.com",
  projectId: "uhunter-b6f95",
  storageBucket: "uhunter-b6f95.firebasestorage.app",
  messagingSenderId: "124609225960",
  appId: "1:124609225960:web:e62f665b1031442c21d55d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firestore = getFirestore(app);

export default app;