import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div className="container">
        <div className="row">
          {/* Left Section - About */}
          <div className="col-md-4">
            <h5 className="fw-bold">About Flatemate</h5>
            <p>
              Your trusted platform to find the best flats and roommates in your city. Connect with verified users and enjoy a hassle-free experience.
            </p>
          </div>

          {/* Center Section - Contact Info */}
          <div className="col-md-4">
            <h5 className="fw-bold">Contact Us</h5>
            <p><FaEnvelope className="me-2" /> info@flatemate.com</p>
            <p><FaPhoneAlt className="me-2" /> +91 98765 43210</p>
            <p><FaMapMarkerAlt className="me-2" /> Pune, Maharashtra, India</p>
          </div>

          {/* Right Section - Social Links */}
          <div className="col-md-4 text-center">
            <h5 className="fw-bold">Follow Us</h5>
            <div className="d-flex justify-content-center gap-3">
              <FaFacebook className="social-icon" />
              <FaTwitter className="social-icon" />
              <FaInstagram className="social-icon" />
              <FaLinkedin className="social-icon" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <hr style={{ borderColor: "white" }} />
        <p className="text-center mt-3">© 2025 Flatemate. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

// ✅ Styles
const styles = {
  footer: {
    backgroundColor: "#20b2aa",
    color: "white",
    padding: "30px 0",
    marginTop: "50px",
  },
  socialIcon: {
    fontSize: "24px",
    cursor: "pointer",
  },
};

export default Footer;
