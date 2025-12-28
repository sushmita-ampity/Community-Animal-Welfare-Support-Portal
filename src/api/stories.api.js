/**
 * Success Stories API
 * Handles community success stories
 */
import storiesData from '../data/stories.json';
import { api } from '../services/api';

const RESOURCE = 'stories';

// Initialize stories data
if (!localStorage.getItem('stories')) {
  localStorage.setItem('stories', JSON.stringify(storiesData));
}

/**
 * Get all success stories
 * @returns {Promise} Array of stories
 */
export const getStories = async () => {
  const response = await api.get(RESOURCE);
  // Sort by date (newest first)
  response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
  return response;
};

/**
 * Get story by ID
 * @param {number} id - Story ID
 * @returns {Promise} Story object
 */
export const getStoryById = async (id) => {
  return await api.getById(RESOURCE, id);
};

/**
 * Create new story (Admin)
 * @param {object} storyData - Story data
 * @returns {Promise} Created story object
 */
export const createStory = async (storyData) => {
  const newStory = {
    title: storyData.title,
    description: storyData.description,
    content: storyData.content,
    image: storyData.image || '/api/placeholder/600/400',
    date: new Date().toISOString(),
    author: storyData.author
  };

  return await api.post(RESOURCE, newStory);
};

