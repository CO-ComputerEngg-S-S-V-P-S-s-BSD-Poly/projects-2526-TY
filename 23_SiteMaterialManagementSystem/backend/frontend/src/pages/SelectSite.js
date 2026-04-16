import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import logo from '../logo.jpg';
import './SelectSite.css';

const PREDEFINED_SITES = [
  { name: 'Shivashree 12',            icon: 'fa-building',      color: '#f97316' },
  { name: 'Shivashree 7D',            icon: 'fa-city',          color: '#3b82f6' },
  { name: 'Shivashree 9D',            icon: 'fa-hard-hat',      color: '#22c55e' },
  { name: 'Shivashree 12A',           icon: 'fa-building',      color: '#a855f7' },
  { name: 'Padmashree 8',             icon: 'fa-landmark',      color: '#f59e0b' },
  { name: 'Padmashree Park Nashik',   icon: 'fa-tree',          color: '#10b981' },
  { name: 'Padmashree 9',             icon: 'fa-industry',      color: '#ef4444' },
  { name: 'Ekdant Padmashree Heights',icon: 'fa-mountain',      color: '#6366f1' },
];

const SelectSite = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [sites, setSites] = useState(PREDEFINED_SITES);
  const [selectedSite, setSelectedSite] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get('/api/sites').then(res => {
      const extra = res.data
        .filter(s => !PREDEFINED_SITES.find(p => p.name === s))
        .map(s => ({ name: s, icon: 'fa-map-marker-alt', color: '#64748b' }));
      setSites([...PREDEFINED_SITES, ...extra]);
    }).catch(() => {});
  }, []);

  const handleConfirm = async () => {
    if (!selectedSite) { toast.error('Please select your site'); return; }
    setLoading(true);
    try {
      const res = await axios.put('/api/select-site', { site: selectedSite });
      updateUser(res.data.user);
      toast.success(`You are now set up for ${selectedSite}!`);
      navigate('/supervisor');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to set site. Try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="select-site-page">
      <div className="ss-bg">
        <div className="ss-orb ss-orb1" />
        <div className="ss-orb ss-orb2" />
      </div>

      <div className="ss-card">
        {/* Header */}
        <div className="ss-header">
          <img src={logo} alt="Padmashree Builders" className="ss-logo" />
          <div className="ss-welcome">
            <div className="ss-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div>
              <h2>Hi, {user?.name}!</h2>
              <p>Select the site you are assigned to</p>
            </div>
          </div>
        </div>

        {/* Site grid */}
        <div className="ss-grid">
          {sites.map(site => (
            <button
              key={site.name}
              className={`ss-site-card ${selectedSite === site.name ? 'selected' : ''}`}
              onClick={() => setSelectedSite(site.name)}
              style={{ '--site-color': site.color }}
            >
              <div className="ss-site-icon">
                <i className={`fas ${site.icon}`} />
              </div>
              <div className="ss-site-name">{site.name}</div>
              {selectedSite === site.name && (
                <div className="ss-check"><i className="fas fa-check-circle" /></div>
              )}
            </button>
          ))}
        </div>

        {/* Confirm */}
        <button className="ss-confirm-btn" onClick={handleConfirm} disabled={!selectedSite || loading}>
          {loading
            ? <><i className="fas fa-spinner fa-spin" /> Setting up your workspace…</>
            : <><i className="fas fa-arrow-right" /> Enter {selectedSite || 'Site'}</>}
        </button>

        <p className="ss-note">
          <i className="fas fa-info-circle" /> Your site will be remembered for future logins. Contact admin to change it.
        </p>
      </div>
    </div>
  );
};

export default SelectSite;
