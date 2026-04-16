import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Edit, Save, X, Search, Loader2 } from 'lucide-react'; // Behtar Icons ke liye
import './ManageDepartments.css';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [newDepartment, setNewDepartment] = useState({ name: '', description: '' });
  
  // Edit mode ke liye states
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', description: '' });

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/departments', {
        headers: { 'x-auth-token': token }
      });
      setDepartments(res.data);
    } catch (err) {
      console.error("Departments load nahi ho paye", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // Naya Department Add karna
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/departments', newDepartment, {
        headers: { 'x-auth-token': token }
      });
      alert("Department successfully add ho gaya!");
      setNewDepartment({ name: '', description: '' });
      fetchDepartments();
    } catch (err) {
      alert("Department add karne mein dikkat aayi");
    }
  };

  // Edit Mode Start karna
  const handleEditClick = (dept) => {
    setEditId(dept._id);
    setEditFormData({ name: dept.name, description: dept.description });
  };

  // Update logic
  const handleUpdate = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/departments/${id}`, editFormData, {
        headers: { 'x-auth-token': token }
      });
      setEditId(null);
      fetchDepartments();
    } catch (err) {
      alert("Update failed");
    }
  };

  // Delete logic
  const handleDelete = async (id) => {
    if(window.confirm("Kya aap ise delete karna chahte hain?")) {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/departments/${id}`, {
                headers: { 'x-auth-token': token }
            });
            fetchDepartments();
        } catch (err) {
            alert("Delete failed");
        }
    }
  };

  // Search filter logic
  const filteredDepartments = departments.filter(dept => 
    dept.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="admin-main">
      <div className="admin-header">
        <h2>Manage Departments</h2>
        {/* Search Bar */}
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search department..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Add Department Form */}
      <form onSubmit={handleAddDepartment} className="department-form">
        <input 
          type="text" 
          placeholder="Department Name (e.g. Water, Electricity)" 
          value={newDepartment.name}
          onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })} 
          required 
        />
        <input 
          type="text" 
          placeholder="Short Description" 
          value={newDepartment.description}
          onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })} 
        />
        <button type="submit" className="add-btn">Add New</button>
      </form>

      {loading ? (
        <div className="loader"><Loader2 className="spinner" /> Loading...</div>
      ) : (
        <div className="table-container">
          <table className="complaint-table">
            <thead>
              <tr>
                <th>Department Name</th>
                <th>Description</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map(dept => (
                <tr key={dept._id}>
                  {editId === dept._id ? (
                    // Edit View
                    <>
                      <td><input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} /></td>
                      <td><input type="text" value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} /></td>
                      <td className="actions-cell">
                        <button onClick={() => handleUpdate(dept._id)} className="save-btn"><Save size={16} /></button>
                        <button onClick={() => setEditId(null)} className="cancel-btn"><X size={16} /></button>
                      </td>
                    </>
                  ) : (
                    // Default View
                    <>
                      <td><strong>{dept.name}</strong></td>
                      <td>{dept.description || "No description"}</td>
                      <td className="actions-cell">
                          <button onClick={() => handleEditClick(dept)} className="edit-btn"><Edit size={16} /></button>
                          <button onClick={() => handleDelete(dept._id)} className="delete-btn"><Trash2 size={16} /></button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageDepartments;