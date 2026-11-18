# peminjaman_asset_trpl_xxx

Pre-Assessment Front End — Pemrograman Berbasis Framework (React + Vite).

## Menjalankan

```bash
npm install
npm run dev
```

Buka alamat yang tampil di terminal (biasanya http://localhost:5173).
Saat development, request API dilewatkan proxy Vite (`/api` -> https://api.melangkah.my.id) agar tidak terkena CORS.

Untuk build production: `VITE_API_URL=https://api.melangkah.my.id npm run build`

## Fitur

**Master Asset**
- Read: list asset dengan status 1 = Aktif, 0 = Tidak Aktif
- Create: status otomatis 1, jenis lewat combobox (Elektronik, Mesin, Lainnya)
- Update: hanya mengubah nama, jenis, dan stok (data diambil lewat API detail)
- Delete: soft delete (status menjadi 0)

**Transaksi Peminjaman**
- Read: 0 Ditolak, 1 Diajukan, 2 Disetujui Atasan, 3 Disetujui PSI
- Create: jumlah tidak boleh melebihi stok dan maksimal 5; keperluan lewat combobox
  (Keperluan Struktural, Keperluan Pengajaran, Lainnya); status otomatis 1;
  setelah berhasil, stok asset diperbarui menjadi stok awal dikurangi jumlah pinjam.

Jangan lupa ganti `xxx` pada nama folder dengan 3 digit terakhir NIM.
