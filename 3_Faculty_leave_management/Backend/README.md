# Backend Setup - SSVPSS Leave Management System

## Folder Structure
```
backend/
  ├── models/
  │   ├── User.js
  │   ├── LeaveRequest.js
  │   └── Notification.js
  ├── routes/
  │   ├── auth.js
  │   ├── staff.js
  │   ├── leaves.js
  │   └── notifications.js
  ├── middleware/
  │   └── auth.js
  ├── .env
  ├── package.json
  ├── seed.js
  └── server.js
```

## Setup Steps

### Step 1: MongoDB Install karo
- MongoDB Community Server download karo: https://www.mongodb.com/try/download/community
- Install karo aur start karo

### Step 2: Backend folder mein jao
```bash
cd backend
npm install
```

### Step 3: Seed data add karo (pehli baar)
```bash
node seed.js
```

### Step 4: Server start karo
```bash
npm run dev
```

Server `http://localhost:5000` pe chalega

---

## API Endpoints

### Auth
| Method | URL | Description |
|--------|-----|-------------|
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| POST | /api/auth/register | Register new user |

### Staff
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/staff | Get all staff |
| POST | /api/staff | Add staff (admin) |
| PUT | /api/staff/:id | Update staff (admin) |
| DELETE | /api/staff/:id | Delete staff (admin) |

### Leaves
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/leaves | Get leave requests |
| POST | /api/leaves | Apply for leave |
| PUT | /api/leaves/:id/status | Approve/Reject (admin) |
| PUT | /api/leaves/:id/accept/:idx | Accept substitute |

### Notifications
| Method | URL | Description |
|--------|-----|-------------|
| GET | /api/notifications | Get my notifications |
| PUT | /api/notifications/:id/read | Mark as read |
| PUT | /api/notifications/read-all | Mark all as read |

---

## Login Credentials (after seed)

**Admin:**
- Email: admin@ssvpss.edu
- Password: admin123

**Staff (any teacher):**
- Email: npatel@ssvpss.edu
- Password: staff123
