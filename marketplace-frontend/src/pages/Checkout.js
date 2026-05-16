import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: user?.name || '', telepon: '', alamat: '', kota: '', metode: 'transfer' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulasi order (integrasi backend bisa ditambahkan Bintang)
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    clearCart();
  };

  if (success) {
    return (
      <div className="container checkout-success">
        <div className="success-icon">✓</div>
        <h2>Pesanan Berhasil!</h2>
        <p>Terima kasih, {user?.name}! Pesanan Anda sedang diproses.</p>
        <button className="btn btn-primary" onClick={() => navigate('/produk')}>Lanjut Belanja</button>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/keranjang');
    return null;
  }

  return (
    <div className="container checkout-page">
      <h1 className="checkout-title">Checkout</h1>

      <div className="checkout-layout">
        {/* Form */}
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Informasi Pengiriman</h3>
            <div className="form-group">
              <label>Nama Penerima</label>
              <input name="nama" value={form.nama} onChange={handleChange} required placeholder="Nama lengkap" />
            </div>
            <div className="form-group">
              <label>Nomor Telepon</label>
              <input name="telepon" value={form.telepon} onChange={handleChange} required placeholder="08xxxxxxxxxx" type="tel" />
            </div>
            <div className="form-group">
              <label>Alamat Lengkap</label>
              <textarea name="alamat" value={form.alamat} onChange={handleChange} required rows="3" placeholder="Jalan, RT/RW, Kelurahan, Kecamatan" />
            </div>
            <div className="form-group">
              <label>Kota</label>
              <input name="kota" value={form.kota} onChange={handleChange} required placeholder="Kota / Kabupaten" />
            </div>
          </div>

          <div className="form-section">
            <h3>Metode Pembayaran</h3>
            {[['transfer', '💳 Transfer Bank'], ['ewallet', '📱 E-Wallet'], ['cod', '💵 Bayar di Tempat (COD)']].map(([val, label]) => (
              <label key={val} className={`pay-option ${form.metode === val ? 'active' : ''}`}>
                <input type="radio" name="metode" value={val} checked={form.metode === val} onChange={handleChange} />
                {label}
              </label>
            ))}
          </div>

          <button type="submit" className="btn btn-primary submit-order" disabled={loading}>
            {loading ? 'Memproses...' : `Pesan Sekarang — ${fmt(totalPrice)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="order-summary">
          <h3>Pesanan Anda</h3>
          {items.map(item => (
            <div key={item._id} className="order-item">
              <span className="order-item-name">{item.name} <span className="order-qty">×{item.qty}</span></span>
              <span className="order-item-price">{fmt(item.price * item.qty)}</span>
            </div>
          ))}
          <div className="order-divider" />
          <div className="order-total">
            <span>Total</span>
            <span>{fmt(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
