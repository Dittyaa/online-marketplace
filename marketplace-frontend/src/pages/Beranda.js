import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './Beranda.css';

const API = process.env.REACT_APP_API_URL || 'http://dummyjson.com';

const Beranda = () => {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    axios.get(`${API}/products`).then(res => {
      const data = res.data.data || res.data;
      setFeatured(data.slice(0, 4));
    }).catch(() => {});
  }, []);

  return (
    <div className="beranda">
      {/* Hero */}
      <section className="hero">
        <div className="hero-text">
          <span className="badge badge-accent">🛒 Online Marketplace</span>
          <h1>Temukan Produk<br /><em>Terbaik</em> untuk Anda</h1>
          <p>Ribuan produk dari penjual terpercaya. Belanja mudah, cepat, dan aman.</p>
          <div className="hero-actions">
            <Link to="/produk" className="btn btn-primary" style={{ fontSize: '15px', padding: '14px 32px' }}>
              Mulai Belanja →
            </Link>
            <Link to="/register" className="btn btn-ghost" style={{ fontSize: '15px', padding: '14px 32px' }}>
              Daftar Gratis
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob">
            <span>🛍️</span>
          </div>
          <div className="hero-stat">
            <strong>1000+</strong>
            <span>Produk</span>
          </div>
          <div className="hero-stat hero-stat-2">
            <strong>500+</strong>
            <span>Penjual</span>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories section">
        <div className="container">
          <h2 className="section-title">Kategori Populer</h2>
          <div className="cat-grid">
            {[['👗','Fashion'],['📱','Elektronik'],['🏠','Rumah'],['🎮','Gaming'],['📚','Buku'],['🍳','Dapur']].map(([icon, label]) => (
              <Link to={`/produk?kategori=${label}`} key={label} className="cat-card">
                <span className="cat-icon">{icon}</span>
                <span className="cat-label">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="featured section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Produk Terbaru</h2>
              <Link to="/produk" className="btn btn-ghost" style={{ padding: '8px 16px', fontSize: '13px' }}>Lihat Semua →</Link>
            </div>
            <div className="products-grid">
              {featured.map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="cta-banner section">
        <div className="container">
          <div className="cta-inner">
            <div>
              <h2>Siap mulai berjualan?</h2>
              <p>Daftarkan toko Anda dan jangkau ribuan pembeli hari ini.</p>
            </div>
            <Link to="/register" className="btn btn-primary" style={{ padding: '14px 28px', whiteSpace: 'nowrap' }}>
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Beranda;
