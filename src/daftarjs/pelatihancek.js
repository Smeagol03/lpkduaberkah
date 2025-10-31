// Ambil parameter dari URL
const params = new URLSearchParams(window.location.search);
const program = params.get("program");

if (program) {
  // Cari input radio dengan value sesuai parameter
  const radio = document.querySelector(
    `input[name="pelatihan"][value="${program}"]`
  );
  if (radio) {
    radio.checked = true;
  }
}
