import React from "react";
import "../Pages/Footer.css";

const Footer = () => {

    return(
        <footer className="footer">
        <div className="footer-content">

          <div className="footer-section">
            <h3>PurohitMitra</h3>
            <p>
              Your trusted partner for Hindu rituals, sanskar,
              festivals & spiritual services.
            </p>
          </div>

          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li>Home</li>
              <li>Explore</li>
              <li>Hindu Festival</li>
              <li>Vedic</li>
              <li>About Us</li>
              <li>Sanskar</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Services</h4>
            <ul>
              <li>All Pujas</li>
              <li>Yag</li>
              <li>Havan</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Contact</h4>
            <p>purohitmitra4@gmail.com</p>
          </div>

        </div>

        <div className="footer-bottom">
          © 2026 PurohitMitra. All rights reserved.
        </div>
      </footer>
    );
};
      export default Footer;