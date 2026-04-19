import React from 'react';
import { X, ShoppingCart, Package, Star, AlertCircle } from 'lucide-react';

const NotificationPanel = ({ isOpen, onClose, notifications, onMarkAsRead }) => {
  if (!isOpen) return null;

  const getIcon = (type) => {
    switch(type) {
      case 'order': return <ShoppingCart size={20} color="#C17A3F" />;
      case 'product': return <Package size={20} color="#10B981" />;
      case 'review': return <Star size={20} color="#F59E0B" />;
      default: return <AlertCircle size={20} color="#6B7280" />;
    }
  };

  const handleNotificationClick = (notifId) => {
    onMarkAsRead(notifId);
  };

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 999,
          animation: 'fadeIn 0.2s ease'
        }}
        onClick={onClose}
      />
      <div style={{
        position: 'fixed',
        top: '90px',
        right: '20px',
        width: '380px',
        maxHeight: '500px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        overflow: 'hidden',
        animation: 'slideDown 0.3s ease'
      }}>
        <div style={{
          padding: '1.25rem',
          borderBottom: '1px solid #F3F4F6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
          color: 'white'
        }}>
          <h3 style={{ fontWeight: '600', fontSize: '1.1rem' }}>Notifications</h3>
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white'
            }}
          >
            <X size={18} />
          </button>
        </div>
        
        <div style={{ 
          maxHeight: '420px', 
          overflowY: 'auto',
          padding: '0.5rem'
        }}>
          {notifications.map((notif, idx) => (
            <div 
              key={idx}
              onClick={() => handleNotificationClick(notif.id)}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #F3F4F6',
                display: 'flex',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s ease',
                borderRadius: '8px',
                margin: '0.25rem 0',
                background: notif.read ? 'transparent' : '#FDF8F4'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.background = notif.read ? 'transparent' : '#FDF8F4'}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: notif.read ? '#F3F4F6' : '#FDF8F4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {getIcon(notif.type)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ 
                  fontWeight: notif.read ? '500' : '600', 
                  color: '#1F2937', 
                  marginBottom: '0.25rem' 
                }}>
                  {notif.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.5rem' }}>
                  {notif.message}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                  {notif.time}
                </div>
              </div>
              {!notif.read && (
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#C17A3F',
                  flexShrink: 0,
                  marginTop: '0.5rem'
                }} />
              )}
            </div>
          ))}
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
            transform: translateY(-20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default NotificationPanel;
