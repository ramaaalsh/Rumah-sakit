# Sistem Informasi Rumah Sakit (SI-RS)

Aplikasi manajemen rumah sakit full-stack yang mencakup sistem pendaftaran, pemeriksaan dokter, manajemen obat, rawat inap, dan pembayaran.

## 🚀 Tech Stack

- **Frontend**: React.js (Vite), TypeScript, Tailwind CSS v4, Lucide React.
- **Backend**: Node.js, Express.js, TypeScript, Prisma ORM.
- **Database**: MySQL.

---

## 🛠️ Persiapan Mandiri (Prerequisites)

Sebelum menjalankan aplikasi, pastikan Anda sudah menginstal:
- [Node.js](https://nodejs.org/) (versi 18+)
- [MySQL](https://dev.mysql.com/downloads/installer/)
- Git

---

## ⚙️ Cara Instalasi & Menjalankan

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME/Rumah-sakit.git
cd Rumah-sakit
```

### 2. Setup Backend
1. Masuk ke folder backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Buat file `.env` di dalam folder `backend` dan sesuaikan konfigurasinya:
   ```env
   DATABASE_URL="mysql://root:password_mysql_kamu@localhost:3306/db_hospital"
   JWT_SECRET="rahasia_bebas_apa_aja"
   ```
4. Setup database & tabel otomatis menggunakan Prisma:
   ```bash
   npx prisma migrate dev --name init
   ```
5. **Penting**: Jalankan seeder untuk mengisi data awal & akun demo:
   ```bash
   npx prisma db seed
   ```
6. Jalankan server backend:
   ```bash
   npm run dev
   ```

### 3. Setup Frontend
1. Buka terminal baru, masuk ke folder frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Jalankan aplikasi frontend:
   ```bash
   npm run dev
   ```
4. Buka [http://localhost:5173](http://localhost:5173) di browser.

---

## 🔑 Akun Demo (Default Credentials)

Gunakan akun berikut untuk mencoba berbagai dashboard (Admin, Dokter, Perawat):

| Role | Username | Password |
| :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` |
| **Dokter** | `dokter1` | `dokter123` |
| **Perawat** | `perawat1` | `perawat123` |

---

## 📁 Struktur Folder Utama

```text
Rumah-sakit/
├── backend/
│   ├── prisma/          # Skema Database & Seeder
│   ├── src/
│   │   ├── controllers/ # Logika Bisnis
│   │   ├── routes/      # Endpoint API
│   │   └── index.ts     # Entry Point Server
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Komponen UI Reusable
    │   ├── pages/       # Halaman Dashboards
    │   └── services/    # API Integration (Axios)
    └── package.json
```

---

## 👤 Kontributor
- Kelompok 2
