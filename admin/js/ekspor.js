// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase configuration
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Fungsi untuk memeriksa apakah pengguna sudah login
function isAuthenticated(user) {
  return user !== null && user !== undefined;
}

// Fungsi umum untuk mengekspor data ke Excel
async function exportToExcel(path, headers, mapFunction, filename) {
  try {
    // Memeriksa status autentikasi terlebih dahulu
    const user = auth.currentUser;
    if (!isAuthenticated(user)) {
      alert("Anda harus login untuk mengekspor data");
      window.location.href = "../admin/login.html";
      return;
    }

    // Mengambil data langsung dari database
    const dataRef = ref(database, path);
    const snapshot = await get(dataRef);

    if (!snapshot.exists()) {
      alert(`Tidak ada data ${path} untuk diekspor`);
      return;
    }

    // Menyiapkan data baris
    const rows = [];
    snapshot.forEach((childSnapshot) => {
      const data = childSnapshot.val();
      const row = mapFunction(data, childSnapshot.key);
      rows.push(row);
    });

    // Membuat workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

    // Menambahkan worksheet ke workbook
    XLSX.utils.book_append_sheet(wb, ws, `Data ${path}`);

    // Menghasilkan file Excel dan mengunduhnya
    const today = new Date();
    const date = today.toISOString().split("T")[0]; // Format YYYY-MM-DD
    XLSX.writeFile(wb, `${filename}_${date}.xlsx`);
  } catch (error) {
    console.error(`Error exporting ${path} data:`, error);
    
    // Pesan error yang lebih informatif
    if (error.code === 'PERMISSION_DENIED') {
      alert(`Akses ditolak: Anda tidak memiliki izin untuk mengakses data ${path}. Silakan login kembali.`);
      // Redirect ke halaman login
      setTimeout(() => {
        window.location.href = "../admin/login.html";
      }, 2000);
    } else {
      alert(`Terjadi kesalahan saat mengekspor data ${path}: ${error.message}`);
    }
  }
}

// Fungsi untuk mengekspor data pendaftar
async function exportPendaftar() {
  const headers = [
    "Tanggal Daftar",
    "Nama Lengkap",
    "NIK",
    "Tempat Lahir",
    "Tanggal Lahir",
    "Jenis Kelamin",
    "Alamat",
    "No HP",
    "Pendidikan Terakhir",
    "Pekerjaan Saat Ini",
    "Paket Pelatihan",
    "Status Pendaftaran",
  ];

  const mapFunction = (data) => {
    // Format tanggal
    const registrationDate = data.tanggalDaftar
      ? new Date(data.tanggalDaftar).toLocaleDateString("id-ID")
      : "-";

    const tanggalLahir = data.informasiPribadi?.tanggalLahir || "-";

    return [
      registrationDate,
      data.informasiPribadi?.namaLengkap || "-",
      data.informasiPribadi?.nik || "-",
      data.informasiPribadi?.tempatLahir || "-",
      tanggalLahir,
      data.informasiPribadi?.jenisKelamin === "L"
        ? "Laki-laki"
        : data.informasiPribadi?.jenisKelamin === "P"
        ? "Perempuan"
        : "-",
      data.informasiPribadi?.alamat || "-",
      data.informasiPribadi?.noHP || "-",
      data.pendidikanPekerjaan?.pendidikanTerakhir || "-",
      data.pendidikanPekerjaan?.pekerjaanSaatIni || "-",
      data.paketPelatihan || "-",
      data.statusPendaftaran || "-",
    ];
  };

  await exportToExcel("pendaftar", headers, mapFunction, "Data_Pendaftar");
}

// Fungsi untuk mengekspor data peserta
async function exportPeserta() {
  const headers = [
    "Tanggal Daftar",
    "Tanggal Diterima",
    "Nama Lengkap",
    "NIK",
    "Tempat Lahir",
    "Tanggal Lahir",
    "Jenis Kelamin",
    "Alamat",
    "No HP",
    "Pendidikan Terakhir",
    "Pekerjaan Saat Ini",
    "Paket Pelatihan",
    "Status Peserta",
  ];

  const mapFunction = (data) => {
    // Format tanggal
    const registrationDate = data.tanggalDaftar
      ? new Date(data.tanggalDaftar).toLocaleDateString("id-ID")
      : "-";

    const acceptedDate = data.tanggalDiterima
      ? new Date(data.tanggalDiterima).toLocaleDateString("id-ID")
      : "-";

    const tanggalLahir = data.informasiPribadi?.tanggalLahir || "-";

    return [
      registrationDate,
      acceptedDate,
      data.informasiPribadi?.namaLengkap || "-",
      data.informasiPribadi?.nik || "-",
      data.informasiPribadi?.tempatLahir || "-",
      tanggalLahir,
      data.informasiPribadi?.jenisKelamin === "L"
        ? "Laki-laki"
        : data.informasiPribadi?.jenisKelamin === "P"
        ? "Perempuan"
        : "-",
      data.informasiPribadi?.alamat || "-",
      data.informasiPribadi?.noHP || "-",
      data.pendidikanPekerjaan?.pendidikanTerakhir || "-",
      data.pendidikanPekerjaan?.pekerjaanSaatIni || "-",
      data.paketPelatihan || "-",
      data.statusPeserta || "-",
    ];
  };

  await exportToExcel("peserta", headers, mapFunction, "Data_Peserta");
}

// Fungsi untuk mengekspor data program
async function exportProgram() {
  const headers = [
    "Tanggal Daftar",
    "Tanggal Diterima",
    "Tanggal Lulus",
    "Nama Lengkap",
    "NIK",
    "Tempat Lahir",
    "Tanggal Lahir",
    "Jenis Kelamin",
    "Alamat",
    "No HP",
    "Pendidikan Terakhir",
    "Pekerjaan Saat Ini",
    "Paket Pelatihan",
    "Status Peserta",
  ];

  const mapFunction = (data) => {
    // Format tanggal
    const registrationDate = data.tanggalDaftar
      ? new Date(data.tanggalDaftar).toLocaleDateString("id-ID")
      : "-";

    const acceptedDate = data.tanggalDiterima
      ? new Date(data.tanggalDiterima).toLocaleDateString("id-ID")
      : "-";

    const graduationDate = data.tanggalLulus
      ? new Date(data.tanggalLulus).toLocaleDateString("id-ID")
      : "-";

    const tanggalLahir = data.informasiPribadi?.tanggalLahir || "-";

    return [
      registrationDate,
      acceptedDate,
      graduationDate,
      data.informasiPribadi?.namaLengkap || "-",
      data.informasiPribadi?.nik || "-",
      data.informasiPribadi?.tempatLahir || "-",
      tanggalLahir,
      data.informasiPribadi?.jenisKelamin === "L"
        ? "Laki-laki"
        : data.informasiPribadi?.jenisKelamin === "P"
        ? "Perempuan"
        : "-",
      data.informasiPribadi?.alamat || "-",
      data.informasiPribadi?.noHP || "-",
      data.pendidikanPekerjaan?.pendidikanTerakhir || "-",
      data.pendidikanPekerjaan?.pekerjaanSaatIni || "-",
      data.paketPelatihan || "-",
      data.statusPeserta || "-",
    ];
  };

  await exportToExcel("program", headers, mapFunction, "Data_Program");
}

// Menambahkan event listener saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  // Menambahkan script SheetJS (xlsx.full.min.js)
  const script = document.createElement("script");
  script.src =
    "https://cdn.sheetjs.com/xlsx-0.19.3/package/dist/xlsx.full.min.js";
  script.async = true;
  document.head.appendChild(script);

  // Menambahkan event listener untuk tombol ekspor pendaftar
  const exportPendaftarButton = document.getElementById("ekspor-pendaftar");
  if (exportPendaftarButton) {
    exportPendaftarButton.addEventListener("click", exportPendaftar);
  }

  // Menambahkan event listener untuk tombol ekspor peserta
  const exportPesertaButton = document.getElementById("ekspor-peserta");
  if (exportPesertaButton) {
    exportPesertaButton.addEventListener("click", exportPeserta);
  }

  // Menambahkan event listener untuk tombol ekspor program
  const exportProgramButton = document.getElementById("ekspor-program");
  if (exportProgramButton) {
    exportProgramButton.addEventListener("click", exportProgram);
  }
});
