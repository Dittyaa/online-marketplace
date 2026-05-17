# Online Marketplace — Mobile App

React Native + Expo mobile app yang merupakan versi mobile dari **online-marketplace**.

## Tech Stack

| Layer | Library |
|-------|---------|
| Framework | [Expo SDK 52](https://docs.expo.dev/) + [Expo Router v4](https://expo.github.io/router/) |
| UI | React Native (native components + StyleSheet) |
| Icons | `@expo/vector-icons` (Ionicons) |
| Images | `expo-image` (lazy load, blurhash placeholder) |
| Auth | JWT disimpan di `AsyncStorage` |
| HTTP | `axios` dengan request interceptor Bearer token |
| State | React Context (AuthContext, CartContext) |

## Fitur

- **Login Screen** — form username + password, show/hide password, demo credentials hint
- **Daftar Produk** — FlatList 2-kolom, infinite scroll, search real-time, filter kategori
- **Detail Produk** — image gallery (swipe), harga diskon, stok, deskripsi, add-to-cart
- **Keranjang** — CRUD quantity, summary harga, mock checkout
- **Profil** — info user dari JWT, logout dengan konfirmasi
- **Auth Guard** — redirect otomatis ke login bila token tidak ada

## Prasyarat

- Node.js >= 18
- npm atau yarn
- [Expo Go](https://expo.dev/go) di HP (Android / iOS) — untuk preview lewat QR code

## Instalasi

```bash
cd mobile
npm install
```

Buat file `.env` dari contoh:

```bash
cp .env.example .env
```

> Default API sudah mengarah ke `https://dummyjson.com` (sama dengan frontend web).
> Untuk pakai backend sendiri, ubah `EXPO_PUBLIC_API_URL` di `.env`.

## Menjalankan (Development + QR Code)

```bash
npm start
# atau
npx expo start
```

Terminal akan menampilkan **QR code**. Scan dengan:
- **Android**: buka Expo Go → pindai kamera
- **iOS**: pindai dari kamera bawaan, buka di Expo Go

Untuk emulator:
```bash
npm run android   # Android emulator (perlu Android Studio)
npm run ios       # iOS simulator (khusus macOS + Xcode)
```

### Akun Demo (dummyjson.com)

| Field | Value |
|-------|-------|
| Username | `emilys` |
| Password | `emilyspass` |

## Deploy ke Expo (QR Code publik)

### Opsi 1 — EAS Update (OTA, gratis)

```bash
npm install -g eas-cli
eas login
eas update --branch production --message "First release"
```

Setelah selesai, buka dashboard di `https://expo.dev` → proyek Anda → tab **Updates**.  
Klik update → salin **QR code** dan bagikan ke tim.

### Opsi 2 — Build APK / IPA (distribusi mandiri)

```bash
# Konfigurasi EAS terlebih dahulu
eas build:configure

# Build Android (APK untuk testing)
eas build --platform android --profile preview

# Build iOS (perlu Apple Developer account)
eas build --platform ios
```

Link download APK akan muncul di terminal dan di dashboard expo.dev.

### Opsi 3 — Expo Publish (legacy, tanpa EAS)

```bash
npx expo publish
```

Hasilkan link seperti `https://exp.host/@username/online-marketplace-mobile`.

## Struktur Folder

```
mobile/
├── app/
│   ├── _layout.tsx          # Root layout (providers)
│   ├── index.tsx            # Entry → redirect ke login/tabs
│   ├── (auth)/
│   │   ├── _layout.tsx      # Auth layout (redirect jika sudah login)
│   │   └── login.tsx        # Halaman login
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab bar dengan cart badge
│   │   ├── index.tsx        # Daftar produk
│   │   ├── cart.tsx         # Keranjang belanja
│   │   └── profile.tsx      # Profil & logout
│   └── product/
│       └── [id].tsx         # Detail produk (dynamic route)
├── src/
│   ├── context/
│   │   ├── AuthContext.tsx  # JWT + AsyncStorage
│   │   └── CartContext.tsx  # Cart state
│   ├── services/
│   │   └── api.ts           # Axios instance + interceptor
│   ├── components/
│   │   └── ProductCard.tsx  # Kartu produk reusable
│   └── types/
│       └── index.ts         # TypeScript interfaces
├── app.json                 # Expo config
├── package.json
└── tsconfig.json
```

## Integrasi API

File `src/services/api.ts` menggunakan `EXPO_PUBLIC_API_URL` sebagai base URL.

| Endpoint | Method | Keterangan |
|----------|--------|------------|
| `/auth/login` | POST | Login, response berisi `token` |
| `/products` | GET | Daftar produk (pagination `limit`/`skip`) |
| `/products/search` | GET | Pencarian produk (`q=...`) |
| `/products/category/:slug` | GET | Filter per kategori |
| `/products/:id` | GET | Detail produk |

Token JWT disimpan di `AsyncStorage` dengan key `mk_token` dan dikirim via header `Authorization: Bearer <token>` pada setiap request.
