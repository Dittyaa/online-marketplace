import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setError('Password tidak cocok');
    if (form.password.length < 6) return setError('Password minimal 6 karakter');
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/produk');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Market<span>Kita</span></div>
        <h2>Buat Akun Baru</h2>
        <p className="auth-sub">Sudah punya akun? <Link to="/login">Masuk</Link></p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nama Lengkap</label>
            <input type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Nama Anda" required autoFocus />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="email@contoh.com" required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} placeholder="Minimal 6 karakter" required />
          </div>
          <div className="form-group">
            <label>Konfirmasi Password</label>
            <input type="password" value={form.confirm} onChange={e => setForm({...form, confirm: e.target.value})} placeholder="Ulangi password" required />
          </div>
          <button type="submit" className="btn btn-primary auth-btn" disabled={loading}>
            {loading ? 'Memproses...' : 'Daftar Sekarang →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
