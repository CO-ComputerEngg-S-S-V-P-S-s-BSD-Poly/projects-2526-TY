/**
 * AuthContext.jsx
 * ─────────────────────────────────────────────────────────
 * Global auth state. Wrap your <App /> with <AuthProvider>.
 * After register or login, call setUser({ name, email, plan })
 * and the Navbar (and any protected page) will auto-update.
 * ─────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

/* ── shape of a logged-in user ── */
const DEFAULT_USER = null;
// e.g. { name: 'Rahul Sharma', email: 'rahul@songir.in', plan: 'Premium' }

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  /* ── Try to restore session from localStorage on first load ── */
  const [user, setUserState] = useState(() => {
    try {
      const stored = localStorage.getItem('songir_user');
      return stored ? JSON.parse(stored) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  /* ── Persist to localStorage whenever user changes ── */
  useEffect(() => {
    if (user) {
      localStorage.setItem('songir_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('songir_user');
    }
  }, [user]);

  /* ── Called after successful REGISTER ── */
  const register = ({ name, email, plan = 'Free' }) => {
    const newUser = { name, email, plan };
    setUserState(newUser);
    // TODO: also POST to your backend API here
  };

  /* ── Called after successful LOGIN ── */
  const login = ({ name, email, plan = 'Free' }) => {
    const loggedIn = { name, email, plan };
    setUserState(loggedIn);
    // TODO: verify JWT / session from your backend
  };

  /* ── Called on Sign Out ── */
  const logout = () => {
    setUserState(null);
    localStorage.removeItem('songir_user');
  };

  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/* ── Hook for easy use in any component ── */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}