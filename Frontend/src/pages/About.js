import React from "react";
import { Users, Target, ShieldCheck, Zap } from "lucide-react";
import "./About.css";

const About = () => {
  return (
    <div className="about-container">

      {/* HERO SECTION */}
      <section className="about-hero">
        <h1>About LocalSolve</h1>
        <p>
          LocalSolve is a smart complaint management system designed to
          help citizens report local issues easily and connect them with
          the responsible government departments.
        </p>
      </section>

      {/* ABOUT CONTENT */}
      <section className="about-content">
        <div className="about-text">
          <h2>Who We Are</h2>
          <p>
            LocalSolve is a digital platform that enables citizens to report
            problems such as electricity failures, water supply issues,
            garbage collection, road damage and many other local problems.
          </p>

          <p>
            Our system ensures that complaints are forwarded to the correct
            department so that issues can be solved quickly and efficiently.
          </p>

          <p>
            The goal of this platform is to create transparency between
            citizens and authorities and make cities cleaner and better.
          </p>
        </div>

        <div className="about-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="about"
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="about-features">
        <h2>Our Key Features</h2>

        <div className="feature-grid">

          <div className="feature-card">
            <Users size={35} />
            <h3>Citizen Friendly</h3>
            <p>Easy interface for citizens to register and submit complaints.</p>
          </div>

          <div className="feature-card">
            <Target size={35} />
            <h3>Accurate Department Routing</h3>
            <p>Complaints automatically reach the correct department.</p>
          </div>

          <div className="feature-card">
            <ShieldCheck size={35} />
            <h3>Secure Platform</h3>
            <p>User data and complaints are safely stored and protected.</p>
          </div>

          <div className="feature-card">
            <Zap size={35} />
            <h3>Fast Resolution</h3>
            <p>Helps authorities respond to issues quickly.</p>
          </div>

        </div>
      </section>

      {/* MISSION */}
      <section className="mission">
        <h2>Our Mission</h2>
        <p>
          Our mission is to create a transparent digital system where citizens
          can easily report problems and local authorities can solve them
          efficiently for a better community.
        </p>
      </section>

    </div>
  );
};

export default About;
