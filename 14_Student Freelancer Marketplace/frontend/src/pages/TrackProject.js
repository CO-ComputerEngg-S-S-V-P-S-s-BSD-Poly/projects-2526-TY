import React, { useState } from 'react';
import axios from 'axios';

function TrackProject() {
  const [email, setEmail] = useState('');
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    setError('');
    setProject(null);
    try {
      const res = await axios.get(`http://localhost:5000/api/track/${email}`);
      setProject(res.data);
    } catch (err) {
      setError("❌ No project found with this email. Please check and try again.");
    }
  };

  return (
    <div className="container py-5 mt-4">
      <div className="row justify-content-center">
        <div className="col-md-7">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <h2 className="text-center fw-bold mb-4">Track Your Project Progress</h2>
            
            <form onSubmit={handleTrack} className="mb-4">
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control px-4" 
                  placeholder="Enter your registered email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
                <button className="btn btn-primary px-4 fw-bold shadow-sm" type="submit">Track Now</button>
              </div>
            </form>

            {error && <div className="alert alert-danger text-center">{error}</div>}

            {project && (
              <div className="mt-5 p-4 border rounded-4 bg-light">
                <h4 className="fw-bold text-primary mb-3">Project: {project.serviceType}</h4>
                <p className="mb-2"><strong>Client:</strong> {project.fullName}</p>
                <p className="mb-4">
                  <strong>Status:</strong> <span className="badge bg-warning text-dark px-3 py-2">{project.status}</span>
                </p>
                
                {/* प्रोग्रेस बार फिक्स - Math.abs वापरून मायनस चिन्ह काढले */}
                <h6 className="fw-bold mb-2">Completion Progress: {Math.abs(project.progress)}%</h6>
                <div className="progress rounded-pill shadow-sm" style={{ height: '30px', background: '#e9ecef' }}>
                  <div 
                    className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                    role="progressbar" 
                    style={{ width: `${Math.abs(project.progress)}%` }} 
                  >
                    {Math.abs(project.progress)}%
                  </div>
                </div>
                <p className="mt-4 text-muted small text-end italic">Last updated: {new Date(project.date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackProject;
