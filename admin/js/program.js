// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  remove,
  get,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";

// Firebase config
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

// Fungsi error
function showError(message) {
  const div = document.createElement("div");
  div.className =
    "bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4";
  div.innerHTML = `<span class="block sm:inline">${message}</span>`;
  document.body.insertBefore(div, document.body.firstChild);
}

// Cek login
function isAuthenticated(user) {
  return user !== null && user !== undefined;
}

let program = [];

// Load data program dari Firebase
function loadProgramData() {
  const programRef = ref(database, "program");

  onValue(programRef, (snapshot) => {
    program = [];
    snapshot.forEach((childSnapshot) => {
      const programData = childSnapshot.val();
      programData.id = childSnapshot.key;
      program.push(programData);
    });

    // Sort by tanggalLulus (newest first)
    program.sort((a, b) => {
      const dateA = a.tanggalLulus ? new Date(a.tanggalLulus).getTime() : 0;
      const dateB = b.tanggalLulus ? new Date(b.tanggalLulus).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    });

    displayProgramData(program);
  });
}

// Menampilkan data program
function displayProgramData(data) {
  const tableBody = document.getElementById("program-table-body");
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML =
      '<tr><td colspan="9" class="px-4 py-3 text-center">Tidak ada data program</td></tr>';
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.className = "text-gray-700 dark:text-gray-400";

    const tanggalLulus = item.tanggalLulus
      ? new Date(item.tanggalLulus).toLocaleDateString("id-ID")
      : "-";

    row.innerHTML = `
            <td class="px-4 py-3">${index + 1}</td>
            <td class="px-4 py-3">${
              item.informasiPribadi?.namaLengkap || "-"
            }</td>
            <td class="px-4 py-3">${item.informasiPribadi?.nik || "-"}</td>
            <td class="px-4 py-3">${item.informasiPribadi?.noHP || "-"}</td>
            <td class="px-4 py-3">${
              item.pendidikanPekerjaan?.pendidikanTerakhir || "-"
            }</td>
            <td class="px-4 py-3">${item.paketPelatihan || "-"}</td>
            <td class="px-4 py-3">
                <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                    Lulus
                </span>
            </td>
            <td class="px-4 py-3">${tanggalLulus}</td>
            <td class="px-4 py-3">
                <button class="btn-detail px-3 py-1 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-blue-600 border border-transparent rounded-md active:bg-blue-600 hover:bg-blue-700 focus:outline-none focus:shadow-outline-blue" data-id="${
                  item.id
                }">
                    Detail
                </button>
            </td>
        `;

    tableBody.appendChild(row);
  });

  // Tambahkan event listener untuk tombol detail
  document.querySelectorAll(".btn-detail").forEach((button) => {
    button.addEventListener("click", function () {
      const programId = this.getAttribute("data-id");
      showProgramDetail(programId);
    });
  });
}

// Menampilkan detail program
function showProgramDetail(programId) {
  const programData = program.find((item) => item.id === programId);

  if (!programData) {
    console.error("Program tidak ditemukan");
    return;
  }

  const modalContent = document.getElementById("modal-program-content");
  const tanggalLulus = programData.tanggalLulus
    ? new Date(programData.tanggalLulus).toLocaleDateString("id-ID")
    : "-";

  modalContent.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <h4 class="text-lg font-semibold mb-2">Informasi Pribadi</h4>
            <p><span class="font-medium">Nama Lengkap:</span> ${
              programData.informasiPribadi?.namaLengkap || "-"
            }</p>
            <p><span class="font-medium">NIK:</span> ${
              programData.informasiPribadi?.nik || "-"
            }</p>
            <p><span class="font-medium">Tempat Lahir:</span> ${
              programData.informasiPribadi?.tempatLahir || "-"
            }</p>
            <p><span class="font-medium">Tanggal Lahir:</span> ${
              programData.informasiPribadi?.tanggalLahir || "-"
            }</p>
            <p><span class="font-medium">Jenis Kelamin:</span> ${
              programData.informasiPribadi?.jenisKelamin || "-"
            }</p>
            <p><span class="font-medium">No. HP:</span> ${
              programData.informasiPribadi?.noHP || "-"
            }</p>
            <p><span class="font-medium">Alamat:</span> ${
              programData.informasiPribadi?.alamat || "-"
            }</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-2">Pendidikan & Pekerjaan</h4>
            <p><span class="font-medium">Pendidikan Terakhir:</span> ${
              programData.pendidikanPekerjaan?.pendidikanTerakhir || "-"
            }</p>
            <p><span class="font-medium">Pekerjaan Saat Ini:</span> ${
              programData.pendidikanPekerjaan?.pekerjaanSaatIni || "-"
            }</p>
            
            <h4 class="text-lg font-semibold mt-4 mb-2">Paket Pelatihan</h4>
            <p><span class="font-medium">Paket:</span> ${
              programData.paketPelatihan || "-"
            }</p>
            
            <h4 class="text-lg font-semibold mt-4 mb-2">Motivasi & Referensi</h4>
            <p><span class="font-medium">Alasan Mengikuti:</span> ${
              programData.motivasiReferensi?.alasanMengikuti || "-"
            }</p>
            <p><span class="font-medium">Sumber Informasi:</span> ${
              programData.motivasiReferensi?.sumberInformasi || "-"
            }</p>
            <div>
                <p class="text-gray-600 dark:text-gray-400 font-semibold">Status</p>
                <p class="text-gray-900 dark:text-white">Lulus</p>
            </div>
            <div>
                <p class="text-gray-600 dark:text-gray-400 font-semibold">Tanggal Lulus</p>
                <p class="text-gray-900 dark:text-white">${tanggalLulus}</p>
            </div>
        </div>
        
    `;

  // Tampilkan modal dengan custom implementation
  const modal = document.getElementById("detailProgram");
  modal.classList.remove("hidden");
  modal.classList.add(
    "fixed",
    "inset-0",
    "z-50",
    "flex",
    "items-center",
    "justify-center",
    "bg-gray-900/30"
  );

  // Set event listener untuk tombol tutup modal
  const closeButtons = modal.querySelectorAll(
    "[data-modal-hide='detailProgram']"
  );
  closeButtons.forEach((button) => {
    button.onclick = function () {
      modal.classList.add("hidden");
    };
  });

  // Set event listener untuk tombol hapus
  document.getElementById("btn-hapus").onclick = function () {
    hapusProgram(programData.id);
  };
}

// Fungsi untuk menghapus data program
function hapusProgram(programId) {
  if (!programId) {
    console.error("ID program tidak valid");
    return;
  }

  if (confirm("Apakah Anda yakin ingin menghapus data program ini?")) {
    const programRef = ref(database, `program/${programId}`);

    remove(programRef)
      .then(() => {
        // Tutup modal
        const modal = document.getElementById("detailProgram");
        modal.classList.add("hidden");

        // Tampilkan pesan sukses
        alert("Data program berhasil dihapus");

        // Reload data program
        loadProgramData();
      })
      .catch((error) => {
        console.error("Error menghapus data program:", error);
        alert("Gagal menghapus data program. Silakan coba lagi.");
      });
  }
}

// Fungsi: Hapus semua data program
function deleteAllProgram() {
  const btn = document.getElementById("hapus-semua-program");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "Memproses...";
  }

  const programRef = ref(database, "program");
  get(programRef)
    .then((snapshot) => {
      if (!snapshot.exists()) {
        alert("Tidak ada data program.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Hapus Semua";
        }
        return;
      }

      // Kumpulkan semua item
      const allItems = [];
      snapshot.forEach((child) => {
        const data = child.val();
        allItems.push({ id: child.key, data });
      });

      if (allItems.length === 0) {
        alert("Tidak ada data program untuk dihapus.");
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Hapus Semua";
        }
        return;
      }

      // Meminta tanggal batas opsional
      const input = prompt(
        "Masukkan tanggal batas (YYYY-MM-DD) untuk menghapus data sebelum tanggal tersebut, atau kosongkan untuk menghapus semua:",
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

      // Tentukan item yang akan dihapus
      const itemsToDelete = cutoffDate
        ? allItems.filter((item) => {
            if (!item.data || !item.data.tanggalLulus) return false;
            const t = new Date(item.data.tanggalLulus);
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
        ? `Yakin menghapus ${itemsToDelete.length} data program sebelum ${input}?\nBackup akan dibuat dan diunduh.`
        : `Yakin menghapus ${itemsToDelete.length} data program?\nBackup akan dibuat dan diunduh.`;
      if (!confirm(confirmMessage)) {
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Hapus Semua";
        }
        return;
      }

      // Buat backup JSON dari data yang akan dihapus (setelah konfirmasi)
      const backupName = `program-backup-${new Date()
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
        const itemRef = ref(database, `program/${item.id}`);
        return remove(itemRef);
      });

      return Promise.allSettled(tasks).then((results) => {
        const successCount = results.filter(
          (r) => r.status === "fulfilled"
        ).length;
        const failCount = results.length - successCount;
        alert(
          `Berhasil menghapus ${successCount} data program.${
            failCount > 0 ? ` Gagal: ${failCount}.` : ""
          }`
        );
        loadProgramData();
        if (btn) {
          btn.disabled = false;
          btn.textContent = "Hapus Semua";
        }
      });
    })
    .catch((error) => {
      console.error("Error memproses Hapus Semua program:", error);
      alert("Gagal memproses Hapus Semua: " + error.message);
      if (btn) {
        btn.disabled = false;
        btn.textContent = "Hapus Semua";
      }
    });
}

// Fungsi filter data program
function filterProgramData(searchTerm) {
  if (!searchTerm) {
    displayProgramData(program);
    return;
  }

  searchTerm = searchTerm.toLowerCase();

  const filteredData = program.filter((item) => {
    return (
      item.informasiPribadi?.namaLengkap?.toLowerCase().includes(searchTerm) ||
      item.informasiPribadi?.nik?.toLowerCase().includes(searchTerm) ||
      item.informasiPribadi?.noHP?.toLowerCase().includes(searchTerm) ||
      item.pendidikanPekerjaan?.pendidikanTerakhir
        ?.toLowerCase()
        .includes(searchTerm) ||
      item.paketPelatihan?.toLowerCase().includes(searchTerm)
    );
  });

  displayProgramData(filteredData);
}

// Setup event listeners
function setupEventListeners() {
  // Event listener untuk pencarian
  const searchInput = document.getElementById("search-program");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      filterProgramData(this.value);
    });
  }

  // Tambahkan event listener untuk menutup modal ketika mengklik di luar modal
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("detailProgram");
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });

  // Event listener untuk tombol Hapus Semua Program
  const hapusSemuaBtn = document.getElementById("hapus-semua-program");
  if (hapusSemuaBtn) {
    hapusSemuaBtn.addEventListener("click", deleteAllProgram);
  }
}

// Inisialisasi saat halaman dimuat
document.addEventListener("DOMContentLoaded", function () {
  // Periksa status autentikasi
  auth.onAuthStateChanged(function (user) {
    if (isAuthenticated(user)) {
      loadProgramData();
      setupEventListeners();
    } else {
      showError("Anda harus login untuk mengakses halaman ini");
      setTimeout(() => {
        window.location.href = "../admin/login.html";
      }, 2000);
    }
  });
});
