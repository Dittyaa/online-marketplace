import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import './DaftarProduk.css';

const API = process.env.REACT_APP_API_URL || 'http://dummyjson.com';

const DaftarProduk = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchParams] = useSearchParams();
  const [activeKat, setActiveKat] = useState(searchParams.get('kategori') || '');
  const [sort, setSort] = useState('terbaru');

  useEffect(() => {
    axios.get(`${API}/products`).then(res => {
      setProducts(res.data.products)
    }).finally(() => setLoading(false));
  }, []);

  const categories = ['', ...new Set(products.map(p => p.category))];

  let filtered = products
    .filter(p => p.title.toLowerCase().includes(search.toLowerCase()))
    .filter(p => activeKat === '' || p.category === activeKat);

  if (sort === 'termurah') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'termahal') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else filtered = [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="daftar-page">
      {/* Search bar */}
      <div className="search-bar-wrapper">
        <div className="container search-bar-inner">
          <div className="search-box">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="sort-select">
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Termurah</option>
            <option value="termahal">Termahal</option>
          </select>
        </div>
      </div>

      <div className="container daftar-layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <h3>Kategori</h3>
          <div className="kat-list">
            {categories.map(kat => (
              <button
                key={kat}
                className={`kat-btn ${activeKat === kat ? 'active' : ''}`}
                onClick={() => setActiveKat(kat)}
              >
                {kat === '' ? 'Semua' : kat}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <main className="produk-main">
          <div className="produk-header">
            <p className="produk-count">
              {loading ? 'Memuat...' : `${filtered.length} produk ditemukan`}
            </p>
          </div>

          {loading ? (
            <div className="page-loader">Memuat produk...</div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <p>📦</p>
              <h3>Tidak ada produk</h3>
              <span>Coba ubah filter atau kata kunci pencarian</span>
            </div>
          ) : (
            <div className="products-grid-main">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DaftarProduk;
