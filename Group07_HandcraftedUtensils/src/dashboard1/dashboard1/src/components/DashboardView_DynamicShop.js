// import React from 'react';
// import { ShoppingCart, Package, Store, Users, ChevronRight, TrendingUp, Award } from 'lucide-react';

// const DashboardView_DynamicShop = ({ data, setActiveView }) => {
//   const StatCard = ({ icon: Icon, title, value, color, trend, onClick }) => (
//     <div className="stat-card" style={{ '--card-color': color }} onClick={onClick}>
//       <div className="stat-icon" style={{ backgroundColor: color }}>
//         <Icon size={24} color="white" />
//       </div>
//       <div className="stat-content">
//         <div className="stat-title">{title}</div>
//         <div className="stat-value">{value}</div>
//         {trend && <div className="stat-trend">{trend}</div>}
//       </div>
//     </div>
//   );

//   const OrderRow = ({ order }) => {
//     const statusColors = {
//       'Pending': '#F59E0B',
//       'Shipped': '#10B981',
//       'Delivered': '#3B82F6',
//       'Processing': '#8B5CF6',
//       'Cancelled': '#EF4444'
//     };

//     return (
//       <tr 
//         className="order-row" 
//         onClick={() => alert(`Order ${order.id} details`)}
//         style={{ cursor: 'pointer' }}
//       >
//         <td className="order-id">{order.id}</td>
//         <td>{order.customer}</td>
//         <td>{order.shop}</td>
//         <td>₹{order.amount.toLocaleString()}</td>
//         <td>
//           <span className="status-badge" style={{ 
//             backgroundColor: statusColors[order.status] + '20', 
//             color: statusColors[order.status] 
//           }}>
//             {order.status}
//           </span>
//         </td>
//       </tr>
//     );
//   };

//   return (
//     <div className="dashboard-content">
//       <h1 className="page-title">Welcome, Admin!</h1>
      
//       <div className="stats-grid">
//         <StatCard 
//           icon={ShoppingCart} 
//           title="Total Orders" 
//           value={data.stats.totalOrders} 
//           color="#C17A3F" 
//           trend="+12% this month"
//           onClick={() => setActiveView('orders')}
//         />
//         <StatCard 
//           icon={Package} 
//           title="New Products" 
//           value={data.stats.newProducts} 
//           color="#D4A574"
//           onClick={() => setActiveView('products')}
//         />
//         <StatCard 
//           icon={Store} 
//           title="Active Shops" 
//           value={data.stats.activeShops} 
//           color="#B8956A"
//           onClick={() => setActiveView('shops')}
//         />
//         <StatCard 
//           icon={Users} 
//           title="New Customers" 
//           value={data.stats.newCustomers} 
//           color="#C9A876" 
//           trend="+8% this week"
//           onClick={() => setActiveView('users')}
//         />
//       </div>

//       <div className="content-grid">
//         <div className="section orders-section">
//           <div className="section-header">
//             <h2>Latest Orders</h2>
//             <button 
//               className="view-all-btn"
//               onClick={() => setActiveView('orders')}
//             >
//               View All <ChevronRight size={18} />
//             </button>
//           </div>
//           <div className="table-container">
//             <table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>Order ID</th>
//                   <th>Customer</th>
//                   <th>Shop</th>
//                   <th>Amount</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.orders.slice(0, 5).map((order, idx) => (
//                   <OrderRow key={idx} order={order} />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="section shopkeepers-section">
//           <h2>Shopkeepers Overview</h2>
//           <div className="subsection">
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '1rem'
//             }}>
//               <h3>Top Performers This Month</h3>
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 color: '#10B981',
//                 fontSize: '0.85rem',
//                 fontWeight: '600'
//               }}>
//                 <TrendingUp size={16} />
//                 Live
//               </div>
//             </div>
//             <div className="top-sellers">
//               {data.topShopkeepers.map((shop, idx) => (
//                 <div key={idx} className="seller-item">
//                   <div style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: '0.5rem'
//                   }}>
//                     <span className="seller-name" style={{ 
//                       fontWeight: idx === 0 ? '700' : '600',
//                       color: idx === 0 ? '#C17A3F' : '#374151'
//                     }}>
//                       {shop.name}
//                     </span>
//                     <div style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '0.5rem'
//                     }}>
//                       <span style={{
//                         fontSize: '0.85rem',
//                         fontWeight: '700',
//                         color: shop.color
//                       }}>
//                         {shop.sales}%
//                       </span>
//                       {idx === 0 && (
//                         <span style={{
//                           background: '#FEF3C7',
//                           color: '#D97706',
//                           padding: '0.25rem 0.5rem',
//                           borderRadius: '12px',
//                           fontSize: '0.7rem',
//                           fontWeight: '700',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '0.25rem'
//                         }}>
//                           <Award size={12} />
//                           Top
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="seller-bar-container" style={{
//                     position: 'relative',
//                     height: idx === 0 ? '36px' : '32px'
//                   }}>
//                     <div 
//                       className="seller-bar" 
//                       style={{ 
//                         width: `${shop.sales}%`, 
//                         backgroundColor: shop.color,
//                         position: 'relative',
//                         boxShadow: idx === 0 ? `0 4px 12px ${shop.color}40` : 'none',
//                         animation: idx === 0 ? 'pulse 2s infinite' : 'none'
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes pulse {
//           0%, 100% {
//             transform: scaleY(1);
//           }
//           50% {
//             transform: scaleY(1.05);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DashboardView_DynamicShop;

//=====================================================================

// import React from 'react';
// import { MessageCircle, Star, Store, Users, ChevronRight, TrendingUp, Award, Mail, Calendar } from 'lucide-react';

// const DashboardView_DynamicShop = ({ data, setActiveView }) => {
//   const StatCard = ({ icon: Icon, title, value, color, trend, onClick }) => (
//     <div className="stat-card" style={{ '--card-color': color, cursor: 'pointer' }} onClick={onClick}>
//       <div className="stat-icon" style={{ backgroundColor: color }}>
//         <Icon size={24} color="white" />
//       </div>
//       <div className="stat-content">
//         <div className="stat-title">{title}</div>
//         <div className="stat-value">{value}</div>
//         {trend && <div className="stat-trend">{trend}</div>}
//       </div>
//     </div>
//   );

//   const UserRow = ({ user }) => (
//     <tr
//       className="order-row"
//       onClick={() => setActiveView('users')}
//       style={{ cursor: 'pointer' }}
//     >
//       <td className="order-id">{user.id}</td>
//       <td>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//           <div style={{
//             width: '34px',
//             height: '34px',
//             borderRadius: '50%',
//             background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
//             color: 'white',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             fontWeight: '600',
//             fontSize: '0.8rem',
//             flexShrink: 0
//           }}>
//             {user.name.split(' ').map(n => n[0]).join('')}
//           </div>
//           <span style={{ fontWeight: '500' }}>{user.name}</span>
//         </div>
//       </td>
//       <td>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//           <Mail size={14} color="#6B7280" />
//           {user.email}
//         </div>
//       </td>
//       <td>
//         <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//           <Calendar size={14} color="#6B7280" />
//           {user.joinedDate}
//         </div>
//       </td>
//       <td>
//         <span className="status-badge" style={{
//           backgroundColor: user.status === 'Active' ? '#10B98120' : '#EF444420',
//           color: user.status === 'Active' ? '#10B981' : '#EF4444'
//         }}>
//           {user.status}
//         </span>
//       </td>
//     </tr>
//   );

//   return (
//     <div className="dashboard-content">
//       <h1 className="page-title">Welcome, Admin!</h1>

//       <div className="stats-grid">
//         <StatCard
//           icon={Store}
//           title="Active Shops"
//           value={data.stats.activeShops}
//           color="#C17A3F"
//           onClick={() => setActiveView('shops')}
//         />
//         <StatCard
//           icon={Users}
//           title="New Customers"
//           value={data.stats.newCustomers}
//           color="#D4A574"
//           trend="+8% this week"
//           onClick={() => setActiveView('users')}
//         />
//         <StatCard
//           icon={MessageCircle}
//           title="Contact Msgs"
//           value={data.stats.totalOrders}
//           color="#B8956A"
//           onClick={() => setActiveView('contact')}
//         />
//         <StatCard
//           icon={Star}
//           title="Reviews"
//           value={data.stats.newProducts}
//           color="#C9A876"
//           onClick={() => setActiveView('reviews')}
//         />
//       </div>

//       <div className="content-grid">
//         <div className="section orders-section">
//           <div className="section-header">
//             <h2>New Users</h2>
//             <button
//               className="view-all-btn"
//               onClick={() => setActiveView('users')}
//             >
//               View All <ChevronRight size={18} />
//             </button>
//           </div>
//           <div className="table-container">
//             <table className="orders-table">
//               <thead>
//                 <tr>
//                   <th>User ID</th>
//                   <th>Name</th>
//                   <th>Email</th>
//                   <th>Joined Date</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.users.slice(0, 5).map((user, idx) => (
//                   <UserRow key={idx} user={user} />
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         <div className="section shopkeepers-section">
//           <h2>Shopkeepers Overview</h2>
//           <div className="subsection">
//             <div style={{
//               display: 'flex',
//               justifyContent: 'space-between',
//               alignItems: 'center',
//               marginBottom: '1rem'
//             }}>
//               <h3>Top Performers This Month</h3>
//               <div style={{
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '0.5rem',
//                 color: '#10B981',
//                 fontSize: '0.85rem',
//                 fontWeight: '600'
//               }}>
//                 <TrendingUp size={16} />
//                 Live
//               </div>
//             </div>
//             <div className="top-sellers">
//               {data.topShopkeepers.map((shop, idx) => (
//                 <div key={idx} className="seller-item">
//                   <div style={{
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     marginBottom: '0.5rem'
//                   }}>
//                     <span className="seller-name" style={{
//                       fontWeight: idx === 0 ? '700' : '600',
//                       color: idx === 0 ? '#C17A3F' : '#374151'
//                     }}>
//                       {shop.name}
//                     </span>
//                     <div style={{
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '0.5rem'
//                     }}>
//                       <span style={{
//                         fontSize: '0.85rem',
//                         fontWeight: '700',
//                         color: shop.color
//                       }}>
//                         {shop.sales}%
//                       </span>
//                       {idx === 0 && (
//                         <span style={{
//                           background: '#FEF3C7',
//                           color: '#D97706',
//                           padding: '0.25rem 0.5rem',
//                           borderRadius: '12px',
//                           fontSize: '0.7rem',
//                           fontWeight: '700',
//                           display: 'flex',
//                           alignItems: 'center',
//                           gap: '0.25rem'
//                         }}>
//                           <Award size={12} />
//                           Top
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                   <div className="seller-bar-container" style={{
//                     position: 'relative',
//                     height: idx === 0 ? '36px' : '32px'
//                   }}>
//                     <div
//                       className="seller-bar"
//                       style={{
//                         width: `${shop.sales}%`,
//                         backgroundColor: shop.color,
//                         position: 'relative',
//                         boxShadow: idx === 0 ? `0 4px 12px ${shop.color}40` : 'none',
//                         animation: idx === 0 ? 'pulse 2s infinite' : 'none'
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes pulse {
//           0%, 100% { transform: scaleY(1); }
//           50% { transform: scaleY(1.05); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DashboardView_DynamicShop;




















import React, { useState, useEffect } from 'react';
import { MessageCircle, Star, Store, Users, ChevronRight, TrendingUp, Award, Mail, Calendar } from 'lucide-react';

const DashboardView_DynamicShop = ({ data, setActiveView }) => {

  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/users')
      .then(res => res.json())
      .then(json => {
        if (json.success) setRecentUsers(json.users.slice(0, 5));
      })
      .catch(err => console.error('Users fetch failed:', err));
  }, []);

  const StatCard = ({ icon: Icon, title, value, color, trend, onClick }) => (
    <div className="stat-card" style={{ '--card-color': color, cursor: 'pointer' }} onClick={onClick}>
      <div className="stat-icon" style={{ backgroundColor: color }}>
        <Icon size={24} color="white" />
      </div>
      <div className="stat-content">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && <div className="stat-trend">{trend}</div>}
      </div>
    </div>
  );

  const UserRow = ({ user }) => (
    <tr
      className="order-row"
      onClick={() => setActiveView('users')}
      style={{ cursor: 'pointer' }}
    >
      <td className="order-id">{user.id}</td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '600',
            fontSize: '0.8rem',
            flexShrink: 0
          }}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <span style={{ fontWeight: '500' }}>{user.name}</span>
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={14} color="#6B7280" />
          {user.email}
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={14} color="#6B7280" />
          {user.joinedDate}
        </div>
      </td>
      <td>
        <span className="status-badge" style={{
          backgroundColor: user.status === 'Active' ? '#10B98120' : '#EF444420',
          color: user.status === 'Active' ? '#10B981' : '#EF4444'
        }}>
          {user.status}
        </span>
      </td>
    </tr>
  );

  return (
    <div className="dashboard-content">
      <h1 className="page-title">Welcome, Admin!</h1>

      <div className="stats-grid">
        <StatCard
          icon={Store}
          title="Active Shops"
          value={data.stats.activeShops}
          color="#C17A3F"
          onClick={() => setActiveView('shops')}
        />
        <StatCard
          icon={Users}
          title="New Customers"
          value={data.stats.newCustomers}
          color="#D4A574"
          trend="+8% this week"
          onClick={() => setActiveView('users')}
        />
        <StatCard
          icon={MessageCircle}
          title="Contact Msgs"
          value={data.stats.totalOrders}
          color="#B8956A"
          onClick={() => setActiveView('contact')}
        />
        <StatCard
          icon={Star}
          title="Reviews"
          value={data.stats.newProducts}
          color="#C9A876"
          onClick={() => setActiveView('reviews')}
        />
      </div>

      <div className="content-grid">
        <div className="section orders-section">
          <div className="section-header">
            <h2>New Users</h2>
            <button
              className="view-all-btn"
              onClick={() => setActiveView('users')}
            >
              View All <ChevronRight size={18} />
            </button>
          </div>
          <div className="table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Joined Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.length > 0 ? (
                  recentUsers.map((user, idx) => (
                    <UserRow key={idx} user={user} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '1.5rem', color: '#9a7b5a' }}>
                      Loading users...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="section shopkeepers-section">
          <h2>Shopkeepers Overview</h2>
          <div className="subsection">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h3>Top Performers This Month</h3>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#10B981',
                fontSize: '0.85rem',
                fontWeight: '600'
              }}>
                <TrendingUp size={16} />
                Live
              </div>
            </div>
            <div className="top-sellers">
              {data.topShopkeepers.map((shop, idx) => (
                <div key={idx} className="seller-item">
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <span className="seller-name" style={{
                      fontWeight: idx === 0 ? '700' : '600',
                      color: idx === 0 ? '#C17A3F' : '#374151'
                    }}>
                      {shop.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        fontSize: '0.85rem',
                        fontWeight: '700',
                        color: shop.color
                      }}>
                        {shop.sales}%
                      </span>
                      {idx === 0 && (
                        <span style={{
                          background: '#FEF3C7',
                          color: '#D97706',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: '700',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}>
                          <Award size={12} />
                          Top
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="seller-bar-container" style={{
                    position: 'relative',
                    height: idx === 0 ? '36px' : '32px'
                  }}>
                    <div
                      className="seller-bar"
                      style={{
                        width: `${shop.sales}%`,
                        backgroundColor: shop.color,
                        position: 'relative',
                        boxShadow: idx === 0 ? `0 4px 12px ${shop.color}40` : 'none',
                        animation: idx === 0 ? 'pulse 2s infinite' : 'none'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(1.05); }
        }
      `}</style>
    </div>
  );
};

export default DashboardView_DynamicShop;