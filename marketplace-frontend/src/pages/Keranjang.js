import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Keranjang.css';

const API = process.env.REACT_APP_API_URL || 'http://dummyjson.com';
const fmt = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

const Keranjang = () => {
  const { items, removeFromCart, updateQty, totalPrice, totalItems } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="container keranjang-empty">
        <div className="empty-icon">🛒</div>
        <h2>Keranjang Kosong</h2>
        <p>Belum ada produk yang ditambahkan.</p>
        <Link to="/produk" className="btn btn-primary">Mulai Belanja</Link>
      </div>
    );
  }

  return (
    <div className="container keranjang-page">
      <h1 className="keranjang-title">Keranjang Belanja <span>({totalItems} item)</span></h1>

      <div className="keranjang-layout">
        <div className="keranjang-items">
          {items.map(item => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-img">
                {item.image
                  ? <img src={`${API}${item.image}`} alt={item.name} />
                  : <span>🏷️</span>
                }
              </div>
              <div className="cart-item-info">
                <Link to={`/produk/${item._id}`} className="cart-item-name">{item.name}</Link>
                <span className="badge">{item.category}</span>
                <p className="cart-item-price">{fmt(item.price)}</p>
              </div>
              <div className="cart-item-right">
                <div className="qty-control">
                  <button onClick={() => item.qty === 1 ? removeFromCart(item._id) : updateQty(item._id, item.qty - 1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => updateQty(item._id, item.qty + 1)}>+</button>
                </div>
                <p className="cart-item-subtotal">{fmt(item.price * item.qty)}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>✕</button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Ringkasan Pesanan</h3>
          <div className="summary-row">
            <span>Subtotal ({totalItems} item)</span>
            <span>{fmt(totalPrice)}</span>
          </div>
          <div className="summary-row">
            <span>Ongkir</span>
            <span className="free-ship">Gratis</span>
          </div>
          <div className="summary-divider" />
          <div className="summary-row summary-total">
            <span>Total</span>
            <span>{fmt(totalPrice)}</span>
          </div>
          <button className="btn btn-primary checkout-btn" onClick={handleCheckout}>
            {isAuthenticated ? 'Lanjut Checkout →' : 'Login untuk Checkout →'}
          </button>
          <Link to="/produk" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', marginTop: '8px' }}>
            Lanjut Belanja
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Keranjang;
