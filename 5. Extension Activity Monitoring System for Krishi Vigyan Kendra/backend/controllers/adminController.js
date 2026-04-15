const mongoose = require('mongoose');
const fs = require('fs-extra');
const path = require('path');
const User = require('../models/User');
const SystemConfig = require('../models/SystemConfig');
const cron = require('node-cron');

const BACKUP_DIR = path.join(process.cwd(), 'backups');

const ALLOWED_ROLE_VALUES = ['admin', 'scientist', 'program_assistant'];
const ALLOWED_PERMISSION_VALUES = ['create', 'view', 'update', 'delete', 'data_entry', 'import'];

// Helper to ensure backup directory exists
const ensureBackupDir = async () => {
  await fs.ensureDir(BACKUP_DIR);
};

// Scheduler for flexible auto backup: Every hour on Friday (0 * * * 5)
cron.schedule('0 * * * 5', async () => {
  try {
    const config = await SystemConfig.findOne({ key: 'auto_backup_enabled' });
    if (config && config.value === true) {
      const now = new Date();
      const currentHour = now.getHours();
      
      // Run only between 9:00 AM and 5:00 PM (17:00)
      if (currentHour >= 9 && currentHour < 17) {
        const lastBackupConfig = await SystemConfig.findOne({ key: 'last_auto_backup_date' });
        const todayDate = now.toISOString().split('T')[0];
        
        if (!lastBackupConfig || lastBackupConfig.value !== todayDate) {
          console.log('Running flexible Friday auto backup...');
          
          const autoDbConfig = await SystemConfig.findOne({ key: 'auto_backup_db' });
          const existingDbName = autoDbConfig ? autoDbConfig.value : null;
          
          await internalCreateBackup({ 
            type: 'automatic', 
            displayName: existingDbName ? null : `Weekly Auto Backup ${new Date().toLocaleDateString()}`,
            existingDbName: existingDbName
          });

          // Update last backup date to prevent multiple runs today
          await SystemConfig.findOneAndUpdate(
            { key: 'last_auto_backup_date' },
            { value: todayDate },
            { upsert: true }
          );
          
          console.log('Flexible auto backup completed successfully.');
        } else {
          console.log('Auto backup already executed today.');
        }
      } else {
        console.log(`Auto backup skipped: Current hour ${currentHour} is outside 9 AM - 5 PM window.`);
      }
    } else {
      console.log('Scheduled backup skipped (Auto Backup is disabled).');
    }
  } catch (err) {
    console.error('Scheduled backup failed:', err);
  }
});

const normalizeStringArray = (value) => {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => String(v || '').trim().toLowerCase())
    .filter(Boolean);
};

const sanitizePermissionsObject = (permissionsObj = {}, allowedDisciplines = []) => {
  const out = {};
  const allowedSet = new Set(allowedDisciplines);

  Object.entries(permissionsObj || {}).forEach(([disciplineCode, perms]) => {
    const key = String(disciplineCode || '').trim().toLowerCase();
    if (!key || !allowedSet.has(key)) return;

    const cleaned = Array.from(
      new Set(
        (Array.isArray(perms) ? perms : [])
          .map((p) => String(p || '').trim().toLowerCase())
          .filter((p) => ALLOWED_PERMISSION_VALUES.includes(p))
      )
    );
    out[key] = cleaned;
  });

  // Ensure every assigned discipline has a key (even if empty)
  allowedDisciplines.forEach((d) => {
    if (!out[d]) out[d] = [];
  });

  return out;
};

// Internal backup logic used by both manual and automatic triggers
const internalCreateBackup = async ({ type = 'manual', displayName = null, existingDbName = null, recordActions = null }) => {
  await ensureBackupDir();
  const mainDb = mongoose.connection.db;
  const collections = await mainDb.listCollections().toArray();
  const collectionNames = collections.map(c => c.name).filter(name => !name.startsWith('system.') && name !== '__backup_metadata');

  const now = new Date();
  const timestamp = now.getFullYear() + '_' + 
                    String(now.getMonth() + 1).padStart(2, '0') + '_' + 
                    String(now.getDate()).padStart(2, '0') + '_' + 
                    String(now.getHours()).padStart(2, '0') + '_' + 
                    String(now.getMinutes()).padStart(2, '0');
  
  const backupName = existingDbName || `kvk_backup_${timestamp}`;
  const backupFolderPath = path.join(BACKUP_DIR, backupName);
  const collectionsPath = path.join(backupFolderPath, 'collections');
  
  await fs.ensureDir(collectionsPath);

  const metadataPath = path.join(backupFolderPath, 'metadata.json');
  let metadata;

  if (existingDbName && await fs.exists(metadataPath)) {
    metadata = await fs.readJson(metadataPath);
    // If a new display name is provided during an incremental backup, update it.
    if (displayName) {
      metadata.displayName = displayName;
    }
    // Ensure timeline array exists
    if (!metadata.timeline) {
      metadata.timeline = [];
    }
  } else {
    metadata = {
      displayName: displayName || `Backup ${timestamp.replace(/_/g, '-')}`,
      databaseName: backupName,
      createdDate: now.toISOString().split('T')[0],
      createdTime: now.toTimeString().split(' ')[0].substring(0, 5),
      type: type,
      collections: [],
      history: [],
      timeline: []
    };
  }

  // Count records before backup for incremental reporting
  const beforeTotalRecords = metadata.collections.reduce((acc, c) => acc + (c.records || 0), 0);
  
  let totalNewRecords = 0;
  const currentCollectionsStats = [];
  const stats = {};

  for (const name of collectionNames) {
    try {
      const mainDocs = await mainDb.collection(name).find({}).toArray();
      const filePath = path.join(collectionsPath, `${name}.json`);
      
      let existingDocs = [];
      if (await fs.exists(filePath)) {
        existingDocs = await fs.readJson(filePath);
      }

      let newDocs = [];
      
      // Get ignore list for this collection from recordActions
      const ignoreIds = recordActions && recordActions[name]
        ? recordActions[name].filter(a => a.action === 'ignore').map(a => String(a.id))
        : [];

      if (name === 'dataentries') {
        const existingKeys = new Set(existingDocs.map(b => 
          `${String(b.eventName).toLowerCase()}|${new Date(b.startDate).getTime()}|${String(b.venuePlace).toLowerCase()}`
        ));
        newDocs = mainDocs.filter(m => {
          // Skip if explicitly ignored
          if (ignoreIds.includes(String(m._id))) return false;
          
          const key = `${String(m.eventName).toLowerCase()}|${new Date(m.startDate).getTime()}|${String(m.venuePlace).toLowerCase()}`;
          return !existingKeys.has(key);
        });
      } else {
        const existingIds = new Set(existingDocs.map(b => String(b._id)));
        newDocs = mainDocs.filter(m => {
          // Skip if explicitly ignored
          if (ignoreIds.includes(String(m._id))) return false;
          
          return !existingIds.has(String(m._id));
        });
      }

      const updatedDocs = [...existingDocs, ...newDocs];
      await fs.writeJson(filePath, updatedDocs, { spaces: 2 });
      
      totalNewRecords += newDocs.length;
      stats[name] = newDocs.length;
      currentCollectionsStats.push({
        name,
        records: updatedDocs.length
      });
    } catch (err) {
      console.error(`Error backing up collection ${name}:`, err);
      // Optionally, you could add this error to the metadata history
      metadata.history.push({
        timestamp: new Date().toISOString(),
        type: 'error',
        details: `Failed to back up collection: ${name}`
      });
    }
  }

  // After backup count
  const afterTotalRecords = currentCollectionsStats.reduce((acc, c) => acc + (c.records || 0), 0);
  const actualAddedCount = Math.max(0, afterTotalRecords - beforeTotalRecords);

  metadata.collections = currentCollectionsStats;
  
  // Only add a history entry if it's the initial backup or if records were actually added.
  if (!existingDbName || actualAddedCount > 0) {
    metadata.history.push({
      timestamp: now.toISOString(),
      type: existingDbName ? 'incremental' : 'initial',
      recordsAdded: actualAddedCount,
      details: `${now.toLocaleDateString()} — ${existingDbName ? 'Incremental' : 'Initial'} Backup — ${actualAddedCount} records added`
    });
  }

  // ALWAYS log to timeline for automatic backups (even if 0 records)
  // Also log to timeline for manual backups that add records
  if (type === 'automatic' || actualAddedCount > 0) {
    const getDirSize = async (dirPath) => {
      let size = 0;
      try {
        const files = await fs.readdir(dirPath);
        for (const file of files) {
          const filePath = path.join(dirPath, file);
          const fileStat = await fs.stat(filePath);
          if (fileStat.isDirectory()) {
            size += await getDirSize(filePath);
          } else {
            size += fileStat.size;
          }
        }
      } catch (e) {}
      return size;
    };

    const currentSize = await getDirSize(backupFolderPath);
    const sizeFormatted = currentSize < 1024 * 1024 
      ? (currentSize / 1024).toFixed(2) + ' KB' 
      : (currentSize / (1024 * 1024)).toFixed(2) + ' MB';

    metadata.timeline.push({
       date: now.toISOString().split('T')[0],
       time: now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' }),
       recordsAdded: actualAddedCount,
       size: sizeFormatted,
       type: type
     });
  }

  await fs.writeJson(metadataPath, metadata, { spaces: 2 });
  
  return { backupName, totalNewRecords: actualAddedCount, metadata, stats };
};

// @desc    Get all pending users (for approval)
const getPendingUsers = async (req, res) => {
  try {
    const users = await User.find({ status: 'pending', role: { $ne: 'admin' }, isDeleted: { $ne: true } })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users
const getAllUsers = async (req, res) => {
  try {
    const { includeDeleted } = req.query;
    const filter = { role: { $ne: 'admin' } };
    if (includeDeleted !== 'true') {
      filter.isDeleted = { $ne: true };
    }
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve user
const approveUser = async (req, res) => {
  try {
    const {
      discipline,
      role,
      designation,
      joiningDate,
      isActive,
      assignedDisciplines,
      permissions,
      adminPassword,
      dataEntryEnabled
    } = req.body || {};

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin user' });
    }

    const nextRole = role ? String(role).trim().toLowerCase() : user.role;
    if (nextRole && !ALLOWED_ROLE_VALUES.includes(nextRole)) {
      return res.status(400).json({ message: 'Invalid role value' });
    }

    const primaryDiscipline = discipline ? String(discipline).trim().toLowerCase() : null;
    if (nextRole === 'scientist' && !primaryDiscipline) {
      return res.status(400).json({ message: 'Primary discipline is required' });
    }

    const finalDesignation = designation !== undefined ? String(designation || '').trim() : null;
    if (nextRole !== 'admin' && !finalDesignation) {
      return res.status(400).json({ message: 'Designation is required' });
    }

    const finalJoiningDate = joiningDate ? new Date(joiningDate) : null;
    if (finalJoiningDate && Number.isNaN(finalJoiningDate.getTime())) {
      return res.status(400).json({ message: 'Invalid joining date format' });
    }

    const activeFlag = Boolean(isActive);
    if (!activeFlag) {
      return res.status(400).json({
        message: 'User must be set Active during approval (inactive users cannot login).'
      });
    }

    if (nextRole === 'admin') {
      const admin = await User.findById(req.user._id).select('+password');
      if (!admin) {
        return res.status(401).json({ message: 'Admin session invalid' });
      }
      const ok = await admin.matchPassword(String(adminPassword || ''));
      if (!ok) {
        return res.status(401).json({ message: 'Admin password confirmation failed' });
      }
    }

    const normalizedAssigned = normalizeStringArray(assignedDisciplines);
    const disciplinesSet = new Set(normalizedAssigned);
    if (primaryDiscipline) {
      disciplinesSet.add(primaryDiscipline);
    }
    const finalAssigned = Array.from(disciplinesSet);

    user.status = 'approved';
    user.isActive = activeFlag;
    user.role = nextRole || user.role;
    user.discipline = nextRole === 'admin' ? null : primaryDiscipline;
    user.designation = finalDesignation;
    user.joiningDate = finalJoiningDate;
    user.assignedDisciplines = nextRole === 'admin' ? [] : finalAssigned;
    user.dataEntryEnabled = nextRole === 'admin' ? false : Boolean(dataEntryEnabled);

    if (nextRole === 'admin') {
      user.permissions = new Map();
    } else {
      const cleanedPermissionsObj = sanitizePermissionsObject(permissions || {}, finalAssigned);
      user.permissions = new Map(Object.entries(cleanedPermissionsObj));
    }

    await user.save();

    res.json({
      message: 'User approved successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        designation: user.designation,
        discipline: user.discipline,
        joiningDate: user.joiningDate,
        isActive: user.isActive,
        status: user.status,
        assignedDisciplines: user.assignedDisciplines,
        dataEntryEnabled: user.dataEntryEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject user
const rejectUser = async (req, res) => {
  try {
    const { reason, adminPassword } = req.body || {};
    if (!reason || !String(reason).trim()) {
      return res.status(400).json({ message: 'Reject reason is required' });
    }
    if (!adminPassword || !String(adminPassword).trim()) {
      return res.status(400).json({ message: 'Admin password is required to reject a user' });
    }

    const admin = await User.findById(req.user._id).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin session invalid' });
    }
    const ok = await admin.matchPassword(String(adminPassword).trim());
    if (!ok) {
      return res.status(401).json({ message: 'Incorrect admin password' });
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin user' });
    }

    user.status = 'rejected';
    user.isActive = false;
    user.blockReason = String(reason).trim();
    await user.save();

    res.json({
      message: 'User rejected',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user permissions and profile
const updatePermissions = async (req, res) => {
  try {
    const {
      role,
      discipline,
      designation,
      joiningDate,
      assignedDisciplines,
      permissions,
      isActive,
      adminPassword,
      dataEntryEnabled
    } = req.body || {};

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin permissions' });
    }

    if (role && role !== user.role) {
      const nextRole = String(role).trim().toLowerCase();
      if (!ALLOWED_ROLE_VALUES.includes(nextRole)) {
        return res.status(400).json({ message: 'Invalid role value' });
      }
      if (nextRole === 'admin') {
        const admin = await User.findById(req.user._id).select('+password');
        if (!admin) {
          return res.status(401).json({ message: 'Admin session invalid' });
        }
        const ok = await admin.matchPassword(String(adminPassword || ''));
        if (!ok) {
          return res.status(401).json({ message: 'Admin password confirmation failed' });
        }
      }
      user.role = nextRole;
    }

    if (discipline !== undefined) {
      const primaryDiscipline = discipline ? String(discipline).trim().toLowerCase() : null;
      if (primaryDiscipline) {
        user.discipline = primaryDiscipline;
      }
    }

    if (designation !== undefined) {
      user.designation = designation ? String(designation).trim() : null;
    }

    if (joiningDate !== undefined) {
      const finalJoiningDate = joiningDate ? new Date(joiningDate) : null;
      if (finalJoiningDate && !Number.isNaN(finalJoiningDate.getTime())) {
        user.joiningDate = finalJoiningDate;
      }
    }

    const normalizedAssigned =
      assignedDisciplines !== undefined
        ? normalizeStringArray(assignedDisciplines)
        : user.assignedDisciplines || [];
    if (assignedDisciplines !== undefined) {
      if (user.discipline && !normalizedAssigned.includes(user.discipline)) {
        normalizedAssigned.push(user.discipline);
      }
      user.assignedDisciplines = normalizedAssigned;
    }

    if (isActive !== undefined) {
      user.isActive = Boolean(isActive);
    }

    if (dataEntryEnabled !== undefined) {
      user.dataEntryEnabled = Boolean(dataEntryEnabled);
    }

    if (permissions) {
      const cleaned = sanitizePermissionsObject(permissions, user.assignedDisciplines || normalizedAssigned);
      user.permissions = new Map(Object.entries(cleaned));
    }

    await user.save();

    const permissionsObj = {};
    if (user.permissions) {
      user.permissions.forEach((value, key) => {
        permissionsObj[key] = Array.isArray(value) ? value : [value];
      });
    }

    res.json({
      message: 'User updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        designation: user.designation,
        discipline: user.discipline,
        joiningDate: user.joiningDate,
        isActive: user.isActive,
        status: user.status,
        assignedDisciplines: user.assignedDisciplines || [],
        permissions: permissionsObj,
        dataEntryEnabled: user.dataEntryEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user
const deleteUser = async (req, res) => {
  try {
    const { reason, adminPassword } = req.body || {};
    if (!reason || !String(reason).trim()) {
      return res.status(400).json({ message: 'Delete reason is required to block a user' });
    }
    if (!adminPassword || !String(adminPassword).trim()) {
      return res.status(400).json({ message: 'Admin password is required to block a user' });
    }
    const admin = await User.findById(req.user._id).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin session invalid' });
    }
    const ok = await admin.matchPassword(String(adminPassword).trim());
    if (!ok) {
      return res.status(401).json({ message: 'Incorrect admin password' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    user.isDeleted = true;
    user.deletedAt = new Date();
    user.status = 'rejected';
    user.isActive = false;
    user.blockReason = String(reason).trim();
    await user.save();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List deleted users
const listDeletedUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: true })
      .select('-password')
      .sort({ deletedAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Recover deleted user
const recoverUser = async (req, res) => {
  try {
    const { adminPassword } = req.body || {};
    if (!adminPassword || !String(adminPassword).trim()) {
      return res.status(400).json({ message: 'Admin password is required to recover a user' });
    }
    const admin = await User.findById(req.user._id).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin session invalid' });
    }
    const ok = await admin.matchPassword(String(adminPassword).trim());
    if (!ok) {
      return res.status(401).json({ message: 'Incorrect admin password' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (!user.isDeleted) {
      return res.status(400).json({ message: 'User is not deleted' });
    }

    user.isDeleted = false;
    user.deletedAt = null;
    user.status = 'pending';
    user.blockReason = null;
    await user.save();

    res.json({ message: 'User recovered successfully', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unblock user
const unblockUser = async (req, res) => {
  try {
    const { adminPassword } = req.body || {};
    if (!adminPassword || !String(adminPassword).trim()) {
      return res.status(400).json({ message: 'Admin password is required to unblock a user' });
    }
    const admin = await User.findById(req.user._id).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin session invalid' });
    }
    const ok = await admin.matchPassword(String(adminPassword).trim());
    if (!ok) {
      return res.status(401).json({ message: 'Incorrect admin password' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin user' });
    }

    user.status = 'pending';
    user.blockReason = null;
    await user.save();

    const permissionsObj = {};
    if (user.permissions) {
      user.permissions.forEach((value, key) => {
        permissionsObj[key] = Array.isArray(value) ? value : [value];
      });
    }

    res.json({
      message: 'User unblocked successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        designation: user.designation,
        discipline: user.discipline,
        joiningDate: user.joiningDate,
        isActive: user.isActive,
        status: user.status,
        assignedDisciplines: user.assignedDisciplines || [],
        permissions: permissionsObj
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create filesystem backup
const createBackup = async (req, res) => {
  try {
    const { existingDbName, displayName, recordActions } = req.body;
    const result = await internalCreateBackup({ type: 'manual', displayName, existingDbName, recordActions });
    
    const message = existingDbName 
      ? `Incremental backup completed. ${result.totalNewRecords} new records added.` 
      : `New backup created successfully. ${result.totalNewRecords} records backed up.`;

    res.status(201).json({
      success: true,
      message: message,
      ...result
    });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ message: 'Failed to create backup', error: error.message });
  }
};

// @desc    Get preview of records to be added in incremental backup
const getIncrementalBackupPreview = async (req, res) => {
  try {
    const { dbName } = req.params;
    const backupFolderPath = path.join(BACKUP_DIR, dbName);
    const collectionsPath = path.join(backupFolderPath, 'collections');
    const metadataPath = path.join(backupFolderPath, 'metadata.json');

    if (!await fs.exists(metadataPath)) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    const metadata = await fs.readJson(metadataPath);
    const mainDb = mongoose.connection.db;
    const collectionNames = (await mainDb.listCollections().toArray()).map(c => c.name).filter(n => !n.startsWith('system.'));

    const preview = [];
    for (const name of collectionNames) {
      const mainDocs = await mainDb.collection(name).find({}).toArray();
      const filePath = path.join(collectionsPath, `${name}.json`);
      
      let existingDocs = [];
      if (await fs.exists(filePath)) {
        existingDocs = await fs.readJson(filePath);
      }

      let newDocs = [];
      if (name === 'dataentries') {
        const existingKeys = new Set(existingDocs.map(b => 
          `${String(b.eventName).toLowerCase()}|${new Date(b.startDate).getTime()}|${String(b.venuePlace).toLowerCase()}`
        ));
        newDocs = mainDocs.filter(m => {
          const key = `${String(m.eventName).toLowerCase()}|${new Date(m.startDate).getTime()}|${String(m.venuePlace).toLowerCase()}`;
          return !existingKeys.has(key);
        }).map(r => ({
          _id: r._id,
          eventType: r.eventType,
          eventCategory: r.eventCategory,
          eventName: r.eventName,
          startDate: r.startDate,
          endDate: r.endDate,
          venuePlace: r.venuePlace,
          venueTal: r.venueTal,
          venueDist: r.venueDist,
          venue: r.venue,
          objectives: r.objectives,
          aboutEvent: r.aboutEvent,
          targetGroup: r.targetGroup,
          postEventDetails: r.postEventDetails,
          contacts: r.contacts,
          contactPerson: r.contactPerson,
          discipline: r.discipline,
          chiefGuest: r.chiefGuest,
          inauguratedBy: r.inauguratedBy,
          chiefGuestRemark: r.chiefGuestRemark,
          mediaCoverage: r.mediaCoverage,
          totalMale: r.totalMale || ((parseInt(r.genMale) || 0) + (parseInt(r.scMale) || 0) + (parseInt(r.stMale) || 0) + (parseInt(r.otherMale) || 0) + (parseInt(r.efMale) || 0)),
          totalFemale: r.totalFemale || ((parseInt(r.genFemale) || 0) + (parseInt(r.scFemale) || 0) + (parseInt(r.stFemale) || 0) + (parseInt(r.otherFemale) || 0) + (parseInt(r.efFemale) || 0)),
          scTotal: r.scTotal || ((parseInt(r.scMale) || 0) + (parseInt(r.scFemale) || 0)),
          stTotal: r.stTotal || ((parseInt(r.stMale) || 0) + (parseInt(r.stFemale) || 0)),
          otherTotal: r.otherTotal || ((parseInt(r.otherMale) || 0) + (parseInt(r.otherFemale) || 0)),
          efTotal: r.efTotal || ((parseInt(r.efMale) || 0) + (parseInt(r.efFemale) || 0)),
          grandTotal: r.grandTotal
        }));
      } else if (name === 'users') {
        const existingEmails = new Set(existingDocs.map(b => String(b.email).toLowerCase()));
        const existingIds = new Set(existingDocs.map(b => String(b._id)));
        newDocs = mainDocs.filter(m => !existingEmails.has(String(m.email).toLowerCase()) && !existingIds.has(String(m._id)))
          .map(r => ({
            _id: r._id,
            name: r.name,
            email: r.email,
            role: r.role,
            designation: r.designation,
            discipline: r.discipline,
            date: r.createdAt
          }));
      } else {
        const existingIds = new Set(existingDocs.map(b => String(b._id)));
        newDocs = mainDocs.filter(m => !existingIds.has(String(m._id)))
          .map(r => ({
            _id: r._id,
            name: r.name || r.title || r.key || r._id,
            date: r.createdAt || r.timestamp || r.date || null,
            contact: r.email || r.username || r.contactPerson || null
          }));
      }

      preview.push({
        collection: name,
        backupRecords: existingDocs.length,
        currentRecords: mainDocs.length,
        toBackup: newDocs.length,
        recordsToBackup: newDocs
      });
    }

    res.json({
      displayName: metadata.displayName,
      createdDate: metadata.createdDate,
      preview
    });
  } catch (error) {
    console.error('Incremental preview failed:', error);
    res.status(500).json({ message: 'Failed to generate incremental preview', error: error.message });
  }
};

// @desc    Get backup preview (dry run)
const getBackupPreview = async (req, res) => {
  try {
    const { dbName } = req.params;
    const backupFolderPath = path.join(BACKUP_DIR, dbName);
    const metadataPath = path.join(backupFolderPath, 'metadata.json');

    if (!await fs.exists(metadataPath)) {
      return res.status(404).json({ message: 'Backup not found' });
    }

    const metadata = await fs.readJson(metadataPath);
    const mainDb = mongoose.connection.db;
    
    // Check if main database exists by listing collections
    let dbExists = true;
    let mainCollections = [];
    try {
      mainCollections = await mainDb.listCollections().toArray();
      if (mainCollections.length === 0) dbExists = false;
    } catch (e) {
      dbExists = false;
    }

    const preview = [];
    for (const coll of metadata.collections) {
      let mainCount = 0;
      let mainDocs = [];
      
      if (dbExists) {
        const mainColl = mainDb.collection(coll.name);
        mainCount = await mainColl.countDocuments();
        mainDocs = await mainColl.find({}).toArray();
      }
      
      const backupFilePath = path.join(backupFolderPath, 'collections', `${coll.name}.json`);
      const backupDocs = await fs.readJson(backupFilePath);

      let recordsToRestore = [];
      if (coll.name === 'dataentries') {
        recordsToRestore = backupDocs.filter(b => !mainDocs.some(m => 
          String(m.eventName).toLowerCase() === String(b.eventName).toLowerCase() &&
          new Date(m.startDate).getTime() === new Date(b.startDate).getTime() &&
          String(m.venuePlace).toLowerCase() === String(b.venuePlace).toLowerCase()
        )).map(r => ({
          _id: r._id,
          eventType: r.eventType,
          eventCategory: r.eventCategory,
          eventName: r.eventName,
          startDate: r.startDate,
          endDate: r.endDate,
          venuePlace: r.venuePlace,
          venueTal: r.venueTal,
          venueDist: r.venueDist,
          venue: r.venue,
          objectives: r.objectives,
          aboutEvent: r.aboutEvent,
          targetGroup: r.targetGroup,
          postEventDetails: r.postEventDetails,
          contacts: r.contacts,
          contactPerson: r.contactPerson,
          discipline: r.discipline,
          chiefGuest: r.chiefGuest,
          inauguratedBy: r.inauguratedBy,
          chiefGuestRemark: r.chiefGuestRemark,
          mediaCoverage: r.mediaCoverage,
          genMale: r.genMale,
          genFemale: r.genFemale,
          scMale: r.scMale,
          scFemale: r.scFemale,
          stMale: r.stMale,
          stFemale: r.stFemale,
          otherMale: r.otherMale,
          otherFemale: r.otherFemale,
          efMale: r.efMale,
          efFemale: r.efFemale,
          scTotal: r.scTotal,
          stTotal: r.stTotal,
          otherTotal: r.otherTotal,
          efTotal: r.efTotal,
          totalMale: r.totalMale,
          totalFemale: r.totalFemale,
          grandTotal: r.grandTotal
        }));
      } else if (coll.name === 'users') {
        recordsToRestore = backupDocs.filter(b => !mainDocs.some(m => 
          (m.email && b.email && String(m.email).toLowerCase() === String(b.email).toLowerCase()) || String(m._id) === String(b._id)
        )).map(r => ({
          _id: r._id,
          name: r.name,
          email: r.email,
          role: r.role,
          designation: r.designation,
          discipline: r.discipline,
          date: r.createdAt
        }));
      } else if (coll.name === 'disciplines') {
        recordsToRestore = backupDocs.filter(b => !mainDocs.some(m => 
          (m.code && b.code && String(m.code).toLowerCase() === String(b.code).toLowerCase()) || String(m._id) === String(b._id)
        )).map(r => ({
          _id: r._id,
          name: r.name,
          code: r.code,
          date: null
        }));
      } else {
        recordsToRestore = backupDocs.filter(b => !mainDocs.some(m => String(m._id) === String(b._id))).map(r => ({
          _id: r._id,
          name: r.name || r.title || r.key || r._id,
          date: r.createdAt || r.timestamp || r.date || null,
          contact: r.email || r.username || r.contactPerson || null
        }));
      }

      preview.push({
        collection: coll.name,
        backupRecords: coll.records,
        currentRecords: mainCount,
        willBeRestored: recordsToRestore.length,
        recordsToRestore
      });
    }

    res.json({
      displayName: metadata.displayName,
      createdDate: metadata.createdDate,
      dbExists,
      preview
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate preview', error: error.message });
  }
};

// @desc    Restore from filesystem backup
const restoreBackup = async (req, res) => {
  try {
    const { backupDbName, adminPassword, recordActions } = req.body;
    
    // Try to find user in DB, but allow recovery mode if DB is missing
    let user;
    try {
      user = await User.findById(req.user._id).select('+password');
    } catch (e) {
      console.log('Database lookup failed during restore, checking recovery credentials...');
    }

    if (user) {
      const isMatch = await user.matchPassword(String(adminPassword || '').trim());
      if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });
    } else {
      // Recovery mode password check (if DB is dropped)
      const recoveryKey = process.env.RECOVERY_PASSWORD || 'admin123';
      if (adminPassword !== recoveryKey) {
        return res.status(401).json({ message: 'Incorrect Recovery Key' });
      }
    }

    const backupFolderPath = path.join(BACKUP_DIR, backupDbName);
    const collectionsPath = path.join(backupFolderPath, 'collections');
    const metadataPath = path.join(backupFolderPath, 'metadata.json');
    const mainDb = mongoose.connection.db;

    const files = await fs.readdir(collectionsPath);
    let totalRestored = 0;
    let totalDeletedFromBackup = 0;
    const stats = {};
    const metadata = await fs.readJson(metadataPath);
    let metadataUpdated = false;

    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const collectionName = file.replace('.json', '');
      const backupFilePath = path.join(collectionsPath, file);
      let backupDocs = await fs.readJson(backupFilePath);
      const mainColl = mainDb.collection(collectionName);
      
      let mainDocs = [];
      try {
        mainDocs = await mainColl.find({}).toArray();
      } catch (e) {
        console.log(`Collection ${collectionName} does not exist, will be created.`);
      }

      // 1. Process deletions from backup file if specified
      if (recordActions && recordActions[collectionName]) {
        const toDeleteIds = recordActions[collectionName]
          .filter(a => a.action === 'delete')
          .map(a => String(a.id));
        
        if (toDeleteIds.length > 0) {
          const originalCount = backupDocs.length;
          backupDocs = backupDocs.filter(doc => !toDeleteIds.includes(String(doc._id)));
          const deletedCount = originalCount - backupDocs.length;
          
          if (deletedCount > 0) {
            await fs.writeJson(backupFilePath, backupDocs, { spaces: 2 });
            totalDeletedFromBackup += deletedCount;
            
            // Update metadata record count for this collection
            const collMeta = metadata.collections.find(c => c.name === collectionName);
            if (collMeta) {
              collMeta.records = backupDocs.length;
              metadataUpdated = true;
            }
          }
        }
      }

      // 2. Identify records to restore
      let docsToRestore = [];
      
      // Get IDs to ignore or keep from user selections
      const ignoreIds = recordActions && recordActions[collectionName] 
        ? recordActions[collectionName].filter(a => a.action === 'ignore').map(a => String(a.id))
        : [];

      // Filter backupDocs to find what's missing in DB
      docsToRestore = backupDocs.filter(b => {
        // A. Skip if user explicitly ignored this record
        if (ignoreIds.includes(String(b._id))) return false;

        // B. ABSOLUTE CHECK: Skip if _id already exists in DB (Prevents E11000)
        const idExists = mainDocs.some(m => String(m._id) === String(b._id));
        if (idExists) return false;

        // C. BUSINESS LOGIC CHECK: Skip if record looks like a duplicate even with different ID
        if (collectionName === 'dataentries') {
          return !mainDocs.some(m => 
            String(m.eventName || '').toLowerCase() === String(b.eventName || '').toLowerCase() &&
            new Date(m.startDate).getTime() === new Date(b.startDate).getTime() &&
            String(m.venuePlace || '').toLowerCase() === String(b.venuePlace || '').toLowerCase()
          );
        } else if (collectionName === 'systemconfigs') {
          return !mainDocs.some(m => (m.key && b.key && String(m.key) === String(b.key)));
        } else if (collectionName === 'users') {
          return !mainDocs.some(m => (m.email && b.email && String(m.email).toLowerCase() === String(b.email).toLowerCase()));
        } else if (collectionName === 'disciplines') {
          return !mainDocs.some(m => (m.code && b.code && String(m.code).toLowerCase() === String(b.code).toLowerCase()));
        }

        return true;
      });

      // 3. Perform insertion
      if (docsToRestore.length > 0) {
        // Convert string IDs back to ObjectIDs if they look like them
        const processedDocs = docsToRestore.map(doc => {
          const newDoc = { ...doc };
          if (newDoc._id && typeof newDoc._id === 'string' && newDoc._id.length === 24) {
            newDoc._id = new mongoose.Types.ObjectId(newDoc._id);
          }
          return newDoc;
        });
        
        // Use ordered: false to continue even if one fails (extra safety)
        await mainColl.insertMany(processedDocs, { ordered: false });
        totalRestored += processedDocs.length;
      }
      stats[collectionName] = docsToRestore.length;
    }

    // 4. Update metadata if records were deleted
    if (metadataUpdated) {
      await fs.writeJson(metadataPath, metadata, { spaces: 2 });
    }

    res.json({
      success: true,
      message: `Restored ${totalRestored} records. Deleted ${totalDeletedFromBackup} from backup.`,
      totalRestored,
      totalDeletedFromBackup,
      stats
    });
  } catch (error) {
    console.error('Restore failed:', error);
    res.status(500).json({ message: 'Restore failed', error: error.message });
  }
};

// @desc    Get backup history from filesystem
const getBackupHistory = async (req, res) => {
  try {
    await ensureBackupDir();
    const folders = await fs.readdir(BACKUP_DIR);
    const backups = [];
    let totalStorageSize = 0;

    for (const folder of folders) {
      const metadataPath = path.join(BACKUP_DIR, folder, 'metadata.json');
      try {
        if (await fs.exists(metadataPath)) {
          const metadata = await fs.readJson(metadataPath);
          
          const getDirSize = async (dirPath) => {
            let size = 0;
            const files = await fs.readdir(dirPath);
            for (const file of files) {
              const filePath = path.join(dirPath, file);
              const fileStat = await fs.stat(filePath);
              if (fileStat.isDirectory()) {
                size += await getDirSize(filePath);
              } else {
                size += fileStat.size;
              }
            }
            return size;
          };

          const totalSize = await getDirSize(path.join(BACKUP_DIR, folder));
          totalStorageSize += totalSize;
          const totalRecords = metadata.collections.reduce((acc, c) => acc + (c.records || 0), 0);

          backups.push({
            ...metadata,
            totalRecords,
            size: totalSize,
            sizeFormatted: totalSize < 1024 * 1024 
              ? (totalSize / 1024).toFixed(2) + ' KB' 
              : (totalSize / (1024 * 1024)).toFixed(2) + ' MB'
          });
        }
      } catch (e) {
        console.error(`Skipping invalid backup folder ${folder}:`, e.message);
      }
    }

    backups.sort((a, b) => {
      const dateA = new Date(a.createdDate + ' ' + (a.createdTime || '00:00'));
      const dateB = new Date(b.createdDate + ' ' + (b.createdTime || '00:00'));
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        return 0; // Don't crash if date is invalid
      }
      return dateB - dateA;
    });
    
    // Check database health
    let dbStatus = 'healthy';
    try {
      const mainDb = mongoose.connection.db;
      const collections = await mainDb.listCollections().toArray();
      if (collections.length === 0) dbStatus = 'empty';
    } catch (e) {
      dbStatus = 'disconnected';
    }

    res.json({
      backups,
      dbStatus,
      stats: {
        totalBackups: backups.length,
        latestBackupDate: backups.length > 0 ? backups[0].createdDate : null,
        totalStorageSize: totalStorageSize,
        totalStorageSizeFormatted: totalStorageSize < 1024 * 1024 
          ? (totalStorageSize / 1024).toFixed(2) + ' KB' 
          : (totalStorageSize / (1024 * 1024)).toFixed(2) + ' MB',
        totalRecords: backups.reduce((acc, b) => acc + (b.totalRecords || 0), 0)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history', error: error.message });
  }
};

// @desc    Delete filesystem backup
const deleteBackup = async (req, res) => {
  try {
    const { dbName } = req.params;
    const { adminPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(String(adminPassword || '').trim());
    if (!isMatch) return res.status(401).json({ message: 'Incorrect password' });

    const backupFolderPath = path.join(BACKUP_DIR, dbName);
    if (await fs.exists(backupFolderPath)) {
      await fs.remove(backupFolderPath);
      res.json({ success: true, message: 'Backup deleted' });
    } else {
      res.status(404).json({ message: 'Backup not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
};

// @desc    Verify admin password
const verifyAdminPassword = async (req, res) => {
  try {
    const { adminPassword } = req.body;
    if (!adminPassword) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findById(req.user._id).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'User session invalid' });
    }

    const isMatch = await user.matchPassword(String(adminPassword).trim());
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    res.json({ success: true, message: 'Password verified' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Inactivate user
const inactivateUser = async (req, res) => {
  try {
    const { reason, adminPassword } = req.body || {};
    if (!reason || !String(reason).trim()) {
      return res.status(400).json({ message: 'Inactivation reason is required' });
    }
    if (!adminPassword || !String(adminPassword).trim()) {
      return res.status(400).json({ message: 'Admin password is required to inactivate a user' });
    }
    const admin = await User.findById(req.user._id).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin session invalid' });
    }
    const ok = await admin.matchPassword(String(adminPassword).trim());
    if (!ok) {
      return res.status(401).json({ message: 'Incorrect admin password' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin user' });
    }

    user.isActive = false;
    if (user.status !== 'approved') {
      user.status = 'approved';
    }
    user.blockReason = String(reason).trim();
    await user.save();

    res.json({
      message: 'User set to inactive',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        designation: user.designation,
        discipline: user.discipline,
        isActive: user.isActive,
        status: user.status,
        blockReason: user.blockReason
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Activate user
const activateUser = async (req, res) => {
  try {
    const { adminPassword } = req.body || {};
    if (!adminPassword || !String(adminPassword).trim()) {
      return res.status(400).json({ message: 'Admin password is required to activate a user' });
    }
    const admin = await User.findById(req.user._id).select('+password');
    if (!admin) {
      return res.status(401).json({ message: 'Admin session invalid' });
    }
    const ok = await admin.matchPassword(String(adminPassword).trim());
    if (!ok) {
      return res.status(401).json({ message: 'Incorrect admin password' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot modify admin user' });
    }

    user.isActive = true;
    if (user.status !== 'approved') {
      user.status = 'approved';
    }
    user.blockReason = null;
    await user.save();

    res.json({
      message: 'User activated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isActive: user.isActive,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Permanently delete user
const permanentlyDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const nonAdminFilter = { role: { $ne: 'admin' } };
    const totalUsers = await User.countDocuments(nonAdminFilter);
    const pendingUsers = await User.countDocuments({ ...nonAdminFilter, status: 'pending' });
    const approvedUsers = await User.countDocuments({ ...nonAdminFilter, status: 'approved' });
    const rejectedUsers = await User.countDocuments({ ...nonAdminFilter, status: 'rejected' });

    res.json({
      totalUsers,
      pendingUsers,
      approvedUsers,
      rejectedUsers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get auto backup config
const getAutoBackupConfig = async (req, res) => {
  try {
    let enabledConfig = await SystemConfig.findOne({ key: 'auto_backup_enabled' });
    if (!enabledConfig) {
      enabledConfig = await SystemConfig.create({ key: 'auto_backup_enabled', value: true });
    }
    
    let dbConfig = await SystemConfig.findOne({ key: 'auto_backup_db' });
    
    res.json({ 
      enabled: enabledConfig.value,
      dbName: dbConfig ? dbConfig.value : null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update auto backup config
const updateAutoBackupConfig = async (req, res) => {
  try {
    const { enabled, dbName } = req.body;
    
    await SystemConfig.findOneAndUpdate(
      { key: 'auto_backup_enabled' },
      { value: !!enabled },
      { upsert: true }
    );
    
    if (dbName !== undefined) {
      await SystemConfig.findOneAndUpdate(
        { key: 'auto_backup_db' },
        { value: dbName },
        { upsert: true }
      );
    }
    
    res.json({ 
      success: true, 
      enabled: !!enabled,
      dbName: dbName
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPendingUsers,
  getAllUsers,
  listDeletedUsers,
  recoverUser,
  approveUser,
  rejectUser,
  updatePermissions,
  deleteUser,
  unblockUser,
  inactivateUser,
  activateUser,
  permanentlyDeleteUser,
  getDashboardStats,
  createBackup,
  getBackupHistory,
  restoreBackup,
  deleteBackup,
  getBackupPreview,
  getIncrementalBackupPreview,
  verifyAdminPassword,
  getAutoBackupConfig,
  updateAutoBackupConfig
};
