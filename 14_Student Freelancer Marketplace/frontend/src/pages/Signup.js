import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Signup = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Join <span style={{color: '#00d2ff'}}>Nexus.</span></h2>
        <p style={styles.subTitle}>Create an account to hire our expert freelancer</p>
        
        <form style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input type="text" placeholder="Enter your name" style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input type="email" placeholder="Enter your email" style={styles.input} />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input type="password" placeholder="Create a password" style={styles.input} />
          </div>

          <button type="submit" style={styles.btn}>Create Account</button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '90vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' },
  card: { background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(15px)', padding: '50px', borderRadius: '30px', border: '1px solid rgba(255,255,255,0.1)', width: '100%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' },
  title: { fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', textAlign: 'center' },
  subTitle: { color: '#888', fontSize: '14px', marginBottom: '30px', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', textAlign: 'left' },
  label: { fontSize: '14px', color: '#ccc', fontWeight: '500' },
  input: { padding: '12px', borderRadius: '10px', border: '1px solid #333', background: '#111', color: '#fff', outline: 'none', transition: '0.3s' },
  btn: { background: '#00d2ff', color: '#000', padding: '14px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '16px' },
  footerText: { marginTop: '20px', fontSize: '14px', color: '#888', textAlign: 'center' },
  link: { color: '#00d2ff', textDecoration: 'none', fontWeight: 'bold' }
};

export default Signup;
