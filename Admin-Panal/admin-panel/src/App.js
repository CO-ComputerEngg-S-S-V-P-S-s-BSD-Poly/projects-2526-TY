import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ManageComplaints from './pages/ManageComplaints';

// Components (Make sure path is correct)
import AdminSidebar from './Components/AdminSidebar'; 
import Feedback from './pages/Feedback'
import ManageUsers from './pages/ManageUsers';
import ManageDepartments from './pages/ManageDepartments';
// 1. Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/" />;
};

// 2. Admin Layout Component (Isse Sidebar har page pe dikhega)
const AdminLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div style={{ flex: 1, marginLeft: '260px', padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page: Bina sidebar ke */}
        <Route path="/" element={<AdminLogin />} />
        
        {/* Protected Admin Routes: Sidebar ke saath */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        } />

        <Route path="/complaints" element={
          <ProtectedRoute>
            <AdminLayout>
              <ManageComplaints />
            </AdminLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/admin/feedbacks" element={
           <ProtectedRoute>
             <AdminLayout>
              <Feedback />
            </AdminLayout>
           </ProtectedRoute>
        } />
        
        <Route path="/admin/users" element={<ProtectedRoute><ManageUsers /></ProtectedRoute>} />

        <Route path="/admin/departments" element={
           <ProtectedRoute>
             <AdminLayout>
              <ManageDepartments />
            </AdminLayout>
           </ProtectedRoute>
        } />

        {/* Agar koi galat URL daale toh login pe bhej do */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;