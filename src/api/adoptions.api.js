/**
 * Adoptions API
 * Handles adoption and fostering requests
 */
import adoptionsData from '../data/adoptions.json';
import { api } from '../services/api';

const RESOURCE = 'adoptions';

// Initialize adoptions data
if (!localStorage.getItem('adoptions')) {
  localStorage.setItem('adoptions', JSON.stringify(adoptionsData));
}

/**
 * Get all adoption requests
 * @param {object} filters - Optional filters (userId, status, etc.)
 * @returns {Promise} Array of adoption requests
 */
export const getAdoptions = async (filters = {}) => {
  const response = await api.get(RESOURCE);
  
  if (filters.userId) {
    response.data = response.data.filter(adoption => adoption.userId === parseInt(filters.userId));
  }
  if (filters.status) {
    response.data = response.data.filter(adoption => adoption.status === filters.status);
  }
  if (filters.animalId) {
    response.data = response.data.filter(adoption => adoption.animalId === parseInt(filters.animalId));
  }
  
  return response;
};

/**
 * Get adoption by ID
 * @param {number} id - Adoption ID
 * @returns {Promise} Adoption object
 */
export const getAdoptionById = async (id) => {
  return await api.getById(RESOURCE, id);
};

/**
 * Submit adoption/foster request
 * @param {object} adoptionData - Adoption request data
 * @returns {Promise} Created adoption request
 */
export const submitAdoptionRequest = async (adoptionData) => {
  const newAdoption = {
    animalId: adoptionData.animalId,
    userId: adoptionData.userId,
    type: adoptionData.type || 'Adoption',
    status: 'Pending',
    submittedAt: new Date().toISOString(),
    approvedAt: null,
    approvedBy: null,
    notes: adoptionData.notes || ''
  };

  return await api.post(RESOURCE, newAdoption);
};

/**
 * Approve or reject adoption request (Admin)
 * @param {number} id - Adoption ID
 * @param {string} status - 'Approved' or 'Rejected'
 * @param {number} approvedBy - Admin user ID
 * @param {string} notes - Optional notes
 * @returns {Promise} Updated adoption request
 */
export const updateAdoptionStatus = async (id, status, approvedBy, notes = '') => {
  const updates = {
    status,
    approvedBy,
    notes
  };

  if (status === 'Approved') {
    updates.approvedAt = new Date().toISOString();
  }

  return await api.put(RESOURCE, id, updates);
};

