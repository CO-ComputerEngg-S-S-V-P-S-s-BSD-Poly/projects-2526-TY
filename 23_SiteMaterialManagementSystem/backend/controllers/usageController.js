const UsageHistory = require('../models/UsageHistory');

// ─── Get All Usage History (Admin) ────────────────────────────────────────────
// GET /api/usage-history
const getAllUsageHistory = async (req, res) => {
  try {
    const history = await UsageHistory.find()
      .populate('materialId', 'name category unit')
      .populate('supervisorId', 'name email')
      .sort({ issuedDate: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Supervisor's Usage History ──────────────────────────────────────────
// GET /api/my-usage-history
const getMyUsageHistory = async (req, res) => {
  try {
    const history = await UsageHistory.find({ supervisorId: req.user._id })
      .populate('materialId', 'name category unit')
      .sort({ issuedDate: -1 });

    res.status(200).json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Usage Report (daily/monthly) ─────────────────────────────────────────
// GET /api/usage-report?type=daily OR ?type=monthly
const getUsageReport = async (req, res) => {
  try {
    const { type } = req.query;
    const now = new Date();
    let startDate;

    if (type === 'daily') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else {
      // Default: monthly
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const history = await UsageHistory.find({
      issuedDate: { $gte: startDate }
    })
      .populate('materialId', 'name category unit pricePerUnit')
      .populate('supervisorId', 'name')
      .sort({ issuedDate: -1 });

    // Calculate total cost
    let totalCost = 0;
    history.forEach(item => {
      if (item.materialId) {
        totalCost += item.quantityUsed * (item.materialId.pricePerUnit || 0);
      }
    });

    res.status(200).json({ history, totalCost, period: type || 'monthly' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAllUsageHistory, getMyUsageHistory, getUsageReport };
