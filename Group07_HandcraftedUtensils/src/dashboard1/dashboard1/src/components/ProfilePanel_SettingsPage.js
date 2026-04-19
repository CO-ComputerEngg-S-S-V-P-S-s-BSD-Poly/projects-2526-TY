import React from 'react';
import { X, User, Settings, LogOut } from 'lucide-react';

const ProfilePanel_SettingsPage = ({ isOpen, onClose, userData, onLogout, onSettingsClick }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={onClose}
      />
      <div style={{
        position: 'fixed',
        top: '90px',
        right: '20px',
        width: '280px',
        background: '#0f172a',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
        overflow: 'hidden',
        animation: 'slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        color: '#fff'
      }}>
        {/* Profile Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #1e293b',
          position: 'relative'
        }}>
          <button 
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
          >
            <X size={16} />
          </button>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              fontSize: '2rem',
              fontWeight: '700',
              border: '3px solid #7c3aed',
              boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)'
            }}>
              {userData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem', marginBottom: '0.25rem' }}>
              {userData.email}
            </p>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              {userData.role}
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <div style={{ padding: '0.75rem' }}>
          <button
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(124, 58, 237, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={18} color="#7c3aed" />
            </div>
            <span>My Profile</span>
          </button>

          <button
            onClick={() => {
              onSettingsClick();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#fff',
              fontSize: '0.9rem',
              fontWeight: '500',
              marginBottom: '0.5rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(59, 130, 246, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Settings size={18} color="#3b82f6" />
            </div>
            <span>Settings</span>
          </button>

          {/* Divider */}
          <div style={{ height: '1px', background: '#1e293b', margin: '0.75rem 0' }} />

          {/* Logout Button */}
          <button
            onClick={onLogout}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'transparent',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              color: '#ef4444',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogOut size={18} color="#ef4444" />
            </div>
            <span>Logout</span>
          </button>
        </div>

        {/* Footer */}
        <div style={{
          padding: '0.75rem',
          borderTop: '1px solid #1e293b',
          textAlign: 'center',
          fontSize: '0.7rem',
          color: '#64748b'
        }}>
          Songir v1.0.0
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default ProfilePanel_SettingsPage;
