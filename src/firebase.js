import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_ut8aOxNkeKbFdXu_nY4DsrSQgJrvRco",
  authDomain: "oprtec-agendamento.firebaseapp.com",
  projectId: "oprtec-agendamento",
  storageBucket: "oprtec-agendamento.firebasestorage.app",
  messagingSenderId: "927555054150",
  appId: "1:927555054150:web:526d86e2fa7e7fc509b847",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
