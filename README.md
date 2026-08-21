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
4. Pastikan `API_KEY` di `Code.gs` disetel ke `'seicut'` (atau ganti dengan kode rahasia buatanmu).
5. Pilih **Deploy > New deployment**.
6. Pilih tipe **Web app**, jalankan sebagai akunmu, dan beri akses **Anyone**.
7. Salin URL Web App hasil deployment.
8. Masukkan URL hasil deployment ke `REMOTE_API_URL` dan pastikan `REMOTE_API_KEY` bernilai `'seicut'` di `index.html`.

Pesanan akan tetap disimpan lokal sebagai cadangan, lalu dikirim ke Google Sheet jika koneksi online tersedia.

## Notifikasi WhatsApp otomatis

Pesan otomatis tanpa pelanggan menekan **Kirim** membutuhkan WhatsApp Cloud API. Isi tiga Script Properties di Apps Script:

```text
WHATSAPP_TOKEN
WHATSAPP_PHONE_NUMBER_ID
WHATSAPP_TO
```

Token tidak boleh ditaruh di `index.html` atau repository publik. Meta dapat mewajibkan template pesan untuk pesan di luar jendela percakapan 24 jam dan dapat menerapkan biaya sesuai kebijakan akun.

## Verifikasi Pembayaran Otomatis (Rp 0 / Tanpa Modal)

Sistem menggunakan **Kode Unik 3 Digit + Pemindaian Mutasi Gmail**:
1. Saat pembeli memilih pembayaran, sistem menambahkan kode unik (contoh: Rp 34.502 + 137 = Rp 34.639).
2. Pembeli mentransfer nominal tepat hingga 3 digit terakhir ke rekening/e-wallet admin (BCA, GoPay, DANA, dll).
3. Notifikasi email uang masuk dari Bank/E-Wallet akan masuk ke Gmail akun Google Apps Script admin.
4. Google Apps Script (`Code.gs`) secara otomatis memeriksa isi inbox Gmail untuk nominal tersebut.
5. Saat uang terdeteksi di mutasi email, status pesanan otomatis berubah menjadi **Lunas** di Google Sheet dan tampilan website pembeli langsung terverifikasi secara instan.

## Panel Dev

Panel Dev tersedia untuk pengujian dengan dua akun yang dikonfigurasi di aplikasi. Panel dapat melihat pesanan, melihat detail email, mengubah status menjadi Menunggu Konfirmasi, Lunas, atau Dibatalkan, serta menghapus riwayat lokal. Login frontend ini diamankan dengan Web Crypto (SHA-256) dan dapat diakses baik secara lokal maupun saat di-deploy online.
