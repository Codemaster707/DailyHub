import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyBxUwx13V37k1wLZstt_-8DnbAsq5SlTeE",
  authDomain: "dailyhub-d16c8.firebaseapp.com",
  projectId: "dailyhub-d16c8",
  storageBucket: "dailyhub-d16c8.firebasestorage.app",
  messagingSenderId: "430767248900",
  appId: "1:430767248900:web:c334a52d3ed147711dc751"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

/* DOM */
const email = document.getElementById("email");
const password = document.getElementById("password");
const msg = document.getElementById("msg");

/* ================= SIGN UP ================= */
window.signUp = function () {
  if (!email.value || !password.value) {
    msg.innerText = "Email and password required";
    return;
  }

  if (password.value.length < 6) {
    msg.innerText = "Password must be at least 6 characters";
    return;
  }

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      msg.innerText = err.message;
    });
};

/* ================= LOGIN ================= */
window.login = function () {
  if (!email.value || !password.value) {
    msg.innerText = "Enter email and password";
    return;
  }

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(() => {
      msg.innerText = "Incorrect email or password";
    });
};

/* ================= GOOGLE ================= */
window.googleLogin = function () {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch(err => {
      msg.innerText = err.message;
    });
};