# Dokumentasi Update & Panduan Implementasi - YAPPA Foundation Website

Dokumen ini berisi panduan bagi klien untuk mengimplementasikan update terbaru pada website YAPPA Foundation. Update ini mencakup perbaikan *responsive design*, penambahan *hamburger menu* untuk mobile, serta pembersihan kode (refactor) agar lebih ringan dan profesional.

---

## 🚀 Apa yang Berubah? (Key Improvements)

1.  **Refactoring Kode CSS:** Ukuran file CSS telah dioptimalkan (dari ribuan baris menjadi struktur yang lebih rapi) tanpa menghilangkan desain asli.
2.  **Responsive Master Fix:** Website sekarang otomatis menyesuaikan tampilan saat dibuka di HP atau Tablet. Tidak ada lagi teks yang bertumpuk atau layar yang bisa digeser ke samping (horizontal scroll).
3.  **Hamburger Menu:** Navigasi di mobile sekarang menggunakan ikon garis tiga yang fungsional dan modern.
4.  **Optimasi Hero Section:** Perbaikan pada area banner utama agar teks tidak menutupi konten di bawahnya pada layar kecil.

---

## 🛠️ Panduan Implementasi (Copy-Paste)

Mohon ikuti langkah-langkah berikut secara berurutan untuk hasil yang sempurna:

### 1. File: `index.html` (dan file HTML lainnya)
**Tindakan:** Hapus atribut `style` manual pada elemen Hero.
* Cari kode: `<div class="hero-content" ... style="margin-top: 20%;">`
* Hapus bagian: `style="margin-top: 20%;"`
* Pastikan elemen `<div class="hamburger">...</div>` sudah ada di dalam tag `<nav>` tepat di bawah logo untuk memunculkan menu mobile.

### 2. File: `css/style.css`
**Tindakan:** Timpa seluruh isi file.
* Hapus semua kode lama di `css/style.css`.
* Copy-paste seluruh kode CSS terbaru yang sudah direfactor. Kode ini sudah dibagi menjadi bagian-bagian (Variables, Header, Hero, Section, Footer, dan Mobile) untuk memudahkan pengelolaan di masa depan.

### 3. File: `javascript/script.js`
**Tindakan:** Tambahkan/Update fungsi Hamburger.
* Pastikan kode untuk `Hamburger Menu Toggle` sudah ada di bagian bawah.
* Kode ini menggunakan `document.addEventListener("DOMContentLoaded", ...)` untuk memastikan menu bisa diklik segera setelah halaman dimuat di semua perangkat.

---

## ⚠️ Hal Penting yang Perlu Diperhatikan

* **Pembersihan Inline Style:** Sangat penting untuk menghapus `margin-top: 20%` di HTML karena nilai persentase tersebut akan merusak tampilan di layar HP.
* **Supabase Security:** Jika website ini akan dipublikasikan, pastikan telah mengaktifkan **RLS (Row Level Security)** di dashboard Supabase untuk tabel `volunteer`, `message`, dan `donations`. Izinkan hanya akses `Insert` bagi publik (Anonymous) untuk keamanan data.

---

Dikerjakan oleh: **Ryonandha Mitchell**
*CodeCraft Studio*