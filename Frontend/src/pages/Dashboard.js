import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FilePlus, History, MessageSquare, UserCircle } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const userName = localStorage.getItem('userName') || 'Citizen';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-content">
        <div className="welcome-section">
          <UserCircle size={50} color="#2563eb" />
          <h2>Welcome, {userName}!</h2>
          <p>Please select one of the options below to continue.</p>
        </div>

        <div className="card-grid">
        <div 
          className="menu-card blue" 
          onClick={() => navigate('/select-category')} // Pehle category pe jayega
        >
          <FilePlus size={35} />
        <h3>New Complaint</h3>
        <p>Select a category and report your issue.</p>
        </div>

          <div 
            className="menu-card green" 
            onClick={() => navigate('/my-complaints')}
          >
            <History size={35} />
            <h3>My Complaints</h3>
            <p>Track the real-time status of your submitted complaints.</p>
          </div>

          <div 
            className="menu-card yellow" 
            onClick={() => navigate('/feedback')}
          >
            <MessageSquare size={35} />
            <h3>Feedback</h3>
            <p>Share your feedback and help us improve our services.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
