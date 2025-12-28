/**
 * Campaigns API
 * Handles awareness campaigns
 */
import campaignsData from '../data/campaigns.json';
import { api } from '../services/api';

const RESOURCE = 'campaigns';

// Initialize campaigns data
if (!localStorage.getItem('campaigns')) {
  localStorage.setItem('campaigns', JSON.stringify(campaignsData));
}

/**
 * Get all campaigns
 * @param {object} filters - Optional filters (status, etc.)
 * @returns {Promise} Array of campaigns
 */
export const getCampaigns = async (filters = {}) => {
  const response = await api.get(RESOURCE);
  
  if (filters.status) {
    response.data = response.data.filter(campaign => campaign.status === filters.status);
  }
  
  return response;
};

/**
 * Get campaign by ID
 * @param {number} id - Campaign ID
 * @returns {Promise} Campaign object
 */
export const getCampaignById = async (id) => {
  return await api.getById(RESOURCE, id);
};

/**
 * Create new campaign (Admin)
 * @param {object} campaignData - Campaign data
 * @returns {Promise} Created campaign object
 */
export const createCampaign = async (campaignData) => {
  const newCampaign = {
    title: campaignData.title,
    description: campaignData.description,
    startDate: campaignData.startDate || new Date().toISOString(),
    endDate: campaignData.endDate,
    status: campaignData.status || 'Active',
    createdBy: campaignData.createdBy,
    image: campaignData.image || '/api/placeholder/800/400'
  };

  return await api.post(RESOURCE, newCampaign);
};

