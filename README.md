# JadwalinAja 🎓📅
> *Atur jadwal kuliah gak pake ribet, jadwalin aja!*

**JadwalinAja** adalah aplikasi web modern, ringan, dan estetik untuk mengorganisir jadwal perkuliahan mingguan, mendeteksi jadwal bentrok secara otomatis, serta mengelola tenggat waktu tugas bagi mahasiswa.

Didesain khusus untuk ekosistem **Cloudflare (Cloudflare Pages + Cloudflare D1 SQLite Database + Edge Functions)** dengan dukungan **Google Login Sync** dan kapabilitas **Local-First (Offline-Ready)**.

---

## ✨ Fitur Unggulan

1. **📅 Interactive Weekly Timetable Grid:**
   - Visualisasi jadwal mingguan (Senin - Sabtu) dari jam 07:00 hingga 21:00.
   - Blok warna proporsional sesuai durasi jam mata kuliah.
   - Klik slot jam kosong untuk menambahkan kelas langsung secara instan.

2. **⚠️ Smart Conflict Detector (Anti-Bentrok):**
   - Mendeteksi secara *real-time* jika ada dua mata kuliah yang memiliki irisan jam yang sama pada hari yang sama.
   - Menampilkan peringatan visual merah/oranye serta daftar nama matkul yang bertabrakan.

3. **⚡ Dynamic "Next Class" Banner:**
   - Menghitung waktu lokal secara akurat: menampilkan kelas yang sedang berlangsung atau kelas berikutnya hari ini lengkap dengan hitung mundur menit, gedung, dan ruangan.

4. **📋 Agenda Hari Ini (Mobile-Friendly):**
   - Mode ringkasan harian berbasis kartu linimasa (*timeline card*), sangat nyaman dibaca lewat layar *smartphone*.

5. **✅ Integrated Task & Assignment Tracker:**
   - Catat deadline tugas kuliah, kuis, atau ujian yang terhubung ke mata kuliah terkait.
   - Dilengkapi efek animasi *celebratory confetti* saat tugas berhasil diselesaikan!

6. **🖼️ Export Wallpaper HD & Kalender (.ics):**
   - **Download Wallpaper:** Mengubah jadwal kuliah menjadi poster gambar PNG beresolusi tinggi yang pas untuk *Lockscreen smartphone* Anda.
   - **Download .ics:** Sinkronisasi satu-klik ke Google Calendar, Apple Calendar, atau Microsoft Outlook.
   - **Cadangan JSON:** Ekspor dan impor data dengan mudah antar perangkat.

7. **☁️ Cloudflare D1 & Google Sync:**
   - Sinkronisasi awan menggunakan database SQL edge Cloudflare D1.
   - Tetap dapat digunakan 100% tanpa login (Local-First), dan otomatis tersinkron saat masuk dengan akun Google.

---

## 🛠️ Tech Stack

* **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
* **Hosting / CDN:** Cloudflare Pages (Super low latency, server edge di Jakarta).
* **Backend Edge:** Cloudflare Pages Functions (`/functions/api/*`).
* **Database:** Cloudflare D1 (Serverless SQLite at the Edge).
* **Libraries:** `html-to-image` (wallpaper generator), `canvas-confetti` (gamifikasi tugas).

---

## 🚀 Panduan Menjalankan Secara Lokal

1. **Clone repositori:**
   ```bash
   git clone https://github.com/zzdree/jadwalinaja.git
   cd jadwalinaja
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan local development server:**
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:5173`.

---

## 🌐 Panduan Deploy ke Cloudflare Pages

### Cara 1: Otomatis via GitHub (Sangat Direkomendasikan)
1. Buka dashboard [Cloudflare Dashboard](https://dash.cloudflare.com/) > **Workers & Pages**.
2. Klik **Create application** > Tab **Pages** > **Connect to Git**.
3. Pilih repositori `zzdree/jadwalinaja`.
4. Konfigurasi Build Settings:
   * **Framework preset:** `Vite`
   * **Build command:** `npm run build`
   * **Build output directory:** `dist`
5. (Opsional untuk D1 Database): Buat D1 Database bernama `jadwalinaja-db`, lalu tambahkan D1 binding bernama `DB` pada tab **Settings > Functions > D1 Database bindings**.
6. Klik **Save and Deploy**. Website Anda langsung aktif di `https://jadwalinaja.pages.dev`!

### Cara 2: Deploy via Wrangler CLI
```bash
npm run build
npx wrangler pages deploy dist --project-name=jadwalinaja
```

---

## 📄 Lisensi
MIT License © 2026 [Andreas](https://github.com/zzdree)
