import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap, Droplets, Construction, Trash2, ArrowLeft } from 'lucide-react';
import './CategorySelection.css';

const CategorySelection = () => {
  const navigate = useNavigate();

  const categories = [
    { id: 'Electricity', name: 'Electricity', icon: <Zap size={30} />, color: '#fbbf24', desc: 'Power cuts, street lights, etc.' },
    { id: 'Water', name: 'Water Supply', icon: <Droplets size={30} />, color: '#3b82f6', desc: 'No water, leakage, or bad quality.' },
    { id: 'Roads', name: 'Roads', icon: <Construction size={30} />, color: '#f97316', desc: 'Potholes or broken roads.' },
    { id: 'Sanitation', name: 'Sanitation', icon: <Trash2 size={30} />, color: '#10b981', desc: 'Garbage collection or drainage.' },
    { id: 'Drainage', name: 'Drainage', icon: <Droplets size={30} />, color: '#38bdf8', desc: 'Blocked or overflowing drainage.' },
    { id: 'StrayAnimals', name: 'Stray Animals', icon: <Construction size={30} />, color: '#fb923c', desc: 'Stray dogs or animals causing issues.' },
  ];

  const handleSelect = (categoryName) => {
    // Navigate karte waqt hum 'state' bhej rahe hain
    navigate('/file-complaint', { state: { selectedCategory: categoryName } });
  };

  return (
    <div className="category-wrapper">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>
        <ArrowLeft size={20} /> Back to Dashboard
      </button>
      <h2>Select Complaint Category</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="cat-card" onClick={() => handleSelect(cat.id)}>
            <div className="cat-icon" style={{ backgroundColor: cat.color }}>{cat.icon}</div>
            <h3>{cat.name}</h3>
            <p>{cat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySelection;