import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Navbar from './components/Navbar';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/Dashboard'; // Ensure file name matches (Dashboard.js)
import ComplaintForm from './pages/ComplaintForm';
import MyComplaints from './pages/MyComplaints';
import Feedback from './pages/Feedback';
import About from "./pages/About";

// CSS
import './App.css';
import CategorySelection from './pages/CategorySelection';


// Protected Route: Sirf logged-in users ke liye
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navbar hamesha dikhega */}
        <Navbar />
        
        <main className="main-content">
          <Routes>
            {/* --- 1. Public Routes --- */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* --- 2. Private/Protected Routes --- */}
            
            {/* Citizen Dashboard (Cards wala page) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <CitizenDashboard />
              </ProtectedRoute>
            } />

            {/* New Complaint Form */}
            <Route path="/file-complaint" element={
              <ProtectedRoute>
                <ComplaintForm />
              </ProtectedRoute>
            } />

            {/* Complaint History List */}
            <Route path="/my-complaints" element={
              <ProtectedRoute>
                <MyComplaints />
              </ProtectedRoute>
            } />

            {/* Feedback Page - Yahan pehle missing tha */}
            <Route path="/feedback" element={
              <ProtectedRoute>
                <Feedback />
              </ProtectedRoute>
            } />

            {/* Default Route: Koi bhi random URL par '/' par bhej dega */}
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/select-category" element={<ProtectedRoute><CategorySelection /></ProtectedRoute>} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

       <footer className="footer">
  <div className="footer-content">
    <h3>Local Area Complaint Management System</h3>
    <p>Empowering citizens. Strengthening communities.</p>
    <span>© 2026 All Rights Reserved.</span>
  </div>
</footer>

      </div>
    </Router>
  );
}

export default App;