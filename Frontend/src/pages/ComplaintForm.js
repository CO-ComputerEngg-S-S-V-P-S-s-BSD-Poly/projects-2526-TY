import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Send, MapPin, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import LocationPicker from '../components/LocationPicker'; 
import './ComplaintForm.css';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const locationState = useLocation();

  const [complaint, setComplaint] = useState({
    category: '', 
    location: '',
    description: '',
    lat: null,
    lng: null
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // To auto-fill the category
  useEffect(() => {
    if (locationState.state && locationState.state.selectedCategory) {
      setComplaint(prev => ({
        ...prev,
        category: locationState.state.selectedCategory
      }));
    }
  }, [locationState.state]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onLocationSelect = (lat, lng) => {
    setComplaint(prev => ({ ...prev, lat, lng }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!complaint.lat || !complaint.lng) {
      alert("Please select the exact location on the map!");
      return;
    }

    const formData = new FormData();
    formData.append('category', complaint.category);
    formData.append('location', complaint.location);
    formData.append('description', complaint.description);
    formData.append('lat', complaint.lat);
    formData.append('lng', complaint.lng);
    
    if (image) {
      formData.append('image', image);
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/complaints',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token 
          }
        }
      );

      alert("Your complaint has been successfully submitted!");
      navigate('/my-complaints'); 

    } catch (err) {
      alert(err.response?.data?.msg || "Submission failed.");
    }
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <div className="form-header">
          <AlertTriangle color="#ef4444" size={32} />
          <h2>File a New Complaint</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Category Dropdown - It will remain DISABLED if data comes from state */}
          <div className="input-group">
            <label>Category</label>
            <select
              required
              value={complaint.category}
              // Category can only be changed if the user came directly through the URL
              disabled={!!(locationState.state && locationState.state.selectedCategory)}
              onChange={(e) =>
                setComplaint({ ...complaint, category: e.target.value })
              }
              className={locationState.state?.selectedCategory ? "disabled-select" : ""}
            >
              <option value="">-- Select Category --</option>
              <option value="Electricity">Electricity</option>
              <option value="Water">Water Supply</option>
              <option value="Roads">Road Maintenance</option>
              <option value="Sanitation">Sanitation</option>
              <option value="Drainage">Drainage</option>
              <option value="StrayAnimals">StrayAnimals</option>
            </select>
            {locationState.state?.selectedCategory && (
              <small className="lock-text">Category is locked based on your selection.</small>
            )}
          </div>

          <div className="input-group">
            <label><MapPin size={16} /> Area / Landmark</label>
            <input
              type="text"
              placeholder="Enter area or locality name"
              required
              onChange={(e) =>
                setComplaint({ ...complaint, location: e.target.value })
              }
            />
          </div>

          <div className="input-group">
            <label><MapPin size={16}/> Select Exact Location on Map</label>
            <LocationPicker onLocationSelect={onLocationSelect} />
            {complaint.lat && (
              <p className="coord-text">Selected: {complaint.lat.toFixed(4)}, {complaint.lng.toFixed(4)}</p>
            )}
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              rows="4"
              placeholder="Provide detailed information about the issue..."
              required
              onChange={(e) =>
                setComplaint({ ...complaint, description: e.target.value })
              }
            ></textarea>
          </div>

          <div className="input-group">
            <label><ImageIcon size={16} /> Upload Image</label>
            {!preview ? (
              <label className="upload-placeholder">
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                <span>Click to upload evidence photo</span>
              </label>
            ) : (
              <div className="image-preview-container">
                <img src={preview} alt="Preview" className="img-preview" />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => { setImage(null); setPreview(null); }}
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="btn-submit">
            <Send size={18} /> Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default ComplaintForm;
