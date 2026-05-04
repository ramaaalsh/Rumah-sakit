# Frontend - Sistem Informasi Rumah Sakit

Bagian frontend dari aplikasi Sistem Informasi Rumah Sakit, dibangun menggunakan React, Vite, dan Tailwind CSS v4.

## 🛠️ Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Routing**: React Router Dom v7
- **HTTP Client**: Axios

## 🚀 Cara Menjalankan
1. Pastikan sudah berada di folder `frontend`.
2. Install dependensi:
   ```bash
   npm install
   ```
3. Jalankan mode pengembangan:
   ```bash
   npm run dev
   ```

## 🏗️ Build untuk Produksi
```bash
npm run build
```

## 📁 Struktur Folder
- `src/components`: Komponen UI yang dapat digunakan kembali.
- `src/pages`: Halaman utama aplikasi (Public, Admin, Dokter, Perawat).
- `src/services`: Konfigurasi axios dan fungsi pemanggilan API.
- `src/context`: State management (AuthContext).
