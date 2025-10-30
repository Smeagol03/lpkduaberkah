// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";

// Firebase configuration from login.js
const firebaseConfig = {
  apiKey: "AIzaSyAx0MtM4P-TRSltbW1lZd_QRQRSQL46zHw",
  authDomain: "lpkduaberkah-59a86.firebaseapp.com",
  projectId: "lpkduaberkah-59a86",
  storageBucket: "lpkduaberkah-59a86.firebasestorage.app",
  messagingSenderId: "210265967961",
  appId: "1:210265967961:web:3a2bf936fae3453031d048",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Handle login form submission
window.handleLogin = function(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  // Show loading state
  const submitButton = event.target.querySelector('button[type="submit"]');
  const originalText = submitButton.textContent;
  submitButton.textContent = "Memproses...";
  submitButton.disabled = true;
  
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Login successful
      const user = userCredential.user;
      console.log("Login berhasil:", user);
      
      // Redirect to dashboard
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      // Handle errors
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error("Login gagal:", errorCode, errorMessage);
      
      // Show error message
      alert("Login gagal: " + getErrorMessage(errorCode));
      
      // Reset button
      submitButton.textContent = originalText;
      submitButton.disabled = false;
    });
};

// Toggle password visibility
window.togglePassword = function() {
  const passwordInput = document.getElementById('password');
  const eyeIcon = document.getElementById('eyeIcon');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    eyeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    `;
  } else {
    passwordInput.type = 'password';
    eyeIcon.innerHTML = `
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    `;
  }
};

// Helper function to get user-friendly error messages
function getErrorMessage(errorCode) {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Format email tidak valid';
    case 'auth/user-disabled':
      return 'Akun ini telah dinonaktifkan';
    case 'auth/user-not-found':
      return 'Email tidak terdaftar';
    case 'auth/wrong-password':
      return 'Password salah';
    case 'auth/too-many-requests':
      return 'Terlalu banyak percobaan login. Coba lagi nanti';
    default:
      return 'Terjadi kesalahan. Silakan coba lagi';
  }
}

// Check authentication state
function checkAuthState() {
  onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (user) {
      // User is signed in
      if (currentPage === 'login.html') {
        // If on login page, redirect to dashboard
        window.location.href = 'dashboard.html';
      }
    } else {
      // User is signed out
      if (currentPage === 'dashboard.html') {
        // If on dashboard page, redirect to login
        window.location.href = 'login.html';
      }
    }
  });
}

// Logout function
window.handleLogout = function() {
  signOut(auth).then(() => {
    // Sign-out successful, redirect to login page
    window.location.href = 'login.html';
  }).catch((error) => {
    // An error happened
    console.error("Logout error:", error);
  });
};

// Check auth state when page loads
document.addEventListener('DOMContentLoaded', checkAuthState);