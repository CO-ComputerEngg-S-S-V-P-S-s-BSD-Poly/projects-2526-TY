import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../Components/AdminSidebar';
import { Trash2, Search, UserCheck, Loader2 } from 'lucide-react'; // Behtar UI ke liye icons
import './ManageUsers.css';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Users fetch karne ka function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { 'x-auth-token': token }
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Users load nahi ho paye", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. User delete karne ka function
  const handleDeleteUser = async (id) => {
    if (window.confirm("Kya aap is user ko remove karna chahte hain?")) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: { 'x-auth-token': token }
        });
        alert("User deleted successfully!");
        fetchUsers(); // List refresh karein
      } catch (err) {
        alert("Delete karne mein error aaya");
      }
    }
  };

  // 3. Search filter logic
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-layout1">
      <AdminSidebar />
      <div className="admin-main1">
        <div className="admin-header">
          <h2>Registered Users</h2>
          
          {/* Search Bar */}
          <div className="search-bar">
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loader-container">
            <Loader2 className="spinner" /> <p>Loading Users...</p>
          </div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map(u => (
                  <tr key={u._id}>
                    <td><strong>{u.name}</strong></td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>
                      <span className={`role-badge ${u.role}`}>
                        {u.role === 'admin' ? <UserCheck size={14} /> : null} {u.role}
                      </span>
                    </td>
                    <td>
                      {/* Admin khud ko delete na kar sake isliye check lagaya ja sakta hai */}
                      <button 
                        className="delete-btn" 
                        onClick={() => handleDeleteUser(u._id)}
                        title="Delete User"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;