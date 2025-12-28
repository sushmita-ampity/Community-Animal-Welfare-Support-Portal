/**
 * Volunteers API
 * Handles volunteer assignments and activities
 */
import volunteersData from '../data/volunteers.json';
import { api } from '../services/api';

const RESOURCE = 'volunteers';

// Initialize volunteers data
if (!localStorage.getItem('volunteers')) {
  localStorage.setItem('volunteers', JSON.stringify(volunteersData));
}

/**
 * Get all volunteers
 * @returns {Promise} Array of volunteers
 */
export const getVolunteers = async () => {
  return await api.get(RESOURCE);
};

/**
 * Get volunteer by user ID
 * @param {number} userId - User ID
 * @returns {Promise} Volunteer object
 */
export const getVolunteerByUserId = async (userId) => {
  const response = await api.query(RESOURCE, volunteer => volunteer.userId === parseInt(userId));
  if (response.data && response.data.length > 0) {
    return { data: response.data[0], status: 200 };
  }
  return { data: null, status: 404 };
};

/**
 * Create volunteer record
 * @param {object} volunteerData - Volunteer data
 * @returns {Promise} Created volunteer object
 */
export const createVolunteer = async (volunteerData) => {
  const newVolunteer = {
    userId: volunteerData.userId,
    assignedTasks: [],
    totalHours: 0,
    specialization: volunteerData.specialization || 'General'
  };

  return await api.post(RESOURCE, newVolunteer);
};

/**
 * Add task to volunteer
 * @param {number} volunteerId - Volunteer ID
 * @param {object} taskData - Task data
 * @returns {Promise} Updated volunteer object
 */
export const addVolunteerTask = async (volunteerId, taskData) => {
  const volunteer = await api.getById(RESOURCE, volunteerId);
  if (!volunteer.data) {
    return { data: null, status: 404, error: 'Volunteer not found' };
  }

  const newTask = {
    id: volunteer.data.assignedTasks.length + 1,
    ...taskData,
    date: taskData.date || new Date().toISOString()
  };

  volunteer.data.assignedTasks.push(newTask);
  return await api.put(RESOURCE, volunteerId, volunteer.data);
};

