# Interface Inventory Dashboard

Dashboard web untuk Network Engineer dan NOC (Network Operations Center) untuk menampilkan dan mengelola inventory interface jaringan dari file Excel/CSV/TXT.

## Fitur Utama

### 1. Upload Data
- Drag & drop file atau folder ke area upload
- Support multiple file upload dan folder sekaligus
- Data digabungkan otomatis dalam satu dataset
- Parsing otomatis dengan mapping kolom yang fleksibel (case-insensitive)
- File format lain akan diabaikan (otomatis skip, tidak error)

### 2. Summary Cards
- Total interface
- Total connected
- Total down (operasional down tapi admin up)
- Total admin down / disabled
- Jumlah device unik
- Ringkasan per-device dalam tabel detail

### 3. Filter & Pencarian
- Filter berdasarkan:
  - Device (multi-select)
  - Link Status (multi-select)
  - Admin Status (multi-select)
  - VLAN/Mode (multi-select)
  - Type (multi-select)
- Pencarian teks bebas untuk Interface, IP Address, atau Description
- Tombol untuk menghapus semua filter sekaligus

### 4. Tabel Data
- Menampilkan semua kolom: Device, Interface, Link Status, Admin Status, Oper Status, VLAN/Mode, Duplex, Speed, Type, IP Address, Description
- Sorting per kolom (ascending/descending)
- Pagination (50 item per halaman)
- Color-coding otomatis berdasarkan status:
  - **Connected** → hijau
  - **Not Connect** → abu-abu
  - **Down** → merah
  - **Admin Down / Disabled** → oranye

### 5. Export Data
- Export ke Excel (.xlsx)
- Export ke CSV
- Data yang di-export sesuai dengan filter yang aktif

## Cara Menjalankan Project

### Instalasi Dependencies
```bash
npm install
```

### Menjalankan Development Server
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5173` (atau port lain yang tersedia).

### Build untuk Production
```bash
npm run build
```

File build akan tersimpan di folder `dist/`.

### Preview Production Build
```bash
npm run preview
```

## Cara Menggunakan Dashboard

### 1. Upload File Excel/CSV/TXT

**Format file yang didukung:**
- Excel: `.xlsx`, `.xls`
- CSV: `.csv`
- Text: `.txt` (tab-separated atau comma-separated)
- File format lain akan diabaikan (tidak diproses, tidak error)

**Struktur kolom yang dikenali** (case-insensitive):
- Device
- Interface
- Link Status / LinkStatus
- Admin Status / AdminStatus
- Oper Status / OperStatus
- VLAN/Mode / VLAN / Mode
- Duplex
- Speed
- Type
- IP Address / IPAddress / IP
- Description / Desc

**Cara upload:**

**Opsi 1 - Drag & Drop File:**
1. Seret file Excel/CSV/TXT langsung ke area upload

**Opsi 2 - Drag & Drop Folder:**
1. Seret seluruh folder ke area upload
2. Semua file Excel/CSV/TXT di dalam folder akan diproses otomatis
3. File format lain akan diabaikan

**Opsi 3 - Klik Tombol:**
1. Klik "Pilih File" untuk memilih 1 atau lebih file
2. Atau klik "Pilih Folder" untuk memilih seluruh folder

**Catatan:**
- Anda bisa upload multiple file/folder sekaligus
- Data dari semua file akan digabung otomatis dalam satu dataset
- Status hasil upload ditampilkan (berhasil, skipped, gagal)
- Klik "Hapus Semua" untuk reset dan mulai dari awal

### 2. Melihat Summary
Setelah data di-upload, summary cards akan muncul menampilkan:
- Statistik global (total interface, connected, down, dll)
- Tabel ringkasan per-device

### 3. Filter Data
- Pilih checkbox pada kategori filter yang diinginkan
- Gunakan search box untuk mencari teks tertentu
- Klik "Hapus Semua Filter" untuk reset filter

### 4. Melihat Tabel
- Klik header kolom untuk sorting
- Gunakan tombol "Sebelumnya" dan "Selanjutnya" untuk navigasi pagination
- Row akan memiliki warna latar belakang sesuai status

### 5. Export Data
- Klik "Export Excel" atau "Export CSV" di atas tabel
- File akan otomatis terdownload dengan nama `interface_inventory.xlsx` atau `interface_inventory.csv`
- Data yang di-export sesuai dengan filter yang aktif

## Mengubah Mapping Warna Status

File konfigurasi warna ada di: `src/config/statusColors.ts`

Untuk mengubah warna, edit object `statusColorConfig`:

```typescript
export const statusColorConfig = {
  linkStatus: {
    connected: {
      bg: 'bg-green-50',        // Warna latar belakang
      text: 'text-green-700',   // Warna teks
      badge: 'bg-green-100 text-green-800',  // Warna badge
      border: 'border-green-200',  // Warna border
    },
    // ... status lainnya
  },
};
```

Class warna menggunakan Tailwind CSS. Anda bisa mengganti dengan class Tailwind lainnya seperti:
- `bg-blue-50`, `bg-red-100`, `bg-yellow-200`, dll untuk background
- `text-blue-700`, `text-red-800`, dll untuk text
- Lihat [Tailwind CSS Colors](https://tailwindcss.com/docs/customizing-colors) untuk referensi lengkap

## Struktur Project

```
src/
├── components/
│   ├── UploadSection.tsx       # Komponen upload file
│   ├── SummaryCards.tsx        # Komponen summary cards
│   ├── FilterSection.tsx       # Komponen filter
│   └── DataTable.tsx           # Komponen tabel data
├── config/
│   └── statusColors.ts         # Konfigurasi warna status
├── types/
│   └── network.ts              # TypeScript interfaces
├── utils/
│   ├── parseFile.ts            # Utility parsing Excel/CSV
│   └── exportFile.ts           # Utility export Excel/CSV
├── App.tsx                      # Main app component
├── main.tsx                     # Entry point
└── index.css                    # Global styles
```

## Teknologi yang Digunakan

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Styling
- **xlsx** - Parsing & export Excel/CSV
- **Lucide React** - Icons

## Troubleshooting

### File tidak bisa di-upload
- Cek apakah file memiliki kolom yang sesuai (minimal Device dan Interface)
- File format lain akan diabaikan otomatis, lihat status pemrosesan untuk detailnya
- Jika upload folder, pastikan folder berisi file Excel/CSV/TXT
- Untuk file TXT, pastikan menggunakan tab atau koma sebagai delimiter

### Data tidak muncul setelah upload
- Buka browser console (F12) untuk melihat error
- Pastikan struktur kolom di file Excel/CSV/TXT sesuai format yang dikenali

### Warna status tidak sesuai
- Edit file `src/config/statusColors.ts`
- Pastikan menggunakan class Tailwind CSS yang valid

### Export tidak bekerja
- Pastikan browser mengizinkan download file
- Cek apakah ada data yang di-filter (tidak kosong)

## Support & Kontribusi

Dashboard ini dibuat untuk internal network engineer team. Untuk pertanyaan atau saran perbaikan, silakan hubungi tim development.
