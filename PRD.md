# Product Requirement Document (PRD)
## Project: **JadwalInAja**
*Modern, intuitive & effortless college timetable organizer.*

---

## 1. Executive Summary & Brand Identity

* **Nama Produk:** JadwalInAja
* **Repositori:** `https://github.com/zzdree/jadwalinaja`
* **Target Pengguna:** Mahasiswa (D3/S1/S2) yang butuh cara cepat, estetik, dan tanpa ribet untuk mengatur jadwal perkuliahan mingguan dan tenggat waktu tugas.
* **Tagline:** *"Atur jadwal kuliah gak pake ribet, jadwalin aja!"*
* **Core Philosophy:** 
  1. **Zero Friction:** Pengguna bisa langsung memasukkan dan melihat jadwal dalam hitungan detik tanpa dipaksa alur registrasi yang panjang.
  2. **Visual & Aesthetic:** Jadwal bukan sekadar tabel kaku hitam-putih, tapi representasi visual mingguan yang memanjakan mata dan jelas.
  3. **Mobile & Desktop First:** Tampilan responsif optimal untuk layar *smartphone* (saat di kampus) dan *laptop/PC* (saat di meja belajar).

---

## 2. Problem Statement (Keresahan Mahasiswa)

1. **Jadwal Kampus Kaku & Tersebar:** Sistem akademik kampus (SIAKAD/KRS) seringkali hanya menyediakan tabel HTML jadul atau file PDF statis yang sulit dibaca di HP.
2. **Potensi Bentrok Jadwal (Schedule Conflict):** Saat pengisian KRS, mahasiswa sering bingung mengecek apakah matkul pilihan A bentrok jamnya dengan matkul wajib B.
3. **Lupa Ruangan & Dosen:** Mahasiswa sering lupa ruang kelas, nama dosen, atau tautan Zoom/GMeet untuk kelas daring.
4. **Tenggat Tugas Terpisah:** Jadwal kuliah dan tugas sering dicatat di tempat berbeda (catatan HP, WhatsApp grup, buku tulis), sehingga sering terlewat.

---

## 3. Scope & Fitur Produk

### Fitur Utama (Core MVP)
1. **Interactive Timetable Grid (Visual Mingguan):**
   * Tampilan matriks jam (07.00 - 21.00) vs hari (Senin - Sabtu).
   * Blok mata kuliah berwarna (*color-coded*) dengan durasi proporsional.
   * Toggle tampilan: **Mode Mingguan (Grid)** untuk overview dan **Mode Harian (Agenda/List)** untuk fokus hari ini.

2. **Quick Course Entry (Input Cepat):**
   * Nama Mata Kuliah & Kode Matkul.
   * Jumlah SKS (otomatis menghitung total SKS semester ini).
   * Hari & Rentang Waktu (Jam Mulai - Jam Selesai).
   * Ruangan / Gedung & Jenis Kelas (Tatap Muka / Online / Lab).
   * Nama Dosen & Kontak/Catatan Khusus.
   * Pemilihan palet warna aksen per matkul (pastel/modern palette).

3. **Smart Conflict Detector (Deteksi Bentrok Otomatis):**
   * Validasi *real-time* saat menambahkan atau mengedit matkul.
   * Menampilkan peringatan visual merah/oranye jika ada jam kuliah yang saling tumpang-tindih (*overlapping*).

4. **"Next Class" Dynamic Banner (Kelas Berikutnya):**
   * Kartu dinamis di bagian atas layar yang menunjukkan kelas terdekat hari ini:
     * Status: *"Sedang Berlangsung"* / *"Dimulai dalam 35 Menit di Lab Komputer 2"*.

5. **Integrated Task & Homework Tracker:**
   * Checklist tugas/kuis/ujian yang terhubung langsung dengan mata kuliah terkait.
   * Indikator status: *Belum Selesai*, *Mendekati Deadline*, *Selesai*.

6. **Export & Share Utility:**
   * **Export Gambar Estetik (PNG/JPG):** Satu klik untuk mengunduh jadwal beresolusi tinggi dengan rasio pas untuk dijadikan *Lockscreen Smartphone* atau *Desktop Wallpaper*.
   * **Export Kalender (iCal / .ics):** Sinkronisasi sekali klik ke Google Calendar, Apple Calendar, atau Outlook.
   * **Export/Import JSON:** Backup data lokal dan pindah perangkat dengan mudah.

---

## 4. Rencana Tahapan Pengembangan (Phased Roadmap)

### **Fase 1: Foundation & Project Setup**
* Setup repo GitHub & Git Workflow.
* Inisialisasi struktur frontend (Framework modern, Tailwind CSS, icon pack, UI library).
* Konfigurasi pipeline deployment ke **Cloudflare Pages / Workers**.
* Setup sistem tema (Light Mode / Dark Mode yang nyaman di mata).

### **Fase 2: Core Timetable & Local Engine (MVP Pertama)**
* Implementasi modul data model mata kuliah (Course schema, time calculations, SKS counter).
* Sistem penyimpanan lokal (*offline-first / local-first storage*) agar aplikasi bisa langsung digunakan instan tanpa login.
* UI Form Tambah / Edit / Hapus Mata Kuliah dengan pemilih warna dan validasi bentrok.
* Render visual Weekly Grid Timetable dan Daily Agenda List.

### **Fase 3: Smart Features & Productivity**
* Banner *"Next Up / Kelas Berikutnya"* berbasis waktu lokal *real-time*.
* Sub-fitur Task & Assignment Tracker (tenggat tugas terhubung ke matkul).
* Filter jadwal (misal: hanya tampilkan hari tertentu, atau sembunyikan kelas praktikum).

### **Fase 4: Export, Sync, & Cloud Connectivity**
* Fitur generate poster jadwal estetik (HTML-to-Canvas / SVG download) siap pakai untuk wallpaper HP.
* Generator file `.ics` (iCalendar sync).
* Integrasi backend/database Cloudflare (jika memilih opsi multi-perangkat / login akun).

---

## 5. Arsitektur Teknis & Pertimbangan Platform

### Hosting & Deployment: **Cloudflare**
* **Cloudflare Pages:** Sangat cepat, CDN global dengan latency super rendah di Indonesia, bandwidth gratis tanpa batas, SSL otomatis, dan integrasi mulus dengan repo GitHub `zzdree/jadwalinaja`.
* **Full-stack Edge:** Dapat memanfaatkan Cloudflare Workers / Functions jika membutuhkan serverless API.

### Database & Storage Architecture:
*(Rekomendasi detail dan kuesioner keputusan ada pada bagian evaluasi arsitektur).*
