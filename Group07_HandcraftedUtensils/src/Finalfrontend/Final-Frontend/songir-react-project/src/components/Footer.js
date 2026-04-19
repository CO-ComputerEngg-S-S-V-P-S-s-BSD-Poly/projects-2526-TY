// import React from 'react';
// import { Link } from 'react-router-dom';
// import Icon from '../utils/Icons';
// import './Footer.css';

// const Footer = () => {
//   const currentYear = new Date().getFullYear();

//   return (
//     <footer className="footer">
//       <div className="footer-container">
//         <div className="footer-content">
//           {/* About Section */}
//           <div className="footer-about">
//             <div className="footer-logo">
//               <Link to="/" className="footer-logo-link">
//                 <div className="footer-logo-icon">
//                   <svg viewBox="0 0 40 40" className="footer-logo-svg">
//                     <ellipse cx="20" cy="30" rx="12" ry="6" fill="currentColor" opacity="0.5"/>
//                     <ellipse cx="20" cy="28" rx="10" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5"/>
//                     <path d="M10 28 Q10 15 20 10 Q30 15 30 28" fill="none" stroke="currentColor" strokeWidth="2"/>
//                     <ellipse cx="20" cy="10" rx="5" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
//                   </svg>
//                 </div>
//                 <div>
//                   <h2 className="footer-logo-title">Songir</h2>
//                   <p className="footer-logo-subtitle">Handcrafted Utensils</p>
//                 </div>
//               </Link>
//             </div>
//             <p>
//               Connecting you directly with skilled artisans from Songir village. 
//               Experience authentic handcrafted brass and copper utensils made with 
//               generations of expertise and pure materials.
//             </p>
//             <div className="footer-social">
//               <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
//                 <Icon name="facebook" size={18} />
//               </a>
//               <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
//                 <Icon name="instagram" size={18} />
//               </a>
//               <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
//                 <Icon name="twitter" size={18} />
//               </a>
//             </div>
//           </div>

//           {/* Quick Links */}
//           <div className="footer-section">
//             <h3>Quick Links</h3>
//             <ul className="footer-links">
//               <li><Link to="/">Home</Link></li>
//               <li><Link to="/about">About Songir</Link></li>
//               <li><Link to="/shops">All Shops</Link></li>
//               <li><Link to="/products">Products</Link></li>
//               <li><Link to="/compare">Compare Prices</Link></li>
//             </ul>
//           </div>

//           {/* Customer Service */}
//           <div className="footer-section">
//             <h3>Customer Service</h3>
//             <ul className="footer-links">
//               <li><Link to="/orders">My Orders</Link></li>
//               <li><Link to="/WishlistPage">Wishlist</Link></li>
//               <li><Link to="/quote">Get a Quote</Link></li>
//               <li><Link to="/contact">Contact Us</Link></li>
//               <li><Link to="/Feedback">Feedback</Link></li>
//             </ul>
//           </div>

//           {/* Contact Info */}
//           <div className="footer-section">
//             <h3>Contact Us</h3>
//             <div className="footer-contact-item">
//               <Icon name="mapPin" size={20} className="footer-contact-icon" />
//               <span>Songir Village<br />Dhule, Maharashtra India</span>
//             </div>
//             <div className="footer-contact-item">
//               <Icon name="phone" size={20} className="footer-contact-icon" />
//               <span>+91 XXXXX XXXXX</span>
//             </div>
//             <div className="footer-contact-item">
//               <Icon name="mail" size={20} className="footer-contact-icon" />
//               <span>info@songir-marketplace.com</span>
//             </div>
//           </div>
//         </div>

//         {/* Footer Bottom */}
//         <div className="footer-bottom">
//           <p>
//             © {currentYear} Songir Marketplace. All rights reserved. | 
//             <Link to="/privacy"> Privacy Policy</Link> | 
//             <Link to="/terms"> Terms of Service</Link>
//           </p>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../utils/Icons';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          {/* About Section */}
          <div className="footer-about">
            <div className="footer-logo">
              <Link to="/" className="footer-logo-link" aria-label="Home">
                <div className="footer-logo-icon" aria-hidden="true">
                  <svg viewBox="0 0 40 40" className="footer-logo-svg">
                    <ellipse cx="20" cy="30" rx="12" ry="6" fill="currentColor" opacity="0.5" />
                    <ellipse cx="20" cy="28" rx="10" ry="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M10 28 Q10 15 20 10 Q30 15 30 28" fill="none" stroke="currentColor" strokeWidth="2" />
                    <ellipse cx="20" cy="10" rx="5" ry="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <h2 className="footer-logo-title">Songir</h2>
                  <p className="footer-logo-subtitle">Handcrafted Utensils</p>
                </div>
              </Link>
            </div>
            <p>
              Connecting you directly with skilled artisans from Songir village.
              Experience authentic handcrafted brass and copper utensils made with
              generations of expertise and pure materials.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
                <Icon name="facebook" size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <Icon name="instagram" size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
                <Icon name="twitter" size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Songir</Link></li>
              <li><Link to="/shops">All Shops</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/compare">Compare Prices</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="footer-section">
            <h3>Customer Service</h3>
            <ul className="footer-links">
              <li><Link to="/orders">My Orders</Link></li>
              <li><Link to="/wishlist">Wishlist</Link></li>   {/* Fixed: consistent lowercase path */}
              <li><Link to="/quote">Get a Quote</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/feedback">Feedback</Link></li>    {/* Fixed: lowercase */}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3>Contact Us</h3>
            <div className="footer-contact-item">
              <Icon name="mapPin" size={20} className="footer-contact-icon" />
              <span>Songir Village<br />Dhule, Maharashtra India</span>
            </div>
            <div className="footer-contact-item">
              <Icon name="phone" size={20} className="footer-contact-icon" />
              <span>+91 XXXXX XXXXX</span>
            </div>
            <div className="footer-contact-item">
              <Icon name="mail" size={20} className="footer-contact-icon" />
              <span>info@songir-marketplace.com</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>
            © {currentYear} Songir Marketplace. All rights reserved. |
            <Link to="/privacy"> Privacy Policy</Link> |
            <Link to="/terms"> Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;