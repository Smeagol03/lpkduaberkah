import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAx0MtM4P-TRSltbW1lZd_QRQRSQL46zHw",
  authDomain: "lpkduaberkah-59a86.firebaseapp.com",
  databaseURL:
    "https://lpkduaberkah-59a86-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lpkduaberkah-59a86",
  storageBucket: "lpkduaberkah-59a86.firebasestorage.app",
  messagingSenderId: "210265967961",
  appId: "1:210265967961:web:3a2bf936fae3453031d048",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Fungsi untuk menampilkan pesan error
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className =
    "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4";
  errorDiv.innerHTML = `<span class="block sm:inline">${message}</span>`;
  document.body.insertBefore(errorDiv, document.body.firstChild);
}

// Fungsi untuk memeriksa apakah pengguna sudah login
function isAuthenticated(user) {
  return user !== null && user !== undefined;
}

// Fungsi untuk menampilkan username pengguna
function displayUsername(user) {
  const usernameElement = document.getElementById("username-display");
  if (usernameElement && user) {
    // Menggunakan email sebagai username (atau nama jika tersedia)
    const displayName = user.displayName || user.email.split("@")[0];
    usernameElement.textContent = displayName;
  }
}

// Fungsi untuk mengambil jumlah peserta dari database
function hitungJumlahPeserta(user) {
  if (!isAuthenticated(user)) {
    showError("Anda harus login untuk mengakses data");
    return;
  }

  const pesertaRef = ref(database, "peserta");

  onValue(
    pesertaRef,
    (snapshot) => {
      const data = snapshot.val();
      let jumlahPeserta = 0;

      if (data) {
        jumlahPeserta = Object.keys(data).length;
      }

      // Menampilkan jumlah peserta di elemen dengan id 'total-siswa'
      document.getElementById("total-siswa").textContent = jumlahPeserta;
    },
    (error) => {
      console.error("Error membaca data peserta:", error);
      showError("Gagal membaca data peserta: " + error.message);
    }
  );
}

function hitungJumlahPendaftar(user) {
  if (!isAuthenticated(user)) {
    showError("Anda harus login untuk mengakses data");
    return;
  }

  const pendaftarRef = ref(database, "pendaftar");

  onValue(
    pendaftarRef,
    (snapshot) => {
      const data = snapshot.val();
      let jumlahPendaftar = 0;

      if (data) {
        jumlahPendaftar = Object.keys(data).length;
      }

      // Menampilkan jumlah pendaftar di elemen dengan id 'total-pendaftar'
      document.getElementById("total-pendaftar").textContent = jumlahPendaftar;
    },
    (error) => {
      console.error("Error membaca data pendaftar:", error);
      showError("Gagal membaca data pendaftar: " + error.message);
    }
  );
}

function hitungJumlahPesertaPerPaket(user) {
  if (!isAuthenticated(user)) {
    showError("Anda harus login untuk mengakses data");
    return;
  }

  const pesertaRef = ref(database, "peserta");

  onValue(
    pesertaRef,
    (snapshot) => {
      const data = snapshot.val();

      // Awali semua paket dengan 0
      const paketCount = {
        paket1: 0,
        paket2: 0,
        paket3: 0,
        paket4: 0,
        paket5: 0,
      };

      // Jika ada data peserta
      if (data) {
        Object.keys(data).forEach((key) => {
          const peserta = data[key];
          const paket = peserta.paketPelatihan;

          if (paket && paketCount.hasOwnProperty(paket)) {
            paketCount[paket]++;
          }
        });
      }

      // Update tampilan ke tabel HTML
      for (let i = 1; i <= 5; i++) {
        document.getElementById(`total-paket-${i}`).textContent =
          paketCount[`paket${i}`];
      }
    },
    (error) => {
      console.error("Error membaca data peserta per paket:", error);
      showError("Gagal membaca data peserta per paket: " + error.message);
    }
  );
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  onAuthStateChanged(auth, (user) => {
    if (isAuthenticated(user)) {
      // Menampilkan username pengguna yang login
      displayUsername(user);
      hitungJumlahPeserta(user);
      hitungJumlahPendaftar(user);
      hitungJumlahPesertaPerPaket(user);
    } else {
      showError("Anda harus login untuk mengakses dashboard");
      setTimeout(() => {
        window.location.href = "../admin/login.html";
      }, 2000);
    }
  });
});
