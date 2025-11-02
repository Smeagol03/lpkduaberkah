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
firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const auth = firebase.auth();

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

// Data program
let program = [];

// Load data program dari Firebase
function loadProgramData() {
  const programRef = database.ref("program");

  programRef.on("value", (snapshot) => {
    program = [];
    snapshot.forEach((childSnapshot) => {
      const programData = childSnapshot.val();
      programData.id = childSnapshot.key;
      program.push(programData);
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
      '<tr><td colspan="8" class="px-4 py-3 text-center">Tidak ada data program</td></tr>';
    return;
  }

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.className = "text-gray-700 dark:text-gray-400";

    const tanggalLulus = item.tanggalLulus
      ? new Date(item.tanggalLulus).toLocaleDateString("id-ID")
      : "-";

    row.innerHTML = `
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

  // Set event listener untuk tombol cetak
  document.getElementById("btn-cetak").onclick = function () {
    cetakSertifikat(programData);
  };

  // Set event listener untuk tombol hapus
  document.getElementById("btn-hapus").onclick = function () {
    hapusProgram(programData.id);
  };
}

// Fungsi untuk mencetak sertifikat
function cetakSertifikat(programData) {
  // Implementasi cetak sertifikat
  alert(
    `Mencetak sertifikat untuk ${programData.informasiPribadi?.namaLengkap}`
  );
  // Disini bisa ditambahkan logika untuk mencetak sertifikat
}

// Fungsi untuk menghapus data program
function hapusProgram(programId) {
  if (!programId) {
    console.error("ID program tidak valid");
    return;
  }

  if (confirm("Apakah Anda yakin ingin menghapus data program ini?")) {
    const programRef = database.ref(`program/${programId}`);

    programRef
      .remove()
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

  // Event listener untuk tombol cetak
  const btnCetak = document.getElementById("btn-cetak");
  if (btnCetak) {
    btnCetak.addEventListener("click", function () {
      const programId = this.getAttribute("data-id");
      const programData = program.find((item) => item.id === programId);
      if (programData) {
        cetakSertifikat(programData);
      }
    });
  }

  // Tambahkan event listener untuk menutup modal ketika mengklik di luar modal
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("detailProgram");
    if (event.target === modal) {
      modal.classList.add("hidden");
    }
  });
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
