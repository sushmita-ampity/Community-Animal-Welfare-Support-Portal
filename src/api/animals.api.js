/**
 * Animals API
 * Handles animal reporting, rescue, and management operations
 */
import animalsData from '../data/animals.json';
import { api } from '../services/api';

const RESOURCE = 'animals';

// Initialize animals data
if (!localStorage.getItem('animals')) {
  localStorage.setItem('animals', JSON.stringify(animalsData));
}

/**
 * Get all animals
 * @param {object} filters - Optional filters (status, type, etc.)
 * @returns {Promise} Array of animals
 */
export const getAnimals = async (filters = {}) => {
  const response = await api.get(RESOURCE);
  
  if (filters.status) {
    response.data = response.data.filter(animal => animal.status === filters.status);
  }
  if (filters.type) {
    response.data = response.data.filter(animal => animal.type === filters.type);
  }
  if (filters.reportedBy) {
    response.data = response.data.filter(animal => animal.reportedBy === parseInt(filters.reportedBy));
  }
  
  return response;
};

/**
 * Get animal by ID
 * @param {number} id - Animal ID
 * @returns {Promise} Animal object
 */
export const getAnimalById = async (id) => {
  return await api.getById(RESOURCE, id);
};

/**
 * Report a new animal in distress
 * @param {object} animalData - Animal report data
 * @returns {Promise} Created animal object
 */
export const reportAnimal = async (animalData) => {
  const newAnimal = {
    type: animalData.type,
    name: animalData.name || 'Unknown',
    breed: animalData.breed || 'Unknown',
    age: animalData.age || 0,
    condition: animalData.condition,
    severity: animalData.severity,
    description: animalData.description,
    location: animalData.location,
    status: 'Reported',
    reportedBy: animalData.reportedBy,
    reportedAt: new Date().toISOString(),
    assignedVolunteer: null,
    healthRecords: [],
    image: animalData.image || '/api/placeholder/400/300'
  };

  return await api.post(RESOURCE, newAnimal);
};

/**
 * Update animal status (Admin/Volunteer)
 * @param {number} id - Animal ID
 * @param {object} updates - Updated animal data
 * @returns {Promise} Updated animal object
 */
export const updateAnimal = async (id, updates) => {
  return await api.put(RESOURCE, id, updates);
};

/**
 * Assign volunteer to animal
 * @param {number} animalId - Animal ID
 * @param {number} volunteerId - Volunteer user ID
 * @returns {Promise} Updated animal object
 */
export const assignVolunteer = async (animalId, volunteerId) => {
  const animal = await getAnimalById(animalId);
  if (!animal.data) {
    return { data: null, status: 404, error: 'Animal not found' };
  }

  return await updateAnimal(animalId, {
    assignedVolunteer: volunteerId,
    status: 'Assigned'
  });
};

/**
 * Get animals available for adoption
 * @returns {Promise} Array of available animals
 */
export const getAvailableAnimals = async () => {
  return await getAnimals({ status: 'Available for Adoption' });
};

