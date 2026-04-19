// import React, { useState, useEffect } from 'react';
// import { Star, Clock, Package, MapPin, CheckCircle2, XCircle, Trash2, Eye } from 'lucide-react';
// import './Shopsmanagement.css';

// const Shopsmanagement = () => {
//   const [shops, setShops] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchShops();
//   }, []);

//   const fetchShops = async () => {
//     try {
//       const mockShops = [
//         {
//           id: '1',
//           name: 'Sharma Brass Works',
//           owner: 'Ramesh Sharma',
//           initials: 'RS',
//           rating: 4.9,
//           reviews: 234,
//           years: '35',
//           products: 6,
//           location: 'Songir',
//           description: 'Third-generation artisan specializing in intricate brass pooja items and traditional vessels.',
//           tags: ['Pooja Items', 'Traditional Vessels'],
//           status: 'verified',
//           verified: true
//         },
//         {
//           id: '2',
//           name: 'Gupta Metal Arts',
//           owner: 'Mohan Gupta',
//           initials: 'MG',
//           rating: 4.9,
//           reviews: 312,
//           years: '40',
//           products: 5,
//           location: 'Songir',
//           description: 'Master craftsman known for decorative pieces and custom metalwork.',
//           tags: ['Decorative Items', 'Custom Orders'],
//           status: 'pending',
//           verified: false
//         },
//         {
//           id: '3',
//           name: 'Patel Copper Crafts',
//           owner: 'Suresh Patel',
//           initials: 'SP',
//           rating: 4.8,
//           reviews: 189,
//           years: '28',
//           products: 5,
//           location: 'Songir',
//           description: 'Expert in creating durable copper cookware with traditional techniques.',
//           tags: ['Kitchen Utensils', 'Cookware'],
//           status: 'rejected',
//           verified: false,
//           rejectionReason: 'Incomplete documentation'
//         }
//       ];

//       setShops(mockShops);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching shops:', error);
//       setLoading(false);
//     }
//   };

//   // ✅ FIXED CONFIRM (window.confirm used)
//   const handleApprove = (shopId) => {
//     const confirmAction = window.confirm('Are you sure you want to approve this shop?');
//     if (!confirmAction) return;

//     setShops(prev =>
//       prev.map(shop =>
//         shop.id === shopId ? { ...shop, status: 'verified', verified: true } : shop
//       )
//     );

//     window.alert('Shop approved successfully!');
//   };

//   const handleReject = (shopId) => {
//     const reason = window.prompt('Please provide a reason for rejection:');
//     if (!reason) return;

//     setShops(prev =>
//       prev.map(shop =>
//         shop.id === shopId
//           ? { ...shop, status: 'rejected', rejectionReason: reason, verified: false }
//           : shop
//       )
//     );

//     window.alert('Shop rejected');
//   };

//   const handleDelete = (shopId) => {
//     const confirmDelete = window.confirm('Are you sure you want to delete this shop?');
//     if (!confirmDelete) return;

//     setShops(prev => prev.filter(shop => shop.id !== shopId));
//     window.alert('Shop deleted successfully');
//   };

//   const filteredShops = shops.filter(shop =>
//     filter === 'all' ? true : shop.status === filter
//   );

//   const ShopCard = ({ shop }) => (
//     <div className="shop-card">
//       {shop.verified && (
//         <div className="verified-badge">
//           <CheckCircle2 size={16} />
//           Verified
//         </div>
//       )}

//       {shop.status === 'pending' && <div className="pending-badge">Pending</div>}

//       {shop.status === 'rejected' && (
//         <div className="rejected-badge">
//           <XCircle size={16} />
//           Rejected
//         </div>
//       )}

//       <div className="shop-avatar">{shop.initials}</div>

//       <h3 className="shop-name">{shop.name}</h3>
//       <p className="shop-owner">{shop.owner}</p>

//       <div className="shop-rating">
//         <Star size={16} fill="#F59E0B" color="#F59E0B" />
//         <span>{shop.rating}</span>
//         <span>({shop.reviews} reviews)</span>
//       </div>

//       <p>{shop.description}</p>

//       <div className="shop-info">
//         <div><Clock size={14} /> {shop.years} years</div>
//         <div><Package size={14} /> {shop.products} products</div>
//         <div><MapPin size={14} /> {shop.location}</div>
//       </div>

//       {shop.status === 'rejected' && shop.rejectionReason && (
//         <div><strong>Reason:</strong> {shop.rejectionReason}</div>
//       )}

//       <div className="shop-actions">
//         {shop.status === 'pending' ? (
//           <>
//             <button onClick={() => handleApprove(shop.id)}>
//               <CheckCircle2 size={16} /> Approve
//             </button>
//             <button onClick={() => handleReject(shop.id)}>
//               <XCircle size={16} /> Reject
//             </button>
//           </>
//         ) : (
//           <button onClick={() => handleDelete(shop.id)}>
//             <Trash2 size={16} /> Delete
//           </button>
//         )}

//         <button>
//           <Eye size={16} /> View
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="view-content">
//       <h1>Shops Management</h1>

//       <div>
//         {['all', 'pending', 'verified', 'rejected'].map(f => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             style={{ marginRight: 10 }}
//           >
//             {f}
//           </button>
//         ))}
//       </div>

//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         filteredShops.map(shop => (
//           <ShopCard key={shop.id} shop={shop} />
//         ))
//       )}
//     </div>
//   );
// };

// export default Shopsmanagement;


// import React, { useState, useEffect } from 'react';
// import { Star, Clock, MapPin, CheckCircle2, XCircle, Trash2, Eye, Mail, Phone } from 'lucide-react';
// import './Shopsmanagement.css';

// const Shopsmanagement = () => {
//   const [shops, setShops] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchShops();
//   }, []);

//   const fetchShops = async () => {
//     try {
//       // Mock data matching the form structure
//       const mockShops = [
//         {
//           id: '1',
//           shopName: 'Sharma Brass Works',
//           ownerName: 'Ramesh Sharma',
//           email: 'ramesh@brasworks.com',
//           phone: '+91 98765 43210',
//           address: 'Shop No. 45, Main Market, Songir, Maharashtra',
//           workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//           openingTime: '09:00',
//           closingTime: '18:00',
//           initials: 'RS',
//           status: 'verified',
//           profilePicture: null
//         },
//         {
//           id: '2',
//           shopName: 'Gupta Metal Arts',
//           ownerName: 'Mohan Gupta',
//           email: 'mohan@metalarts.com',
//           phone: '+91 98765 43211',
//           address: 'Shop No. 12, Artisan Colony, Songir, Maharashtra',
//           workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
//           openingTime: '10:00',
//           closingTime: '19:00',
//           initials: 'MG',
//           status: 'pending',
//           profilePicture: null
//         },
//         {
//           id: '3',
//           shopName: 'Patel Copper Crafts',
//           ownerName: 'Suresh Patel',
//           email: 'suresh@coppercraft.com',
//           phone: '+91 98765 43212',
//           address: 'Shop No. 78, Copper Street, Songir, Maharashtra',
//           workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
//           openingTime: '09:30',
//           closingTime: '17:30',
//           initials: 'SP',
//           status: 'rejected',
//           rejectionReason: 'Incomplete documentation provided',
//           profilePicture: null
//         }
//       ];

//       setShops(mockShops);
//       setLoading(false);
//     } catch (error) {
//       console.error('Error fetching shops:', error);
//       setLoading(false);
//     }
//   };

//   const handleApprove = async (shopId) => {
//     if (window.confirm('Are you sure you want to approve this shop?')) return;

//     try {
//       setShops(shops.map(shop => 
//         shop.id === shopId ? { ...shop, status: 'verified' } : shop
//       ));
//       alert('Shop approved successfully!');
//     } catch (error) {
//       console.error('Error approving shop:', error);
//       alert('Failed to approve shop');
//     }
//   };

//   const handleReject = async (shopId) => {
//     const reason = prompt('Please provide a reason for rejection:');
//     if (!reason) return;

//     try {
//       setShops(shops.map(shop => 
//         shop.id === shopId ? { ...shop, status: 'rejected', rejectionReason: reason } : shop
//       ));
//       alert('Shop rejected');
//     } catch (error) {
//       console.error('Error rejecting shop:', error);
//       alert('Failed to reject shop');
//     }
//   };

//   const handleDelete = async (shopId) => {
//     if (window.confirm('Are you sure you want to delete this shop?')) return;

//     try {
//       setShops(shops.filter(shop => shop.id !== shopId));
//       alert('Shop deleted successfully');
//     } catch (error) {
//       console.error('Error deleting shop:', error);
//       alert('Failed to delete shop');
//     }
//   };

//   const filteredShops = shops.filter(shop => {
//     if (filter === 'all') return true;
//     return shop.status === filter;
//   });

//   const ShopCard = ({ shop }) => (
//     <div className="shop-card">
//       <div className="card-header">
//         <div className="shop-avatar">
//           {shop.profilePicture ? (
//             <img src={shop.profilePicture} alt={shop.shopName} />
//           ) : (
//             <span>{shop.initials}</span>
//           )}
//         </div>
        
//         <div className="status-badge-container">
//           {shop.status === 'verified' && (
//             <div className="badge verified">
//               <CheckCircle2 size={14} />
//               Verified
//             </div>
//           )}
//           {shop.status === 'pending' && (
//             <div className="badge pending">
//               Pending
//             </div>
//           )}
//           {shop.status === 'rejected' && (
//             <div className="badge rejected">
//               <XCircle size={14} />
//               Rejected
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="card-body">
//         <h3 className="shop-title">{shop.shopName}</h3>
//         <p className="shop-subtitle">{shop.ownerName}</p>

//         <div className="info-grid">
//           <div className="info-row">
//             <Mail size={16} />
//             <span>{shop.email}</span>
//           </div>
//           <div className="info-row">
//             <Phone size={16} />
//             <span>{shop.phone}</span>
//           </div>
//           <div className="info-row">
//             <MapPin size={16} />
//             <span>{shop.address}</span>
//           </div>
//         </div>

//         <div className="working-info">
//           <div className="working-label">
//             <Clock size={16} />
//             Working Hours
//           </div>
//           <div className="working-details">
//             <span className="time-badge">{shop.openingTime} - {shop.closingTime}</span>
//           </div>
//         </div>

//         <div className="working-days-display">
//           <div className="days-label">Working Days</div>
//           <div className="days-badges">
//             {shop.workingDays.map((day, idx) => (
//               <span key={idx} className="day-badge">{day}</span>
//             ))}
//           </div>
//         </div>

//         {shop.status === 'rejected' && shop.rejectionReason && (
//           <div className="rejection-box">
//             <strong>Rejection Reason:</strong>
//             <p>{shop.rejectionReason}</p>
//           </div>
//         )}
//       </div>

//       <div className="card-actions">
//         {shop.status === 'pending' && (
//           <>
//             <button 
//               className="btn btn-approve"
//               onClick={() => handleApprove(shop.id)}
//             >
//               <CheckCircle2 size={16} />
//               Approve
//             </button>
//             <button 
//               className="btn btn-reject"
//               onClick={() => handleReject(shop.id)}
//             >
//               <XCircle size={16} />
//               Reject
//             </button>
//           </>
//         )}
//         {shop.status !== 'pending' && (
//           <button 
//             className="btn btn-delete"
//             onClick={() => handleDelete(shop.id)}
//           >
//             <Trash2 size={16} />
//             Delete
//           </button>
//         )}
//         <button className="btn btn-view">
//           <Eye size={16} />
//           View Details
//         </button>
//       </div>
//     </div>
//   );

//   return (
//     <div className="shops-management">
//       <div className="management-header">
//         <div className="header-content">
//           <h1 className="page-title">Shops Management</h1>
//           <p className="page-subtitle">
//             Showing {filteredShops.length} of {shops.length} shops
//           </p>
//         </div>
//       </div>

//       {/* Filter Buttons */}
//       <div className="filter-bar">
//         {['all', 'pending', 'verified', 'rejected'].map(f => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             className={`filter-btn ${filter === f ? 'active' : ''}`}
//           >
//             {f.charAt(0).toUpperCase() + f.slice(1)}
//             <span className="filter-count">
//               {f === 'all' ? shops.length : shops.filter(s => s.status === f).length}
//             </span>
//           </button>
//         ))}
//       </div>

//       {/* Shops Grid */}
//       {loading ? (
//         <div className="loading-container">
//           <div className="spinner"></div>
//           <p>Loading shops...</p>
//         </div>
//       ) : filteredShops.length === 0 ? (
//         <div className="empty-container">
//           <div className="empty-icon">🏪</div>
//           <p>No shops found</p>
//         </div>
//       ) : (
//         <div className="shops-grid">
//           {filteredShops.map((shop) => (
//             <ShopCard key={shop.id} shop={shop} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Shopsmanagement;

// import React, { useState, useEffect } from 'react';
// import { Star, Clock, MapPin, CheckCircle2, XCircle, Trash2, Eye, Mail, Phone } from 'lucide-react';
// import './Shopsmanagement.css';

// const Shopsmanagement = () => {
//   const [shops, setShops] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchShops();
//   }, []);

//   // ✅ REAL FETCH FROM BACKEND
//   const fetchShops = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/shops");
//       const data = await response.json();

//       const formatted = data.map(shop => ({
//         ...shop,
//         id: shop._id,
//         initials: shop.shopName
//           ? shop.shopName.substring(0, 2).toUpperCase()
//           : "SH"
//       }));

//       setShops(formatted);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching shops:", error);
//       setLoading(false);
//     }
//   };

//   // ✅ APPROVE
//   const handleApprove = async (shopId) => {
//     const confirm = window.confirm("Approve this shop?");
//     if (!confirm) return;

//     try {
//       await fetch(`http://localhost:5000/api/shops/approve/${shopId}`, {
//         method: "PUT"
//       });

//       fetchShops();
//       alert("Shop approved!");
//     } catch (error) {
//       alert("Failed to approve");
//     }
//   };

//   // ✅ REJECT
//   const handleReject = async (shopId) => {
//     const reason = prompt("Enter rejection reason:");
//     if (!reason) return;

//     try {
//       await fetch(`http://localhost:5000/api/shops/reject/${shopId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reason })
//       });

//       fetchShops();
//       alert("Shop rejected");
//     } catch (error) {
//       alert("Failed to reject");
//     }
//   };

//   const filteredShops = shops.filter(shop => {
//     if (filter === 'all') return true;
//     return shop.status === filter;
//   });

//   const ShopCard = ({ shop }) => (
//     <div className="shop-card">
//       <div className="card-header">
//         <div className="shop-avatar">
//           <span>{shop.initials}</span>
//         </div>

//         <div className="status-badge-container">
//           {shop.status === 'approved' && (
//             <div className="badge verified">
//               <CheckCircle2 size={14} />
//               Verified
//             </div>
//           )}
//           {shop.status === 'pending' && (
//             <div className="badge pending">
//               Pending
//             </div>
//           )}
//           {shop.status === 'rejected' && (
//             <div className="badge rejected">
//               <XCircle size={14} />
//               Rejected
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="card-body">
//         <h3 className="shop-title">{shop.shopName}</h3>
//         <p className="shop-subtitle">{shop.ownerName}</p>

//         <div className="info-grid">
//           <div className="info-row">
//             <Mail size={16} />
//             <span>{shop.email}</span>
//           </div>
//           <div className="info-row">
//             <Phone size={16} />
//             <span>{shop.phone}</span>
//           </div>
//           <div className="info-row">
//             <MapPin size={16} />
//             <span>{shop.address}</span>
//           </div>
//         </div>

//         <div className="working-info">
//           <div className="working-label">
//             <Clock size={16} />
//             Working Hours
//           </div>
//           <div className="working-details">
//             <span className="time-badge">
//               {shop.openingTime} - {shop.closingTime}
//             </span>
//           </div>
//         </div>

//         <div className="working-days-display">
//           <div className="days-label">Working Days</div>
//           <div className="days-badges">
//             {shop.workingDays?.map((day, idx) => (
//               <span key={idx} className="day-badge">{day}</span>
//             ))}
//           </div>
//         </div>

//         {shop.status === 'rejected' && shop.rejectionReason && (
//           <div className="rejection-box">
//             <strong>Rejection Reason:</strong>
//             <p>{shop.rejectionReason}</p>
//           </div>
//         )}
//       </div>

//       <div className="card-actions">
//         {shop.status === 'pending' && (
//           <>
//             <button className="btn btn-approve" onClick={() => handleApprove(shop.id)}>
//               <CheckCircle2 size={16} />
//               Approve
//             </button>
//             <button className="btn btn-reject" onClick={() => handleReject(shop.id)}>
//               <XCircle size={16} />
//               Reject
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="shops-management">
//       <div className="shops-grid">
//         {filteredShops.map((shop) => (
//           <ShopCard key={shop.id} shop={shop} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Shopsmanagement;


// import React, { useState, useEffect } from "react";
// import {
//   CheckCircle2,
//   XCircle,
//   Clock,
//   MapPin,
//   Mail,
//   Phone
// } from "lucide-react";
// import "./Shopsmanagement.css";

// const API_URL = "http://localhost:5000/api/shops";

// const Shopsmanagement = () => {
//   const [shops, setShops] = useState([]);
//   const [filter, setFilter] = useState("all");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ================= FETCH SHOPS =================
//   const fetchShops = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch(API_URL);

//       if (!response.ok) {
//         throw new Error("Failed to fetch shops");
//       }

//       const data = await response.json();

//       const formattedData = data.map((shop) => ({
//         ...shop,
//         id: shop._id,
//         initials: shop.shopName
//           ? shop.shopName.substring(0, 2).toUpperCase()
//           : "SH",
//       }));

//       setShops(formattedData);
//       setError("");
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load shops");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchShops();
//   }, []);

//   // ================= APPROVE SHOP =================
//   const handleApprove = async (shopId) => {
//     if (!window.confirm("Approve this shop?")) return;

//     try {
//       const res = await fetch(`${API_URL}/approve/${shopId}`, {
//         method: "PUT",
//       });

//       if (!res.ok) throw new Error("Approve failed");

//       alert("Shop Approved ✅");
//       fetchShops();
//     } catch (err) {
//       alert("Failed to approve shop ❌");
//     }
//   };

//   // ================= REJECT SHOP =================
//   const handleReject = async (shopId) => {
//     const reason = prompt("Enter rejection reason:");
//     if (!reason) return;

//     try {
//       const res = await fetch(`${API_URL}/reject/${shopId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reason }),
//       });

//       if (!res.ok) throw new Error("Reject failed");

//       alert("Shop Rejected ❌");
//       fetchShops();
//     } catch (err) {
//       alert("Failed to reject shop");
//     }
//   };

//   // ================= FILTER =================
//   const filteredShops =
//     filter === "all"
//       ? shops
//       : shops.filter((shop) => shop.status === filter);

//   // ================= LOADING =================
//   if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

//   if (error)
//     return <h2 style={{ textAlign: "center", color: "red" }}>{error}</h2>;

//   return (
//     <div className="shops-management">
//       <div className="filter-bar">
//         <button onClick={() => setFilter("all")}>All</button>
//         <button onClick={() => setFilter("pending")}>Pending</button>
//         <button onClick={() => setFilter("approved")}>Approved</button>
//         <button onClick={() => setFilter("rejected")}>Rejected</button>
//       </div>

//       <div className="shops-grid">
//         {filteredShops.map((shop) => (
//           <div className="shop-card" key={shop.id}>
//             <div className="card-header">
//               <div className="shop-avatar">
//                 <span>{shop.initials}</span>
//               </div>

//               {shop.status === "approved" && (
//                 <div className="badge verified">
//                   <CheckCircle2 size={14} /> Verified
//                 </div>
//               )}

//               {shop.status === "pending" && (
//                 <div className="badge pending">Pending</div>
//               )}

//               {shop.status === "rejected" && (
//                 <div className="badge rejected">
//                   <XCircle size={14} /> Rejected
//                 </div>
//               )}
//             </div>

//             <div className="card-body">
//               <h3>{shop.shopName}</h3>
//               <p>{shop.ownerName}</p>

//               <div className="info-row">
//                 <Mail size={16} /> {shop.email}
//               </div>

//               <div className="info-row">
//                 <Phone size={16} /> {shop.phone}
//               </div>

//               <div className="info-row">
//                 <MapPin size={16} /> {shop.address}
//               </div>

//               <div className="working-hours">
//                 <Clock size={16} />
//                 {shop.openingTime} - {shop.closingTime}
//               </div>

//               {shop.workingDays && (
//                 <div className="working-days">
//                   {shop.workingDays.map((day, index) => (
//                     <span key={index} className="day-badge">
//                       {day}
//                     </span>
//                   ))}
//                 </div>
//               )}

//               {shop.status === "rejected" && shop.rejectionReason && (
//                 <div className="rejection-box">
//                   <strong>Reason:</strong> {shop.rejectionReason}
//                 </div>
//               )}
//             </div>

//             {shop.status === "pending" && (
//               <div className="card-actions">
//                 <button
//                   className="btn btn-approve"
//                   onClick={() => handleApprove(shop.id)}
//                 >
//                   <CheckCircle2 size={16} /> Approve
//                 </button>

//                 <button
//                   className="btn btn-reject"
//                   onClick={() => handleReject(shop.id)}
//                 >
//                   <XCircle size={16} /> Reject
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Shopsmanagement;


// import React, { useState, useEffect } from 'react';
// import { Star, Clock, MapPin, CheckCircle2, XCircle, Trash2, Eye, Mail, Phone } from 'lucide-react';
// import './Shopsmanagement.css';

// const Shopsmanagement = () => {
//   const [shops, setShops] = useState([]);
//   const [filter, setFilter] = useState('all');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchShops();
//   }, []);

//   // ✅ REAL FETCH FROM BACKEND
//   const fetchShops = async () => {
//     try {
//       const response = await fetch("http://localhost:5000/api/shops");
//       const data = await response.json();

//       const formatted = data.map(shop => ({
//         ...shop,
//         id: shop._id,
//         initials: shop.shopName
//           ? shop.shopName.substring(0, 2).toUpperCase()
//           : "SH"
//       }));

//       setShops(formatted);
//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching shops:", error);
//       setLoading(false);
//     }
//   };

//   // ✅ APPROVE
//   const handleApprove = async (shopId) => {
//     const confirm = window.confirm("Approve this shop?");
//     if (!confirm) return;

//     try {
//       await fetch(`http://localhost:5000/api/shops/approve/${shopId}`, {
//         method: "PUT"
//       });

//       fetchShops();
//       alert("Shop approved!");
//     } catch (error) {
//       alert("Failed to approve");
//     }
//   };

//   // ✅ REJECT
//   const handleReject = async (shopId) => {
//     const reason = prompt("Enter rejection reason:");
//     if (!reason) return;

//     try {
//       await fetch(`http://localhost:5000/api/shops/reject/${shopId}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reason })
//       });

//       fetchShops();
//       alert("Shop rejected");
//     } catch (error) {
//       alert("Failed to reject");
//     }
//   };

//   const filteredShops = shops.filter(shop => {
//     if (filter === 'all') return true;
//     return shop.status === filter;
//   });

//   const ShopCard = ({ shop }) => (
//     <div className="shop-card">
//       <div className="card-header">
//         <div className="shop-avatar">
//           <span>{shop.initials}</span>
//         </div>

//         <div className="status-badge-container">
//           {shop.status === 'approved' && (
//             <div className="badge verified">
//               <CheckCircle2 size={14} />
//               Verified
//             </div>
//           )}
//           {shop.status === 'pending' && (
//             <div className="badge pending">
//               Pending
//             </div>
//           )}
//           {shop.status === 'rejected' && (
//             <div className="badge rejected">
//               <XCircle size={14} />
//               Rejected
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="card-body">
//         <h3 className="shop-title">{shop.shopName}</h3>
//         <p className="shop-subtitle">{shop.ownerName}</p>

//         <div className="info-grid">
//           <div className="info-row">
//             <Mail size={16} />
//             <span>{shop.email}</span>
//           </div>
//           <div className="info-row">
//             <Phone size={16} />
//             <span>{shop.phone}</span>
//           </div>
//           <div className="info-row">
//             <MapPin size={16} />
//             <span>{shop.address}</span>
//           </div>
//         </div>

//         <div className="working-info">
//           <div className="working-label">
//             <Clock size={16} />
//             Working Hours
//           </div>
//           <div className="working-details">
//             <span className="time-badge">
//               {shop.openingTime} - {shop.closingTime}
//             </span>
//           </div>
//         </div>

//         <div className="working-days-display">
//           <div className="days-label">Working Days</div>
//           <div className="days-badges">
//             {shop.workingDays?.map((day, idx) => (
//               <span key={idx} className="day-badge">{day}</span>
//             ))}
//           </div>
//         </div>

//         {shop.status === 'rejected' && shop.rejectionReason && (
//           <div className="rejection-box">
//             <strong>Rejection Reason:</strong>
//             <p>{shop.rejectionReason}</p>
//           </div>
//         )}
//       </div>

//       <div className="card-actions">
//         {shop.status === 'pending' && (
//           <>
//             <button className="btn btn-approve" onClick={() => handleApprove(shop.id)}>
//               <CheckCircle2 size={16} />
//               Approve
//             </button>
//             <button className="btn btn-reject" onClick={() => handleReject(shop.id)}>
//               <XCircle size={16} />
//               Reject
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="shops-management">
//       <div className="shops-grid">
//         {filteredShops.map((shop) => (
//           <ShopCard key={shop.id} shop={shop} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Shopsmanagement;




import React, { useState, useEffect } from "react";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  RefreshCw,
  Eye,
  Trash2
} from "lucide-react";
import "./Shopsmanagement.css";

const API_URL = "http://localhost:5000/api/shops";

const Shopsmanagement = () => {
  const [shops, setShops] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH SHOPS =================
  const fetchShops = async () => {
    try {
      setLoading(true);
      setError("");
      
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(`Failed to fetch shops (Status: ${response.status})`);
      }

      const data = await response.json();
      console.log("✅ Fetched shops:", data); // Debug log

      const formattedData = data.map((shop) => ({
        ...shop,
        id: shop._id,
        initials: shop.shopName
          ? shop.shopName.substring(0, 2).toUpperCase()
          : "SH",
      }));

      setShops(formattedData);
      setError("");
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError("Unable to load shops. Please check if backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  // ================= APPROVE SHOP =================
  const handleApprove = async (shopId) => {
    if (!window.confirm("Approve this shop?")) return;

    try {
      const res = await fetch(`${API_URL}/approve/${shopId}`, {
        method: "PUT",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Approve failed");
      }

      alert("✅ Shop Approved Successfully!");
      fetchShops(); // Refresh list
    } catch (err) {
      console.error("Approve error:", err);
      alert(`❌ Failed to approve: ${err.message}`);
    }
  };

  // ================= REJECT SHOP =================
  const handleReject = async (shopId) => {
    const reason = prompt("Enter rejection reason:");
    
    if (!reason || reason.trim() === "") {
      alert("⚠️ Rejection reason is required!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/reject/${shopId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: reason.trim() }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Reject failed");
      }

      alert("✅ Shop Rejected!");
      fetchShops(); // Refresh list
    } catch (err) {
      console.error("Reject error:", err);
      alert(`❌ Failed to reject: ${err.message}`);
    }
  };

  // ================= DELETE SHOP =================
  const handleDelete = async (shopId) => {
    if (!window.confirm("⚠️ Are you sure you want to DELETE this shop? This cannot be undone!")) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${shopId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      alert("✅ Shop Deleted Successfully!");
      fetchShops(); // Refresh list
    } catch (err) {
      console.error("Delete error:", err);
      alert(`❌ Failed to delete: ${err.message}`);
    }
  };

  // ================= VIEW DETAILS =================
  const handleViewDetails = (shop) => {
    alert(`
📋 Shop Details:
━━━━━━━━━━━━━━━━
🏪 Name: ${shop.shopName}
👤 Owner: ${shop.ownerName}
📧 Email: ${shop.email}
📱 Phone: ${shop.phone}
📍 Address: ${shop.address}
⏰ Hours: ${shop.openingTime} - ${shop.closingTime}
📅 Days: ${shop.workingDays?.join(", ") || "N/A"}
✅ Status: ${shop.status}
    `);
  };

  // ================= FILTER =================
  const filteredShops =
    filter === "all"
      ? shops
      : shops.filter((shop) => shop.status === filter);

  // ================= COUNT SHOPS =================
  const counts = {
    all: shops.length,
    pending: shops.filter(s => s.status === "pending").length,
    approved: shops.filter(s => s.status === "approved").length,
    rejected: shops.filter(s => s.status === "rejected").length,
  };

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading shops...</p>
      </div>
    );
  }

  // ================= ERROR STATE =================
  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button className="retry-btn" onClick={fetchShops}>
          <RefreshCw size={18} /> Retry
        </button>
      </div>
    );
  }

  return (
    <div className="shops-management">
      {/* ========== PAGE HEADER ========== */}
      <div className="page-header">
        <div>
          <h1>Shop Management</h1>
          <p>Manage shop approvals and listings ({shops.length} total shops)</p>
        </div>
        <button className="refresh-btn" onClick={fetchShops}>
          <RefreshCw size={18} /> Refresh
        </button>
      </div>

      {/* ========== FILTER BAR WITH COUNTS ========== */}
      <div className="filter-bar">
        <button 
          className={filter === "all" ? "active" : ""} 
          onClick={() => setFilter("all")}
        >
          All <span className="count-badge">{counts.all}</span>
        </button>
        <button 
          className={filter === "pending" ? "active pending-tab" : ""} 
          onClick={() => setFilter("pending")}
        >
          Pending <span className="count-badge">{counts.pending}</span>
        </button>
        <button 
          className={filter === "approved" ? "active approved-tab" : ""} 
          onClick={() => setFilter("approved")}
        >
          Approved <span className="count-badge">{counts.approved}</span>
        </button>
        <button 
          className={filter === "rejected" ? "active rejected-tab" : ""} 
          onClick={() => setFilter("rejected")}
        >
          Rejected <span className="count-badge">{counts.rejected}</span>
        </button>
      </div>

      {/* ========== NO SHOPS MESSAGE ========== */}
      {filteredShops.length === 0 && (
        <div className="no-shops-message">
          <p>📭 No {filter === "all" ? "" : filter} shops found.</p>
        </div>
      )}

      {/* ========== SHOPS GRID ========== */}
      <div className="shops-grid">
        {filteredShops.map((shop) => (
          <div className="shop-card" key={shop.id}>
            
            {/* Card Header */}
            <div className="card-header">
              {/* Shop Avatar/Image */}
              <div className="shop-avatar">
                {shop.profileImage ? (
                  <img 
                    src={`http://localhost:5000/${shop.profileImage}`} 
                    alt={shop.shopName}
                    onError={(e) => {
                      // Fallback to initials if image fails
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <span style={{ display: shop.profileImage ? 'none' : 'flex' }}>
                  {shop.initials}
                </span>
              </div>

              {/* Status Badge */}
              {shop.status === "approved" && (
                <div className="badge verified">
                  <CheckCircle2 size={14} /> Verified
                </div>
              )}

              {shop.status === "pending" && (
                <div className="badge pending">
                  <Clock size={14} /> Pending
                </div>
              )}

              {shop.status === "rejected" && (
                <div className="badge rejected">
                  <XCircle size={14} /> Rejected
                </div>
              )}
            </div>

            {/* Card Body */}
            <div className="card-body">
              <h3>{shop.shopName}</h3>
              <p className="owner-name">{shop.ownerName}</p>

              <div className="info-row">
                <Mail size={16} />
                <span>{shop.email}</span>
              </div>

              <div className="info-row">
                <Phone size={16} />
                <span>{shop.phone}</span>
              </div>

              <div className="info-row">
                <MapPin size={16} />
                <span>{shop.address}</span>
              </div>

              <div className="working-hours">
                <Clock size={16} />
                <span>{shop.openingTime} - {shop.closingTime}</span>
              </div>

              {/* Working Days */}
              {shop.workingDays && shop.workingDays.length > 0 && (
                <div className="working-days">
                  {shop.workingDays.map((day, index) => (
                    <span key={index} className="day-badge">
                      {day}
                    </span>
                  ))}
                </div>
              )}

              {/* Rejection Reason */}
              {shop.status === "rejected" && shop.rejectionReason && (
                <div className="rejection-box">
                  <strong>❌ Rejection Reason:</strong>
                  <p>{shop.rejectionReason}</p>
                </div>
              )}
            </div>

            {/* Card Actions */}
            <div className="card-actions">
              {/* PENDING SHOP ACTIONS */}
              {shop.status === "pending" && (
                <>
                  <button
                    className="btn btn-approve"
                    onClick={() => handleApprove(shop.id)}
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>

                  <button
                    className="btn btn-reject"
                    onClick={() => handleReject(shop.id)}
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </>
              )}

              {/* APPROVED SHOP ACTIONS */}
              {shop.status === "approved" && (
                <button
                  className="btn btn-view"
                  onClick={() => handleViewDetails(shop)}
                >
                  <Eye size={16} /> View Details
                </button>
              )}

              {/* DELETE BUTTON (for all statuses) */}
              <button
                className="btn btn-delete"
                onClick={() => handleDelete(shop.id)}
              >
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shopsmanagement;
