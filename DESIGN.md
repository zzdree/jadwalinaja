# Design System & Direction: JadwalinAja

Dokumen ini mendefinisikan arah desain (*design direction*) untuk JadwalinAja sesuai standar `antislop`. Tujuannya adalah memastikan antarmuka terasa seperti dirancang oleh desainer sungguhan yang memahami kebutuhan nyata mahasiswa, bukan *template AI slop*.

---

## 1. Identitas & Esensi Produk

* **Subjek:** Pengatur jadwal perkuliahan mingguan mahasiswa universitas di Indonesia.
* **Karakter:** Ringkas, jujur, tenang, fungsional, dan langsung ke inti masalah.
* **Audiens:** Mahasiswa yang lelah dengan tampilan SIAKAD/KRS yang kaku dan butuh jadwal yang cepat dibaca saat di kampus.

---

## 2. Palet Warna (Restraint & Purpose)

* **Canvas Ground:** `#fafafa` (Abu-abu sangat terang dan bersih, tidak silau).
* **Card Ground:** `#ffffff` (Putih murni untuk kartu dan panel aktif).
* **Borders / Rules:** `#e5e5e5` (Garis pemisah tipis dan teratur).
* **Primary Text:** `#0f172a` (Slate pekat dengan kontras tinggi untuk keterbacaan tajam).
* **Muted Text:** `#64748b` (Slate abu-abu untuk metadata, label waktu, dan keterangan).
* **Aksentuation:** Warna aksen hanya digunakan secara fungsional pada blok kartu mata kuliah untuk membedakan satu matkul dengan matkul lainnya di tabel jadwal mingguan.

---

## 3. Tipografi

* **Font Family:** `Plus Jakarta Sans`, sans-serif.
* **Skala Ukuran:**
  * Judul Utama: 24px - 36px (Bold 800/900, tracking tight)
  * Subjudul / Heading Kartu: 14px - 16px (Bold 700)
  * Teks Tubuh (Body): 13px - 14px (Regular 400 / Medium 500)
  * Metadata / Label Jam: 11px - 12px (Semi-bold 600)
* **Aturan Typo:**
  * Hindari penggunaan em dash (`—`).
  * Jangan gunakan huruf kapital semua (*ALL CAPS*) untuk label biasa.
  * Hindari pewarnaan satu kata acak di tengah kalimat.

---

## 4. Dials (Tingkat Liveliness)

* **ENERGY (2/3):** Rapi dan stabil. Bukan halaman marketing pesta warna, melainkan alat produktivitas harian yang diandalkan.
* **RHYTHM (2/3):** Variasi tata letak berdasarkan fungsi nyata: tampilan grid jam mingguan yang presisi, linimasa vertikal untuk agenda harian, dan daftar tugas berbasis checklist.
* **MOTION (1/3):** Efek gerak hanya muncul sebagai respons langsung dari tindakan pengguna (membuka modal, klik tab, mencentang tugas). Tidak ada animasi melayang acak (*floating* atau *continuous bounce*).

---

## 5. Copywriting (Anti-Slop Copy)

* Tidak ada klaim palsu atau angka karangan (*"Digunakan oleh 10.000+ mahasiswa"*).
* Tidak ada testimoni palsu atau foto stok buatan AI.
* Tidak menggunakan kata-kata hampa (*"revolusioner", "seamless", "next-gen", "cutting-edge"*).
* Menggunakan bahasa Indonesia yang wajar dan lugas (*"Masuk dengan Google"*, *"Tambah mata kuliah"*, *"Unduh gambar jadwal"*).
