import React, { useState } from 'react';
import { Sun, Moon, User, Lock, Globe, Bell } from 'lucide-react';

const SettingsPage_Clean = () => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState({
    email: true,
    orderAlerts: true
  });

  const handleToggle = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="view-content">
      <div className="page-header">
        <h1 className="page-title">Admin Settings</h1>
        <p className="page-subtitle">Manage your dashboard preferences</p>
      </div>

      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        {/* Single Clean Form */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          border: '2px solid #E5D4C1'
        }}>
          
          {/* Profile Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              color: '#C17A3F'
            }}>
              <User size={24} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>
                Profile Information
              </h3>
            </div>
            
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Admin User"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Email Address</label>
                <input 
                  type="email" 
                  defaultValue="admin@songir.com"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '2.5rem 0' }} />

          {/* Password Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              color: '#C17A3F'
            }}>
              <Lock size={24} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>
                Change Password
              </h3>
            </div>
            
            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Current Password</label>
                <input 
                  type="password" 
                  placeholder="Enter current password"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>New Password</label>
                <input 
                  type="password" 
                  placeholder="Enter new password"
                  style={{
                    width: '100%',
                    padding: '0.875rem',
                    border: '2px solid #E5E7EB',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '2.5rem 0' }} />

          {/* Theme Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              color: '#C17A3F'
            }}>
              {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>
                Dashboard Theme
              </h3>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setTheme('light')}
                style={{
                  flex: 1,
                  padding: '1.25rem',
                  background: theme === 'light' ? 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)' : 'white',
                  color: theme === 'light' ? 'white' : '#6B7280',
                  border: theme === 'light' ? 'none' : '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <Sun size={20} />
                Light Theme
              </button>
              <button
                onClick={() => setTheme('dark')}
                style={{
                  flex: 1,
                  padding: '1.25rem',
                  background: theme === 'dark' ? 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)' : 'white',
                  color: theme === 'dark' ? 'white' : '#6B7280',
                  border: theme === 'dark' ? 'none' : '2px solid #E5E7EB',
                  borderRadius: '12px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <Moon size={20} />
                Dark Theme
              </button>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '2.5rem 0' }} />

          {/* Preferences Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              color: '#C17A3F'
            }}>
              <Globe size={24} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>
                Preferences
              </h3>
            </div>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Language</label>
                <select style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: 'white'
                }}>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Marathi</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  color: '#374151'
                }}>Timezone</label>
                <select style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #E5E7EB',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  background: 'white'
                }}>
                  <option>Asia/Kolkata (IST)</option>
                  <option>Asia/Dubai (GST)</option>
                  <option>America/New_York (EST)</option>
                </select>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #E5E7EB', margin: '2.5rem 0' }} />

          {/* Notifications Section */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              color: '#C17A3F'
            }}>
              <Bell size={24} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', margin: 0 }}>
                Notifications
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: '#F9FAFB',
                borderRadius: '10px'
              }}>
                <span style={{ fontWeight: '500', color: '#374151' }}>Email Notifications</span>
                <div 
                  onClick={() => handleToggle('email')}
                  style={{
                    width: '52px',
                    height: '28px',
                    background: notifications.email ? '#C17A3F' : '#E5E7EB',
                    borderRadius: '14px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '3px',
                    left: notifications.email ? '27px' : '3px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: '#F9FAFB',
                borderRadius: '10px'
              }}>
                <span style={{ fontWeight: '500', color: '#374151' }}>Order Alerts</span>
                <div 
                  onClick={() => handleToggle('orderAlerts')}
                  style={{
                    width: '52px',
                    height: '28px',
                    background: notifications.orderAlerts ? '#C17A3F' : '#E5E7EB',
                    borderRadius: '14px',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{
                    width: '22px',
                    height: '22px',
                    background: 'white',
                    borderRadius: '50%',
                    position: 'absolute',
                    top: '3px',
                    left: notifications.orderAlerts ? '27px' : '3px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: 'pointer',
            marginTop: '2rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 8px 20px rgba(193, 122, 63, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
          >
            Save All Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage_Clean;
