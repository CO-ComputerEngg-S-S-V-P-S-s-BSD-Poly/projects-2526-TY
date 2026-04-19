const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// 1. Middleware Setup
app.use(cors());
app.use(express.json());

// 2. MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/freelancer_project')
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// 3. Project Data Schema
const hireSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, default: "123456" }, // Initial default password
    serviceType: String,
    projectDetails: String,
    paymentMethod: { type: String, default: "Cash" },
    paymentStatus: { type: String, default: "Unpaid" },
    totalBudget: { type: Number, default: 0 },
    advancePaid: { type: Number, default: 0 },
    revisionsRequested: { type: String, default: "" },
    status: { type: String, default: "Pending" },
    progress: { type: Number, default: 0 },
    date: { type: Date, default: Date.now }
});

const HireRequest = mongoose.model('HireRequest', hireSchema);

// --- 4. Client Login Route (Improved for Case-Insensitive Username) ---
app.post('/api/client-login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find client by fullName (Case-Insensitive) and exact password
        const project = await HireRequest.findOne({ 
            fullName: { $regex: new RegExp(`^${username}$`, 'i') }, 
            password: password 
        });
        
        if (project) {
            res.status(200).json(project);
        } else {
            res.status(401).send({ message: "Invalid Username or Password" });
        }
    } catch (error) {
        res.status(500).send({ message: "Server Error during login", error });
    }
});

// 5. API Route: Save New Hire Request
app.post('/api/hire', async (req, res) => {
    try {
        const newRequest = new HireRequest(req.body);
        await newRequest.save();
        res.status(201).send({ message: "Request Saved Successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Error saving project", error });
    }
});

// 6. API Route: Get All Requests (Admin Dashboard)
app.get('/api/requests', async (req, res) => {
    try {
        const requests = await HireRequest.find().sort({ date: -1 });
        res.status(200).json(requests);
    } catch (error) {
        res.status(500).send({ message: "Error fetching projects", error });
    }
});

// 7. API Route: Update Project (Status, Progress, Budget, Password, etc.)
app.put('/api/update-status/:id', async (req, res) => {
    try {
        const updatedData = await HireRequest.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        res.status(200).send({ message: "Updated Successfully!", data: updatedData });
    } catch (error) {
        res.status(500).send({ message: "Error updating record", error });
    }
});

// 8. API Route: Delete Request
app.delete('/api/delete-request/:id', async (req, res) => {
    try {
        await HireRequest.findByIdAndDelete(req.params.id);
        res.status(200).send({ message: "Record Deleted Successfully!" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting record", error });
    }
});

// Server Configuration
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend Server live on http://localhost:${PORT}`);
});
