import React, { useState } from 'react';
import './contactus.css';
import { NavLink } from 'react-router-dom';

// ── Character-level blockers (onKeyDown) ─────────────────────────────────────
const CTRL = ["Backspace","Delete","ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Tab","Home","End"];

// Name: sirf letters aur spaces — numbers/symbols type hi nahi hoga
const allowOnlyLettersSpaces = (e) => {
  if (CTRL.includes(e.key)) return;
  if (!/^[a-zA-Z\s]$/.test(e.key)) e.preventDefault();
};

// Email: sirf valid email characters
const allowEmailChars = (e) => {
  if (CTRL.includes(e.key)) return;
  if (!/^[a-zA-Z0-9@._+\-]$/.test(e.key)) e.preventDefault();
};

// Phone: sirf digits, pehla digit 6-9, max 10
const makePhoneKeyDown = (currentValue) => (e) => {
  if (CTRL.includes(e.key)) return;
  if (!/^\d$/.test(e.key))                              { e.preventDefault(); return; }
  if (currentValue.length >= 10)                        { e.preventDefault(); return; }
  if (currentValue.length === 0 && !/^[6-9]$/.test(e.key)) { e.preventDefault(); return; }
};

// Message: no script/html injection chars
const blockMessageInjection = (e) => {
  if (CTRL.includes(e.key)) return;
  if (/^[<>]$/.test(e.key)) e.preventDefault();
};
// ────────────────────────────────────────────────────────────────────────────

// ── Field validators ─────────────────────────────────────────────────────────
const validateField = (name, value) => {
  switch (name) {
    case 'firstName':
    case 'lastName': {
      const label = name === 'firstName' ? 'First' : 'Last';
      if (!value.trim())               return `${label} Name is required.`;
      if (value.trim().length < 2)     return `${label} Name must be at least 2 characters.`;
      if (!/^[a-zA-Z\s]+$/.test(value)) return `${label} Name must contain only letters.`;
      return '';
    }
    case 'email':
      if (!value.trim())                              return 'Email address is required.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address.';
      return '';
    case 'phone':
      if (!value.trim())                    return 'Phone number is required.';
      if (!/^[6-9]\d{9}$/.test(value.trim())) return 'Enter a valid 10-digit Indian number (starts with 6-9).';
      return '';
    case 'subject':
      if (!value) return 'Please select a subject.';
      return '';
    case 'message':
      if (!value.trim())              return 'Message is required.';
      if (value.trim().length < 10)   return 'Message must be at least 10 characters.';
      if (value.trim().length > 1000) return 'Message cannot exceed 1000 characters.';
      return '';
    default:
      return '';
  }
};
// ────────────────────────────────────────────────────────────────────────────

const ALLOWED_FILE_TYPES = ['application/pdf','application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg','image/jpg','image/png'];
const ALLOWED_EXT_LABEL = 'PDF, DOC, DOCX, JPG, PNG';
const MAX_FILE_MB = 5;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    subject: '', message: '', attachment: null
  });

  const [errors, setErrors]         = useState({});
  const [touched, setTouched]       = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess]   = useState(false);
  const [charCount, setCharCount]       = useState(0);
  const [fileName, setFileName]         = useState('Click to upload file (Max 5MB)');
  const [fileError, setFileError]       = useState('');

  // ── Handlers ────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'message') setCharCount(value.length);
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError('');
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setFileError(`Invalid file type. Allowed: ${ALLOWED_EXT_LABEL}`);
      e.target.value = '';
      setFileName('Click to upload file (Max 5MB)');
      setFormData(prev => ({ ...prev, attachment: null }));
      return;
    }
    if (file.size > MAX_FILE_MB * 1024 * 1024) {
      setFileError(`File size must be less than ${MAX_FILE_MB}MB.`);
      e.target.value = '';
      setFileName('Click to upload file (Max 5MB)');
      setFormData(prev => ({ ...prev, attachment: null }));
      return;
    }

    const sizeMB = (file.size / 1024 / 1024).toFixed(2);
    setFileName(`${file.name} (${sizeMB} MB)`);
    setFormData(prev => ({ ...prev, attachment: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all fields touched
    const allTouched = {};
    ['firstName','lastName','email','phone','subject','message'].forEach(k => { allTouched[k] = true; });
    setTouched(allTouched);

    // Validate all
    const newErrors = {};
    ['firstName','lastName','email','phone','subject','message'].forEach(k => {
      const err = validateField(k, formData[k]);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
      console.log('Form submitted:', formData);
    }, 2000);
  };

  const resetForm = () => {
    setFormData({ firstName:'', lastName:'', email:'', phone:'', subject:'', message:'', attachment: null });
    setErrors({});
    setTouched({});
    setCharCount(0);
    setFileName('Click to upload file (Max 5MB)');
    setFileError('');
    setShowSuccess(false);
  };

  const ic = (name) => `form-group${errors[name] && touched[name] ? ' error' : ''}`;

  return (
    <div className="contact-page">

      {/* Hero Section */}
      <section className="hero">
        <h2>Contact Us</h2>
        <p>Have questions or need assistance? We're here to help you connect with Songir artisans.</p>
      </section>

      <div className="container">
        {/* ── Left Sidebar ── */}
        <aside className="sidebar">
          <div className="card">
            <h3>Get in Touch</h3>

            <div className="contact-item">
              <div className="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="contact-details">
                <h4>Address</h4>
                <p>Songir Village, Taluka Dhule,<br/>Maharashtra 424001, India</p>
              </div>
            </div>

            <div className="contact-item">
              <div className="icon-circle">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>
              <div className="contact-details">
                <h4>Working Hours</h4>
                <p>Monday - Saturday<br/>9:00 AM - 6:00 PM IST</p>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #E0E0E0' }}>
              <h4 style={{ marginBottom: '10px', fontSize: '14px' }}>Follow Us</h4>
              <div className="social-links">
                <button className="social-link" title="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>
                <button className="social-link" title="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </button>
                <button className="social-link" title="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </button>
                <button className="social-link" title="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Quick Help</h3>
            <NavLink to="/quote" className="quick-help-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              Request a Custom Quote
            </NavLink>
            <NavLink to="/shops" className="quick-help-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              Find Artisan Shops
            </NavLink>
          </div>
        </aside>

        {/* ── Contact Form ── */}
        <div className="form-container">
          {!showSuccess ? (
            <form onSubmit={handleSubmit} noValidate>

              {/* First Name + Last Name */}
              <div className="form-row">
                <div className={ic('firstName')}>
                  <label htmlFor="firstName">First Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={allowOnlyLettersSpaces}
                    maxLength={50}
                    autoComplete="given-name"
                    placeholder="e.g. Ramesh"
                  />
                  {errors.firstName && touched.firstName && (
                    <span className="error-message">⚠ {errors.firstName}</span>
                  )}
                </div>

                <div className={ic('lastName')}>
                  <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={allowOnlyLettersSpaces}
                    maxLength={50}
                    autoComplete="family-name"
                    placeholder="e.g. Patil"
                  />
                  {errors.lastName && touched.lastName && (
                    <span className="error-message">⚠ {errors.lastName}</span>
                  )}
                </div>
              </div>

              {/* Email + Phone */}
              <div className="form-row">
                <div className={ic('email')}>
                  <label htmlFor="email">Email Address <span className="required">*</span></label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={allowEmailChars}
                    maxLength={100}
                    autoComplete="email"
                    placeholder="example@email.com"
                  />
                  {errors.email && touched.email && (
                    <span className="error-message">⚠ {errors.email}</span>
                  )}
                </div>

                <div className={ic('phone')}>
                  <label htmlFor="phone">Phone Number <span className="required">*</span></label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={makePhoneKeyDown(formData.phone)}
                    maxLength={10}
                    inputMode="numeric"
                    autoComplete="tel"
                    placeholder="10-digit number (6-9 se shuru)"
                  />
                  {errors.phone && touched.phone && (
                    <span className="error-message">⚠ {errors.phone}</span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div className={ic('subject')}>
                <label htmlFor="subject">Subject <span className="required">*</span></label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="product">Product Information</option>
                  <option value="custom">Custom Order</option>
                  <option value="wholesale">Wholesale Inquiry</option>
                  <option value="support">Customer Support</option>
                  <option value="partnership">Partnership Opportunities</option>
                  <option value="other">Other</option>
                </select>
                {errors.subject && touched.subject && (
                  <span className="error-message">⚠ {errors.subject}</span>
                )}
              </div>

              {/* Message */}
              <div className={ic('message')}>
                <label htmlFor="message">Message <span className="required">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={blockMessageInjection}
                  maxLength={1000}
                  placeholder="Apna message yahan likhein... (min 10 characters)"
                />
                <div className="char-count">
                  <span style={{ color: charCount > 900 ? '#e74c3c' : 'inherit' }}>{charCount}</span>/1000 characters
                </div>
                {errors.message && touched.message && (
                  <span className="error-message">⚠ {errors.message}</span>
                )}
              </div>

              {/* File Attachment */}
              <div className={`form-group file-upload${fileError ? ' error' : ''}`}>
                <label>Attachment (Optional) — {ALLOWED_EXT_LABEL}, max {MAX_FILE_MB}MB</label>
                <label htmlFor="attachment" className="file-upload-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                  </svg>
                  <span className="file-name">{fileName}</span>
                </label>
                <input
                  type="file"
                  id="attachment"
                  name="attachment"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                {fileError && <span className="error-message">⚠ {fileError}</span>}
              </div>

              <button
                type="submit"
                className={`submit-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          ) : (
            <div className="success-message show">
              <div className="success-icon">
                <svg viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="25" fill="none"/>
                  <path d="M14 27l7.5 7.5L38 18" />
                </svg>
              </div>
              <h3>Message Sent!</h3>
              <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
              <button className="btn-another" onClick={resetForm}>Send Another Message</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage;