import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  get,
  query,
  orderByChild,
  equalTo,
} from "https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js";

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

// Fungsi untuk mengumpulkan data formulir
function getFormData() {
  return {
    informasiPribadi: {
      namaLengkap: document.getElementById("fullName").value,
      nik: document.getElementById("nik").value,
      tempatLahir: document.getElementById("birthPlace").value,
      tanggalLahir: document.getElementById("birthDate").value,
      jenisKelamin: document.getElementById("gender").value,
      noHP: document.getElementById("phone").value,
      alamat: document.getElementById("address").value,
    },
    pendidikanPekerjaan: {
      pendidikanTerakhir: document.getElementById("education").value,
      pekerjaanSaatIni:
        document.getElementById("occupation").value || "Tidak ada",
    },
    paketPelatihan:
      document.querySelector('input[name="pelatihan"]:checked')?.value || "",
    motivasiReferensi: {
      alasanMengikuti:
        document.getElementById("motivation").value || "Tidak diisi",
      sumberInformasi:
        document.getElementById("reference").value || "Tidak diisi",
    },
    statusPendaftaran: "menunggu",
    tanggalDaftar: new Date().toISOString(),
  };
}

// Fungsi untuk menyimpan data ke Firebase
async function saveToFirebase(formData) {
  try {
    const pendaftarRef = ref(database, "pendaftar");
    const newPendaftarRef = push(pendaftarRef);
    await set(newPendaftarRef, formData);
    return { success: true, id: newPendaftarRef.key };
  } catch (error) {
    console.error("Error menyimpan data:", error);
    return { success: false, error: error.message };
  }
}

// Fungsi untuk validasi formulir
// Fungsi untuk memeriksa apakah NIK sudah terdaftar
async function checkNikExists(nik) {
  try {
    const pendaftarRef = ref(database, "pendaftar");
    const nikQuery = query(
      pendaftarRef,
      orderByChild("informasiPribadi/nik"),
      equalTo(nik)
    );
    const snapshot = await get(nikQuery);
    return snapshot.exists();
  } catch (error) {
    console.error("Error memeriksa NIK:", error);
    return false;
  }
}

// Fungsi untuk validasi formulir
async function validateForm() {
  const requiredFields = [
    "fullName",
    "nik",
    "birthPlace",
    "birthDate",
    "gender",
    "phone",
    "address",
    "education",
  ];

  const invalidFields = requiredFields.filter((field) => {
    const element = document.getElementById(field);
    return !element.value.trim();
  });

  if (invalidFields.length > 0) {
    alert("Mohon lengkapi semua field yang wajib diisi");
    document.getElementById(invalidFields[0]).focus();
    return false;
  }

  // Validasi nomor HP (hanya angka)
  const phoneInput = document.getElementById("phone").value;
  if (!/^08\d{8,11}$/.test(phoneInput)) {
    alert("Nomor HP tidak valid. Gunakan format 08xxxxxxxxx");
    document.getElementById("phone").focus();
    return false;
  }

  // Validasi NIK (harus 16 digit angka)
  const nikInput = document.getElementById("nik").value;
  if (!/^\d{16}$/.test(nikInput)) {
    alert("NIK harus terdiri dari 16 digit angka");
    document.getElementById("nik").focus();
    return false;
  }

  // Validasi NIK duplikat
  const nikExists = await checkNikExists(nikInput);
  if (nikExists) {
    alert("NIK ini sudah terdaftar dalam sistem kami");
    document.getElementById("nik").focus();
    return false;
  }

  // Validasi paket pelatihan
  if (!document.querySelector('input[name="pelatihan"]:checked')) {
    alert("Mohon pilih paket pelatihan");
    return false;
  }

  // Validasi persetujuan
  if (!document.getElementById("agreement").checked) {
    alert("Anda harus menyetujui persyaratan pendaftaran");
    return false;
  }

  return true;
}

// Fungsi untuk menampilkan feedback ke pengguna
function showFeedback(success, message) {
  const feedbackDiv = document.createElement("div");
  feedbackDiv.className = success
    ? "fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-black p-4 rounded shadow-md z-50"
    : "fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded shadow-md z-50";

  feedbackDiv.innerHTML = `
    <div class="flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${
          success
            ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            : "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        }" />
      </svg>
      <p>${message}</p>
    </div>
  `;

  document.body.appendChild(feedbackDiv);

  // Hapus feedback setelah 5 detik
  setTimeout(() => {
    feedbackDiv.classList.add(
      "opacity-0",
      "transition-opacity",
      "duration-500"
    );
    setTimeout(() => document.body.removeChild(feedbackDiv), 500);
  }, 5000);
}

// Event listener untuk submit formulir
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Tampilkan loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = `
      <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Mengirim...
    `;

    try {
      const isValid = await validateForm();
      if (!isValid) {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonContent;
        return;
      }

      const formData = getFormData();
      const result = await saveToFirebase(formData);

      if (result.success) {
        showFeedback(
          true,
          "Pendaftaran berhasil dikirim! Kami akan menghubungi Anda segera."
        );
        form.reset();
      } else {
        showFeedback(false, "Gagal mengirim pendaftaran. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error:", error);
      showFeedback(false, "Terjadi kesalahan. Silakan coba lagi nanti.");
    } finally {
      // Kembalikan tombol ke keadaan semula
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonContent;
    }
  });
});
