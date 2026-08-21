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
4. Ganti `GANTI_DENGAN_KODE_RAHASIA` dengan kode rahasia buatanmu.
5. Pilih **Deploy > New deployment**.
6. Pilih tipe **Web app**, jalankan sebagai akunmu, dan beri akses **Anyone**.
7. Salin URL Web App hasil deployment.
8. Masukkan URL dan kode yang sama ke `REMOTE_API_URL` dan `REMOTE_API_KEY` di `index.html`.

Pesanan akan tetap disimpan lokal sebagai cadangan, lalu dikirim ke Google Sheet jika koneksi online tersedia.

## Notifikasi WhatsApp otomatis

Pesan otomatis tanpa pelanggan menekan **Kirim** membutuhkan WhatsApp Cloud API. Isi tiga Script Properties di Apps Script:

```text
WHATSAPP_TOKEN
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_TO
```

Token tidak boleh ditaruh di `index.html` atau repository publik. Meta dapat mewajibkan template pesan untuk pesan di luar jendela percakapan 24 jam dan dapat menerapkan biaya sesuai kebijakan akun.

## Catatan keamanan

Google Sheets + Apps Script cocok untuk penggunaan kecil tanpa biaya. Untuk data pelanggan dan transaksi dalam jumlah besar, gunakan backend dengan autentikasi dan database yang benar. Pembayaran otomatis tetap membutuhkan payment gateway.

## Panel Dev

Panel Dev tersedia untuk pengujian lokal dengan dua akun yang dikonfigurasi di aplikasi. Panel dapat melihat pesanan, melihat detail email, mengubah status menjadi Menunggu Konfirmasi, Lunas, atau Dibatalkan, serta menghapus riwayat lokal. Login frontend ini bukan pengganti autentikasi server dan tidak boleh dianggap aman untuk data produksi di GitHub Pages.
