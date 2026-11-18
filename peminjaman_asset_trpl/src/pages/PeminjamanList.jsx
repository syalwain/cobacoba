import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPeminjaman, STATUS_TRANSAKSI } from '../api.js'

const BADGE = { 0: 'badge-off', 1: 'badge-warn', 2: 'badge-info', 3: 'badge-ok' }

export default function PeminjamanList() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const data = await getPeminjaman()
        setRows(Array.isArray(data) ? data : [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  return (
    <section>
      <div className="page-head">
        <h1>Transaksi Peminjaman</h1>
        <Link to="/peminjaman/tambah" className="btn btn-primary">
          + Ajukan Peminjaman
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Asset</th>
            <th>Peminjam</th>
            <th>Keperluan</th>
            <th>Jumlah</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="6" className="center">Memuat data...</td>
            </tr>
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan="6" className="center">Belum ada transaksi.</td>
            </tr>
          ) : (
            rows.map((r, i) => {
              const s = Number(r.status_transaksi)
              return (
                <tr key={r.id_transaksi}>
                  <td>{i + 1}</td>
                  <td>{r.nama_asset}</td>
                  <td>{r.peminjam}</td>
                  <td>{r.keperluan}</td>
                  <td>{r.jumlah_dipinjam}</td>
                  <td>
                    <span className={`badge ${BADGE[s] ?? ''}`}>{STATUS_TRANSAKSI[s] ?? r.status_transaksi}</span>
                  </td>
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </section>
  )
}
