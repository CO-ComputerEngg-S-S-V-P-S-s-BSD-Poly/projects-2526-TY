import React, { useState } from 'react';
import axios from 'axios';
import { Star, Send, MessageSquare } from 'lucide-react';
import './Feedback.css';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/feedback',
        { rating, comment },
        { headers: { 'x-auth-token': token } }
      );

      alert("Thank you for your valuable feedback!");
      setComment('');
      setRating(0);

    } catch (err) {
      alert("Unable to submit feedback. Please try again.");
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-card">
        <MessageSquare size={40} color="#2563eb" />
        <h2>Your Feedback</h2>
        <p>Please let us know how we can improve our services.</p>

        <form onSubmit={handleSubmit}>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={32}
                fill={star <= rating ? "#ca8a04" : "none"}
                color={star <= rating ? "#ca8a04" : "#cbd5e1"}
                onClick={() => setRating(star)}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>

          <textarea
            placeholder="Write your comments here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />

          <button type="submit" className="submit-feedback-btn">
            Submit Feedback <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Feedback;
