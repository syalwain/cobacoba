// Base URL API. Saat dev dipakai proxy '/api' (lihat vite.config.js).
// Untuk build production, set VITE_API_URL=https://api.melangkah.my.id
const BASE = import.meta.env.VITE_API_URL ?? '/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Request gagal (${res.status})`)
  }
  return data
}

const post = (path, body) =>
  request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined })

// ---------- Asset ----------
export const getAssets = () => request('/asset/read.php')
export const getAssetDetail = (id) => request(`/asset/detail.php?id_asset=${id}`)
export const createAsset = (data) => post('/asset/create.php', data)
export const updateAsset = (data) => post('/asset/update.php', data)
export const deleteAsset = (id) => post(`/asset/delete.php?id_asset=${id}`)

// ---------- Peminjaman ----------
export const getPeminjaman = () => request('/peminjaman/read.php')
export const createPeminjaman = (data) => post('/peminjaman/create.php', data)
export const updateStok = (id_asset, stok) => post('/peminjaman/stok.php', { id_asset, stok })

// ---------- Konstanta ----------
export const JENIS_ASSET = ['Elektronik', 'Mesin', 'Lainnya']
export const KEPERLUAN = ['Keperluan Struktural', 'Keperluan Pengajaran', 'Lainnya']
export const MAX_PINJAM = 5

export const STATUS_ASSET = { 1: 'Aktif', 0: 'Tidak Aktif' }
export const STATUS_TRANSAKSI = {
  0: 'Ditolak',
  1: 'Diajukan',
  2: 'Disetujui Atasan',
  3: 'Disetujui PSI',
}
