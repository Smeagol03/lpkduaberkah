import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

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

// Fungsi untuk mengambil jumlah peserta dari database
function hitungJumlahPeserta() {
  const pesertaRef = ref(database, "peserta");

  onValue(pesertaRef, (snapshot) => {
    const data = snapshot.val();
    let jumlahPeserta = 0;

    if (data) {
      jumlahPeserta = Object.keys(data).length;
    }

    // Menampilkan jumlah peserta di elemen dengan id 'total-siswa'
    document.getElementById("total-siswa").textContent = jumlahPeserta;
  });
}

function hitungJumlahPendaftar() {
  const pendaftarRef = ref(database, "pendaftar");

  onValue(pendaftarRef, (snapshot) => {
    const data = snapshot.val();
    let jumlahPendaftar = 0;

    if (data) {
      jumlahPendaftar = Object.keys(data).length;
    }

    // Menampilkan jumlah pendaftar di elemen dengan id 'total-pendaftar'
    document.getElementById("total-pendaftar").textContent = jumlahPendaftar;
  });
}

function hitungJumlahPesertaPerPaket() {
  const pesertaRef = ref(database, "peserta");

  onValue(pesertaRef, (snapshot) => {
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
  });
}

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", hitungJumlahPeserta);
document.addEventListener("DOMContentLoaded", hitungJumlahPendaftar);
document.addEventListener("DOMContentLoaded", hitungJumlahPesertaPerPaket);
