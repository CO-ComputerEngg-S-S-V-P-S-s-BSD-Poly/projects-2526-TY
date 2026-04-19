const Request = require('../models/Request');
const Material = require('../models/Material');
const UsageHistory = require('../models/UsageHistory');

// ─── Create Request (Supervisor) ──────────────────────────────────────────────
// POST /api/request
const createRequest = async (req, res) => {
  try {
    const { materialId, quantityRequested, reason } = req.body;

    if (!materialId || !quantityRequested) {
      return res.status(400).json({ message: 'Material and quantity are required' });
    }

    // Check if material exists
    const material = await Material.findById(materialId);
    if (!material) {
      return res.status(404).json({ message: 'Material not found' });
    }

    const request = await Request.create({
      materialId,
      supervisorId: req.user._id,
      quantityRequested,
      reason: reason || '',
      status: 'Pending',
    });

    const populatedRequest = await Request.findById(request._id)
      .populate('materialId', 'name category unit')
      .populate('supervisorId', 'name email');

    res.status(201).json({ message: 'Request submitted successfully', request: populatedRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get All Requests (Admin) ─────────────────────────────────────────────────
// GET /api/requests
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate('materialId', 'name category unit quantity')
      .populate('supervisorId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Get Supervisor's Own Requests ────────────────────────────────────────────
// GET /api/my-requests
const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({ supervisorId: req.user._id })
      .populate('materialId', 'name category unit quantity')
      .sort({ createdAt: -1 });

    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── Approve or Reject Request (Admin) ────────────────────────────────────────
// PUT /api/request/:id
const updateRequestStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be Approved or Rejected' });
    }

    const request = await Request.findById(req.params.id).populate('materialId');
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: 'Request has already been processed' });
    }

    // If Approving - check stock and deduct
    if (status === 'Approved') {
      const material = await Material.findById(request.materialId._id);

      if (material.quantity < request.quantityRequested) {
        return res.status(400).json({
          message: `Insufficient stock! Available: ${material.quantity} ${material.unit}, Requested: ${request.quantityRequested} ${material.unit}`
        });
      }

      // Deduct quantity from stock
      material.quantity -= request.quantityRequested;
      await material.save();

      // Add to usage history
      await UsageHistory.create({
        materialId: request.materialId._id,
        requestId: request._id,
        supervisorId: request.supervisorId,
        quantityUsed: request.quantityRequested,
        issuedDate: new Date(),
      });
    }

    // Update request status
    request.status = status;
    request.adminNote = adminNote || '';
    await request.save();

    const updatedRequest = await Request.findById(req.params.id)
      .populate('materialId', 'name category unit quantity')
      .populate('supervisorId', 'name email');

    res.status(200).json({
      message: `Request ${status} successfully`,
      request: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRequest,
  getAllRequests,
  getMyRequests,
  updateRequestStatus,
};
