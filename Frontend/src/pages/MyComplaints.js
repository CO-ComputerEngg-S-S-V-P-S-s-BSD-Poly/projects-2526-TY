import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, CheckCircle, AlertCircle, Building2 } from 'lucide-react'; // Building2 icon add kiya
import './MyComplaint.css';

const MyComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const token = localStorage.getItem('token');

        // Backend API call: Fetch only the logged-in user's complaints
        const res = await axios.get(
          'http://localhost:5000/api/complaints/my',
          {
            headers: {
              'x-auth-token': token
            }
          }
        );

        setComplaints(res.data);
        setLoading(false);

      } catch (err) {
        console.error("Error fetching complaints:", err);
        setLoading(false);
      }
    };

    fetchMyComplaints();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Resolved': 
        return 'status-resolved';
      case 'In Progress': 
        return 'status-progress';
      default: 
        return 'status-pending';
    }
  };

  if (loading) return <div className="loader">Loading your complaints...</div>;

  return (
    <div className="my-complaints-container">
      <div className="header-section">
        <h2>My Complaint History</h2>
        <p>Track the real-time status of your submitted complaints.</p>
      </div>

      <div className="complaints-list">
        {complaints.length === 0 ? (
          <p>You have not submitted any complaints yet.</p>
        ) : (
          complaints.map((item) => (
            <div key={item._id} className="complaint-card">
              <div className="card-info">
                <span className="complaint-id">
                  ID: {item._id.slice(-6).toUpperCase()}
                </span>

                <h3>{item.category}</h3>

                {/* --- UPDATE: Department Display Logic --- */}
                <div className="dept-info">
                  <Building2 size={16} color="#64748b" />
                  <span>
                    <strong>Department:</strong> {item.department ? item.department.name : "Pending Assignment"}
                  </span>
                </div>

                <p>
                  <strong>Location:</strong> {item.location}
                </p>

                {/* Display attached image link if available */}
                {item.image && (
                  <a 
                    href={`http://localhost:5000/${item.image}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="view-image-link"
                  >
                    View Attached Image
                  </a>
                )}

                <p className="date-text">
                  Filed on: {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
              
              <div className={`status-badge ${getStatusStyle(item.status)}`}>
                {item.status}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyComplaints;