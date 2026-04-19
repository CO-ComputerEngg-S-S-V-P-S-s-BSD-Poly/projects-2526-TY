import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

const LoginWithDashboard = ({ onLogin, dashboardPreview }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    if (formData.email === 'admin@songir.com' && formData.password === 'admin123') {
      onLogin({
        name: 'Admin User',
        email: 'admin@songir.com',
        role: 'Administrator'
      });
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <>
      {/* Blurred Dashboard Background */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        filter: 'blur(8px)',
        zIndex: 1
      }}>
        {dashboardPreview}
      </div>

      {/* Dark Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        zIndex: 2
      }} />

      {/* Login Card */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        background: 'white',
        borderRadius: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
        width: '90%',
        maxWidth: '440px',
        padding: '3rem',
        animation: 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
      }}>
        {/* Logo & Title */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '0.5rem'
          }}>
            Songir
          </h1>
          <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>
            Handcraft Utensils Portal
          </p>
          <p style={{ color: '#C17A3F', fontSize: '0.9rem', fontWeight: '600', marginTop: '0.5rem' }}>
            Admin Dashboard Login
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#374151',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Email Address
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <User size={20} style={{
                position: 'absolute',
                left: '1rem',
                color: '#9CA3AF'
              }} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  setError('');
                }}
                placeholder="Enter your email"
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 3rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#C17A3F'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#374151',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Password
            </label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <Lock size={20} style={{
                position: 'absolute',
                left: '1rem',
                color: '#9CA3AF'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  setError('');
                }}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '0.875rem 3rem 0.875rem 3rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'all 0.3s ease'
                }}
                onFocus={(e) => e.target.style.borderColor = '#C17A3F'}
                onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  padding: 0
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#FEE2E2',
              color: '#DC2626',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              marginBottom: '1.5rem',
              fontWeight: '500'
            }}>
              {error}
            </div>
          )}

          {/* Demo Credentials */}
          <div style={{
            background: '#FDF8F4',
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #E5D4C1'
          }}>
            <p style={{
              fontSize: '0.8rem',
              color: '#C17A3F',
              fontWeight: '600',
              marginBottom: '0.25rem'
            }}>
              Demo Credentials:
            </p>
            <p style={{ fontSize: '0.75rem', color: '#6B7280', margin: 0 }}>
              Email: admin@songir.com<br />
              Password: admin123
            </p>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(193, 122, 63, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 20px rgba(193, 122, 63, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 12px rgba(193, 122, 63, 0.3)';
            }}
          >
            Login to Dashboard
          </button>
        </form>

        {/* Footer */}
        <p style={{
          marginTop: '2rem',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: '#9CA3AF'
        }}>
          © 2026 Songir. All rights reserved.
        </p>
      </div>

      <style>{`
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default LoginWithDashboard;




// import React, { useState } from 'react';
// import { User, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

// const LoginWithDashboard = ({ onLogin, dashboardPreview }) => {
//   const [isRegister, setIsRegister] = useState(false);
//   const [formData, setFormData] = useState({ name: '', email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.email || !formData.password) {
//       setError('Please enter both email and password');
//       return;
//     }

//     if (isRegister && !formData.name) {
//       setError('Please enter your name');
//       return;
//     }

//     setLoading(true);
//     setError('');
//     setSuccess('');

//     const url = isRegister
//       ? 'http://localhost:5000/api/auth/register'
//       : 'http://localhost:5000/api/auth/login';

//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(
//           isRegister
//             ? { name: formData.name, email: formData.email, password: formData.password }
//             : { email: formData.email, password: formData.password }
//         )
//       });

//       const data = await response.json();

//       if (response.ok) {
//         if (isRegister) {
//           setSuccess('Account created! Please login now.');
//           setIsRegister(false);
//           setFormData({ name: '', email: formData.email, password: '' });
//         } else {
//           onLogin({
//             name: data.name,
//             email: data.email,
//             role: 'Administrator',
//             token: data.token
//           });
//         }
//       } else {
//         setError(data.message || 'Something went wrong');
//       }

//     } catch (err) {
//       console.error('Error:', err);
//       setError('Unable to connect to server. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputStyle = {
//     width: '100%',
//     padding: '0.875rem 1rem 0.875rem 3rem',
//     border: '2px solid #E5E7EB',
//     borderRadius: '12px',
//     fontSize: '0.95rem',
//     outline: 'none',
//     transition: 'all 0.3s ease'
//   };

//   return (
//     <>
//       {/* Blurred Background */}
//       <div style={{
//         position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//         filter: 'blur(8px)', zIndex: 1
//       }}>
//         {dashboardPreview}
//       </div>

//       {/* Dark Overlay */}
//       <div style={{
//         position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
//         background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)', zIndex: 2
//       }} />

//       {/* Card */}
//       <div style={{
//         position: 'fixed',
//         top: '50%', left: '50%',
//         transform: 'translate(-50%, -50%)',
//         zIndex: 3,
//         background: 'white',
//         borderRadius: '24px',
//         boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
//         width: '90%', maxWidth: '440px',
//         padding: '3rem',
//         animation: 'scaleIn 0.4s cubic-bezier(0.4,0,0.2,1)'
//       }}>

//         {/* Logo */}
//         <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
//           <h1 style={{
//             fontSize: '2.5rem', fontWeight: '700',
//             background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
//             WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
//             marginBottom: '0.5rem'
//           }}>
//             Songir
//           </h1>
//           <p style={{ color: '#6B7280', fontSize: '0.95rem' }}>Handcraft Utensils Portal</p>
//           <p style={{ color: '#C17A3F', fontSize: '0.9rem', fontWeight: '600', marginTop: '0.5rem' }}>
//             {isRegister ? 'Create Admin Account' : 'Admin Dashboard Login'}
//           </p>
//         </div>

//         {/* Toggle Tabs */}
//         <div style={{
//           display: 'flex', background: '#F3F4F6',
//           borderRadius: '12px', padding: '4px',
//           marginBottom: '1.75rem'
//         }}>
//           <button
//             type="button"
//             onClick={() => { setIsRegister(false); setError(''); setSuccess(''); }}
//             style={{
//               flex: 1, padding: '0.6rem',
//               borderRadius: '8px', border: 'none',
//               fontWeight: '600', fontSize: '0.9rem',
//               cursor: 'pointer', transition: 'all 0.3s ease',
//               background: !isRegister ? 'white' : 'transparent',
//               color: !isRegister ? '#C17A3F' : '#6B7280',
//               boxShadow: !isRegister ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
//             }}
//           >
//             Login
//           </button>
//           <button
//             type="button"
//             onClick={() => { setIsRegister(true); setError(''); setSuccess(''); }}
//             style={{
//               flex: 1, padding: '0.6rem',
//               borderRadius: '8px', border: 'none',
//               fontWeight: '600', fontSize: '0.9rem',
//               cursor: 'pointer', transition: 'all 0.3s ease',
//               background: isRegister ? 'white' : 'transparent',
//               color: isRegister ? '#C17A3F' : '#6B7280',
//               boxShadow: isRegister ? '0 2px 8px rgba(0,0,0,0.1)' : 'none'
//             }}
//           >
//             Register
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>

//           {/* Name — only register */}
//           {isRegister && (
//             <div style={{ marginBottom: '1.25rem' }}>
//               <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.9rem' }}>
//                 Full Name
//               </label>
//               <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
//                 <UserPlus size={20} style={{ position: 'absolute', left: '1rem', color: '#9CA3AF' }} />
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setError(''); }}
//                   placeholder="Enter your full name"
//                   style={inputStyle}
//                   onFocus={(e) => e.target.style.borderColor = '#C17A3F'}
//                   onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
//                 />
//               </div>
//             </div>
//           )}

//           {/* Email */}
//           <div style={{ marginBottom: '1.25rem' }}>
//             <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.9rem' }}>
//               Email Address
//             </label>
//             <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
//               <User size={20} style={{ position: 'absolute', left: '1rem', color: '#9CA3AF' }} />
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setError(''); }}
//                 placeholder="Enter your email"
//                 style={inputStyle}
//                 onFocus={(e) => e.target.style.borderColor = '#C17A3F'}
//                 onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div style={{ marginBottom: '1.5rem' }}>
//             <label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '600', fontSize: '0.9rem' }}>
//               Password
//             </label>
//             <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
//               <Lock size={20} style={{ position: 'absolute', left: '1rem', color: '#9CA3AF' }} />
//               <input
//                 type={showPassword ? 'text' : 'password'}
//                 value={formData.password}
//                 onChange={(e) => { setFormData({ ...formData, password: e.target.value }); setError(''); }}
//                 placeholder="Enter your password"
//                 style={{ ...inputStyle, padding: '0.875rem 3rem 0.875rem 3rem' }}
//                 onFocus={(e) => e.target.style.borderColor = '#C17A3F'}
//                 onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 style={{ position: 'absolute', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 0 }}
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Error */}
//           {error && (
//             <div style={{
//               background: '#FEE2E2', color: '#DC2626',
//               padding: '0.75rem 1rem', borderRadius: '8px',
//               fontSize: '0.875rem', marginBottom: '1.25rem', fontWeight: '500'
//             }}>
//               {error}
//             </div>
//           )}

//           {/* Success */}
//           {success && (
//             <div style={{
//               background: '#D1FAE5', color: '#065F46',
//               padding: '0.75rem 1rem', borderRadius: '8px',
//               fontSize: '0.875rem', marginBottom: '1.25rem', fontWeight: '500'
//             }}>
//               ✅ {success}
//             </div>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               width: '100%', padding: '1rem',
//               background: loading ? '#D1D5DB' : 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
//               color: 'white', border: 'none', borderRadius: '12px',
//               fontSize: '1rem', fontWeight: '700',
//               cursor: loading ? 'not-allowed' : 'pointer',
//               transition: 'all 0.3s ease',
//               boxShadow: '0 4px 12px rgba(193,122,63,0.3)'
//             }}
//             onMouseEnter={(e) => {
//               if (!loading) {
//                 e.target.style.transform = 'translateY(-2px)';
//                 e.target.style.boxShadow = '0 8px 20px rgba(193,122,63,0.4)';
//               }
//             }}
//             onMouseLeave={(e) => {
//               e.target.style.transform = 'translateY(0)';
//               e.target.style.boxShadow = '0 4px 12px rgba(193,122,63,0.3)';
//             }}
//           >
//             {loading ? (isRegister ? 'Creating...' : 'Logging in...') : (isRegister ? 'Create Account' : 'Login to Dashboard')}
//           </button>

//         </form>

//         <p style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.75rem', color: '#9CA3AF' }}>
//           © 2026 Songir. All rights reserved.
//         </p>
//       </div>

//       <style>{`
//         @keyframes scaleIn {
//           from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
//           to   { opacity: 1; transform: translate(-50%, -50%) scale(1);   }
//         }
//       `}</style>
//     </>
//   );
// };

// export default LoginWithDashboard;