import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, X, MapPin, Wrench, Calendar, Loader2 } from 'lucide-react';
import './Sellers.css';

const Sellers = () => {
  const [pendingSellers, setPendingSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Pending Sellers from Backend
  useEffect(() => {
    fetchPendingSellers();
  }, []);

  const fetchPendingSellers = async () => {
    try {
      const token = localStorage.getItem('token'); // Token nikalna zaroori hai
      const res = await axios.get(
        "http://localhost:5000/api/auth/pending-sellers",
        { headers: { Authorization: `Bearer ${token}` } } // Headers add kiye
      );
      setPendingSellers(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sellers:", error);
      setLoading(false);
    }
  };

  // ✅ Approve Seller
  const handleApprove = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/auth/approve/${id}`,
        {}, // Body empty
        { headers: { Authorization: `Bearer ${token}` } } // Auth header
      );

      alert("Artisan Approved Successfully!");

      // UI se remove karein
      setPendingSellers(prev =>
        prev.filter(s => s._id !== id)
      );

    } catch (error) {
      console.error("Approval error:", error);
      alert("Verification fail ho gayi.");
    }
  };

  // ❌ Reject Seller logic
  const handleReject = (id) => {
    if (window.confirm("Kya aap is application ko reject karna chahte hain?")) {
      setPendingSellers(prev =>
        prev.filter(s => s._id !== id)
      );
      alert("Application Removed from List.");
    }
  };

  return (
    <div className="sellers-page">
      <div className="page-header">
        <h1>Artisan Applications</h1>
        <p>Review and verify rural artisans for GramKala marketplace.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-10">
          <Loader2 className="animate-spin text-green-600" size={32} />
        </div>
      ) : (
        <div className="sellers-list">
          {pendingSellers.length > 0 ? (
            pendingSellers.map((seller) => (
              <div key={seller._id} className="seller-approval-card">

                <div className="seller-info">
                  <h3>
                    {seller.firstName} {seller.lastName}
                  </h3>

                  <div className="info-tags">
                    <span>
                      <MapPin size={14} /> {seller.village || 'GramKala Cluster'}
                    </span>

                    <span>
                      <Wrench size={14} /> {seller.craftType}
                    </span>

                    <span>
                      <Calendar size={14} /> 
                      {new Date(seller.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="action-buttons">
                  <button
                    className="approve-btn"
                    onClick={() => handleApprove(seller._id)}
                  >
                    <Check size={18} /> Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => handleReject(seller._id)}
                  >
                    <X size={18} /> Reject
                  </button>
                </div>

              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No pending artisan applications.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Sellers;