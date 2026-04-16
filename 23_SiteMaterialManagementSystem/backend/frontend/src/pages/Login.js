import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import './Login.css';
import logo from '../logo.jpg';

// Which tab is active
// 'signup'     → Supervisor registers with real name + email
// 'check-email'→ After signup: "Check your email" screen
// 'login'      → Supervisor logs in with system username + password
// 'admin'      → Admin logs in with email + password (separate hidden tab)

const Login = () => {
  const [tab, setTab] = useState('signup'); // default: signup

  // Signup fields
  const [signupName,     setSignupName]     = useState('');
  const [signupEmail,    setSignupEmail]    = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm,  setSignupConfirm]  = useState('');

  // Supervisor login fields (system credentials)
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Admin login fields
  const [adminEmail,    setAdminEmail]    = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const [loading,   setLoading]   = useState(false);
  const [showPass,  setShowPass]  = useState(false);
  const [sentEmail, setSentEmail] = useState(''); // store email for "check your email" screen

  const { login, adminLogin, saveSession } = useAuth();
  const navigate = useNavigate();

  // ── Step 1: Supervisor submits name + email ──────────────────────────────────
  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupPassword !== signupConfirm) { toast.error('Passwords do not match'); return; }
    if (signupPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await axios.post('/api/register', {
        name: signupName.trim(),
        email: signupEmail.trim(),
        password: signupPassword,
      });
      setSentEmail(signupEmail.trim());
      setTab('check-email'); // move to check-email screen
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  // ── Step 3: Supervisor logs in with system credentials ───────────────────────
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(loginUsername.trim(), loginPassword);
      toast.success(`Welcome, ${user.name}!`);
      if (!user.site) {
        navigate('/select-site');
      } else {
        navigate('/supervisor');
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid credentials. Check your email.');
    } finally { setLoading(false); }
  };

  // ── Admin login ──────────────────────────────────────────────────────────────
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await adminLogin(adminEmail.trim(), adminPassword);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/admin');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Invalid admin credentials.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <div className="bg-orb orb1" />
        <div className="bg-orb orb2" />
        <div className="bg-orb orb3" />
      </div>

      <div className="login-container">

        {/* ── Left Branding Panel ── */}
        <div className="login-left">
          <div className="brand">
            <div className="brand-logo-wrap">
              <img src={logo} alt="Padmashree Builders" className="brand-logo-img" />
            </div>
            <h1>Padmashree<br />Builders</h1>
            <p>Site Material Management System — smart, real-time inventory tracking for your construction sites.</p>
          </div>
          <div className="features-list">
            {[
              { icon: 'fa-envelope',       text: 'Secure email-based credentials' },
              { icon: 'fa-map-marker-alt', text: 'Site-specific supervisor access' },
              { icon: 'fa-chart-bar',      text: 'Real-time stock tracking' },
              { icon: 'fa-shield-alt',     text: 'Role-based access control' },
            ].map(f => (
              <div className="feature-item" key={f.text}>
                <i className={`fas ${f.icon}`} />
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Form Panel ── */}
        <div className="login-right">
          <div className="login-card">

            {/* ══════ CHECK EMAIL SCREEN ══════ */}
            {tab === 'check-email' && (
              <div className="check-email-screen">
                <div className="check-email-icon">
                  <i className="fas fa-envelope-open-text" />
                </div>
                <h2>Check Your Email!</h2>
                <p>
                  We've sent your unique login credentials to<br />
                  <strong>{sentEmail}</strong>
                </p>
                <div className="check-email-steps">
                  <div className="step"><span className="step-num">1</span><span>Open the email from Padmashree Builders</span></div>
                  <div className="step"><span className="step-num">2</span><span>Copy your Username and Password</span></div>
                  <div className="step"><span className="step-num">3</span><span>Come back and click Login below</span></div>
                </div>
                <button className="login-btn" onClick={() => setTab('login')}>
                  <i className="fas fa-sign-in-alt" /> Go to Login
                </button>
                <p className="auth-switch">
                  Didn't receive email?{' '}
                  <span onClick={() => setTab('signup')}>Try again</span>
                </p>
              </div>
            )}

            {/* ══════ SIGN UP ══════ */}
            {tab === 'signup' && (
              <>
                <div className="auth-toggle">
                  <button className="toggle-btn active">
                    <i className="fas fa-user-plus" /> Register
                  </button>
                  <button className="toggle-btn" onClick={() => setTab('login')}>
                    <i className="fas fa-sign-in-alt" /> Login
                  </button>
                </div>

                <div className="login-header">
                  <h2>Supervisor Registration</h2>
                  <p>Enter your details — we'll send your login credentials by email</p>
                </div>

                <form onSubmit={handleSignup} className="login-form" autoComplete="off">
                  <div className="input-group">
                    <label>Full Name *</label>
                    <div className="input-wrapper">
                      <i className="fas fa-user input-icon" />
                      <input type="text" placeholder="Your full name"
                        value={signupName} onChange={e => setSignupName(e.target.value)}
                        autoComplete="off" required />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Email Address *</label>
                    <div className="input-wrapper">
                      <i className="fas fa-envelope input-icon" />
                      <input type="email" placeholder="Your real email address"
                        value={signupEmail} onChange={e => setSignupEmail(e.target.value)}
                        autoComplete="off" required />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Create Password *</label>
                    <div className="input-wrapper">
                      <i className="fas fa-lock input-icon" />
                      <input type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                        value={signupPassword} onChange={e => setSignupPassword(e.target.value)}
                        autoComplete="new-password" required minLength={6} />
                      <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                        <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Confirm Password *</label>
                    <div className="input-wrapper">
                      <i className="fas fa-lock input-icon" />
                      <input type={showPass ? 'text' : 'password'} placeholder="Re-enter password"
                        value={signupConfirm} onChange={e => setSignupConfirm(e.target.value)}
                        autoComplete="new-password" required />
                    </div>
                  </div>

                  <div className="info-box">
                    <i className="fas fa-info-circle" />
                    After registration, a unique <strong>username & password</strong> will be sent to your email. Use those to log in.
                  </div>

                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading
                      ? <><i className="fas fa-spinner fa-spin" /> Sending credentials…</>
                      : <><i className="fas fa-paper-plane" /> Register & Send Credentials</>}
                  </button>
                </form>

                <p className="auth-switch">
                  Already registered?{' '}
                  <span onClick={() => setTab('login')}>Login here</span>
                </p>
              </>
            )}

            {/* ══════ SUPERVISOR LOGIN ══════ */}
            {tab === 'login' && (
              <>
                <div className="auth-toggle">
                  <button className="toggle-btn" onClick={() => setTab('signup')}>
                    <i className="fas fa-user-plus" /> Register
                  </button>
                  <button className="toggle-btn active">
                    <i className="fas fa-sign-in-alt" /> Login
                  </button>
                </div>

                <div className="login-header">
                  <h2>Supervisor Login</h2>
                  <p>Use the username & password sent to your email</p>
                </div>

                <form onSubmit={handleLogin} className="login-form" autoComplete="off">
                  <div className="input-group">
                    <label>Username</label>
                    <div className="input-wrapper">
                      <i className="fas fa-at input-icon" />
                      <input type="text" placeholder="Username from your email"
                        value={loginUsername} onChange={e => setLoginUsername(e.target.value)}
                        autoComplete="off" required />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                      <i className="fas fa-lock input-icon" />
                      <input type={showPass ? 'text' : 'password'} placeholder="Password from your email"
                        value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                        autoComplete="off" required />
                      <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                        <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                  </div>

                  <div className="info-box">
                    <i className="fas fa-envelope" />
                    Check your email for your unique credentials sent by Padmashree Builders.
                  </div>

                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading
                      ? <><i className="fas fa-spinner fa-spin" /> Signing in…</>
                      : <><i className="fas fa-sign-in-alt" /> Sign In</>}
                  </button>
                </form>

                <p className="auth-switch">
                  New supervisor?{' '}
                  <span onClick={() => setTab('signup')}>Register here</span>
                </p>

                {/* Hidden admin link — small and subtle at bottom */}
                <p className="admin-link" onClick={() => setTab('admin')}>
                  <i className="fas fa-user-shield" /> Admin Login
                </p>
              </>
            )}

            {/* ══════ ADMIN LOGIN ══════ */}
            {tab === 'admin' && (
              <>
                <div className="login-header" style={{ marginTop: '8px' }}>
                  <div className="admin-badge"><i className="fas fa-user-shield" /> Admin Access</div>
                  <h2>Admin Login</h2>
                  <p>Restricted to authorized administrators only</p>
                </div>

                <form onSubmit={handleAdminLogin} className="login-form" autoComplete="off">
                  <div className="input-group">
                    <label>Email Address</label>
                    <div className="input-wrapper">
                      <i className="fas fa-envelope input-icon" />
                      <input type="email" placeholder="admin@padmashree.com"
                        value={adminEmail} onChange={e => setAdminEmail(e.target.value)}
                        autoComplete="off" required />
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                      <i className="fas fa-lock input-icon" />
                      <input type={showPass ? 'text' : 'password'} placeholder="Admin password"
                        value={adminPassword} onChange={e => setAdminPassword(e.target.value)}
                        autoComplete="off" required />
                      <button type="button" className="toggle-pass" onClick={() => setShowPass(!showPass)}>
                        <i className={`fas ${showPass ? 'fa-eye-slash' : 'fa-eye'}`} />
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading
                      ? <><i className="fas fa-spinner fa-spin" /> Signing in…</>
                      : <><i className="fas fa-sign-in-alt" /> Admin Sign In</>}
                  </button>
                </form>

                <p className="auth-switch">
                  <span onClick={() => setTab('login')}>← Back to Supervisor Login</span>
                </p>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
