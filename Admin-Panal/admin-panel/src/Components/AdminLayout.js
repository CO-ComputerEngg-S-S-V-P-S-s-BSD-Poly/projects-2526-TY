import React from 'react';
import AdminSidebar from './AdminSidebar';

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

export default AdminLayout;