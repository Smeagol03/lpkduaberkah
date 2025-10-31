// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  update,
  get,
  set,
  push,
} from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";

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

// Global variable to store current pendaftar ID
let currentPendaftarId = null;

// Function to load and display pendaftar data
function loadPendaftarData() {
  const tableBody = document.getElementById("pendaftar-table-body");
  const registrationsRef = ref(database, "pendaftar");

  onValue(registrationsRef, (snapshot) => {
    // Clear existing table data
    tableBody.innerHTML = "";

    // Check if data exists
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const registrationId = childSnapshot.key;
        const data = childSnapshot.val();

        // Skip if not in "menunggu" status
        if (data.statusPendaftaran !== "menunggu") return;

        // Create table row
        const row = document.createElement("tr");
        row.className = "text-gray-700 dark:text-gray-400";

        // Format date
        const registrationDate = data.tanggalDaftar
          ? new Date(data.tanggalDaftar).toLocaleDateString("id-ID")
          : "-";

        // Create table cells
        row.innerHTML = `
          <td class="px-4 py-3">${
            data.informasiPribadi?.namaLengkap || "-"
          }</td>
          <td class="px-4 py-3">${data.informasiPribadi?.nik || "-"}</td>
          <td class="px-4 py-3">${data.informasiPribadi?.noHP || "-"}</td>
          <td class="px-4 py-3">${
            data.pendidikanPekerjaan?.pendidikanTerakhir || "-"
          }</td>
          <td class="px-4 py-3">${data.paketPelatihan || "-"}</td>
          <td class="px-4 py-3">
            <span class="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:bg-orange-700 dark:text-orange-100">
              Menunggu
            </span>
          </td>
          <td class="px-4 py-3">${registrationDate}</td>
          <td class="px-4 py-3">
            <div class="flex items-center space-x-4 text-sm">
              <button
                class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray btn-detail"
                aria-label="Detail"
                data-id="${registrationId}"
                data-modal-target="detailModal"
                data-modal-toggle="detailModal">
                <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"></path>
                </svg>
              </button>
            </div>
          </td>
        `;

        tableBody.appendChild(row);
      });

      // Add event listeners to detail buttons
      document.querySelectorAll(".btn-detail").forEach((button) => {
        button.addEventListener("click", () => {
          const id = button.getAttribute("data-id");
          showPendaftarDetail(id);
        });
      });
    } else {
      // No data
      const emptyRow = document.createElement("tr");
      emptyRow.className = "text-gray-700 dark:text-gray-400";
      emptyRow.innerHTML = `
        <td class="px-4 py-3 text-center" colspan="8">
          Belum ada data pendaftar
        </td>
      `;
      tableBody.appendChild(emptyRow);
    }
  });
}

// Function to show pendaftar detail in modal
function showPendaftarDetail(id) {
  currentPendaftarId = id;
  const pendaftarRef = ref(database, `pendaftar/${id}`);

  get(pendaftarRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();
      const modalContent = document.getElementById("modal-content");
      const modalTitle = document.getElementById("modal-title");
      const detailModal = document.getElementById("detailModal");

      // Set modal title
      modalTitle.textContent = `Detail Pendaftar: ${
        data.informasiPribadi?.namaLengkap || "Tidak ada nama"
      }`;

      // Format date
      const registrationDate = data.tanggalDaftar
        ? new Date(data.tanggalDaftar).toLocaleDateString("id-ID")
        : "-";

      // Build detail content
      let detailHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 class="text-lg font-semibold mb-2">Informasi Pribadi</h4>
            <p><span class="font-medium">Nama Lengkap:</span> ${
              data.informasiPribadi?.namaLengkap || "-"
            }</p>
            <p><span class="font-medium">NIK:</span> ${
              data.informasiPribadi?.nik || "-"
            }</p>
            <p><span class="font-medium">Tempat Lahir:</span> ${
              data.informasiPribadi?.tempatLahir || "-"
            }</p>
            <p><span class="font-medium">Tanggal Lahir:</span> ${
              data.informasiPribadi?.tanggalLahir || "-"
            }</p>
            <p><span class="font-medium">Jenis Kelamin:</span> ${
              data.informasiPribadi?.jenisKelamin || "-"
            }</p>
            <p><span class="font-medium">No. HP:</span> ${
              data.informasiPribadi?.noHP || "-"
            }</p>
            <p><span class="font-medium">Alamat:</span> ${
              data.informasiPribadi?.alamat || "-"
            }</p>
          </div>
          <div>
            <h4 class="text-lg font-semibold mb-2">Pendidikan & Pekerjaan</h4>
            <p><span class="font-medium">Pendidikan Terakhir:</span> ${
              data.pendidikanPekerjaan?.pendidikanTerakhir || "-"
            }</p>
            <p><span class="font-medium">Pekerjaan Saat Ini:</span> ${
              data.pendidikanPekerjaan?.pekerjaanSaatIni || "-"
            }</p>
            
            <h4 class="text-lg font-semibold mt-4 mb-2">Paket Pelatihan</h4>
            <p><span class="font-medium">Paket:</span> ${
              data.paketPelatihan || "-"
            }</p>
            
            <h4 class="text-lg font-semibold mt-4 mb-2">Motivasi & Referensi</h4>
            <p><span class="font-medium">Alasan Mengikuti:</span> ${
              data.motivasiReferensi?.alasanMengikuti || "-"
            }</p>
            <p><span class="font-medium">Sumber Informasi:</span> ${
              data.motivasiReferensi?.sumberInformasi || "-"
            }</p>
            
            <h4 class="text-lg font-semibold mt-4 mb-2">Informasi Pendaftaran</h4>
            <p><span class="font-medium">Status:</span> 
              <span class="px-2 py-1 font-semibold leading-tight text-orange-700 bg-orange-100 rounded-full dark:bg-orange-700 dark:text-orange-100">
                Menunggu
              </span>
            </p>
            <p><span class="font-medium">Tanggal Daftar:</span> ${registrationDate}</p>
          </div>
        </div>
      `;

      modalContent.innerHTML = detailHTML;

      // Show modal centered on screen
      detailModal.classList.remove("hidden");
      detailModal.classList.add(
        "fixed",
        "inset-0",
        "z-50",
        "flex",
        "items-center",
        "justify-center",
        "bg-gray-900/30"
      );
    }
  });
}

// Function to validate pendaftar
function validatePendaftar(id) {
  if (!id) return;

  const pendaftarRef = ref(database, `pendaftar/${id}`);
  const detailModal = document.getElementById("detailModal");

  // Get pendaftar data first
  get(pendaftarRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const pendaftarData = snapshot.val();

        // Create new peserta entry with status aktif
        const pesertaData = {
          ...pendaftarData,
          statusPeserta: "aktif",
          tanggalDiterima: new Date().toISOString(),
        };

        // Generate a new key for peserta
        const pesertaRef = ref(database, "peserta");
        const newPesertaRef = push(pesertaRef);

        // Save to peserta database
        set(newPesertaRef, pesertaData)
          .then(() => {
            // Update status to "diterima" in pendaftar database
            update(pendaftarRef, {
              statusPendaftaran: "diterima",
            })
              .then(() => {
                // Hide modal using custom approach
                detailModal.classList.add("hidden");

                // Show success message
                alert(
                  "Pendaftar berhasil divalidasi dan dipindahkan ke database peserta!"
                );

                // Reset current pendaftar ID
                currentPendaftarId = null;

                // Reload pendaftar data
                loadPendaftarData();
              })
              .catch((error) => {
                console.error("Error updating pendaftar status:", error);
                alert("Gagal memperbarui status pendaftar. Silakan coba lagi.");
              });
          })
          .catch((error) => {
            console.error("Error saving to peserta database:", error);
            alert(
              "Gagal menyimpan data ke database peserta. Silakan coba lagi."
            );
          });
      } else {
        alert("Data pendaftar tidak ditemukan!");
      }
    })
    .catch((error) => {
      console.error("Error getting pendaftar data:", error);
      alert("Gagal mengambil data pendaftar. Silakan coba lagi.");
    });
}

// Function to reject pendaftar
function rejectPendaftar(id) {
  if (!id) return;

  const pendaftarRef = ref(database, `pendaftar/${id}`);
  const detailModal = document.getElementById("detailModal");

  // Update status to "ditolak"
  update(pendaftarRef, {
    statusPendaftaran: "ditolak",
  })
    .then(() => {
      // Hide modal using custom approach
      detailModal.classList.add("hidden");

      // Show success message
      alert("Status pendaftar berhasil diubah menjadi ditolak!");

      // Reset current pendaftar ID
      currentPendaftarId = null;

      // Reload pendaftar data
      loadPendaftarData();
    })
    .catch((error) => {
      console.error("Error updating pendaftar status:", error);
      alert("Gagal memperbarui status pendaftar. Silakan coba lagi.");
    });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load pendaftar data
  loadPendaftarData();

  // Add event listeners to buttons
  document.getElementById("btn-validasi").addEventListener("click", () => {
    validatePendaftar(currentPendaftarId);
  });

  document.getElementById("btn-tolak").addEventListener("click", () => {
    rejectPendaftar(currentPendaftarId);
  });

  // Add event listeners for modal close buttons
  const closeButtons = document.querySelectorAll(
    '[data-modal-hide="detailModal"]'
  );
  closeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const detailModal = document.getElementById("detailModal");
      detailModal.classList.add("hidden");
    });
  });
});
