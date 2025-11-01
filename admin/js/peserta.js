// Import Firebase functions
import {
  getDatabase,
  ref,
  onValue,
  get,
  set,
  update,
  remove,
  push,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

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
let app;
let database;
let currentPesertaId = null;

function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log("Firebase initialized successfully");
  }
}

// Function to format date
function formatDate(dateString) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Function to load peserta data
function loadPesertaData() {
  const pesertaRef = ref(database, "peserta");
  onValue(pesertaRef, (snapshot) => {
    const data = snapshot.val();
    displayPesertaData(data);
  });
}

// Function to display peserta data
function displayPesertaData(data) {
  const tableBody = document.getElementById("peserta-table-body");
  tableBody.innerHTML = "";

  if (!data) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="8" class="px-4 py-3 text-center">Tidak ada data peserta</td>
      </tr>
    `;
    return;
  }

  Object.keys(data).forEach((key) => {
    const peserta = data[key];
    const row = document.createElement("tr");
    row.className = "text-gray-700 dark:text-gray-400";

    // Status badge
    let statusBadge = "";
    switch (peserta.statusPeserta) {
      case "aktif":
        statusBadge = `<span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full">Aktif</span>`;
        break;
      case "lulus":
        statusBadge = `<span class="px-2 py-1 font-semibold leading-tight text-blue-700 bg-blue-100 rounded-full">Lulus</span>`;
        break;
      case "tidak lulus":
        statusBadge = `<span class="px-2 py-1 font-semibold leading-tight text-red-700 bg-red-100 rounded-full">Tidak Lulus</span>`;
        break;
      default:
        statusBadge = `<span class="px-2 py-1 font-semibold leading-tight text-gray-700 bg-gray-100 rounded-full">Tidak Diketahui</span>`;
    }

    // Tampilkan data sesuai struktur 'pendaftar'
    row.innerHTML = `
      <td class="px-4 py-3">${peserta.informasiPribadi?.namaLengkap || "-"}</td>
      <td class="px-4 py-3">${peserta.informasiPribadi?.nik || "-"}</td>
      <td class="px-4 py-3">${peserta.informasiPribadi?.noHP || "-"}</td>
      <td class="px-4 py-3">${
        peserta.pendidikanPekerjaan?.pendidikanTerakhir || "-"
      }</td>
      <td class="px-4 py-3">${peserta.paketPelatihan || "-"}</td>
      <td class="px-4 py-3">${statusBadge}</td>
      <td class="px-4 py-3">${formatDate(peserta.tanggalDaftar)}</td>
      <td class="px-4 py-3">
        <button 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded text-xs"
          onclick="showPesertaDetail('${key}')"
        >
          Detail
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// Function to show peserta detail
function showPesertaDetail(id) {
  if (!id) return;

  currentPesertaId = id;
  const pesertaRef = ref(database, `peserta/${id}`);
  const detailPeserta = document.getElementById("detailPeserta");
  const modalContent = document.getElementById("modal-peserta-content");

  get(pesertaRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const peserta = snapshot.val();

        // Format data for display
        const pendidikan = peserta.pendidikan || {};
        const pekerjaan = peserta.pekerjaan || {};
        const paketPelatihan = peserta.paketPelatihan || {};

        // Build HTML content
        let content = `
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 class="text-lg font-semibold mb-2">Data Pribadi</h4>
              <p><span class="font-medium">Nama Lengkap:</span> ${
                peserta.informasiPribadi?.namaLengkap || "-"
              }</p>
              <p><span class="font-medium">NIK:</span> ${
                peserta.informasiPribadi?.nik || "-"
              }</p>
              <p><span class="font-medium">Tempat Lahir:</span> ${
                peserta.informasiPribadi?.tempatLahir || "-"
              }</p>
              <p><span class="font-medium">Tanggal Lahir:</span> ${formatDate(
                peserta.informasiPribadi?.tanggalLahir || "-"
              )}</p>
              <p><span class="font-medium">Jenis Kelamin:</span> ${
                peserta.informasiPribadi?.jenisKelamin || "-"
              }</p>
              <p><span class="font-medium">Alamat:</span> ${
                peserta.informasiPribadi?.alamat || "-"
              }</p>
              <p><span class="font-medium">No. HP:</span> ${
                peserta.informasiPribadi?.noHP || "-"
              }</p>
            </div>
            
            <div>
              <h4 class="text-lg font-semibold mb-2">Pendidikan dan Pekerjaan</h4>
              <p><span class="font-medium">Pendidikan Terakhir:</span> ${
                peserta.pendidikanPekerjaan?.pendidikanTerakhir || "-"
              }</p>
              <p><span class="font-medium">Pekerjaan Saat Ini:</span> ${
                peserta.pendidikanPekerjaan?.pekerjaanSaatIni || "-"
              }</p>
                        
            </div>
            <div class="mt-4">
            <h4 class="text-lg font-semibold mb-2">Paket Pelatihan</h4>
            <p><span class="font-medium">Nama Paket:</span> ${
              peserta.paketPelatihan || "-"
            }</p>
          </div>
          
          <div class="mt-4">
            <h4 class="text-lg font-semibold mb-2">Motivasi</h4>
            <p>${peserta.motivasiReferensi?.alasanMengikuti || "-"}</p>
            <p><span class="font-medium">Sumber Informasi:</span> ${
              peserta.motivasiReferensi?.sumberInformasi || "-"
            }</p>
          </div>
          
          <div class="mt-4">
            <h4 class="text-lg font-semibold mb-2">Status Peserta</h4>
            <p><span class="font-medium">Status:</span> ${
              peserta.statusPeserta || "-"
            }</p>
            <p><span class="font-medium">Tanggal Diterima:</span> ${formatDate(
              peserta.tanggalDiterima
            )}</p>
          </div>
          </div>
               
        `;

        modalContent.innerHTML = content;

        // Show modal using custom approach
        detailPeserta.classList.remove("hidden");
      } else {
        alert("Data peserta tidak ditemukan!");
      }

      detailPeserta.classList.add(
        "fixed",
        "inset-0",
        "z-50",
        "flex",
        "items-center",
        "justify-center",
        "bg-gray-900/30"
      );
    })
    .catch((error) => {
      console.error("Error getting peserta data:", error);
      alert("Gagal mengambil data peserta. Silakan coba lagi.");
    });
}

function hapusPeserta(id) {
  if (!id) return;

  // Konfirmasi penghapusan
  if (!confirm("Apakah Anda yakin ingin menghapus data peserta ini?")) {
    return;
  }

  const pesertaRef = ref(database, `peserta/${id}`);
  const detailPeserta = document.getElementById("detailPeserta");

  // Hapus data peserta dari database
  remove(pesertaRef)
    .then(() => {
      // Tampilkan pesan sukses
      alert("Data peserta berhasil dihapus!");

      // Tutup modal setelah notifikasi ditutup
      detailPeserta.classList.add("hidden");

      // Reset ID peserta saat ini
      currentPesertaId = null;

      // Muat ulang data peserta
      loadPesertaData();
    })
    .catch((error) => {
      console.error("Error menghapus data peserta:", error);
      alert("Gagal menghapus data peserta. Silakan coba lagi.");
    });
}

// Function to update peserta status to "lulus" and move to program database
function lulusPeserta(id) {
  if (!id) return;

  const pesertaRef = ref(database, `peserta/${id}`);
  const detailPeserta = document.getElementById("detailPeserta");

  // Get peserta data first
  get(pesertaRef)
    .then((snapshot) => {
      const pesertaData = snapshot.val();
      if (!pesertaData) {
        throw new Error("Data peserta tidak ditemukan");
      }

      // Add tanggalLulus to the data
      pesertaData.statusPeserta = "lulus";
      pesertaData.tanggalLulus = new Date().toISOString();

      // Create a reference to the program database
      const programRef = ref(database, "program");

      // Push data to program database
      return push(programRef, pesertaData).then(() => {
        // After successfully adding to program, remove from peserta
        return remove(pesertaRef);
      });
    })
    .then(() => {
      // Hide modal using custom approach
      detailPeserta.classList.add("hidden");

      // Show success message
      alert("Peserta berhasil dipindahkan ke database program!");

      // Reset current peserta ID
      currentPesertaId = null;

      // Reload peserta data
      loadPesertaData();
    })
    .catch((error) => {
      console.error("Error memindahkan peserta ke program:", error);
      alert("Gagal memindahkan peserta ke program. Silakan coba lagi.");
    });
}

// Function to update peserta status to "tidak lulus"
function tidakLulusPeserta(id) {
  if (!id) return;

  const pesertaRef = ref(database, `peserta/${id}`);
  const detailPeserta = document.getElementById("detailPeserta");

  // Update status to "tidak lulus"
  update(pesertaRef, {
    statusPeserta: "tidak lulus",
    tanggalTidakLulus: new Date().toISOString(),
  })
    .then(() => {
      // Hide modal using custom approach
      detailPeserta.classList.add("hidden");

      // Show success message
      alert("Status peserta berhasil diubah menjadi tidak lulus!");

      // Reset current peserta ID
      currentPesertaId = null;

      // Reload peserta data
      loadPesertaData();
    })
    .catch((error) => {
      console.error("Error updating peserta status:", error);
      alert("Gagal memperbarui status peserta. Silakan coba lagi.");
    });
}

// Function to filter peserta data
function filterPesertaData(searchTerm) {
  const pesertaRef = ref(database, "peserta");
  get(pesertaRef)
    .then((snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const filteredData = {};
      Object.keys(data).forEach((key) => {
        const peserta = data[key];
        // Search in multiple fields
        if (
          peserta.informasiPribadi?.namaLengkap
            ?.toLowerCase()
            .includes(searchTerm) ||
          peserta.informasiPribadi?.nik?.toLowerCase().includes(searchTerm) ||
          peserta.informasiPribadi?.noHP?.toLowerCase().includes(searchTerm) ||
          peserta.pendidikanPekerjaan?.pendidikanTerakhir
            ?.toLowerCase()
            .includes(searchTerm) ||
          peserta.paketPelatihan?.toLowerCase().includes(searchTerm) ||
          peserta.statusPeserta?.toLowerCase().includes(searchTerm) ||
          formatDate(peserta.tanggalDiterima)
            ?.toLowerCase()
            .includes(searchTerm)
        ) {
          filteredData[key] = peserta;
        }
      });

      displayPesertaData(filteredData);
    })
    .catch((error) => {
      console.error("Error filtering peserta data:", error);
    });
}

// Add event listeners when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase
  initializeFirebase();

  // Load peserta data
  loadPesertaData();

  // Ensure all event listeners are properly attached
  setupEventListeners();

  // Function to setup all event listeners
  function setupEventListeners() {
    // Add event listener for search input
    const searchInput = document.getElementById("search-peserta");
    if (searchInput) {
      searchInput.addEventListener("keyup", function () {
        const searchTerm = this.value.toLowerCase();
        filterPesertaData(searchTerm);
      });
    }

    // Add event listeners for modal close buttons
    const closeButtons = document.querySelectorAll(
      '[data-modal-hide="detailPeserta"]'
    );
    closeButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const detailPeserta = document.getElementById("detailPeserta");
        detailPeserta.classList.add("hidden");
      });
    });

    // Add event listeners for action buttons
    const btnLulus = document.getElementById("btn-validasi");
    if (btnLulus) {
      btnLulus.addEventListener("click", function () {
        lulusPeserta(currentPesertaId);
      });
    }

    const btnTidakLulus = document.getElementById("btn-tolak");
    if (btnTidakLulus) {
      btnTidakLulus.addEventListener("click", function () {
        tidakLulusPeserta(currentPesertaId);
      });
    }

    // Add event listener for hapus button
    const btnHapus = document.getElementById("btn-hapus");
    if (btnHapus) {
      btnHapus.addEventListener("click", function () {
        hapusPeserta(currentPesertaId);
      });
    }
  }
});

// Make functions available globally
window.showPesertaDetail = showPesertaDetail;
window.lulusPeserta = lulusPeserta;
window.tidakLulusPeserta = tidakLulusPeserta;
