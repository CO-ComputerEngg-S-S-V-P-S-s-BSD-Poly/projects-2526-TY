import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Users, LogOut, MessageSquare, Briefcase } from 'lucide-react';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <div className="admin-sidebar">
      <div className="admin-logo">
        <h3>Admin Portal</h3>
      </div>

      <ul className="admin-links">
        <li>
          <Link to="/dashboard">
            <LayoutDashboard size={20}/> Dashboard
          </Link>
        </li>

        <li>
          <Link to="/complaints">
            <ListChecks size={20}/> All Complaints
          </Link>
        </li>

        <li>
          <Link to="/admin/users">
            <Users size={20}/> Manage Users
          </Link>
        </li>

        <li>
          <Link to="/admin/departments">
            <Briefcase size={20}/> Manage Departments
          </Link>
        </li>

        <li>
          <Link to="/admin/feedbacks">
            <MessageSquare size={20}/> User Feedbacks
          </Link>
        </li>

        <li className="logout">
          <Link to="/login">
            <LogOut size={20}/> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
