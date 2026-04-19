// import React, { useState } from 'react';
// import { BarChart3, Package, ShoppingCart, Users, Store, Star, Settings, Bell, User, MessageCircle, LogOut } from 'lucide-react';

// import LoginWithDashboard from './LoginWithDashboard';
// import DashboardView from './DashboardView_DynamicShop';
// import OrdersView from './OrderView';
// import ShopsManagement from './Shopsmanagement';
// import ShopDetailsView from './ShopDetailsView';
// import SettingsPage from './SettingsPage_Clean';
// import UsersView from './UsersView';
// import ProductsView from './ProductsView';
// import ContactView from './ContactView_Simple';
// import ReviewsView from './ReviewsView';
// import NotificationPanel from './NotificationPanel';
// import ProfilePanel from './ProfilePanel_SettingsPage';

// import { generateMockData } from '../data/MockData';
// import './DashboardHome.css';

// const DashboardHome = () => {

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [userData, setUserData] = useState(null);
//   const [activeView, setActiveView] = useState('dashboard');
//   const [data, setData] = useState(generateMockData());
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [showProfile, setShowProfile] = useState(false);
//   const [selectedShop, setSelectedShop] = useState(null);

//   const navItems = [
//     { id: 'dashboard', icon: BarChart3, label: 'Home' },
//     { id: 'shops', icon: Store, label: 'Shops' },
//     { id: 'users', icon: Users, label: 'Users' },
//     { id: 'reviews', icon: Star, label: 'Reviews' },
//     { id: 'contact', icon: MessageCircle, label: 'Contact' },
//     { id: 'settings', icon: Settings, label: 'Settings' }
//   ];

//   const handleLogin = (user) => {
//     setUserData(user);
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     setIsLoggedIn(false);
//     setUserData(null);
//     setActiveView('dashboard');
//     setShowProfile(false);
//   };

//   const handleViewShop = (shop) => {
//     setSelectedShop(shop);
//     setActiveView('shop-details');
//   };

//   const handleBackToShops = () => {
//     setSelectedShop(null);
//     setActiveView('shops');
//   };

//   const handleMarkAsRead = (notifId) => {
//     setData(prev => ({
//       ...prev,
//       notifications: prev.notifications.map(n =>
//         n.id === notifId ? { ...n, read: true } : n
//       )
//     }));
//   };

//   const renderView = () => {
//     switch (activeView) {

//       case 'dashboard':
//         return <DashboardView data={data} setActiveView={setActiveView} />;

//       case 'shops':
//         return <ShopsManagement onViewShop={handleViewShop} />;

//       case 'shop-details':
//         return selectedShop ? (
//           <ShopDetailsView
//             shop={selectedShop}
//             onBack={handleBackToShops}
//           />
//         ) : (
//           <ShopsManagement onViewShop={handleViewShop} />
//         );

//       case 'orders':
//         return <OrdersView data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;

//       case 'products':
//         return <ProductsView data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;

//       case 'users':
//         return <UsersView data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;

//       case 'reviews':
//         return <ReviewsView data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;

//       case 'contact':
//         return <ContactView data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;

//       case 'settings':
//         return <SettingsPage />;

//       default:
//         return <DashboardView data={data} setActiveView={setActiveView} />;
//     }
//   };

//   const unreadCount = data.notifications.filter(n => !n.read).length;

//   if (!isLoggedIn) {
//     return <LoginWithDashboard onLogin={handleLogin} />;
//   }

//   return (
//     <div className="app">

//       <div className="header">
//         <div className="logo-text">
//           <h1>Songir</h1>
//           <p>Handcraft Utensils Portal</p>
//         </div>

//         <div className="header-actions">
//           <button className="header-btn" onClick={() => setShowNotifications(!showNotifications)}>
//             <Bell size={20} />
//             {unreadCount > 0 && <span className="notification-badge"></span>}
//           </button>

//           <button className="header-btn" onClick={() => setShowProfile(!showProfile)}>
//             <User size={20} />
//           </button>
//         </div>
//       </div>

//       <NotificationPanel
//         isOpen={showNotifications}
//         onClose={() => setShowNotifications(false)}
//         notifications={data.notifications}
//         onMarkAsRead={handleMarkAsRead}
//       />

//       <ProfilePanel
//         isOpen={showProfile}
//         onClose={() => setShowProfile(false)}
//         userData={userData}
//         onLogout={handleLogout}
//       />

//       <div className="app-body">

//         <div className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

//           {/* Nav Items */}
//           <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '12px' }}>
//             {navItems.map((item) => (
//               <div
//                 key={item.id}
//                 className={`nav-item ${activeView === item.id ? 'active' : ''}`}
//                 onClick={() => {
//                   setActiveView(item.id);
//                   setSelectedShop(null);
//                 }}
//                 style={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '12px',
//                   padding: '10px 20px',
//                   cursor: 'pointer',
//                   margin: '2px 8px',
//                   borderRadius: '8px',
//                 }}
//               >
//                 <item.icon size={20} style={{ flexShrink: 0 }} />
//                 <span style={{ whiteSpace: 'nowrap', fontSize: '0.9rem' }}>{item.label}</span>
//               </div>
//             ))}
//           </div>

//           {/* Logout Button at Bottom */}
//           <div style={{ padding: '0 8px 20px' }}>
//             <div
//               className="nav-item"
//               onClick={handleLogout}
//               style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '12px',
//                 padding: '10px 20px',
//                 cursor: 'pointer',
//                 borderRadius: '8px',
//                 color: '#EF4444',
//                 borderTop: '1px solid #e5e7eb',
//                 paddingTop: '16px',
//                 marginTop: '4px',
//               }}
//             >
//               <LogOut size={20} style={{ flexShrink: 0, color: '#EF4444' }} />
//               <span style={{ whiteSpace: 'nowrap', fontSize: '0.9rem', fontWeight: '600', color: '#EF4444' }}>Logout</span>
//             </div>
//           </div>

//         </div>

//         <div className="main-content">
//           {renderView()}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default DashboardHome;




import React, { useState } from 'react';
import { BarChart3, Package, ShoppingCart, Users, Store, Star, Settings, Bell, User, MessageCircle, LogOut } from 'lucide-react';

import LoginWithDashboard from './LoginWithDashboard';
import DashboardView from './DashboardView_DynamicShop';
import OrdersView from './OrderView';
import ShopsManagement from './Shopsmanagement';
import ShopDetailsView from './ShopDetailsView';
import SettingsPage from './SettingsPage_Clean';
import UsersView from './UsersView';
import ProductsView from './ProductsView';
import ContactView from './ContactView_Simple';
import ReviewsView from './ReviewsView';
import NotificationPanel from './NotificationPanel';
import ProfilePanel from './ProfilePanel_SettingsPage';

import { generateMockData } from '../data/MockData';
import './DashboardHome.css';

const DashboardHome = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [activeView, setActiveView] = useState('dashboard');
  const [data, setData] = useState(generateMockData());
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  const navItems = [
    { id: 'dashboard', icon: BarChart3, label: 'Home' },
    { id: 'shops', icon: Store, label: 'Shops' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'reviews', icon: Star, label: 'Reviews' },
    { id: 'contact', icon: MessageCircle, label: 'Contact' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  const handleLogin = (user) => {
    setUserData(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setActiveView('dashboard');
    setShowProfile(false);
  };

  const handleViewShop = (shop) => {
    setSelectedShop(shop);
    setActiveView('shop-details');
  };

  const handleBackToShops = () => {
    setSelectedShop(null);
    setActiveView('shops');
  };

  const handleMarkAsRead = (notifId) => {
    setData(prev => ({
      ...prev,
      notifications: prev.notifications.map(n =>
        n.id === notifId ? { ...n, read: true } : n
      )
    }));
  };

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView data={data} setActiveView={setActiveView} />;
      case 'shops':
        return <ShopsManagement onViewShop={handleViewShop} />;
      case 'shop-details':
        return selectedShop ? (
          <ShopDetailsView shop={selectedShop} onBack={handleBackToShops} />
        ) : (
          <ShopsManagement onViewShop={handleViewShop} />
        );
      case 'orders':
        return <OrdersView data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'products':
        return <ProductsView data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'users':
        return <UsersView data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'reviews':
        return <ReviewsView data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'contact':
        return <ContactView data={data} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardView data={data} setActiveView={setActiveView} />;
    }
  };

  const unreadCount = data.notifications.filter(n => !n.read).length;

  // Admin initials from userData
  const getInitials = () => {
    if (!userData?.name) return 'A';
    return userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!isLoggedIn) {
    return <LoginWithDashboard onLogin={handleLogin} />;
  }

  return (
    <div className="app">

      <div className="header">
        <div className="logo-text">
          <h1>Songir</h1>
          <p>Handcraft Utensils Portal</p>
        </div>
        <div className="header-actions">
          <button className="header-btn" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge"></span>}
          </button>
          <button className="header-btn" onClick={() => setShowProfile(!showProfile)}>
            <User size={20} />
          </button>
        </div>
      </div>

      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={data.notifications}
        onMarkAsRead={handleMarkAsRead}
      />

      <ProfilePanel
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        userData={userData}
        onLogout={handleLogout}
      />

      <div className="app-body">
        <div className="sidebar">

          {/* ── Nav Items ── */}
          <div style={{ flex: 1, paddingTop: '1.5rem' }}>
            {navItems.map((item) => (
              <div
                key={item.id}
                className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveView(item.id);
                  setSelectedShop(null);
                }}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* ── Admin Profile + Logout at Bottom ── */}
          <div style={{ borderTop: '1px solid #F3E8DC' }}>

            {/* Admin Info */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              background: '#FDF8F4',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '0.9rem',
                flexShrink: 0,
              }}>
                {getInitials()}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  color: '#1F2937',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {userData?.name || 'Admin'}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#6B7280',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {userData?.email || 'admin@songir.com'}
                </div>
              </div>
            </div>

            {/* Logout */}
            <div
              className="nav-item"
              onClick={handleLogout}
              style={{
                color: '#EF4444',
                padding: '0.875rem 1.5rem',
                marginBottom: '0.5rem',
              }}
            >
              <LogOut size={20} style={{ color: '#EF4444' }} />
              <span style={{ color: '#EF4444', fontWeight: '600' }}>Logout</span>
            </div>

          </div>
        </div>

        <div className="main-content">
          {renderView()}
        </div>
      </div>

    </div>
  );
};

export default DashboardHome;