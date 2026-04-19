import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import SelectSite from './pages/SelectSite';
import AdminDashboard from './pages/AdminDashboard';
import SupervisorDashboard from './pages/SupervisorDashboard';
import './App.css';

// Admin only route
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'admin') return <Navigate to="/supervisor" />;
  return children;
};

// Supervisor only route — must have site selected
const SupervisorRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (!user.site) return <Navigate to="/select-site" />;
  return children;
};

// Select site — only for supervisors without a site
const SelectSiteRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="loading-screen"><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;
  if (user.role === 'admin') return <Navigate to="/admin" />;
  if (user.site) return <Navigate to="/supervisor" />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  const getHome = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (!user.site) return '/select-site';
    return '/supervisor';
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={getHome()} /> : <Login />} />
      <Route path="/select-site" element={<SelectSiteRoute><SelectSite /></SelectSiteRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/supervisor" element={<SupervisorRoute><SupervisorDashboard /></SupervisorRoute>} />
      <Route path="*" element={<Navigate to={getHome()} />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      </Router>
    </AuthProvider>
  );
}

export default App;
