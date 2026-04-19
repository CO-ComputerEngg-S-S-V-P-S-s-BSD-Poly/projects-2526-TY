// import React from 'react';
// import { Search, UserPlus, Mail, Calendar, User as UserIcon } from 'lucide-react';

// const UsersView = ({ data, searchTerm, setSearchTerm }) => {
//   const filteredUsers = data.users.filter(user =>
//     user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     user.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const UserRow = ({ user }) => {
//     return (
//       <tr className="order-row" style={{ cursor: 'pointer' }}>
//         <td className="order-id">{user.id}</td>
//         <td>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
//             <div style={{
//               width: '40px',
//               height: '40px',
//               borderRadius: '50%',
//               background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontWeight: '600',
//               fontSize: '0.9rem'
//             }}>
//               {user.name.split(' ').map(n => n[0]).join('')}
//             </div>
//             <span style={{ fontWeight: '500' }}>{user.name}</span>
//           </div>
//         </td>
//         <td>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//             <Mail size={16} color="#6B7280" />
//             {user.email}
//           </div>
//         </td>
//         <td>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
//             <Calendar size={16} color="#6B7280" />
//             {user.joinedDate}
//           </div>
//         </td>
//         <td>
//           <span className="status-badge" style={{ 
//             backgroundColor: user.status === 'Active' ? '#10B98120' : '#EF444420',
//             color: user.status === 'Active' ? '#10B981' : '#EF4444'
//           }}>
//             {user.status}
//           </span>
//         </td>
//       </tr>
//     );
//   };

//   return (
//     <div className="view-content">
//       <div className="page-header-row">
//         <div>
//           <h1 className="page-title">Users Management</h1>
//           <p className="page-subtitle">Manage all registered users - Total: {data.users.length}</p>
//         </div>
//         <div className="page-actions">
//           {/* <button className="filter-btn">
//             <Filter size={18} />
//             Filter
//           </button>
//           <button className="download-btn">
//             <Download size={18} />
//             Export
//           </button> */}
//           {/* <button className="download-btn" style={{ background: '#10B981' }}>
//             <UserPlus size={18} />
//             Add User
//           </button> */}
//         </div>
//       </div>

//       <div className="search-container">
//         <Search size={20} />
//         <input 
//           type="text"
//           placeholder="Search users by ID, name, or email..."
//           className="search-input"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       <div className="orders-card">
//         <div className="table-container">
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>User ID</th>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Joined Date</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.length > 0 ? (
//                 filteredUsers.map((user, idx) => (
//                   <UserRow key={idx} user={user} />
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="5" style={{ textAlign: 'center', padding: '1.5rem' }}>
//                     No users found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UsersView;

//==========================================================
//====================================================================



import React, { useState, useEffect } from 'react';
import { Search, Mail, Calendar } from 'lucide-react';

const UsersView = ({ searchTerm, setSearchTerm }) => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // ✅ Backend se real users fetch karo
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res  = await fetch('http://localhost:5000/api/users');
        const data = await res.json();
        if (data.success) setUsers(data.users);
        else setError('Failed to load users.');
      } catch {
        setError('Cannot connect to server.');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.id.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    user.name.toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    user.email.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const UserRow = ({ user }) => (
    <tr className="order-row" style={{ cursor: 'pointer' }}>
      <td className="order-id">{user.id}</td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #C17A3F 0%, #A85C28 100%)',
            color: 'white', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontWeight: '600', fontSize: '0.9rem'
          }}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <span style={{ fontWeight: '500' }}>{user.name}</span>
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={16} color="#6B7280" />
          {user.email}
        </div>
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Calendar size={16} color="#6B7280" />
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
    <div className="view-content">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Users Management</h1>
          <p className="page-subtitle">
            Manage all registered users - Total: {loading ? '...' : users.length}
          </p>
        </div>
      </div>

      <div className="search-container">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search users by ID, name, or email..."
          className="search-input"
          value={searchTerm || ''}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="orders-card">
        <div className="table-container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#9a7b5a' }}>
              Loading users...
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#EF4444' }}>
              {error}
            </div>
          ) : (
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
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <UserRow key={idx} user={user} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '1.5rem' }}>
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersView;
