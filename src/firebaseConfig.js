// Config pública do app web do Firebase (projeto oprtec-agendamento). Não é segredo:
// o acesso é controlado pelas regras do Firestore. Separado de firebase.js pra que
// código de servidor possa usar (REST) sem inicializar o SDK do navegador.
export const firebaseConfig = {
  apiKey: "AIzaSyB_ut8aOxNkeKbFdXu_nY4DsrSQgJrvRco",
  authDomain: "oprtec-agendamento.firebaseapp.com",
  projectId: "oprtec-agendamento",
  storageBucket: "oprtec-agendamento.firebasestorage.app",
  messagingSenderId: "927555054150",
  appId: "1:927555054150:web:526d86e2fa7e7fc509b847",
};
