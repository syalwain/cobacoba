import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { createPeminjaman, getAssets, KEPERLUAN, MAX_PINJAM, updateStok } from '../api.js'

export default function PeminjamanForm() {
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [form, setForm] = useState({
    id_asset: '',
    peminjam: '',
    keperluan: KEPERLUAN[0],
    jumlah_dipinjam: 1,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getAssets()
        // Hanya asset aktif dan masih ada stok yang bisa dipinjam
        setAssets((Array.isArray(data) ? data : []).filter((a) => Number(a.status_asset) === 1 && Number(a.stok_asset) > 0))
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const selected = assets.find((a) => String(a.id_asset) === String(form.id_asset))
  const maxJumlah = selected ? Math.min(MAX_PINJAM, Number(selected.stok_asset)) : MAX_PINJAM

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!selected) return setError('Pilih asset terlebih dahulu.')
    if (!form.peminjam.trim()) return setError('Nama peminjam wajib diisi.')

    const jumlah = Number(form.jumlah_dipinjam)
    const stokAwal = Number(selected.stok_asset)

    if (!Number.isInteger(jumlah) || jumlah < 1) return setError('Jumlah peminjaman minimal 1.')
    if (jumlah > MAX_PINJAM) return setError(`Jumlah peminjaman maksimal ${MAX_PINJAM}.`)
    if (jumlah > stokAwal) return setError(`Jumlah peminjaman melebihi stok (${stokAwal}).`)

    setSaving(true)
    try {
      // 1) Buat transaksi (status otomatis 1 = Diajukan)
      await createPeminjaman({
        id_asset: Number(selected.id_asset),
        peminjam: form.peminjam.trim(),
        keperluan: form.keperluan,
        jumlah_dipinjam: jumlah,
        status_transaksi: 1,
      })
      // 2) Kurangi stok di master asset
      await updateStok(Number(selected.id_asset), stokAwal - jumlah)
      navigate('/peminjaman')
    } catch (e2) {
      setError(e2.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Memuat data...</p>

  return (
    <section>
      <h1>Ajukan Peminjaman</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={onSubmit} className="form">
        <label>
          Asset
          <select name="id_asset" value={form.id_asset} onChange={onChange}>
            <option value="">-- Pilih asset --</option>
            {assets.map((a) => (
              <option key={a.id_asset} value={a.id_asset}>
                {a.nama_asset} (stok: {a.stok_asset})
              </option>
            ))}
          </select>
        </label>

        <label>
          Nama Peminjam
          <input name="peminjam" value={form.peminjam} onChange={onChange} />
        </label>

        <label>
          Keperluan
          <select name="keperluan" value={form.keperluan} onChange={onChange}>
            {KEPERLUAN.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </label>

        <label>
          Jumlah Dipinjam {selected && <small>(maks. {maxJumlah})</small>}
          <input type="number" min="1" max={maxJumlah} name="jumlah_dipinjam" value={form.jumlah_dipinjam} onChange={onChange} />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Ajukan'}
          </button>
          <Link to="/peminjaman" className="btn">Batal</Link>
        </div>
      </form>
    </section>
  )
}
