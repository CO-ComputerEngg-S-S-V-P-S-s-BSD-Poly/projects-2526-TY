// export const statusColors = {
//   pending: 'bg-yellow-100 text-yellow-800',
//   completed: 'bg-green-100 text-green-800',
//   cancelled: 'bg-red-100 text-red-800',
//   shipped: 'bg-blue-100 text-blue-800',
//   delivered: 'bg-green-200 text-green-900',
//   processing: 'bg-purple-100 text-purple-800',
// };

// export const generateMockData = () => ({
//   stats: {
//     totalOrders: 350,
//     pendingQuotes: 12,
//     activeShops: 25,
//     newCustomers: 42,
//     totalShops: 25,
//     totalProducts: 120,
//     totalUsers: 180
//   },

//   customers: [
//     { id: 1, name: 'Rahul', status: 'pending' },
//     { id: 2, name: 'Anita', status: 'completed' }
//   ],
//   orders: [
//     { id: '#1023', customer: 'Ankit Sharma', shop: 'Copper Artifacts', amount: 3200, status: 'Pending', date: '06 Feb 2026' },
//     { id: '#1022', customer: 'Priya Mehta', shop: 'Clay Creations', amount: 2800, status: 'Shipped', date: '06 Feb 2026' },
//     { id: '#1021', customer: 'Rajesh Gupta', shop: 'Brass World', amount: 4100, status: 'Delivered', date: '05 Feb 2026' },
//     { id: '#1020', customer: 'Neha Sharma', shop: 'Mohana Craft', amount: 1800, status: 'Processing', date: '05 Feb 2026' },
//     { id: '#1019', customer: 'Arvind Patel', shop: 'Patel Brassworks', amount: 2500, status: 'Shipped', date: '04 Feb 2026' },
//     { id: '#1018', customer: 'Sneha Reddy', shop: 'Gupta Utensils', amount: 2800, status: 'Delivered', date: '04 Feb 2026' },
//     { id: '#1017', customer: 'Rajesh Gupta', shop: 'Sharma Handicrafts', amount: 1900, status: 'Processing', date: '03 Feb 2026' },
//     { id: '#1016', customer: 'Kavita Shah', shop: 'Copper Artifacts', amount: 1200, status: 'Cancelled', date: '03 Feb 2026' }
//   ],
//   users: [
//     { id: 'USR001', name: 'Ankit Sharma', email: 'ankit.sharma@example.com', joinedDate: '15 Jan 2026', status: 'Active' },
//     { id: 'USR002', name: 'Priya Mehta', email: 'priya.mehta@example.com', joinedDate: '20 Jan 2026', status: 'Active' },
//     { id: 'USR003', name: 'Rajesh Gupta', email: 'rajesh.gupta@example.com', joinedDate: '22 Jan 2026', status: 'Active' },
//     { id: 'USR004', name: 'Neha Sharma', email: 'neha.sharma@example.com', joinedDate: '25 Jan 2026', status: 'Active' },
//     { id: 'USR005', name: 'Arvind Patel', email: 'arvind.patel@example.com', joinedDate: '28 Jan 2026', status: 'Active' },
//     { id: 'USR006', name: 'Sneha Reddy', email: 'sneha.reddy@example.com', joinedDate: '30 Jan 2026', status: 'Inactive' },
//     { id: 'USR007', name: 'Kavita Shah', email: 'kavita.shah@example.com', joinedDate: '01 Feb 2026', status: 'Active' },
//     { id: 'USR008', name: 'Vikram Singh', email: 'vikram.singh@example.com', joinedDate: '03 Feb 2026', status: 'Active' },
//     { id: 'USR009', name: 'Pooja Desai', email: 'pooja.desai@example.com', joinedDate: '05 Feb 2026', status: 'Active' },
//     { id: 'USR010', name: 'Amit Kumar', email: 'amit.kumar@example.com', joinedDate: '06 Feb 2026', status: 'Active' }
//   ],
//   notifications: [
//     {
//       type: 'order',
//       title: 'New Order Received',
//       message: 'Order #1023 from Ankit Sharma',
//       time: '2 minutes ago',
//       read: false
//     },
//     {
//       type: 'product',
//       title: 'Low Stock Alert',
//       message: 'Brass Bowl - Only 5 items left',
//       time: '1 hour ago',
//       read: false
//     },
//     {
//       type: 'review',
//       title: 'New Review',
//       message: '5-star review on Copper Artifacts',
//       time: '3 hours ago',
//       read: true
//     },
//     {
//       type: 'order',
//       title: 'Order Shipped',
//       message: 'Order #1022 has been shipped',
//       time: '5 hours ago',
//       read: true
//     },
//     {
//       type: 'other',
//       title: 'System Update',
//       message: 'New features available in dashboard',
//       time: '1 day ago',
//       read: true
//     }
//   ],
//   shops: [
//     {
//       id: 1,
//       initials: 'RS',
//       name: 'Sharma Brass Works',
//       owner: 'Ramesh Sharma',
//       rating: 4.9,
//       reviews: 234,
//       description: 'Third-generation artisan specializing in intricate brass pooja items and traditional vessels.',
//       years: 35,
//       products: 6,
//       location: 'Songir',
//       verified: true,
//       tags: ['Pooja Items', 'Traditional Vessels']
//     },
//     {
//       id: 2,
//       initials: 'MG',
//       name: 'Gupta Metal Arts',
//       owner: 'Mohan Gupta',
//       rating: 4.9,
//       reviews: 312,
//       description: 'Master craftsman known for decorative pieces and custom metalwork.',
//       years: 40,
//       products: 5,
//       location: 'Songir',
//       verified: true,
//       tags: ['Decorative Items', 'Custom Orders']
//     },
//     {
//       id: 3,
//       initials: 'SP',
//       name: 'Patel Copper Crafts',
//       owner: 'Suresh Patel',
//       rating: 4.8,
//       reviews: 189,
//       description: 'Expert in creating durable copper cookware with traditional techniques.',
//       years: 28,
//       products: 5,
//       location: 'Songir',
//       verified: true,
//       tags: ['Kitchen Utensils', 'Cookware']
//     },
//     {
//       id: 4,
//       initials: 'KC',
//       name: 'Kumar Handicrafts',
//       owner: 'Vijay Kumar',
//       rating: 4.7,
//       reviews: 156,
//       description: 'Specialized in handcrafted brass and copper decorative items.',
//       years: 22,
//       products: 8,
//       location: 'Songir',
//       verified: true,
//       tags: ['Decorative', 'Handicrafts']
//     },
//     {
//       id: 5,
//       initials: 'MA',
//       name: 'Mehta Artisans',
//       owner: 'Rajesh Mehta',
//       rating: 4.8,
//       reviews: 201,
//       description: 'Premium quality brass utensils and religious artifacts.',
//       years: 30,
//       products: 7,
//       location: 'Songir',
//       verified: true,
//       tags: ['Religious Items', 'Brass Utensils']
//     },
//     {
//       id: 6,
//       initials: 'DS',
//       name: 'Desai Metalworks',
//       owner: 'Amit Desai',
//       rating: 4.6,
//       reviews: 145,
//       description: 'Contemporary and traditional metal craft fusion designs.',
//       years: 18,
//       products: 6,
//       location: 'Songir',
//       verified: true,
//       tags: ['Modern Design', 'Traditional Craft']
//     }
//   ],
//   topShopkeepers: [
//     { name: 'Mohana Craft', sales: 85, color: '#C17A3F' },
//     { name: 'Patel Brassworks', sales: 72, color: '#D4A574' },
//     { name: 'Gupta Utensils', sales: 58, color: '#B8956A' },
//     { name: 'Sharma Handicrafts', sales: 45, color: '#C9A876' }
//   ]
// });


export const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-200 text-green-900',
  processing: 'bg-purple-100 text-purple-800',
};

export const generateMockData = () => ({
  stats: {
    totalOrders: 350,
    pendingQuotes: 12,
    activeShops: 25,
    newCustomers: 42,
    totalShops: 25,
    totalProducts: 120,
    totalUsers: 180
  },
  orders: [
    { id: '#1023', customer: 'Ankit Sharma', shop: 'Copper Artifacts', amount: 3200, status: 'Pending', date: '06 Feb 2026' },
    { id: '#1022', customer: 'Priya Mehta', shop: 'Clay Creations', amount: 2800, status: 'Shipped', date: '06 Feb 2026' },
    { id: '#1021', customer: 'Rajesh Gupta', shop: 'Brass World', amount: 4100, status: 'Delivered', date: '05 Feb 2026' },
    { id: '#1020', customer: 'Neha Sharma', shop: 'Mohana Craft', amount: 1800, status: 'Processing', date: '05 Feb 2026' },
    { id: '#1019', customer: 'Arvind Patel', shop: 'Patel Brassworks', amount: 2500, status: 'Shipped', date: '04 Feb 2026' },
    { id: '#1018', customer: 'Sneha Reddy', shop: 'Gupta Utensils', amount: 2800, status: 'Delivered', date: '04 Feb 2026' },
    { id: '#1017', customer: 'Rajesh Gupta', shop: 'Sharma Handicrafts', amount: 1900, status: 'Processing', date: '03 Feb 2026' },
    { id: '#1016', customer: 'Kavita Shah', shop: 'Copper Artifacts', amount: 1200, status: 'Cancelled', date: '03 Feb 2026' }
  ],
  products: [
    { id: 'PRD001', name: 'Traditional Brass Diya', shopkeeper: 'Ramesh Sharma', category: 'Pooja Items', price: 450, stock: 25, addedDate: '01 Feb 2026' },
    { id: 'PRD002', name: 'Copper Water Bottle', shopkeeper: 'Mohan Gupta', category: 'Kitchen Utensils', price: 850, stock: 15, addedDate: '02 Feb 2026' },
    { id: 'PRD003', name: 'Brass Pooja Thali Set', shopkeeper: 'Suresh Patel', category: 'Pooja Items', price: 1200, stock: 8, addedDate: '03 Feb 2026' },
    { id: 'PRD004', name: 'Copper Cooking Pot', shopkeeper: 'Vijay Kumar', category: 'Cookware', price: 2100, stock: 12, addedDate: '04 Feb 2026' },
    { id: 'PRD005', name: 'Brass Wall Hanging', shopkeeper: 'Rajesh Mehta', category: 'Decorative', price: 3500, stock: 5, addedDate: '04 Feb 2026' },
    { id: 'PRD006', name: 'Copper Kalash', shopkeeper: 'Amit Desai', category: 'Religious Items', price: 1800, stock: 10, addedDate: '05 Feb 2026' },
    { id: 'PRD007', name: 'Brass Temple Bell', shopkeeper: 'Ramesh Sharma', category: 'Pooja Items', price: 650, stock: 20, addedDate: '05 Feb 2026' },
    { id: 'PRD008', name: 'Copper Serving Bowl', shopkeeper: 'Mohan Gupta', category: 'Kitchen Utensils', price: 950, stock: 18, addedDate: '06 Feb 2026' },
    { id: 'PRD009', name: 'Brass Arti Plate', shopkeeper: 'Suresh Patel', category: 'Pooja Items', price: 750, stock: 22, addedDate: '06 Feb 2026' },
    { id: 'PRD010', name: 'Copper Dinner Set', shopkeeper: 'Vijay Kumar', category: 'Cookware', price: 4500, stock: 6, addedDate: '07 Feb 2026' },
    { id: 'PRD011', name: 'Brass Statue Ganesha', shopkeeper: 'Rajesh Mehta', category: 'Religious Items', price: 5200, stock: 3, addedDate: '07 Feb 2026' },
    { id: 'PRD012', name: 'Copper Glass Set', shopkeeper: 'Amit Desai', category: 'Kitchen Utensils', price: 1600, stock: 14, addedDate: '08 Feb 2026' }
  ],
  users: [
    { id: 'USR001', name: 'Ankit Sharma', email: 'ankit.sharma@example.com', joinedDate: '15 Jan 2026', status: 'Active' },
    { id: 'USR002', name: 'Priya Mehta', email: 'priya.mehta@example.com', joinedDate: '20 Jan 2026', status: 'Active' },
    { id: 'USR003', name: 'Rajesh Gupta', email: 'rajesh.gupta@example.com', joinedDate: '22 Jan 2026', status: 'Active' },
    { id: 'USR004', name: 'Neha Sharma', email: 'neha.sharma@example.com', joinedDate: '25 Jan 2026', status: 'Active' },
    { id: 'USR005', name: 'Arvind Patel', email: 'arvind.patel@example.com', joinedDate: '28 Jan 2026', status: 'Active' },
    { id: 'USR006', name: 'Sneha Reddy', email: 'sneha.reddy@example.com', joinedDate: '30 Jan 2026', status: 'Inactive' },
    { id: 'USR007', name: 'Kavita Shah', email: 'kavita.shah@example.com', joinedDate: '01 Feb 2026', status: 'Active' },
    { id: 'USR008', name: 'Vikram Singh', email: 'vikram.singh@example.com', joinedDate: '03 Feb 2026', status: 'Active' },
    { id: 'USR009', name: 'Pooja Desai', email: 'pooja.desai@example.com', joinedDate: '05 Feb 2026', status: 'Active' },
    { id: 'USR010', name: 'Amit Kumar', email: 'amit.kumar@example.com', joinedDate: '06 Feb 2026', status: 'Active' }
  ],
  notifications: [
    {
      id: 'NOT001',
      type: 'order',
      title: 'New Order Received',
      message: 'Order #1023 from Ankit Sharma',
      time: '2 minutes ago',
      read: false
    },
    {
      id: 'NOT002',
      type: 'product',
      title: 'New Product Added',
      message: 'Copper Glass Set added by Amit Desai',
      time: '1 hour ago',
      read: false
    },
    {
      id: 'NOT003',
      type: 'review',
      title: 'New Review',
      message: '5-star review on Copper Artifacts',
      time: '3 hours ago',
      read: true
    },
    {
      id: 'NOT004',
      type: 'order',
      title: 'Order Shipped',
      message: 'Order #1022 has been shipped',
      time: '5 hours ago',
      read: true
    },
    {
      id: 'NOT005',
      type: 'other',
      title: 'System Update',
      message: 'New features available in dashboard',
      time: '1 day ago',
      read: true
    }
  ],
  contacts: [
    { id: 'CNT001', name: 'Ankit Sharma', email: 'ankit@example.com', phone: '+91 98765 43210', subject: 'Product Inquiry', date: '06 Feb 2026', status: 'Pending' },
    { id: 'CNT002', name: 'Priya Mehta', email: 'priya@example.com', phone: '+91 98765 43211', subject: 'Order Status', date: '06 Feb 2026', status: 'Replied' },
    { id: 'CNT003', name: 'Rajesh Gupta', email: 'rajesh@example.com', phone: '+91 98765 43212', subject: 'Bulk Order Request', date: '05 Feb 2026', status: 'In Progress' },
    { id: 'CNT004', name: 'Neha Sharma', email: 'neha@example.com', phone: '+91 98765 43213', subject: 'Custom Design Query', date: '05 Feb 2026', status: 'Pending' },
    { id: 'CNT005', name: 'Arvind Patel', email: 'arvind@example.com', phone: '+91 98765 43214', subject: 'Shipping Information', date: '04 Feb 2026', status: 'Replied' },
    { id: 'CNT006', name: 'Sneha Reddy', email: 'sneha@example.com', phone: '+91 98765 43215', subject: 'Partnership Inquiry', date: '04 Feb 2026', status: 'In Progress' },
    { id: 'CNT007', name: 'Kavita Shah', email: 'kavita@example.com', phone: '+91 98765 43216', subject: 'Product Complaint', date: '03 Feb 2026', status: 'Replied' },
    { id: 'CNT008', name: 'Vikram Singh', email: 'vikram@example.com', phone: '+91 98765 43217', subject: 'General Inquiry', date: '03 Feb 2026', status: 'Pending' }
  ],
  reviews: [
    { id: 'REV001', userName: 'Ankit Sharma', productName: 'Traditional Brass Diya', shopName: 'Sharma Brass Works', rating: 5, comment: 'Excellent quality and beautiful craftsmanship!', date: '06 Feb 2026', status: 'Approved' },
    { id: 'REV002', userName: 'Priya Mehta', productName: 'Copper Water Bottle', shopName: 'Gupta Metal Arts', rating: 4, comment: 'Good product, delivery was a bit slow.', date: '06 Feb 2026', status: 'Approved' },
    { id: 'REV003', userName: 'Rajesh Gupta', productName: 'Brass Pooja Thali Set', shopName: 'Patel Copper Crafts', rating: 5, comment: 'Perfect for daily pooja. Highly recommended!', date: '05 Feb 2026', status: 'Approved' },
    { id: 'REV004', userName: 'Neha Sharma', productName: 'Copper Cooking Pot', shopName: 'Kumar Handicrafts', rating: 3, comment: 'Average quality, expected better for the price.', date: '05 Feb 2026', status: 'Pending' },
    { id: 'REV005', userName: 'Arvind Patel', productName: 'Brass Wall Hanging', shopName: 'Mehta Artisans', rating: 5, comment: 'Stunning piece! Adds elegance to my living room.', date: '04 Feb 2026', status: 'Approved' },
    { id: 'REV006', userName: 'Sneha Reddy', productName: 'Copper Kalash', shopName: 'Desai Metalworks', rating: 4, comment: 'Nice traditional design, good value for money.', date: '04 Feb 2026', status: 'Approved' },
    { id: 'REV007', userName: 'Kavita Shah', productName: 'Brass Temple Bell', shopName: 'Sharma Brass Works', rating: 5, comment: 'Beautiful sound quality, authentic craftsmanship.', date: '03 Feb 2026', status: 'Approved' },
    { id: 'REV008', userName: 'Vikram Singh', productName: 'Copper Serving Bowl', shopName: 'Gupta Metal Arts', rating: 2, comment: 'Product arrived damaged, waiting for replacement.', date: '03 Feb 2026', status: 'Rejected' },
    { id: 'REV009', userName: 'Pooja Desai', productName: 'Brass Arti Plate', shopName: 'Patel Copper Crafts', rating: 5, comment: 'Exceeded expectations! Will order again.', date: '02 Feb 2026', status: 'Approved' },
    { id: 'REV010', userName: 'Amit Kumar', productName: 'Copper Dinner Set', shopName: 'Kumar Handicrafts', rating: 4, comment: 'Good quality set, packaging could be better.', date: '02 Feb 2026', status: 'Pending' }
  ],
  shops: [
    {
      id: 1,
      initials: 'RS',
      name: 'Sharma Brass Works',
      owner: 'Ramesh Sharma',
      rating: 4.9,
      reviews: 234,
      description: 'Third-generation artisan specializing in intricate brass pooja items and traditional vessels.',
      years: 35,
      products: 6,
      location: 'Songir',
      verified: true,
      tags: ['Pooja Items', 'Traditional Vessels']
    },
    {
      id: 2,
      initials: 'MG',
      name: 'Gupta Metal Arts',
      owner: 'Mohan Gupta',
      rating: 4.9,
      reviews: 312,
      description: 'Master craftsman known for decorative pieces and custom metalwork.',
      years: 40,
      products: 5,
      location: 'Songir',
      verified: true,
      tags: ['Decorative Items', 'Custom Orders']
    },
    {
      id: 3,
      initials: 'SP',
      name: 'Patel Copper Crafts',
      owner: 'Suresh Patel',
      rating: 4.8,
      reviews: 189,
      description: 'Expert in creating durable copper cookware with traditional techniques.',
      years: 28,
      products: 5,
      location: 'Songir',
      verified: true,
      tags: ['Kitchen Utensils', 'Cookware']
    },
    {
      id: 4,
      initials: 'KC',
      name: 'Kumar Handicrafts',
      owner: 'Vijay Kumar',
      rating: 4.7,
      reviews: 156,
      description: 'Specialized in handcrafted brass and copper decorative items.',
      years: 22,
      products: 8,
      location: 'Songir',
      verified: true,
      tags: ['Decorative', 'Handicrafts']
    },
    {
      id: 5,
      initials: 'MA',
      name: 'Mehta Artisans',
      owner: 'Rajesh Mehta',
      rating: 4.8,
      reviews: 201,
      description: 'Premium quality brass utensils and religious artifacts.',
      years: 30,
      products: 7,
      location: 'Songir',
      verified: true,
      tags: ['Religious Items', 'Brass Utensils']
    },
    {
      id: 6,
      initials: 'DS',
      name: 'Desai Metalworks',
      owner: 'Amit Desai',
      rating: 4.6,
      reviews: 145,
      description: 'Contemporary and traditional metal craft fusion designs.',
      years: 18,
      products: 6,
      location: 'Songir',
      verified: true,
      tags: ['Modern Design', 'Traditional Craft']
    }
  ],
  topShopkeepers: [
    { name: 'Mohana Craft', sales: 85, color: '#C17A3F' },
    { name: 'Patel Brassworks', sales: 72, color: '#D4A574' },
    { name: 'Gupta Utensils', sales: 58, color: '#B8956A' },
    { name: 'Sharma Handicrafts', sales: 45, color: '#C9A876' }
  ]
});
