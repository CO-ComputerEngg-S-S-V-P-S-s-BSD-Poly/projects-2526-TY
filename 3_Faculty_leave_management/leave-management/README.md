# 🎓 LeaveSync - College Faculty Leave Management System

## Folder Structure

```
leave-management/
├── public/
│   └── index.html
├── src/
│   ├── context/
│   │   └── AppContext.js       # Global state (staff, timetable, leaves, notifications)
│   ├── data/
│   │   └── initialData.js      # Sample staff, timetable, periods
│   ├── components/
│   │   └── Navbar.js           # Top navigation + notifications bell + user switcher
│   ├── pages/
│   │   ├── Dashboard.js        # Stats + quick actions
│   │   ├── ApplyLeave.js       # Teacher leave application + auto substitute preview
│   │   ├── LeaveRequests.js    # Admin: approve/reject + assign substitutes
│   │   ├── MyLeaves.js         # Teacher: personal leave history
│   │   ├── TimetablePage.js    # Grid timetable view + add/remove periods
│   │   └── StaffPage.js        # Staff directory + add new staff
│   ├── App.js                  # Root with routing
│   └── index.js
├── package.json
└── README.md
```

## Features

### 👑 Admin Features
- Dashboard with system-wide stats
- View & manage all leave requests (Pending / Approved / Rejected)
- **Approve / Reject** leave requests with one click
- **Auto substitute assignment** - system finds free teachers per period
- Manually reassign substitutes from dropdown
- Add/remove timetable entries for any staff
- Add new staff members

### 👤 Teacher Features
- Apply for leave (single or multi-day)
- **Preview affected classes** before submitting
- See automatically suggested substitute teachers (free during that period)
- View personal leave history with status
- View own timetable
- Receive notifications for leave approval/rejection
- Receive substitute duty requests

## How Auto-Substitute Works

1. Teacher applies leave for dates (e.g. Monday-Wednesday)
2. System checks teacher's timetable for those days
3. For each affected period, system finds teachers who are **NOT** teaching during that period
4. System sends automatic notification to the first free teacher
5. Admin can manually reassign if needed

## Run Instructions

```bash
cd leave-management
npm install
npm start
```

## User Roles

Switch between users using the top-right user menu:
- **Admin** - Full access: approve/reject leaves, manage timetable & staff
- **Any Teacher** - Apply leave, view own schedule, receive notifications

## Tech Stack
- React 18 (all .js files, no TypeScript)
- React Context API for state management
- No external UI library (pure inline styles)
- No backend needed (all in-memory state)
