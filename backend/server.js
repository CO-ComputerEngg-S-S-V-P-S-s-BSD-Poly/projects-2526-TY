const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors());

const DB_PATH = path.join(__dirname, 'data', 'database.json');

// --- DATABASE CHECK ---
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify({
        users: [],
        events: [],
        attendance: [],
        violation_logs: [],
        feedback: []
    }, null, 2));
}

const getData = () => JSON.parse(fs.readFileSync(DB_PATH));
const saveData = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// --- GEOLOCATION LOGIC ---
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
}

// --- AUTH APIs ---
app.post('/api/signup', (req, res) => {
    const { name, email, password, role, collegeId, department } = req.body;
    const db = getData();
    if (db.users.find(u => u.email === email)) return res.status(400).json({ message: "Email already registered!" });
    const newUser = { id: Date.now(), name, email, password, role, collegeId, department, status: 'active', createdAt: new Date() };
    db.users.push(newUser);
    saveData(db);
    res.json({ message: "Registration Successful!" });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const db = getData();
    const user = db.users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ message: "Invalid credentials!" });
    res.json({ message: "Login Successful", user });
});

// --- EVENT APIs ---
app.post('/api/create-event', (req, res) => {
    const db = getData();
    const newEvent = { 
        ...req.body, 
        id: Date.now(), 
        lat: parseFloat(req.body.lat), 
        lng: parseFloat(req.body.lng),
        radius: parseFloat(req.body.radius),
        status: 'active', 
        createdAt: new Date() 
    };
    db.events.push(newEvent);
    saveData(db);
    res.json({ message: "Event Created Successfully!", event: newEvent });
});

app.get('/api/events', (req, res) => {
    res.json(getData().events || []);
});

app.post('/api/update-event-status', (req, res) => {
    const { eventId, status } = req.body;
    const db = getData();
    const index = db.events.findIndex(e => Number(e.id) === Number(eventId));
    if (index !== -1) {
        db.events[index].status = status;
        saveData(db);
        res.json({ message: "Status updated!" });
    } else {
        res.status(404).json({ message: "Event not found" });
    }
});

// --- STUDENT MANAGEMENT ---
app.get('/api/students', (req, res) => {
    const db = getData();
    res.json(db.users.filter(u => u.role === 'student'));
});

app.post('/api/update-user-status', (req, res) => {
    const { email, status } = req.body;
    const db = getData();
    const userIndex = db.users.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        db.users[userIndex].status = status;
        saveData(db);
        res.json({ message: "Student status updated!" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
});

// --- ATTENDANCE & STATS ---
app.post('/api/mark-attendance', (req, res) => {
    const { studentEmail, eventId, studentLat, studentLng } = req.body;
    const db = getData();
    const event = db.events.find(e => Number(e.id) === Number(eventId));

    if (!event) return res.status(404).json({ message: "Event not found!" });

    // ************* महत्त्वाचा बदल: DUPLICATE CHECK *************
    const alreadyPresent = db.attendance.find(a => 
        a.studentEmail === studentEmail && Number(a.eventId) === Number(eventId)
    );

    if (alreadyPresent) {
        return res.status(400).json({ message: "तुमची हजेरी आधीच लागलेली आहे!" });
    }
    // **********************************************************

    const distance = calculateDistance(event.lat, event.lng, parseFloat(studentLat), parseFloat(studentLng));

    if (distance <= event.radius) {
        const record = { studentEmail, eventId: Number(eventId), eventName: event.name, time: new Date(), status: 'Present', distance: Math.round(distance) };
        db.attendance.push(record);
        saveData(db);
        res.json({ message: `Success! Within ${Math.round(distance)}m.` });
    } else {
        const log = { studentEmail, eventId: Number(eventId), eventName: event.name, time: new Date(), distance: Math.round(distance), status: 'Violation' };
        db.violation_logs.push(log);
        saveData(db);
        res.status(403).json({ message: `Rejected! ${Math.round(distance)}m away.` });
    }
});

app.get('/api/student-stats', (req, res) => {
    const { email } = req.query;
    const db = getData();
    // Unique events count for attendance percent calculation
    const attended = db.attendance.filter(a => a.studentEmail === email).length;
    const total = db.events.length;
    res.json({ attended, totalEvents: total });
});

app.get('/api/attendance-logs', (req, res) => {
    const db = getData();
    res.json({
        present: db.attendance || [],
        violations: db.violation_logs || []
    });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`));