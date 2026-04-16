import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Star } from 'lucide-react';
import './Feedback.css';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/feedback');
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Error fetching feedbacks");
      }
    };
    fetchFeedbacks();
  }, []);

  return (
    <div className="admin-content">
      <h2>Citizens Feedback</h2>
      <div className="feedback-list">
        {feedbacks.map((fb) => (
          <div key={fb._id} className="feedback-item-card">
            <div className="rating">
              {[...Array(fb.rating)].map((_, i) => (
                <Star key={i} size={16} fill="#ca8a04" color="#ca8a04" />
              ))}
            </div>
            <p>"{fb.comment}"</p>
            <small>Submitted on: {new Date(fb.createdAt).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feedback;