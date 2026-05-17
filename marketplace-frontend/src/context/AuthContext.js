import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const API = process.env.REACT_APP_API_URL || 'http://dummyjson.com';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('mk_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    else delete axios.defaults.headers.common['Authorization'];
  }, [token]);

  useEffect(() => {
    const init = async () => {
      if (token) {
        try {
          const res = await axios.get(`${API}/api/auth/me`);
          setUser(res.data.user);
        } catch {
          localStorage.removeItem('mk_token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    init();
  }, [token]);

  const login = async (email, password) => {
    const res = await axios.post(`${API}/api/auth/login`, { email, password });
    localStorage.setItem('mk_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${API}/api/auth/register`, { name, email, password });
    localStorage.setItem('mk_token', res.data.token);
    setToken(res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('mk_token');
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated: !!token && !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
