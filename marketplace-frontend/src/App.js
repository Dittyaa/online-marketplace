import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Beranda from './pages/Beranda';
import DaftarProduk from './pages/DaftarProduk';
import DetailProduk from './pages/DetailProduk';
import Keranjang from './pages/Keranjang';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';

const GA_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

const GATracker = () => {
  const location = useLocation();
  useEffect(() => {
    if (GA_ID && window.gtag) {
      window.gtag('config', GA_ID, { page_path: location.pathname });
    }
  }, [location]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <GATracker />
          <Navbar />
          <Routes>
            <Route path="/" element={<Beranda />} />
            <Route path="/produk" element={<DaftarProduk />} />
            <Route path="/produk/:id" element={<DetailProduk />} />
            <Route path="/keranjang" element={<Keranjang />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '100px 20px', color: 'var(--text2)' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--text)' }}>404</h2>
                <p>Halaman tidak ditemukan.</p>
                <a href="/" style={{ color: 'var(--accent)', marginTop: '16px', display: 'inline-block' }}>Kembali ke Beranda</a>
              </div>
            } />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
