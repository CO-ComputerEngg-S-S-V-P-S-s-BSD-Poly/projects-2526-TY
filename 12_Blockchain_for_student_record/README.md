## Blockchain for Student Record System - Group No 12
Group Members :-
Durgesh Pradip Upasani
Latikesh Subhash Marathe
Om Hiralal Patil
Pushpak Gyanu Patil

![Node.js](https://img.shields.io/badge/Node.js-v14+-green?style=flat-square&logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![Express.js](https://img.shields.io/badge/Express.js-Latest-black?style=flat-square&logo=express)
![JWT Auth](https://img.shields.io/badge/JWT-Authentication-orange?style=flat-square)
![SHA-256 Encryption](https://img.shields.io/badge/AES--256-Encryption-red?style=flat-square)
> **Secure blockchain-based student profile verification system** | MERN Stack | Cryptographic Encryption | Educational Data Management | Student Records Verification
A production-ready blockchain-inspired student data management platform combining MERN stack (MongoDB, Express, React, Node.js) with SHA-256 encryption for immutable student record storage and verification workflows.
🔑 Keywords
`blockchain` `student-verification` `MERN-stack` `React` `Node.js` `MongoDB` `Express` `JWT-authentication` `SHA-256-encryption` `educational-system` `data-integrity` `student-records` `teacher-dashboard` `form-validation` `file-upload` `REST-API` `full-stack` `academic-management`
---
📋 Table of Contents
Problem & Overview
Features
Tech Stack & Architecture
Installation & Usage
API Endpoints
Project Structure
Security & Workflows
Management & Deployment
Contributors & License
---

❓ Problem Statement
Challenge: Educational institutions need secure, tamper-proof student record management with transparent verification workflows.
Solution: This system provides:
✅ Immutable Records: Blockchain-style encrypted storage prevents unauthorized modifications
✅ Dual Verification: Teachers review and approve student profiles with detailed feedback
✅ Change Request System: Students can request modifications before final verification
✅ Real-time Tracking: Both students and teachers get instant verification status updates
✅ Audit Trail: Complete history of all requests, approvals, and rejections
✅ Encrypted Data: SHA-256 encryption ensures sensitive student data remains secure
---
🎯 Overview
This full-stack application implements a blockchain-inspired approach to storing student academic records:
🔐 Encrypted Storage: Student profile data encrypted with SHA-256 before storage
⛓️ Blockchain Blocks: Each record stored as immutable cryptographic blocks
🔒 Profile Lock: Once verified, records become permanent and unmodifiable
👁️ Teacher Review: Comprehensive verification workflow with section-by-section review
📋 Change Requests: Students can request profile updates before initial lock
📊 Real-time Analytics: Dashboard with verification statistics and charts
🔑 JWT Authentication: Secure token-based access control
📱 Responsive UI: Professional, mobile-friendly interface
The system ensures data integrity, prevents unauthorized modifications, and provides a transparent audit trail of all student records.
---
✨ Features & Functionality
👨‍🎓 Student Portal Features
Complete Profile Management
Multi-section form (Basic Info, Contact, Guardian Details, Academic)
Photo upload with validation
Client-side and server-side form validation
Profile lock mechanism after submission
Real-time Verification Status
Check verification approval status instantly
View verification reason and feedback
Track profile submission history
Change Request System
Submit change requests with categories (Basic Info, Contact, Guardian, Academic, Other)
View request history with statuses (Pending, Approved, Rejected)
Optional notes and feedback from administrators
Track all modification attempts
Password Reset
Forgot password functionality
Email-based password reset
Secure token-based verification
Teacher Request System
Request teachers to add/modify information
Track request status
👨‍🏫 Teacher/Admin Dashboard
> **Note:** the front‑end includes a stubbed administrator login (email `admin@gmail.com`/`admin1`).
> It stores a special token (`admin-token`) locally; the backend middleware now treats this
> value as a valid admin credential so the admin panel can load without a real JWT.
Pending Students Management
View all pending verification students
Modal-based information display with all student fields
Section review checkboxes (enforced verification flow)
Dual-confirmation warning before final approval
Request changes with targeted feedback (teacher can pick specific sections; student may edit those fields before final verification)
Student Verification List
Complete list of verified students
Search and filter functionality
Enrollment and status tracking
Change Requests Review
Review student change request submissions
Approve or reject with detailed feedback
Track modification request history
Analytics Dashboard
Real-time statistics cards (Total, Verified, Pending)
Graphical verification overview with stacked bar chart
Student count analytics
Trend monitoring
Password Reset Requests Management
View student password reset requests
Approve or reject password changes
Security feature for account recovery
🛡️ Admin Panel Features
Dashboard
Overview statistics
Quick access to all sections
Student Management
View all students (verified and pending)
View verified students
View pending students
Search and filter functionality
Teacher Management
Add new teachers
Edit teacher information
Delete teachers
View all teachers
Password Reset Requests
View all password reset requests
Approve or reject requests
Track request history
Settings
Admin settings configuration

---
🛠 Technologies & Stack
Backend Technologies
Node.js v14+: JavaScript runtime
Express.js: RESTful API framework
MongoDB: NoSQL database
Mongoose: ODM (Object Data Modeling)
JWT: JSON Web Token authentication
bcryptjs: Password hashing
crypto: Node.js encryption module (SHA-256)
Multer: File upload middleware
dotenv: Environment configuration
cors: Cross-origin resource sharing
Frontend Technologies
React 18: Modern UI library
React Router v6: Client-side routing
React Bootstrap 5: UI component library
Hooks: useState, useEffect, useContext
CSS3: Gradient backgrounds, grid layouts, animations
CSS Variables: Themeable styling
Custom Dialog: Modal/notification component
Development Tools
Git: Version control
npm: Package management
ESLint: Code quality (optional)
Postman: API testing (optional)
---
🏗 Architecture
System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     React Frontend                       │
│         (Students, Teachers, Admin Panels)               │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP/REST API
┌──────────────────▼──────────────────────────────────────┐
│                  Express.js Backend                      │
├──────────────┬──────────────┬──────────────┬────────────┤
│ Auth Routes  │ Student APIs │ Teacher APIs │ Admin APIs │
└──────────────┼──────────────┼──────────────┼────────────┘
               │              │              │
┌──────────────▼──────────┬───▼──────┬──────▼────────────┐
│    MongoDB Database     │ JWT Auth │ Encryption Utils  │
│  (Students, Profiles,   │ Middleware│ (Crypto Module) │
│   Requests, Verification)│          │                  │
└─────────────────────────┴──────────┴───────────────────┘
```
Student Workflow
Login → Navigate to Student Dashboard
Complete Profile → Fill all fields from 4 sections + Upload photo
Submit Profile → Profile saved and locked on blockchain
Teacher Verification → Teacher views and marks record verified
---
📦 Installation
Prerequisites
Node.js v14 or higher
npm v6 or higher
MongoDB running locally or cloud connection
Backend Setup
```bash
cd BackEnd
npm install
node app.js  # http://localhost:8000
```
Frontend Setup
```bash
cd FrontEnd
npm install
npm start  # http://localhost:3000
```
---
🚀 Usage
Student Workflow
Login → Navigate to Student Dashboard
Complete Profile → Fill all fields from 4 sections + Upload photo
Submit Profile → Profile saved and locked on blockchain
Check Status → Student → Verified Status page
Request Changes → Teacher picks one or more form sections (basic, contact, guardian, academic) and optionally adds a note; student can then update their profile before verification
Track History → View all requests with approval/rejection status
Forgot Password → Use forgot password to reset credentials
Teacher Request → Request teachers to add/modify information
Teacher Workflow
Login → Navigate to Teacher Dashboard
View Analytics → See summary cards + verification chart
Review Pending → Go to Pending Students → Click View
Examine Fields → Check each section using review checkboxes
Verify or Request Changes:
Verify: All checkboxes → Dual confirmation → Student verified
Request Changes: Teacher selects the offending sections (basic/contact/guardian/academic) → Add an optional note → Send feedback; rejected students regain edit access
View Verified Students → Complete list of verified records
Manage Requests → Review/approve/reject student change requests
Password Reset Requests → Review and process student password reset requests
Admin Workflow
Login → Navigate to Admin Dashboard (use admin@gmail.com / admin1)
View Dashboard → Overview statistics and quick actions
Manage Students → View all, verified, or pending students
Manage Teachers → Add, edit, or delete teachers
Password Reset Requests → Review and process password reset requests
Settings → Configure admin settings
---
🔌 API Endpoints
Authentication
```
POST   /student/signup              - Student registration
POST   /student/login               - Student login
POST   /teacher/login               - Teacher login
POST   /student/forgot-password     - Request password reset (student)
POST   /student/reset-password      - Reset password with token (student)
POST   /teacher/forgot-password     - Request password reset (teacher)
POST   /teacher/reset-password      - Reset password with token (teacher)
```
Student Profile
```
POST   /student/save                - Create/save profile (encrypted)
GET    /student/me                  - Get own profile with verify status
GET    /student/view/:studentId     - Get student profile by ID (decrypted)
DELETE /student/delete              - Delete profile
POST   /student/form                - Submit student form for review
GET    /student/form                - Get student form data
PUT    /student/form/:id             - Update student form
```
Student Verification
```
GET    /student/pending             - Get pending students (teacher only)
PUT    /student/verify/:id          - Verify student (teacher only)
PUT    /student/unverify/:id        - Unverify student (admin only)
PUT    /student/reject/:id          - Send change request feedback
GET    /student/verified            - Get verified students
GET    /student/verified/count      - Count verified students
GET    /student/pending/count       - Count pending students
```
Change Requests
```
POST   /student/request             - Submit change request
GET    /student/request/me           - Get own requests
GET    /student/request/all          - Get all requests (teacher)
PUT    /student/request/:id          - Approve/reject request (teacher)
```
Teacher Requests (Student requesting teacher info changes)
```
POST   /student/teacher-request     - Submit teacher request
GET    /student/teacher-request/me  - Get own teacher requests
GET    /student/teacher-request/all - Get all teacher requests (admin)
PUT    /student/teacher-request/:id - Approve/reject teacher request (admin)
```
Contact
```
POST   /contact                     - Submit contact form
GET    /contact                     - Get all contacts (admin)
DELETE /contact/:id                 - Delete contact (admin)
```
Admin
```
POST   /teacher/add                 - Add new teacher
GET    /teacher/all                 - Get all teachers
PUT    /teacher/:id                 - Update teacher
DELETE /teacher/:id                 - Delete teacher
GET    /student/password-reset-requests      - Get password reset requests
PUT    /student/password-reset-requests/:id  - Approve/reject password reset
```
---
📁 Project Structure
```
BlockChain_For_Student_Record_System/
├── BackEnd/
│   ├── config/     (db.js)
│   ├── controller/ (auth, profile, requests...)
│   ├── middleware/ (auth, upload)
│   ├── models/     (Student, Teacher, Block...)
│   ├── routes/     (login, profile, verify...)
│   ├── utils/      (encryption)
│   ├── app.js
│   └── package.json
├── FrontEnd/
│   ├── public/
│   ├── src/
│   │   ├── Pages/
│   │   │   ├── Student/   (dashboard, profile...)
│   │   │   ├── Teacher/  (pending, verified...)
│   │   │   └── Admin/    (manage, dashboard...)
│   │   └── components/
│   └── package.json
└── README.md
```
---
🔒 Security Features
Encryption
Algorithm: SHA-256-ECB
When Applied: On profile save, before storing in database
Decryption: Only when viewing (real-time decryption)
Key Storage: Environment variable (should use secure vault in production)
Authentication
Method: JWT Bearer tokens
Expiration: Configurable (default 7 days)
Storage: localStorage (frontend)
Validation: Protected routes via middleware
Profile Lock
Once a student profile is saved to the blockchain block, it becomes immutable
Prevents tampering with verified records
Students must use change requests for modifications
Data Validation
Server-side validation on all inputs
Photo upload restrictions (image type + size)
Form validation (all fields required before submit)
Email and phone format validation
---
📊 Key Workflows
Verification Flow
```
Student Submits Profile
         ↓
Profile Encrypted & Locked
         ↓
Teacher Views → Reviews All Sections
         ↓
   ┌─────┴─────┐
   ↓           ↓
VERIFY    REQUEST CHANGES
   ↓           ↓
VERIFIED  Student Revises
         (if not locked)
```
Change Request Flow
```
Student Submits Request
    (before lock)
         ↓
Teacher Reviews & Selects
 areas needing change
         ↓
   ┌─────┴─────┐
   ↓           ↓
APPROVE    REJECT
   ↓           ↓
Student  History
Updates  Tracking
```
---
