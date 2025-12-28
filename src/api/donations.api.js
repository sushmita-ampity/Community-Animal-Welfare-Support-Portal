/**
 * Donations API
 * Handles monetary and in-kind donations
 */
import donationsData from '../data/donations.json';
import { api } from '../services/api';

const RESOURCE = 'donations';

// Initialize donations data
if (!localStorage.getItem('donations')) {
  localStorage.setItem('donations', JSON.stringify(donationsData));
}

/**
 * Get all donations
 * @param {object} filters - Optional filters (userId, type, etc.)
 * @returns {Promise} Array of donations
 */
export const getDonations = async (filters = {}) => {
  const response = await api.get(RESOURCE);
  
  if (filters.userId) {
    response.data = response.data.filter(donation => donation.userId === parseInt(filters.userId));
  }
  if (filters.type) {
    response.data = response.data.filter(donation => donation.type === filters.type);
  }
  
  return response;
};

/**
 * Get donation by ID
 * @param {number} id - Donation ID
 * @returns {Promise} Donation object
 */
export const getDonationById = async (id) => {
  return await api.getById(RESOURCE, id);
};

/**
 * Create a new donation
 * @param {object} donationData - Donation data
 * @returns {Promise} Created donation object
 */
export const createDonation = async (donationData) => {
  const newDonation = {
    userId: donationData.userId,
    type: donationData.type,
    amount: donationData.amount || 0,
    description: donationData.description,
    date: new Date().toISOString(),
    purpose: donationData.purpose || 'General',
    status: 'Received'
  };

  return await api.post(RESOURCE, newDonation);
};

/**
 * Get donation statistics (Admin)
 * @returns {Promise} Statistics object
 */
export const getDonationStats = async () => {
  const response = await api.get(RESOURCE);
  const donations = response.data || [];
  
  const totalMonetary = donations
    .filter(d => d.type === 'Monetary')
    .reduce((sum, d) => sum + (d.amount || 0), 0);
  
  const totalInKind = donations.filter(d => d.type === 'In-Kind').length;
  
  const monthlyStats = donations.reduce((acc, donation) => {
    const month = new Date(donation.date).toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { monetary: 0, count: 0 };
    }
    if (donation.type === 'Monetary') {
      acc[month].monetary += donation.amount || 0;
    }
    acc[month].count += 1;
    return acc;
  }, {});

  return {
    data: {
      totalMonetary,
      totalInKind,
      totalCount: donations.length,
      monthlyStats
    },
    status: 200
  };
};

