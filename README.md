# 🛍️ Online Marketplace

Aplikasi marketplace online yang mencakup versi **Web** dan **Mobile**, dengan backend API, autentikasi JWT, serta deployment ke platform cloud.

> **Tugas Kelompok — Specialized Platform Development**  
> Universitas Bina Nusantara | Computer Science

---

## 👥 Tim Pengembang

| Nama | Peran | Bobot |
|------|-------|-------|
| Mochammad Aditya Firmansyah | Full Frontend Web (React) | 25% |
| Zhafran Abyaz | Full Backend (Node.js + Express + MongoDB) | 25% |
| Vincent Ferio | Full Mobile App (React Native + Expo) | 25% |
| Bintang Pramudya | Authentication + Integration + Deployment + Dokumentasi | 25% |

---

## 🚀 Live Demo

| Platform | URL |
|----------|-----|
| 🌐 Frontend Web | [online-marketplace-chi.vercel.app](https://online-marketplace-chi.vercel.app) |
| ⚙️ Backend API | *(isi URL Railway/Render setelah deploy)* |
| 📱 Mobile App | [online-marketplace-mobile1--0z3th9s4vh.expo.app](https://online-marketplace-mobile1--0z3th9s4vh.expo.app/) · <img src="https://qr.expo.dev/eas-update?slug=exp&projectId=b0f4e4b9-c41a-488b-ba7c-741f9a3bc278&groupId=79be0d58-c622-460e-9f3e-7ebd99b1cfdd&host=u.expo.dev" width="80" alt="QR Mobile" /> |

---

## 🧱 Arsitektur Sistem

```
┌─────────────────────────────────────────────┐
│              CLIENT LAYER                   │
│  React Web (Vercel) │ React Native (Expo)   │
└────────────┬────────────────────┬───────────┘
             │   Axios + JWT      │
             ▼                    ▼
┌─────────────────────────────────────────────┐
│              BACKEND API                    │
│        Node.js + Express (Railway)          │
│   /api/auth  │  /api/products  │  /api/users│
└──────────────────────┬──────────────────────┘
                       │ Mongoose
                       ▼
┌─────────────────────────────────────────────┐
│              DATABASE                       │
│              MongoDB Atlas                  │
└─────────────────────────────────────────────┘
```

---

## 📁 Struktur Repo

```
online-marketplace/
├── marketplace-frontend/   # React Web (Aditya)
├── backend/                # Node.js + Express (Zhafran & Bintang)
├── mobile/                 # React Native + Expo (Vincent)
└── README.md
```

---

## ✨ Fitur

### 🌐 Web Frontend
- Beranda dengan hero section, kategori, dan produk unggulan
- Daftar produk dengan fitur search, filter kategori, dan sort harga
- Halaman detail produk
- Keranjang belanja (persisten di localStorage)
- Halaman checkout (protected route — hanya untuk user login)
- Register & Login dengan JWT
- Tampilan responsif (Mobile-friendly)

### ⚙️ Backend API
- RESTful API untuk produk dan user
- CRUD lengkap dengan validasi input
- MongoDB Atlas sebagai database
- JWT Authentication

### 📱 Mobile App
- Halaman Daftar Produk & Detail Produk
- Login Screen dengan JWT di AsyncStorage
- Integrasi API backend

---

## 🛠️ Cara Menjalankan Lokal

### Prerequisites
- Node.js v18+
- npm
- MongoDB Atlas account

### 1. Clone Repo
```bash
git clone https://github.com/Dittyaa/online-marketplace.git
cd online-marketplace
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env: isi MONGO_URI dan JWT_SECRET
node server.js
```

### 3. Frontend Web
```bash
cd marketplace-frontend
npm install
cp .env.example .env
# Edit .env: REACT_APP_API_URL=http://localhost:5000
npm start
```

### 4. Mobile
```bash
cd mobile
npm install
npx expo start
```

---

## 🔌 API Endpoints

| Method | Endpoint | Akses | Keterangan |
|--------|----------|-------|------------|
| POST | `/api/auth/register` | Public | Registrasi user |
| POST | `/api/auth/login` | Public | Login, dapat token |
| GET | `/api/auth/me` | Private | Data user login |
| GET | `/api/products` | Public | Semua produk |
| GET | `/api/products/:id` | Public | Detail produk |
| POST | `/api/products` | Private | Tambah produk |
| PUT | `/api/products/:id` | Private | Edit produk |
| DELETE | `/api/products/:id` | Private | Hapus produk |

---

## 🔧 Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Frontend Web | React.js, React Router v6, Axios, CSS Grid/Flexbox |
| Backend | Node.js, Express.js, JWT, bcryptjs, Multer |
| Database | MongoDB Atlas, Mongoose |
| Mobile | React Native, Expo |
| Deployment | Vercel (FE), Railway (BE), Expo (Mobile) |
| Monitoring | Google Analytics 4 |

---

## 📊 Monitoring

Google Analytics 4 diintegrasikan pada frontend untuk memantau:
- Jumlah pengunjung aktif
- Halaman yang paling banyak dikunjungi
- Sesi pengguna dan bounce rate
