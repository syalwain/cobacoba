import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import AssetList from './pages/AssetList.jsx'
import AssetForm from './pages/AssetForm.jsx'
import PeminjamanList from './pages/PeminjamanList.jsx'
import PeminjamanForm from './pages/PeminjamanForm.jsx'

export default function App() {
  const linkClass = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

  return (
    <>
      <header className="topbar">
        <div className="brand">Peminjaman Asset</div>
        <nav>
          <NavLink to="/asset" className={linkClass}>
            Master Asset
          </NavLink>
          <NavLink to="/peminjaman" className={linkClass}>
            Transaksi Peminjaman
          </NavLink>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/asset" replace />} />
          <Route path="/asset" element={<AssetList />} />
          <Route path="/asset/tambah" element={<AssetForm />} />
          <Route path="/asset/edit/:id" element={<AssetForm />} />
          <Route path="/peminjaman" element={<PeminjamanList />} />
          <Route path="/peminjaman/tambah" element={<PeminjamanForm />} />
          <Route path="*" element={<p>Halaman tidak ditemukan.</p>} />
        </Routes>
      </main>
    </>
  )
}
