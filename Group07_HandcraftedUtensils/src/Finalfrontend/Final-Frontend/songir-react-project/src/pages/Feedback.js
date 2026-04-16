import React, { useState } from "react";
import "./Feedback.css";

const categories = ["UI Experience", "Performance", "Support", "Features"];

export default function FeedbackSection() {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const ratingText = () => {
    switch (rating) {
      case 1: return "We’ll improve.";
      case 2: return "Thanks! We’ll do better.";
      case 3: return "Good! Tell us more.";
      case 4: return "Great! Thank you!";
      case 5: return "You love us! ❤️";
      default: return "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !rating || !message) return;

    const newFeedback = {
      id: Date.now(),
      name,
      rating,
      category,
      message
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setRating(0);
      setCategory("");
      setMessage("");
    }, 2000);
  };

  return (
    <div className="feedback-container">
      <div className="feedback-left">
        <h2>Trusted by 10,000+ Users</h2>
        <p>Your feedback helps us improve continuously.</p>
        <h3>⭐ 4.8 / 5 Average Rating</h3>
      </div>

      <div className="feedback-right">
        <form onSubmit={handleSubmit} className="feedback-form">

          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="stars">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <span
                  key={index}
                  className={starValue <= (hover || rating) ? "star active" : "star"}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                >
                  ★
                </span>
              );
            })}
          </div>

          {rating > 0 && <div className="rating-text">{ratingText()}</div>}

          <div className="category">
            {categories.map((cat) => (
              <button
                type="button"
                key={cat}
                className={category === cat ? "pill active-pill" : "pill"}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
          />

          <button type="submit" className="submit-btn">
            Submit Feedback
          </button>

          {submitted && <div className="success">✔ Feedback Submitted!</div>}
        </form>
      </div>

      <div className="feedback-list">
        {feedbacks.map((fb) => (
          <div key={fb.id} className="feedback-card">
            <h4>{fb.name}</h4>
            <div className="card-rating">
              {"★".repeat(fb.rating)}
              {"☆".repeat(5 - fb.rating)}
            </div>
            <small>{fb.category}</small>
            <p>{fb.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}