# JadwalinAja 🎓📅
> *Atur jadwal kuliah gak pake ribet, jadwalin aja!*

**JadwalinAja** adalah aplikasi web modern, ringan, estetik, dan berorientasi utilitas nyata untuk mahasiswa di Indonesia. Dirancang untuk menggantikan portal akademik (SIAKAD) yang kaku dan lambat dengan antarmuka yang jernih, cepat dibuka di HP, serta anti-bentrok.

Dideploy di atas ekosistem **Cloudflare (Cloudflare Pages + Cloudflare D1 SQLite Database + Edge Functions)** dengan dukungan **PWA (Progressive Web App)**, **Google Auth Sync**, dan arsitektur **Local-First (Offline-Ready)**.

---

## ✨ Fitur-Fitur Utama (Real & Siap Pakai)

### 1. 📅 Interactive Weekly Timetable Grid
* Visualisasi matriks jam (07:00 - 21:00) vs hari (Senin - Sabtu) dengan tinggi kartu proporsional durasi jam mata kuliah.
* **Quick Add:** Klik langsung pada slot jam kosong untuk menambah kelas di hari tersebut.
* **Deteksi Bentrok Otomatis (*Real-time Conflict Detector*):** Langsung memperingatkan jika ada jam kuliah yang bertabrakan di hari yang sama.

### 2. ⚡ Dynamic "Next Class" Banner & Tautan Cepat
* Menghitung waktu lokal secara akurat: menampilkan kelas yang sedang berlangsung atau kelas berikutnya hari ini lengkap dengan hitung mundur menit, gedung, dan ruangan.
* **Tombol Akses Cepat:** Tautan langsung ke Zoom / Google Meet dan grup WhatsApp kelas.

### 3. 🪄 Smart Fast Import (Parser Teks SIAKAD Kampus)
* Tidak perlu menginput matkul satu per satu secara manual. Cukup salin teks jadwal atau tabel dari SIAKAD kampus dan tempelkan ke form *Smart Import*. Sistem akan otomatis mendeteksi nama matkul, hari, jam, SKS, ruangan, dan dosen pengampu.

### 4. 🛡️ Tracker Presensi & Sisa Jatah Bolos (Batas 75% Hadir)
* Pantau kehadiran perkuliahan per mata kuliah untuk memastikan syarat minimal 75% kehadiran Ujian Akhir Semester (UAS) terpenuhi.
* Indikator status kehadiran:
  * **Aman:** Sisa jatah absen > 1x pertemuan.
  * **Waspada:** Sisa jatah absen tinggal 1x pertemuan.
  * **Bahaya:** Jatah absen habis (berisiko tidak boleh ikut ujian).
* Tombol cepat: `+ Hadir`, `+ Izin/Sakit`, `+ Alpa/Bolos`.

### 5. 🎯 Tugas, Kuis & Jadwal Ujian (Countdown H-X)
* Pengelompokan kategori: **Tugas Harian**, **Kuis**, **Proyek/Makalah**, **UTS**, dan **UAS**.
* Badge countdown deadline dinamis: *Hari Ini!*, *Besok*, *H-2*, *H-5*, atau *Terlewat X hari*.
* Dilengkapi tautan pengumpulan (Google Classroom / Spada LMS) dan efek *confetti* saat tugas selesai.

### 6. 🖼️ Multi-Ratio Wallpaper Generator (HP & Laptop)
* **Smartphone Lockscreen (9:16 Portret):** Poster ringkasan jadwal vertikal beresolusi tinggi, pas untuk dijadikan wallpaper layar kunci smartphone.
* **Desktop / Laptop (16:9 Lanskap):** Format horisontal tajam untuk layar monitor belajar.
* **Cetak Dokumen A4 Resmi:** Format cetak dokumen hitam-putih rapi yang siap diprint untuk arsip KRS atau ditempel di kamar kos.
* **Export .ics:** Sinkronisasi jadwal mingguan ke Google Calendar, Apple Calendar, atau Microsoft Outlook.
* **Cadangan JSON:** Ekspor dan impor data jadwal antar perangkat.

### 7. 📱 PWA Support (Install ke Layar Utama HP)
* Mendukung instalasi aplikasi web (*Add to Home Screen*) di perangkat Android & iOS tanpa perlu unduh dari Play Store/App Store.
* Buka dalam mode layar penuh (*standalone app*).

### 8. ☁️ Cloudflare D1 Edge & Google Sync
* Tetap dapat digunakan 100% tanpa internet (Offline-First).
* Sinkronisasi awan otomatis ke database SQLite Cloudflare D1 di region APAC saat login dengan akun Google.

---

## 🛠️ Arsitektur & Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
* **Hosting & CDN:** Cloudflare Pages (Server Edge di Jakarta & Singapore).
* **Backend:** Cloudflare Pages Functions (`/functions/api/sync.ts` & `/functions/api/auth/google.ts`).
* **Database:** Cloudflare D1 (Serverless SQLite at the Edge).
* **Skills Terintegrasi:** `antislop` (38 Rules Anti-AI Slop), `frontend-design`, dan `hallmark`.

---

## 🚀 Menjalankan Proyek Secara Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/zzdree/jadwalinaja.git
   cd jadwalinaja
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   Buka `http://localhost:5173` di browser Anda.

---

## 🌐 Deploy ke Cloudflare Pages

```bash
# Build production bundle
npm run build

# Deploy via Wrangler CLI
npx wrangler pages deploy dist --project-name=jadwalinaja --branch=main
```

---

## 📄 Lisensi
MIT License © 2026 [Andreas](https://github.com/zzdree)
