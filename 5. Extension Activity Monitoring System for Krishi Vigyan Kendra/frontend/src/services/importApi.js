// src/services/importApi.js

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const importAPI = {
  bulkDataEntry: async (records) => {
    const token = sessionStorage.getItem('kvkAuthToken');
    const response = await fetch(`${API_URL}/api/import/bulk-data-entry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: JSON.stringify({ records }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to import data');
    }

    return response.json();
  }
};
