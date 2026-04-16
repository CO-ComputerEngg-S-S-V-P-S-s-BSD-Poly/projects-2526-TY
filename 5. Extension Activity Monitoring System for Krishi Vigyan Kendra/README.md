# Extension Activity Monitoring System for Krishi Vigyan Kendra, Dhule

## Project Description
The Extension Activity Monitoring System for Krishi Vigyan Kendra, Dhule, is a comprehensive web-based platform designed to streamline and manage extension activities, training programs, and data collection. It provides administrative tools for monitoring progress, generating analytical reports, and ensuring efficient data management for agricultural extension services.

## Group Information
- **Group No:** 5
- **Team Members:**
  1. Hemant Girish Mali
  2. Om Anil Hire
  3. Eshwari Rohit Kadu
  4. Smita Dinesh Desale

## Tech Stack
### Frontend
- **React**: Modern UI library for building responsive interfaces.
- **React-Bootstrap**: Pre-styled UI components for faster development.
- **Axios**: For handling API requests and data fetching.
- **Recharts**: For creating interactive analytical charts and reports.
- **React Router Dom**: For seamless navigation between pages.
- **Lucide-React**: For a modern and consistent icon set.
- **XLSX**: For importing and exporting data in Excel format.

### Backend
- **Node.js & Express**: Scalable and fast server-side runtime and framework.
- **MongoDB & Mongoose**: Flexible NoSQL database with powerful modeling tools.
- **JSON Web Tokens (JWT)**: For secure user authentication and session management.
- **Bcrypt.js**: For hashing and securing user passwords.
- **Node-Cron**: For scheduling automated tasks and backups.

## Project Structure
```text
5. Extension Activity Monitoring System for Krishi Vigyan Kendra/ # Main Folder
├── backend/                # Backend API logic and database management
│   ├── config/             # Database connection configuration
│   ├── controllers/        # Business logic for handling requests
│   ├── middleware/         # Authentication and authorization filters
│   ├── models/             # Mongoose schemas and data models
│   ├── routes/             # API endpoint definitions
│   ├── scripts/            # Utility scripts (e.g., seeding data)
│   ├── .env.example        # Environment variables template
│   ├── package.json        # Backend dependencies and scripts
│   └── server.js           # Main entry point for the backend server
│
├── frontend/               # Frontend React application source code
│   ├── public/             # Static assets (HTML, favicon, etc.)
│   ├── src/                # All React application source code
│   │   ├── Assets/         # Project images and logos
│   │   ├── components/     # Reusable UI building blocks
│   │   ├── context/        # Auth state management
│   │   ├── pages/          # Individual page components (Dashboard, Login, etc.)
│   │   ├── services/       # API integration logic
│   │   ├── styles/         # CSS files for custom styling
│   │   ├── App.js          # Core application component and routing
│   │   └── index.js        # Entry point for the React application
│   ├── package.json        # Frontend dependencies and scripts
│   └── .env.example        # Environment variables template
│
├── project_report/         # Project documentation and presentation files
│   ├── CPE PPT.pdf         # Project presentation (PPT format)
│   └── CPE Report.pdf      # Complete project report document
│
└── README.md               # Project overview and setup instructions
```

## Prerequisites and Installation Steps
### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (Local or Atlas)
- **Git** (Optional for cloning)

### Installation Steps
1. **Clone the Repository** (If applicable):
   ```bash
   git clone <repository_url>
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file from `.env.example` and configure your `MONGODB_URI` and `JWT_SECRET`.
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the React development server:
     ```bash
     npm start
     ```

4. **Accessing the Application**:
   - The frontend will be available at `http://localhost:3000`.
   - The backend API will be running on `http://localhost:5000` (by default).
