const express = require('express');
const router = express.Router();
const Freelancer = require('../models/Freelancer');

// डेटा मिळवण्यासाठी (GET)
router.get('/get', async (req, res) => {
    const data = await Freelancer.find();
    res.json(data);
});

// नवीन फ्रीलान्सर रजिस्टर करण्यासाठी (POST)
router.post('/add', async (req, res) => {
    const newFreelancer = new Freelancer(req.body);
    await newFreelancer.save();
    res.json({ message: "Registered Successfully!" });
});

router.delete('/delete/:id', async (req, res) => {
    await Freelancer.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted!" });
});

module.exports = router;
