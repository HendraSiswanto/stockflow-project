# ⚡ StockFlow — Inventory & Stock Management System

**StockFlow** adalah aplikasi web *full-stack* untuk manajemen inventori, pemantauan stok barang, serta pencatatan riwayat mutasi keluar-masuk barang secara *real-time*. Aplikasi ini dirancang dengan antarmuka modern berbasis **Side Panel Navigation** untuk memudahkan pengelolaan stok barang usaha maupun kasir (POS).

---

## ✨ Fitur Utama

### 1. 📊 Overview Dashboard
* **Metrik Ringkasan Real-time:** Menampilkan total stok masuk (*Total In Stock*), total stok keluar (*Total Out Stock*), dan total valuasi aset stok saat ini (*Total Asset*).
* **Highlight Produk:** Menampilkan 10 produk teratas beserta status ketersediaan stok dan peringatan visual (*low-stock alert*) jika stok berada di bawah batas minimum.

### 2. 📦 Master Manajemen Produk
* **CRUD Produk Lengkap:** Tambah, ubah (*edit*), dan hapus data produk beserta pengaturan harga beli, harga jual, batas minimum stok, serta kategori produk.
* **Kontrol Mutasi Cepat:** Penambahan (`+ Stok`) dan pengurangan (`- Stok`) stok barang secara langsung dari tabel utama.
* **Manajemen Status Penjualan:** Pengaturan status produk **Aktif** atau **Non-Aktif** secara instan.
* **Paginasi Data (Pagination):** Mendukung *Server-Side Pagination* menggunakan Spring Data JPA (`Pageable`) maupun *Client-Side Pagination* untuk menjaga performa saat data berkembang besar.

### 3. 🗂️ Master Manajemen Kategori
* Pengelolaan kategori barang (Tambah, Edit *inline*, dan Hapus kategori) untuk mengelompokkan katalog produk secara terstruktur.

### 4. 🕒 Log Riwayat Mutasi (Audit Trail)
* Mencatat seluruh aktivitas perubahan stok (`IN` / `OUT`) lengkap dengan waktu kejadian, nama barang, jumlah mutasi, dan keterangan transaksi.
* Mendukung pemfilteran riwayat berdasarkan seluruh produk maupun per produk spesifik.

---

## 🛠️ Teknologi & Arsitektur Deployment

### Tech Stack
* **Frontend:** React, TypeScript (Vite), Axios
* **Backend:** Java 17+, Spring Boot, Spring Data JPA (Hibernate), Lombok
* **Database:** PostgreSQL

### Infrastruktur Cloud (Production)

| Layer | Layanan Cloud | Keterangan |
| :--- | :--- | :--- |
| **Database** | **Supabase** | Managed PostgreSQL Database untuk penyimpanan data produk, kategori, dan riwayat mutasi. |
| **Backend API** | **Snapdeploy** | Containerized Spring Boot REST API server (berjalan pada container cloud dengan konfigurasi port dinamis). |
| **Frontend Web** | **Vercel** | Hosting aplikasi SPA React + TypeScript dengan CDN global dan CI/CD otomatis dari GitHub. |

---

## 📂 Struktur Proyek

### 1. Backend (`backend/`)
```text
backend/
├── config/
│   └── CorsConfig.java             # Konfigurasi CORS untuk akses dari frontend
└── src/main/
    ├── java/com/hendra/stockflow/backend/
    │   ├── controller/             # REST API Endpoints (Product, Category, History)
    │   ├── exception/              # Custom Exception & Global Error Handling
    │   ├── model/
    │   │   ├── dto/                # Data Transfer Objects (Request & Flat Response)
    │   │   ├── entity/             # Entitas JPA Database (Product, Category, History)
    │   │   └── enums/              # Enum status & tipe mutasi (ProductStatus, HistoryType)
    │   ├── repository/             # Spring Data JPA Repositories & Pagination
    │   ├── service/                # Logika bisnis & kalkulasi mutasi stok
    │   └── BackendApplication.java # Main entry point aplikasi Spring Boot
    └── resources/
        └── application.properties  # Konfigurasi database Supabase, JPA & port server
```


### 2. Frontend (`src/`)
```text
src/
├── api/
│   └── productApi.ts           # Konfigurasi Axios & endpoint API (Products, Categories, History, Summary)
├── components/
│   ├── Sidebar.tsx             # Navigasi panel samping (Side Panel)
│   ├── OverviewDashboard.tsx   # Halaman ringkasan aset & 10 produk highlight
│   ├── ProductDashboard.tsx    # Halaman master CRUD produk, mutasi stok & paginasi
│   ├── CategoryManager.tsx     # Halaman pengelolaan master kategori
│   └── HistoryLogs.tsx         # Halaman audit log riwayat mutasi barang
├── types/
│   └── index.ts                # Definisi TypeScript interfaces & DTO responses
└── App.tsx                     # Root layout pengatur navigasi antar tab
```

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

### Prasyarat
* **Node.js** (v18 atau lebih baru) & **npm**
* **Java JDK** (v17 atau lebih baru) & **Maven**
* **PostgreSQL** (Lokal atau koneksi langsung ke **Supabase**)

### 1. Menjalankan Backend (Spring Boot)
1. Masuk ke direktori backend proyek Anda.
2. Konfigurasikan koneksi database dan port di `src/main/resources/application.properties`:
   ```properties
   server.port=\${PORT:8080}
   spring.datasource.url=jdbc:postgresql://localhost:5432/stockflow_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.jpa.hibernate.ddl-auto=update
   ```
3. Jalankan aplikasi Spring Boot:
   ```bash
   ./mvnw spring-boot:run
   ```

### 2. Menjalankan Frontend (React + Vite)
1. Masuk ke direktori frontend proyek Anda.
2. Instal seluruh dependensi:
   ```bash
   npm install
   ```
3. Pastikan URL dasar API di `src/api/productApi.ts` mengarah ke server backend Anda (lokal `http://localhost:8080/api` atau URL produksi **Snapdeploy**).
4. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
5. Buka browser dan akses `http://localhost:5173`.

---

## ☁️ Konfigurasi Deployment

1. **Database (Supabase):**
   * Pastikan proyek PostgreSQL di **Supabase** dalam status *Active*.
   * Gunakan *Connection String* JDBC PostgreSQL dari dashboard Supabase pada pengaturan *Environment Variables* backend.
2. **Backend (Snapdeploy):**
   * Atur `server.port=${PORT:8080}` pada `application.properties` agar sesuai dengan *port health-check* container.
   * Tambahkan *Environment Variables* untuk `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, dan `SPRING_DATASOURCE_PASSWORD` yang mengarah ke Supabase.
   * Pastikan konfigurasi **CORS** di Spring Boot mengizinkan origin dari domain **Vercel** frontend.
3. **Frontend (Vercel):**
   * Hubungkan repository GitHub ke **Vercel**.
   * Pastikan `baseURL` pada Axios (`src/api/productApi.ts`) mengarah ke endpoint HTTPS dari **Snapdeploy**.

---

## 🗺️ Roadmap Pengembangan Selanjutnya

- [ ] **Autentikasi & Otorisasi User:** Implementasi **Spring Security + JWT (JSON Web Token)** untuk membatasi akses sistem (halaman *Login*, proteksi endpoint API, serta manajemen peran *Admin* & *Kasir*).
- [ ] **Pencarian & Filter Lanjutan:** Fitur *search bar* produk dan filter berdasarkan kategori pada tabel master produk.
- [ ] **Export Laporan:** Fitur unduh laporan stok dan riwayat mutasi ke format Excel/PDF.

---

## 👤 Kontributor

* **Hendra Siswanto** — [GitHub Profile](https://github.com)
