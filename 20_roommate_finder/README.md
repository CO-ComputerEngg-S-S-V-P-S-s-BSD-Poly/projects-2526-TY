# Roommate Finder - Group No: 20

## Project Information
**Project Name:** Roommate Finder  
**Group No:** 20  
**Group Members:**
1) Patil Pranav Manoj
2) Shinde Keyur LAxmikant
3) Wagh Dhiraj Pravin
4) Padmar Pramod Dnyaneshwar

**Description:** A full-stack web application designed to help students and professionals in Maharashtra (e.g., Pune, Mumbai, Nashik, Dhule, Aurangabad, Nagpur) find compatible roommates or rooms based on preferences like lifestyle, budget, location, and more. Features user authentication, posting needs for flatmates/rooms, preference matching, admin dashboard, and an AI chatbot for assistance.

## Features
- User registration/login with OTP verification
- Post needs for flatmates or rooms with images and details
- Set and match preferences (e.g., early bird/night owl, veg/non-veg, pets, gym, music, etc.)
- Search and list postings with filters
- User dashboard and admin panel
- Image uploads for profile pics and room photos
- Chatbot for quick queries using predefined Q&A
- Responsive React frontend

## Folder Structure
```
20_roommate_finder/
├── README.md                 # This file
├── backend/                  # Node.js/Express API server
│   ├── server.js             # Main server entry
│   ├── config/db.js          # Database config (MongoDB)
│   ├── controllers/          # Business logic
│   │   ├── authController.js
│   │   ├── needFlatmateController.js
│   │   ├── needRoomController.js
│   │   └── preferencesController.js
│   ├── middleware/           # Auth, upload middleware
│   ├── models/               # Mongoose schemas (User, NeedFlatmate, NeedRoom, Preference)
│   ├── routes/               # API routes
│   ├── uploads/              # Uploaded images/profile pics
│   └── package.json
├── frontend/                 # React + Vite client
│   ├── src/
│   │   ├── components/       # Reusable UI (Header, Footer, ChatbotButton)
│   │   ├── pages/            # Views (Home, Login, Dashboard, PostFlatmate, etc.)
│   │   └── assets/           # Images (locations, icons, rooms)
│   ├── index.html
│   └── package.json
├── chatbot/                  # Python Flask chatbot
│   ├── app.py
│   ├── questions_answers.csv # Q&A data
│   └── templates/index.html
└── Document/                 # Project reports
    ├── group 20 ppt.pdf
    └── MAIN CPE REPORT.pdf
```

## Technologies Used
- **Backend:** Node.js, Express, Mongoose (MongoDB), Multer (uploads), JWT (auth)
- **Frontend:** React, Vite, Tailwind CSS/Axios (inferred from structure)
- **Chatbot:** Python, Flask
- **Database:** MongoDB
- **Other:** OTP verification, Image uploads

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python 3.8+
- MongoDB (local or Atlas)
- Git (optional)

### 1. Backend Setup
```bash
cd 20_roommate_finder/backend
npm install
# Set environment variables (e.g., MONGO_URI, JWT_SECRET, OTP service) in .env
npm start  # or nodemon server.js
```
Server runs on http://localhost:5000 (default).

### 2. Frontend Setup
```bash
cd 20_roommate_finder/frontend
npm install
npm run dev
```
App runs on http://localhost:5173 (Vite default). Update API base URL in frontend to point to backend.

### 3. Chatbot Setup
```bash
cd 20_roommate_finder/chatbot
python -m venv venv
# Windows:
venv\\Scripts\\activate
# pip install flask pandas scikit-learn (inferred deps)
python app.py
```
Chatbot runs on http://localhost:5001 (default).

### 4. Full Run
- Start MongoDB.
- Run backend, frontend, and chatbot in separate terminals.
- Access app at frontend URL.
- Check Documents for full reports.

## Group Members
Group No: 20 (Details in PDF reports).

---

*Project for CPE course, TY 2526.*

