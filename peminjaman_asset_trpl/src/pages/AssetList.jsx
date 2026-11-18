import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deleteAsset, getAssets, STATUS_ASSET } from '../api.js'

export default function AssetList() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getAssets()
      setAssets(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async (a) => {
    if (!window.confirm(`Nonaktifkan asset "${a.nama_asset}"?`)) return
    try {
      await deleteAsset(a.id_asset)
      await load()
    } catch (e) {
      alert(e.message)
    }
  }

  return (
    <section>
      <div className="page-head">
        <h1>Master Asset</h1>
        <Link to="/asset/tambah" className="btn btn-primary">
          + Tambah Asset
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Asset</th>
            <th>Jenis</th>
            <th>Stok</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="center">Memuat data...</td>
            </tr>
          ) : assets.length === 0 ? (
            <tr>
              <td colSpan="6" className="center">Belum ada data.</td>
            </tr>
          ) : (
            assets.map((a, i) => (
              <tr key={a.id_asset}>
                <td>{i + 1}</td>
                <td>{a.nama_asset}</td>
                <td>{a.jenis_asset}</td>
                <td>{a.stok_asset}</td>
                <td>
                  <span className={Number(a.status_asset) === 1 ? 'badge badge-ok' : 'badge badge-off'}>
                    {STATUS_ASSET[Number(a.status_asset)] ?? a.status_asset}
                  </span>
                </td>
                <td className="actions">
                  <Link to={`/asset/edit/${a.id_asset}`} className="btn btn-sm">
                    Edit
                  </Link>
                  {Number(a.status_asset) === 1 && (
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(a)}>
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  )
}
