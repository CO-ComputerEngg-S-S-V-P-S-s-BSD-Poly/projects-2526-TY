import React from 'react';
import './App.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="container">
        <div className="about-grid">
          
          {/* Left Side: Visual Element (Image or Animated Box) */}
          <div className="about-image">
            <div className="image-wrapper">
              <img src="https://via.placeholder.com" alt="Profile" />
              <div className="experience-badge">
                <span>3+</span>
                <p>Years of Learning</p>
              </div>
            </div>
          </div>

          {/* Right Side: Content */}
          <div className="about-content">
            <h4 className="subtitle">About Me</h4>
            <h2 className="title">Professional Student & <br /><span>Web Developer</span></h2>
            <p className="description">
              I am a passionate Full-Stack Developer currently pursuing my final year. 
              I specialize in creating high-performance, visually stunning, and user-centric 
              web applications. As a freelancer, I have helped various clients bring 
              their digital visions to life.
            </p>
            
            <ul className="skills-list">
              <li><strong>Frontend:</strong> React.js, Tailwind CSS, JavaScript</li>
              <li><strong>Backend:</strong> Node.js, Express, MongoDB</li>
              <li><strong>Tools:</strong> Git, GitHub, VS Code, Figma</li>
            </ul>

            <div className="about-stats">
              <div className="stat-item">
                <h3>10+</h3>
                <p>Projects Done</p>
              </div>
              <div className="stat-item">
                <h3>5+</h3>
                <p>Happy Clients</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;
