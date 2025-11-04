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
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

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
let auth;
let currentPesertaId = null;

function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    auth = getAuth(app);
    console.log("Firebase initialized successfully");
  }
}

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
        <td colspan="9" class="px-4 py-3 text-center">Tidak ada data peserta</td>
      </tr>
    `;
    return;
  }

  // Convert object to array for sorting
  const pesertaArray = Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));

  // Sort by tanggalDiterima (newest first)
  pesertaArray.sort((a, b) => {
    const dateA = a.tanggalDiterima ? new Date(a.tanggalDiterima).getTime() : 0;
    const dateB = b.tanggalDiterima ? new Date(b.tanggalDiterima).getTime() : 0;
    return dateB - dateA; // Descending order (newest first)
  });

  // Display sorted data with row numbers
  pesertaArray.forEach((peserta, index) => {
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
      <td class="px-4 py-3">${index + 1}</td>
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
          onclick="showPesertaDetail('${peserta.id}')"
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

  // Periksa status autentikasi
  onAuthStateChanged(auth, (user) => {
    if (isAuthenticated(user)) {
      // Load peserta data
      loadPesertaData();

      // Ensure all event listeners are properly attached
      setupEventListeners();

      // Add event listeners for batch buttons
      const terimaSemuaBtn = document.getElementById("terima-semua-peserta");
      const luluskanSemuaBtn = document.getElementById(
        "luluskan-semua-peserta"
      );
      const tolakSemuaBtn = document.getElementById("tolak-semua-peserta");
      const hapusSemuaBtn = document.getElementById("hapus-semua-peserta");

      if (terimaSemuaBtn) {
        terimaSemuaBtn.addEventListener("click", graduateAllPeserta);
      }
      if (luluskanSemuaBtn) {
        luluskanSemuaBtn.addEventListener("click", activateAllPeserta);
      }

      if (tolakSemuaBtn) {
        tolakSemuaBtn.addEventListener("click", failAllPeserta);
      }

      if (hapusSemuaBtn) {
        hapusSemuaBtn.addEventListener("click", deleteAllPeserta);
      }
    } else {
      showError("Anda harus login untuk mengakses halaman ini");
      setTimeout(() => {
        window.location.href = "../admin/login.html";
      }, 2000);
    }
  });

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

// Fungsi: Terima semua peserta aktif (pindah ke program)
function graduateAllPeserta() {
  const btn = document.getElementById("terima-semua-peserta");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Memproses...";
  }

  const pesertaRef = ref(database, "peserta");
  get(pesertaRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        alert("Tidak ada data peserta.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Terima Semua";
        }
        return;
      }

      // Collect active peserta
      const activePeserta = [];
      snapshot.forEach((child) => {
        const data = child.val();
        if (data && data.statusPeserta === "aktif") {
          activePeserta.push({
            id: child.key,
            data: data,
          });
        }
      });

      if (activePeserta.length === 0) {
        alert("Tidak ada peserta aktif untuk diluluskan.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Terima Semua";
        }
        return;
      }

      // Confirmation dialog
      const confirmMessage = `Yakin meluluskan ${activePeserta.length} peserta aktif? Tindakan ini akan memindahkan mereka ke database program dan menghapus dari peserta.`;
      if (!confirm(confirmMessage)) {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Terima Semua";
        }
        return;
      }

      // Process each peserta
      const tasks = activePeserta.map((peserta) => {
        const programData = {
          ...peserta.data,
          statusPeserta: "lulus",
          tanggalLulus: new Date().toISOString(),
        };

        const programRef = ref(database, "program");
        const newProgramRef = push(programRef);
        const pesertaItemRef = ref(database, `peserta/${peserta.id}`);

        // Save to program then remove from peserta
        return set(newProgramRef, programData).then(() =>
          remove(pesertaItemRef)
        );
      });

      return Promise.allSettled(tasks).then((results) => {
        const successCount = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failCount = results.length - successCount;
        alert(
          `Berhasil meluluskan ${successCount} peserta.${
            failCount > 0 ? ` Gagal: ${failCount}.` : ""
          }`
        );
        loadPesertaData();
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Terima Semua";
        }
      });
    })
    .catch((error) => {
      console.error("Error memproses Terima Semua:", error);
      alert("Gagal memproses Terima Semua: " + error.message);
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Terima Semua";
      }
    });
}

// Fungsi: Tolak semua peserta aktif (ubah status tidak lulus)
function failAllPeserta() {
  const btn = document.getElementById("tolak-semua-peserta");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Memproses...";
  }

  const pesertaRef = ref(database, "peserta");
  get(pesertaRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        alert("Tidak ada data peserta.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Tolak Semua";
        }
        return;
      }

      // Collect active peserta
      const activePeserta = [];
      snapshot.forEach((child) => {
        const data = child.val();
        if (data && data.statusPeserta === "aktif") {
          activePeserta.push({
            id: child.key,
            data: data,
          });
        }
      });

      if (activePeserta.length === 0) {
        alert("Tidak ada peserta aktif untuk diubah statusnya.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Tolak Semua";
        }
        return;
      }

      // Confirmation dialog
      const confirmMessage = `Yakin mengubah status ${activePeserta.length} peserta aktif menjadi tidak lulus? Tindakan ini tidak dapat dibatalkan.`;
      if (!confirm(confirmMessage)) {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Tolak Semua";
        }
        return;
      }

      // Process each peserta
      const tasks = activePeserta.map((peserta) => {
        const pesertaItemRef = ref(database, `peserta/${peserta.id}`);
        return update(pesertaItemRef, {
          statusPeserta: "tidak lulus",
          tanggalTidakLulus: new Date().toISOString(),
        });
      });

      return Promise.allSettled(tasks).then((results) => {
        const successCount = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failCount = results.length - successCount;
        alert(
          `Berhasil mengubah status ${successCount} peserta menjadi tidak lulus.${
            failCount > 0 ? ` Gagal: ${failCount}.` : ""
          }`
        );
        loadPesertaData();
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Tolak Semua";
        }
      });
    })
    .catch((error) => {
      console.error("Error memproses Tolak Semua:", error);
      alert("Gagal memproses Tolak Semua: " + error.message);
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Tolak Semua";
      }
    });
}

// Fungsi: Aktifkan semua peserta (set statusPeserta menjadi 'aktif')
function activateAllPeserta() {
  const btn = document.getElementById("luluskan-semua-peserta");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Memproses...";
  }

  const pesertaRef = ref(database, "peserta");
  get(pesertaRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        alert("Tidak ada data peserta.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Luluskan Semua";
        }
        return;
      }

      const toActivate = [];
      snapshot.forEach((child) => {
        const data = child.val();
        // Kumpulkan semua peserta yang statusnya bukan 'aktif'
        if (!data || data.statusPeserta !== "aktif") {
          toActivate.push({ id: child.key, data });
        }
      });

      if (toActivate.length === 0) {
        alert("Semua peserta sudah berstatus aktif.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Luluskan Semua";
        }
        return;
      }

      // Konfirmasi sebelum eksekusi
      const confirmMessage = `Yakin mengaktifkan ${toActivate.length} peserta? Status akan diubah menjadi 'aktif'.`;
      if (!confirm(confirmMessage)) {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Luluskan Semua";
        }
        return;
      }

      const tasks = toActivate.map((p) => {
        const pesertaItemRef = ref(database, `peserta/${p.id}`);
        const payload = {
          statusPeserta: "aktif",
        };
        // Jika belum ada tanggalDiterima, set sekarang
        if (!p.data || !p.data.tanggalDiterima) {
          payload.tanggalDiterima = new Date().toISOString();
        }
        // Hapus tanggalTidakLulus atau tanggalLulus jika ada
        payload.tanggalTidakLulus = null;
        payload.tanggalLulus = null;
        return update(pesertaItemRef, payload);
      });

      return Promise.allSettled(tasks).then((results) => {
        const successCount = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failCount = results.length - successCount;
        alert(
          `Berhasil mengaktifkan ${successCount} peserta.${
            failCount > 0 ? ` Gagal: ${failCount}.` : ""
          }`
        );
        loadPesertaData();
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Luluskan Semua";
        }
      });
    })
    .catch((error) => {
      console.error("Error memproses Aktifkan Semua:", error);
      alert("Gagal memproses Aktifkan Semua: " + error.message);
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Luluskan Semua";
      }
    });
}

// Fungsi: Hapus semua peserta (dengan cutoff tanggal & backup JSON)
function deleteAllPeserta() {
  const btn = document.getElementById("hapus-semua-peserta");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Memproses...";
  }

  const pesertaRef = ref(database, "peserta");
  get(pesertaRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        alert("Tidak ada data peserta.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Hapus Semua";
        }
        return;
      }

      // Kumpulkan semua item peserta
      const allItems = [];
      snapshot.forEach((child) => {
        const data = child.val();
        allItems.push({ id: child.key, data });
      });

      if (allItems.length === 0) {
        alert("Tidak ada data peserta untuk dihapus.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Hapus Semua";
        }
        return;
      }

      // Meminta tanggal batas opsional
      const input = prompt(
        "Masukkan tanggal batas (YYYY-MM-DD) untuk menghapus peserta yang diterima sebelum tanggal tersebut, atau kosongkan untuk menghapus semua:",
        ""
      );

      let cutoffDate = null;
      if (input && input.trim() !== "") {
        const parsed = new Date(input.trim() + "T00:00:00");
        if (isNaN(parsed.getTime())) {
          alert("Format tanggal tidak valid. Gunakan format YYYY-MM-DD.");
          if (btn) {
            btn.disabled = false;
            btn.textContent = "Hapus Semua";
          }
          return;
        }
        cutoffDate = parsed;
      }

      // Tentukan item yang akan dihapus (berdasarkan tanggalDiterima jika tersedia)
      const itemsToDelete = cutoffDate
        ? allItems.filter((item) => {
            const tStr = item.data?.tanggalDiterima;
            if (!tStr) return false;
            const t = new Date(tStr);
            return !isNaN(t.getTime()) && t < cutoffDate;
          })
        : allItems;

      if (itemsToDelete.length === 0) {
        alert("Tidak ada data yang memenuhi kriteria untuk dihapus.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Hapus Semua";
        }
        return;
      }

      // Konfirmasi akhir sebelum menghapus (backup akan dibuat setelah konfirmasi)
      const confirmMessage = cutoffDate
        ? `Yakin menghapus ${itemsToDelete.length} peserta yang diterima sebelum ${input}?\nBackup akan dibuat dan diunduh.`
        : `Yakin menghapus ${itemsToDelete.length} peserta?\nBackup akan dibuat dan diunduh.`;
      if (!confirm(confirmMessage)) {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Hapus Semua";
        }
        return;
      }

      // Buat backup JSON dari data yang akan dihapus (setelah konfirmasi)
      const backupName = `peserta-backup-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.json`;
      const backupContent = itemsToDelete.map((it) => ({
        id: it.id,
        ...it.data,
      }));
      (function downloadJson(filename, content) {
        const blob = new Blob([JSON.stringify(content, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      })(backupName, backupContent);

      // Eksekusi penghapusan
      const tasks = itemsToDelete.map((item) => {
        const itemRef = ref(database, `peserta/${item.id}`);
        return remove(itemRef);
      });

      return Promise.allSettled(tasks).then((results) => {
        const successCount = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failCount = results.length - successCount;
        alert(
          `Berhasil menghapus ${successCount} data peserta.${
            failCount > 0 ? ` Gagal: ${failCount}.` : ""
          }`
        );
        loadPesertaData();
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Hapus Semua";
        }
      });
    })
    .catch((error) => {
      console.error("Error memproses Hapus Semua:", error);
      alert("Gagal memproses Hapus Semua: " + error.message);
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Hapus Semua";
      }
    });
}

// Make functions available globally
window.showPesertaDetail = showPesertaDetail;
window.lulusPeserta = lulusPeserta;
window.tidakLulusPeserta = tidakLulusPeserta;
window.graduateAllPeserta = graduateAllPeserta;
window.failAllPeserta = failAllPeserta;
window.deleteAllPeserta = deleteAllPeserta;
