## Group No: 16 ##
**Group Members:-**
1) Devangi Pravin Bhamare 
2) Manasi Devidas Chavan 
3) Sohelkhan Mushirkhan Pathan
4) Siddharth Prakash Wagh


## Project Topic
Rural E-commerce and Logistics Management System - A full-stack web application designed for rural areas to facilitate e-commerce activities including product listing, ordering, payments, artisan/seller dashboards, and admin management with logistics tracking support.

## Group Members
*(Please update with actual names and roles)*
- Member 1: Lead Developer
- Member 2: Frontend Specialist
- Member 3: Backend Engineer
- Member 4: UI/UX Designer
- Member 5: Tester/Documenter

## 🏗️ Project Structure
```
d:/Rural E-commerce And Logistics/
└── projects-2526-TY/
    └── 16_Rural_ecommerce_and_logistics/
        ├── README.md                 # Project documentation
        ├── Backend/                   # Node.js/Express server
        │   ├── package.json
        │   ├── server.js
        │   ├── controllers/           # API controllers
        │   │   ├── authController.js
        │   │   ├── orderController.js
        │   │   └── productController.js
        │   └── models/                # Mongoose models
        │       ├── Order.js
        │       ├── Product.js
        │       └── User.js
        ├── Frontend/                  # React frontend apps
        │   ├── admin-panel/
        │   │   └── admin-panel/       # Admin dashboard (React)
        │   │       ├── package.json
        │   │       ├── src/
        │   │       │   ├── components/Sidebar.*
        │   │       │   └── pages/      # Admin pages (Dashboard, Orders, Products, Sellers, AdminLogin)
        │   │       └── public/
        │   └── frontend/              # Customer frontend (React)
        │       ├── package.json
        │       ├── src/
        │       │   ├── components/     # Navbar, ProductCard
        │       │   └── pages/          # Home, Cart, ProductDetails, ArtisanDashboard, MyOrders, Payment, etc.
        │       └── public/
        └── Document/                  # Project documents and screenshots
            ├── project images/        # UI screenshots
            └── project report/        # PDF reports and certificates
```

## 🚀 Quick Start

### Backend
```bash
cd projects-2526-TY/16_Rural_ecommerce_and_logistics/Backend
npm install
npm start  # Runs on port from server.js (likely 5000)
```

### Frontend (Customer)
```bash
cd projects-2526-TY/16_Rural_ecommerce_and_logistics/Frontend/frontend
npm install
npm start  # Runs on http://localhost:3000
```

### Admin Panel
```bash
cd projects-2526-TY/16_Rural_ecommerce_and_logistics/Frontend/admin-panel/admin-panel
npm install
npm start  # Runs on http://localhost:3001 (adjust as needed)
```

## Features
- **User Authentication**: Login/Register
- **Product Catalog**: Browse categories, product details
- **Shopping Cart & Orders**: Add to cart, checkout, order tracking
- **Artisan/Seller Dashboard**: Manage products
- **Admin Panel**: Manage users, products, orders, sellers
- **Payments**: Integrated payment page
- **Responsive Design**: Mobile-friendly UI

## Tech Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React.js
- **Other**: CSS Modules, Axios (likely for API calls)

## Screenshots
See `Document/project images/` for UI captures.

## Reports & Certificates
Available in `Document/project report/`.

## Notes
- Database connection details in Backend/server.js (update MONGO_URI).
- API endpoints: `/api/auth`, `/api/products`, `/api/orders`.
- Update group members section with real names.
- For production, set up environment variables and CORS.

**Project submitted for evaluation under Group 16.**

