import React from 'react';

function Contact() {
  return (
    <div className="container py-5 mt-5 text-center">
      <h1 className="fw-bold display-4 mb-4">Contact <span className="text-primary">Us</span></h1>
      <p className="lead text-muted mb-5">We'd love to hear from you! Reach out to us for any queries.</p>
      
      <div className="row justify-content-center">
        <div className="col-md-6 shadow-lg p-5 rounded-4 bg-white border">
          <div className="text-start">
            <h4 className="fw-bold mb-4 text-dark">Get In Touch</h4>
            <p className="fs-5">📧 <strong>Email:</strong> support@freelancemarket.com</p>
            <p className="fs-5">📞 <strong>Phone:</strong> +91 98765 43210</p>
            <hr className="my-4" />
            <p className="fs-5 text-secondary">📍 <strong>Location:</strong> Nashik, Maharashtra, India</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
