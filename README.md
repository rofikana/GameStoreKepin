# Keppin Game Store

Website top up game sederhana untuk Mobile Legends, Roblox, PUBG Mobile, dan Free Fire.

## Menjalankan lokal

Buka `index.html` di browser. Untuk fitur Dev Only dengan verifikasi Web Crypto, jalankan melalui server lokal seperti Live Server di VS Code.

## Publikasi ke GitHub Pages

1. Upload `index.html`, `README.md`, dan gambar QRIS ke repository.
2. Buka **Settings > Pages**.
3. Pada **Build and deployment**, pilih **Deploy from a branch**.
4. Pilih branch utama dan folder `/ (root)`.
5. Simpan, lalu tunggu GitHub membuat alamat website.

## Menghubungkan Google Sheets gratis

1. Buat Google Sheet baru.
2. Buka **Extensions > Apps Script**.
3. Salin isi `Code.gs` ke editor Apps Script.
4. Pastikan `API_KEY` di `Code.gs` dan `REMOTE_API_KEY` di `index.html` berisi nilai yang sama.
5. Pilih **Deploy > New deployment**.
6. Pilih tipe **Web app**, jalankan sebagai akunmu, dan beri akses **Anyone**.
7. Salin URL Web App hasil deployment.
8. Masukkan URL hasil deployment ke `REMOTE_API_URL` di `index.html`.

Pesanan akan tetap disimpan lokal sebagai cadangan, lalu dikirim ke Google Sheet jika koneksi online tersedia.

## Notifikasi WhatsApp otomatis

Pesan otomatis tanpa pelanggan menekan **Kirim** membutuhkan WhatsApp Cloud API. Isi tiga Script Properties di Apps Script:

```text
WHATSAPP_TOKEN
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_TO
```

Token tidak boleh ditaruh di `index.html` atau repository publik. Meta dapat mewajibkan template pesan untuk pesan di luar jendela percakapan 24 jam dan dapat menerapkan biaya sesuai kebijakan akun.

## Pemeriksaan Status Pembayaran

Pembeli mentransfer sesuai nominal produk yang dipilih ke rekening atau e-wallet admin. Admin memeriksa pembayaran lalu mengubah kolom **Status** pesanan di Google Sheet menjadi **Lunas**. Website memeriksa status pesanan secara berkala dan akan menampilkan status lunas setelah perubahan itu tersimpan.

Pemindaian mutasi Gmail atau rekening tidak disertakan pada versi ini. Fitur tersebut memerlukan integrasi khusus dengan format notifikasi bank/e-wallet yang digunakan.

## Panel Dev

Panel Dev hanya dapat dibuka setelah login dengan ID dan password Dev yang telah dikonfigurasi. Panel dapat membuat pesanan uji tanpa memasukkan data pemain, melihat pesanan, dan mengubah status menjadi Menunggu Konfirmasi, Lunas, atau Dibatalkan.

Setiap pesanan baru dan setiap perubahan status dari Panel Dev dikirim sebagai notifikasi ke alamat `EMAIL_PENERIMA` pada `Code.gs`. Setelah memperbarui `Code.gs`, deploy ulang Apps Script agar notifikasi dan perubahan status aktif.
