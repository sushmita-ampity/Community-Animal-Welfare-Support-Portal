/**
 * Events API
 * Handles community events
 */
import eventsData from '../data/events.json';
import { api } from '../services/api';

const RESOURCE = 'events';

// Initialize events data
if (!localStorage.getItem('events')) {
  localStorage.setItem('events', JSON.stringify(eventsData));
}

/**
 * Get all events
 * @param {object} filters - Optional filters (status, etc.)
 * @returns {Promise} Array of events
 */
export const getEvents = async (filters = {}) => {
  const response = await api.get(RESOURCE);
  
  if (filters.status) {
    response.data = response.data.filter(event => event.status === filters.status);
  }
  
  // Sort by date
  response.data.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return response;
};

/**
 * Get event by ID
 * @param {number} id - Event ID
 * @returns {Promise} Event object
 */
export const getEventById = async (id) => {
  return await api.getById(RESOURCE, id);
};

/**
 * Create new event (Admin)
 * @param {object} eventData - Event data
 * @returns {Promise} Created event object
 */
export const createEvent = async (eventData) => {
  const newEvent = {
    title: eventData.title,
    description: eventData.description,
    date: eventData.date,
    location: eventData.location,
    status: eventData.status || 'Upcoming',
    createdBy: eventData.createdBy
  };

  return await api.post(RESOURCE, newEvent);
};

