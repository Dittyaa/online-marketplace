import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">Market<span>Kita</span></Link>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={isActive('/') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Beranda</Link>
          <Link to="/produk" className={isActive('/produk') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Produk</Link>
          {isAuthenticated && (
            <Link to="/checkout" className={isActive('/checkout') ? 'active' : ''} onClick={() => setMenuOpen(false)}>Pesanan</Link>
          )}
        </div>

        <div className="navbar-right">
          <Link to="/keranjang" className="cart-btn">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          {isAuthenticated ? (
            <div className="user-menu">
              <span className="user-name">{user?.name?.split(' ')[0]}</span>
              <button className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={() => { logout(); navigate('/'); setMenuOpen(false); }}>
                Keluar
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>Masuk</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Daftar</Link>
            </div>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
