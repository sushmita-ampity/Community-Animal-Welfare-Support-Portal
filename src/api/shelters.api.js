/**
 * Shelters API
 * Handles shelter capacity and resource management
 */
import sheltersData from '../data/shelters.json';
import { api } from '../services/api';

const RESOURCE = 'shelters';

// Initialize shelters data
if (!localStorage.getItem('shelters')) {
  localStorage.setItem('shelters', JSON.stringify(sheltersData));
}

/**
 * Get all shelters
 * @returns {Promise} Array of shelters
 */
export const getShelters = async () => {
  return await api.get(RESOURCE);
};

/**
 * Get shelter by ID
 * @param {number} id - Shelter ID
 * @returns {Promise} Shelter object
 */
export const getShelterById = async (id) => {
  return await api.getById(RESOURCE, id);
};

/**
 * Update shelter capacity and resources
 * @param {number} id - Shelter ID
 * @param {object} updates - Updated shelter data
 * @returns {Promise} Updated shelter object
 */
export const updateShelter = async (id, updates) => {
  return await api.put(RESOURCE, id, updates);
};

