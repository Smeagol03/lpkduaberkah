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

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", hitungJumlahPeserta);
