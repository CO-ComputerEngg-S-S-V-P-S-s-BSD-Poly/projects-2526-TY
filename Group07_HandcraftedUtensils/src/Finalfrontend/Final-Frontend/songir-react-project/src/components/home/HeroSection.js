import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../utils/Icons';
import '../../styles/HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero-section">
      {/* Decorative Elements */}
      <div className="hero-decorative">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
      </div>

      <div className="container hero-container">
        <div className="hero-grid">
          {/* Content */}
          <div className="hero-content">
            <div className="hero-badge">
              <Icon name="sparkles" size={16} />
              <span>Authentic Handcrafted Utensils</span>
            </div>
            
            <h1 className="hero-title">
              Timeless Craft from{' '}
              <span className="hero-title-highlight">Songir</span>{' '}
              Village Artisans
            </h1>
            
            <p className="hero-description">
              Discover the finest handcrafted brass and copper utensils, made with generations of expertise. 
              Connect directly with skilled artisans and bring authentic traditional craftsmanship to your home.
            </p>

            <div className="hero-buttons">
              <Link to="/products" className="hero-button hero-button-primary">
                Explore Products
                <Icon name="arrowRight" size={20} />
              </Link>
              <Link to="/about" className="hero-button hero-button-secondary">
                Learn About Songir
              </Link>
            </div>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat">
                <span className="hero-stat-number">50+</span>
                <span className="hero-stat-label">Skilled Artisans</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">500+</span>
                <span className="hero-stat-label">Products</span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-number">100%</span>
                <span className="hero-stat-label">Pure Materials</span>
              </div>
            </div>
          </div>

          {/* Image Grid */}
          <div className="hero-image-container">
            <div className="hero-image-grid">
              <div className="hero-image-col">
                <div className="hero-image-card hero-image-card-tall">
                  <div className="hero-image-placeholder">
                    <svg viewBox="0 0 100 120" width="96" height="112">
                      <ellipse cx="50" cy="100" rx="35" ry="12" fill="currentColor" opacity="0.3"/>
                      <path d="M20 95 Q15 50 50 20 Q85 50 80 95" fill="none" stroke="currentColor" strokeWidth="3"/>
                      <ellipse cx="50" cy="20" rx="15" ry="6" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <ellipse cx="50" cy="95" rx="30" ry="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
                <div className="hero-image-card hero-image-card-square">
                  <div className="hero-image-placeholder">
                    <svg viewBox="0 0 100 100" width="80" height="80" style={{color: 'var(--color-brass)'}}>
                      <ellipse cx="50" cy="85" rx="40" ry="10" fill="currentColor" opacity="0.3"/>
                      <ellipse cx="50" cy="80" rx="35" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M15 80 L15 40 Q15 20 50 20 Q85 20 85 40 L85 80" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <ellipse cx="50" cy="40" rx="35" ry="8" fill="none" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="hero-image-col">
                <div className="hero-image-card hero-image-card-square">
                  <div className="hero-image-placeholder">
                    <svg viewBox="0 0 100 100" width="80" height="80">
                      <ellipse cx="50" cy="90" rx="25" ry="6" fill="currentColor" opacity="0.3"/>
                      <circle cx="50" cy="60" r="30" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M50 30 L50 10" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="50" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
                <div className="hero-image-card hero-image-card-tall">
                  <div className="hero-image-placeholder">
                    <svg viewBox="0 0 100 120" width="96" height="112" style={{color: 'var(--color-brass)'}}>
                      <ellipse cx="50" cy="110" rx="30" ry="6" fill="currentColor" opacity="0.3"/>
                      <ellipse cx="50" cy="105" rx="25" ry="5" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M25 105 Q20 70 30 50 Q35 40 50 40 Q65 40 70 50 Q80 70 75 105" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <path d="M35 40 Q35 25 50 20 Q65 25 65 40" fill="none" stroke="currentColor" strokeWidth="2"/>
                      <ellipse cx="50" cy="20" rx="8" ry="3" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="hero-floating-badge">
              <p className="hero-floating-badge-label">Trusted by</p>
              <span className="hero-floating-badge-number">10,000+</span>
              <p className="hero-floating-badge-text">Happy Customers</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
