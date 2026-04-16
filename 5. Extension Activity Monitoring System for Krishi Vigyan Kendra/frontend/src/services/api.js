// src/services/api.js

const API_BASE_URL = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api`;

// Generic helper for making API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = sessionStorage.getItem('kvkAuthToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    // If response has no JSON, fallback
    if (!response.ok) {
      throw new Error('Something went wrong');
    }
    return {};
  }

  if (!response.ok) {
    // IMPORTANT: use backend message so Login.js can show the correct toast
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Auth API calls
export const authAPI = {
  // Login user (admin or scientist)
  login: async (email, password, loginType) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, loginType })
    });
  },

  // Register scientist (pending approval) – now with phone
  register: async (name, email, phone, password) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password })
    });
  },

  // Get current user
  getMe: async () => {
    return apiRequest('/auth/me', {
      method: 'GET'
    });
  },

  // Get active staff for dropdowns (any role)
  getUsers: async () => {
    return apiRequest('/auth/users', {
      method: 'GET'
    });
  }
};

// Admin API calls
export const adminAPI = {
  // Get dashboard stats
  getStats: async () => {
    return apiRequest('/admin/stats', { method: 'GET' });
  },

  // Get all users
  getAllUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/admin/users${query ? `?${query}` : ''}`, { method: 'GET' });
  },

  // Get pending users
  getPendingUsers: async () => {
    return apiRequest('/admin/pending-users', { method: 'GET' });
  },

  // Get deleted users
  getDeletedUsers: async () => {
    return apiRequest('/admin/deleted-users', { method: 'GET' });
  },

  // Recover user
  recoverUser: async (userId, adminPassword) => {
    return apiRequest(`/admin/recover-user/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ adminPassword })
    });
  },

  // Approve user
  approveUser: async (userId, data) => {
    return apiRequest(`/admin/approve/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Reject user with reason
  rejectUser: async (userId, reason, adminPassword) => {
    return apiRequest(`/admin/reject/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ reason, adminPassword })
    });
  },

  // Update user permissions
  updatePermissions: async (userId, data) => {
    return apiRequest(`/admin/permissions/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },

  // Delete user (soft block with reason); adminPassword required
  deleteUser: async (userId, { reason, adminPassword }) => {
    return apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason, adminPassword })
    });
  },

  // Inactivate user (keep approved, set isActive=false)
  inactivateUser: async (userId, { reason, adminPassword }) => {
    return apiRequest(`/admin/inactivate/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ reason, adminPassword })
    });
  },

  // Unblock user; adminPassword required
  unblockUser: async (userId, adminPassword) => {
    return apiRequest(`/admin/unblock/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ adminPassword })
    });
  },

  // Activate user; adminPassword required
  activateUser: async (userId, adminPassword) => {
    return apiRequest(`/admin/activate/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ adminPassword })
    });
  },

  // Permanently delete user
  permanentlyDeleteUser: async (userId) => {
    return apiRequest(`/admin/users/${userId}/permanent`, { method: 'DELETE' });
  },

  // Create database backup
  createBackup: async (existingDbName = null, displayName = null, recordActions = null) => {
    return apiRequest('/admin/create-backup', { 
      method: 'POST',
      body: JSON.stringify({ existingDbName, displayName, recordActions })
    });
  },

  // Get incremental backup preview
  getIncrementalBackupPreview: async (dbName) => {
    return apiRequest(`/admin/backups/${dbName}/incremental-preview`, { method: 'GET' });
  },

  // Get backup history
  getBackupHistory: async () => {
    return apiRequest('/admin/backups', { method: 'GET' });
  },

  // Get backup preview
  getBackupPreview: async (dbName) => {
    return apiRequest(`/admin/backups/${dbName}/preview`, { method: 'GET' });
  },

  // Restore backup
  restoreBackup: async (backupDbName, adminPassword, recordActions = null) => {
    return apiRequest('/admin/restore-backup', {
      method: 'POST',
      body: JSON.stringify({ backupDbName, adminPassword, recordActions })
    });
  },

  // Delete backup
  deleteBackup: async (backupDbName, adminPassword) => {
    return apiRequest(`/admin/backups/${backupDbName}`, {
      method: 'DELETE',
      body: JSON.stringify({ adminPassword })
    });
  },

  // Verify admin password
  verifyAdminPassword: async (adminPassword) => {
    return apiRequest('/admin/verify-password', {
      method: 'POST',
      body: JSON.stringify({ adminPassword })
    });
  },

  // Get auto backup config
  getAutoBackupConfig: async () => {
    return apiRequest('/admin/auto-backup-config', { method: 'GET' });
  },

  // Update auto backup config
  updateAutoBackupConfig: async (enabled, dbName) => {
    return apiRequest('/admin/auto-backup-config', {
      method: 'PUT',
      body: JSON.stringify({ enabled, dbName })
    });
  }
};

// Discipline API calls
export const disciplineAPI = {
  list: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/disciplines${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  listDeleted: async () => {
    return apiRequest('/disciplines/deleted', { method: 'GET' });
  },
  create: async (data) => {
    return apiRequest('/disciplines', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  update: async (id, data) => {
    return apiRequest(`/disciplines/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  remove: async (id, { reason, adminPassword }) => {
    return apiRequest(`/disciplines/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason, adminPassword })
    });
  },
  recover: async (id, adminPassword) => {
    return apiRequest(`/disciplines/${id}/recover`, {
      method: 'PUT',
      body: JSON.stringify({ adminPassword })
    });
  },
  permanentDelete: async (id, adminPassword) => {
    return apiRequest(`/disciplines/${id}/permanent`, {
      method: 'DELETE',
      body: JSON.stringify({ adminPassword })
    });
  }
};

// Extension Activity API calls
export const extensionActivityAPI = {
  list: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/extension-activities${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  listDeleted: async () => {
    return apiRequest('/extension-activities/deleted', { method: 'GET' });
  },
  get: async (id) => {
    return apiRequest(`/extension-activities/${id}`, { method: 'GET' });
  },
  create: async (data) => {
    return apiRequest('/extension-activities', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  update: async (id, data) => {
    return apiRequest(`/extension-activities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  remove: async (id, { reason, adminPassword }) => {
    return apiRequest(`/extension-activities/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason, adminPassword })
    });
  },
  recover: async (id, adminPassword) => {
    return apiRequest(`/extension-activities/${id}/recover`, {
      method: 'PUT',
      body: JSON.stringify({ adminPassword })
    });
  },
  permanentDelete: async (id, adminPassword) => {
    return apiRequest(`/extension-activities/${id}/permanent`, {
      method: 'DELETE',
      body: JSON.stringify({ adminPassword })
    });
  }
};

// Training API calls
export const trainingAPI = {
  list: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/trainings${query ? `?${query}` : ''}`, { method: 'GET' });
  },
  listDeleted: async () => {
    return apiRequest('/trainings/deleted', { method: 'GET' });
  },
  get: async (id) => {
    return apiRequest(`/trainings/${id}`, { method: 'GET' });
  },
  create: async (data) => {
    return apiRequest('/trainings', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  update: async (id, data) => {
    return apiRequest(`/trainings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  remove: async (id, { reason, adminPassword }) => {
    return apiRequest(`/trainings/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason, adminPassword })
    });
  },
  recover: async (id, adminPassword) => {
    return apiRequest(`/trainings/${id}/recover`, {
      method: 'PUT',
      body: JSON.stringify({ adminPassword })
    });
  },
  permanentDelete: async (id, adminPassword) => {
    return apiRequest(`/trainings/${id}/permanent`, {
      method: 'DELETE',
      body: JSON.stringify({ adminPassword })
    });
  }
};

// Year Lock API calls
export const yearLockAPI = {
  getAll: async () => {
    return apiRequest('/year-lock');
  },
  lock: async (year, password) => {
    return apiRequest(`/year-lock/${year}/lock`, {
      method: 'PUT',
      body: JSON.stringify({ password })
    });
  },
  unlock: async (year, password) => {
    return apiRequest(`/year-lock/${year}/unlock`, {
      method: 'PUT',
      body: JSON.stringify({ password })
    });
  }
};

export default apiRequest;
