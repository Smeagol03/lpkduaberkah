// Fungsi untuk mengirim pesan ke WhatsApp
document.addEventListener("DOMContentLoaded", function () {
  // Mendapatkan referensi ke form dan input
  const pesanForm = document.getElementById("pesanForm");
  const pesanInput = document.getElementById("pesanInput");

  // Nomor WhatsApp yang akan menerima pesan
  const nomorWhatsApp = "6287717398311";

  // Menambahkan event listener untuk form submission
  if (pesanForm) {
    pesanForm.addEventListener("submit", function (event) {
      // Mencegah form melakukan submit default
      event.preventDefault();

      // Mendapatkan nilai pesan
      const pesan = pesanInput.value.trim();

      // Validasi input
      if (!pesan) {
        alert("Silakan masukkan pesan terlebih dahulu!");
        return;
      }

      // Menambahkan kalimat layanan website LPK2BERKAH sebelum isi pesan
      const pesanLengkap = `Layanan website LPK2BERKAH :\n${pesan}`;

      // Membuat URL WhatsApp dengan pesan
      const whatsappURL = `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(
        pesanLengkap
      )}`;

      // Membuka WhatsApp di tab baru
      window.open(whatsappURL, "_blank");

      // Reset form setelah mengirim
      pesanForm.reset();
    });
  }
});
