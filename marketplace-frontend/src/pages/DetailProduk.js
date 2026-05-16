import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import './DetailProduk.css';

const API = process.env.REACT_APP_API_URL || 'http://dummyjson.com';
const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const DetailProduk = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    axios.get(`${API}/products/${id}`)
      .then(res => setProduct(res.data.data || res.data))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <div className="page-loader">Memuat...</div>;
  if (!product) return <div className="page-loader">Produk tidak ditemukan. <Link to="/produk">Kembali</Link></div>;

  return (
    <div className="container detail-page">
      <Link to="/produk" className="back-link">← Kembali ke Produk</Link>

      <div className="detail-grid">
        <div className="detail-img-wrap">
          {product.image
            ? <img src={`${API}${product.image}`} alt={product.name} />
            : <div className="detail-img-placeholder">🏷️</div>
          }
        </div>

        <div className="detail-info">
          <span className="badge badge-accent">{product.category}</span>
          <h1>{product.name}</h1>
          <div className="detail-price">{fmt(product.price)}</div>

          <div className={`detail-stock ${product.stock === 0 ? 'out' : ''}`}>
            {product.stock > 0 ? `✓ Stok tersedia (${product.stock})` : '✕ Stok habis'}
          </div>

          <div className="detail-desc">
            <h3>Deskripsi</h3>
            <p>{product.description}</p>
          </div>

          <div className="detail-actions">
            <button
              className={`btn ${added ? 'btn-ghost' : 'btn-primary'} add-to-cart-btn`}
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {added ? '✓ Ditambahkan!' : '🛒 Tambah ke Keranjang'}
            </button>
            <Link to="/keranjang" className="btn btn-outline">Lihat Keranjang</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProduk;
