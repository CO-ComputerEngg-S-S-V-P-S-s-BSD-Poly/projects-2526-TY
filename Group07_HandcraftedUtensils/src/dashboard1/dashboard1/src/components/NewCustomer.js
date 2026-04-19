// import React from 'react';
// import { Search } from 'lucide-react';
// import { statusColors } from '../data/MockData'; // assuming you still want status badge colors

// // Row component for each customer
// const CustomerRow = ({ customer, showActions = false }) => {
//   const handleCustomerClick = (customerId) => {
//     alert(`Customer ${customerId} details`);
//   };

//   return (
//     <tr
//       className="customer-row"
//       onClick={() => handleCustomerClick(customer.id)}
//       style={{ cursor: 'pointer' }}
//     >
//       <td className="customer-name">{customer.name}</td>
//       <td>{customer.email}</td>
//       {showActions && <td>{customer.joinedDate}</td>}
//       <td>
//         <span
//           className="status-badge"
//           style={{
//             backgroundColor: statusColors[customer.status] + '20',
//             color: statusColors[customer.status],
//           }}
//         >
//           {customer.status}
//         </span>
//       </td>
//     </tr>
//   );
// };

// // Main component for New Customers table
// const NewCustomer = ({ data, searchTerm, setSearchTerm }) => {
//   // Filter customers based on search input
//   const filteredCustomers = data.customers.filter(
//     (customer) =>
//       customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       customer.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="view-content">
//       <div className="page-header-row">
//         <div>
//           <h1 className="page-title">New Customers</h1>
//           <p className="page-subtitle">Manage and track all your new customers</p>
//         </div>

//         <div className="search-container">
//           <Search size={20} />
//           <input
//             type="text"
//             placeholder="Search customers by name or email..."
//             className="search-input"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="customers-card">
//         <div className="table-container">
//           <table className="customers-table">
//             <thead>
//               <tr>
//                 <th>Name</th>
//                 <th>Email</th>
//                 <th>Joined Date</th>
//                 <th>Status</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredCustomers.length > 0 ? (
//                 filteredCustomers.map((customer, idx) => (
//                   <CustomerRow key={idx} customer={customer} showActions={true} />
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem' }}>
//                     No customers found
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

// export default NewCustomer;

import React from "react";
import { Search } from "lucide-react";
import { statusColors } from "../data/MockData"; // statusColors will define colors for Customer/Shopkeeper

// Row for each user
const CustomerRow = ({ user }) => {
  const handleClick = (userId) => {
    alert(`User ${userId} details`);
  };

  return (
    <tr
      className="customer-row"
      onClick={() => handleClick(user.id)}
      style={{ cursor: "pointer" }}
    >
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.joinedDate}</td>
      <td>
        <span
          className="status-badge"
          style={{
            backgroundColor: statusColors[user.role] + "20",
            color: statusColors[user.role],
            padding: "0.25rem 0.5rem",
            borderRadius: "9999px",
            fontWeight: 500,
            fontSize: "0.85rem",
          }}
        >
          {user.role} {/* dynamically shows Customer or Shopkeeper */}
        </span>
      </td>
    </tr>
  );
};

const NewCustomer = ({ data, searchTerm, setSearchTerm }) => {
  // Filter users based on name or email
  const filteredUsers = data.users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="view-content">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="page-title">All Users</h1>
          <p className="page-subtitle">Manage and track all your users</p>
        </div>

        <div className="search-container">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table card */}
      <div className="orders-card"> {/* same card style as orders */}
        <div className="table-container">
          <table className="orders-table"> {/* same table style */}
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <CustomerRow key={idx} user={user} />
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "1.5rem" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;

