import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Eye, CheckCircle, RefreshCcw, Building2 } from 'lucide-react'; // Building2 icon for departments
import './ManageComplaints.css';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [departments, setDepartments] = useState([]); // Nayi state departments ke liye

  // 1. Complaints aur Departments dono fetch karein
  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'x-auth-token': token } };

      // Dono API calls ek saath karein
      const [compRes, deptRes] = await Promise.all([
        axios.get('http://localhost:5000/api/complaints/all', config),
        axios.get('http://localhost:5000/api/departments', config)
      ]);

      setComplaints(compRes.data);
      setDepartments(deptRes.data);
    } catch (err) {
      console.error("Data Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // 2. Status update karne ka function
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/complaints/${id}`, 
        { status: newStatus },
        { headers: { 'x-auth-token': token } }
      );
      alert(`Status updated to ${newStatus}`);
      fetchAllData(); 
    } catch (err) {
      alert("Update failed");
    }
  };

  // 3. Department assign karne ka function
  const handleAssignDept = async (complaintId, deptId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/complaints/assign/${complaintId}`, 
        { departmentId: deptId },
        { headers: { 'x-auth-token': token } }
      );
      alert("Department Assigned Successfully!");
      fetchAllData(); // Refresh list to show updated department
    } catch (err) {
      alert("Department assignment failed");
    }
  };

  return (
    <div className="admin-main">
      <h2>Manage Complaints</h2>
      <div className="table-container">
        <table className="complaint-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Category</th>
              <th>Photo</th>
              <th>Status</th>
              <th>Assign Department</th> {/* Naya Column */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c._id}>
                <td>
                  {c.user?.name} <br/> 
                  <small>{c.user?.phone}</small>
                </td>
                <td>{c.category}</td>
                <td>
                  {c.image ? (
                    <a href={`http://localhost:5000/${c.image}`} target="_blank" rel="noreferrer">View</a>
                  ) : "No Image"}
                </td>
                <td><span className={`status-pill ${c.status.toLowerCase()}`}>{c.status}</span></td>
                
                {/* --- DEPARTMENT ASSIGNMENT DROPDOWN --- */}
                <td>
                  <select 
                    className="dept-dropdown"
                    value={c.department?._id || ""} 
                    onChange={(e) => handleAssignDept(c._id, e.target.value)}
                  >
                    <option value="">Select Department</option>
                    {departments.map(d => (
                      <option key={d._id} value={d._id}>{d.name}</option>
                    ))}
                  </select>
                </td>

                <td className="actions">
                  <button onClick={() => handleUpdateStatus(c._id, 'In Progress')} className="update-btn" title="In Progress">
                    <RefreshCcw size={16}/>
                  </button>
                  <button onClick={() => handleUpdateStatus(c._id, 'Resolved')} className="resolve-btn" title="Resolved">
                    <CheckCircle size={16}/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageComplaints;