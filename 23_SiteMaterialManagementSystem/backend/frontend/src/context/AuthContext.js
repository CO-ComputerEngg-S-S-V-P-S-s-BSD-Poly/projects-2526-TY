import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  const _saveSession = (userData, tokenData) => {
    localStorage.setItem('token', tokenData);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${tokenData}`;
    setToken(tokenData);
    setUser(userData);
  };

  // Supervisor login — username + system password
  const login = async (username, password) => {
    const res = await axios.post('/api/login', { username, password });
    _saveSession(res.data.user, res.data.token);
    return res.data.user;
  };

  // Admin login — email + password
  const adminLogin = async (email, password) => {
    const res = await axios.post('/api/admin-login', { email, password });
    _saveSession(res.data.user, res.data.token);
    return res.data.user;
  };

  // Save after signup (before site selection)
  const saveSession = (userData, tokenData) => _saveSession(userData, tokenData);

  // Update user in state after site selection
  const updateUser = (updatedUser) => {
    const merged = { ...user, ...updatedUser };
    localStorage.setItem('user', JSON.stringify(merged));
    setUser(merged);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, adminLogin, saveSession, updateUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
