const express = require('express');
const router = express.Router();
const {
  getPendingUsers,
  getAllUsers,
  listDeletedUsers,
  recoverUser,
  approveUser,
  rejectUser,
  updatePermissions,
  deleteUser,
  unblockUser,
  permanentlyDeleteUser,
  getDashboardStats,
  inactivateUser,
  activateUser,
  createBackup,
  getBackupHistory,
  restoreBackup,
  deleteBackup,
  getBackupPreview,
  getIncrementalBackupPreview,
  verifyAdminPassword
} = require('../controllers/adminController');
const { protect, adminOnly, adminOrProgramAssistant } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Dashboard stats
router.get('/stats', adminOnly, getDashboardStats);

// Backup routes
router.post('/create-backup', adminOrProgramAssistant, createBackup);
router.get('/backups', adminOrProgramAssistant, getBackupHistory);
router.get('/backups/:dbName/preview', adminOrProgramAssistant, getBackupPreview);
router.get('/backups/:dbName/incremental-preview', adminOrProgramAssistant, getIncrementalBackupPreview);
router.post('/restore-backup', adminOrProgramAssistant, restoreBackup);
router.delete('/backups/:dbName', adminOrProgramAssistant, deleteBackup);
router.post('/verify-password', adminOrProgramAssistant, verifyAdminPassword);
router.get('/auto-backup-config', adminOrProgramAssistant, require('../controllers/adminController').getAutoBackupConfig);
router.put('/auto-backup-config', adminOrProgramAssistant, require('../controllers/adminController').updateAutoBackupConfig);

// User management (Admin only)
router.use(adminOnly);
router.get('/users', getAllUsers);
router.get('/deleted-users', listDeletedUsers);
router.get('/pending-users', getPendingUsers);
router.put('/approve/:id', approveUser);
router.put('/recover-user/:id', recoverUser);
router.put('/reject/:id', rejectUser);
router.put('/unblock/:id', unblockUser);
router.put('/inactivate/:id', inactivateUser);
router.put('/activate/:id', activateUser);
router.put('/permissions/:id', updatePermissions);
router.delete('/users/:id', deleteUser);
router.delete('/users/:id/permanent', permanentlyDeleteUser);

module.exports = router;
