import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { createAsset, getAssetDetail, JENIS_ASSET, updateAsset } from '../api.js'

const EMPTY = { nama_asset: '', jenis_asset: JENIS_ASSET[0], stok_asset: '' }

export default function AssetForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()

  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Halaman edit memakai API Detail Asset
  useEffect(() => {
    if (!isEdit) return
    ;(async () => {
      try {
        const d = await getAssetDetail(id)
        setForm({
          nama_asset: d.nama_asset ?? '',
          jenis_asset: d.jenis_asset ?? JENIS_ASSET[0],
          stok_asset: d.stok_asset ?? '',
        })
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [id, isEdit])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.nama_asset.trim()) return setError('Nama asset wajib diisi.')
    const stok = Number(form.stok_asset)
    if (form.stok_asset === '' || !Number.isInteger(stok) || stok < 0) {
      return setError('Stok harus berupa bilangan bulat >= 0.')
    }

    setSaving(true)
    try {
      if (isEdit) {
        // Update hanya mengubah nama, jenis, dan stok
        await updateAsset({
          id_asset: Number(id),
          nama_asset: form.nama_asset.trim(),
          jenis_asset: form.jenis_asset,
          stok_asset: stok,
        })
      } else {
        // Status otomatis 1 (Aktif)
        await createAsset({
          nama_asset: form.nama_asset.trim(),
          jenis_asset: form.jenis_asset,
          stok_asset: stok,
          status_asset: 1,
        })
      }
      navigate('/asset')
    } catch (e2) {
      setError(e2.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <p>Memuat data...</p>

  return (
    <section>
      <h1>{isEdit ? 'Edit Asset' : 'Tambah Asset'}</h1>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={onSubmit} className="form">
        <label>
          Nama Asset
          <input name="nama_asset" value={form.nama_asset} onChange={onChange} placeholder="Contoh: Laptop Lenovo" />
        </label>

        <label>
          Jenis Asset
          <select name="jenis_asset" value={form.jenis_asset} onChange={onChange}>
            {JENIS_ASSET.map((j) => (
              <option key={j} value={j}>{j}</option>
            ))}
          </select>
        </label>

        <label>
          Stok
          <input type="number" min="0" name="stok_asset" value={form.stok_asset} onChange={onChange} />
        </label>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <Link to="/asset" className="btn">Batal</Link>
        </div>
      </form>
    </section>
  )
}
