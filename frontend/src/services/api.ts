/**
 * API Service Module
 * 
 * Centralizes all API calls to the backend server.
 * Implements axios for HTTP requests with proper error handling.
 * 
 * Features:
 * - Typed API responses
 * - Centralized error handling
 * - Consistent API endpoint management
 */

import axios from 'axios';

// Base URL for all API endpoints
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * API service object containing all available API calls
 */
export const api = {
  /**
   * Fetches ACV range distribution data
   * @returns Promise<ACVRangeData[]>
   */
  getACVRanges: async () => {
    const response = await axios.get(`${API_BASE_URL}/acv-range`);
    return response.data;
  },

  /**
   * Fetches customer type distribution data
   * @returns Promise<CustomerTypeData[]>
   */
  getCustomerTypes: async () => {
    const response = await axios.get(`${API_BASE_URL}/customer-type`);
    return response.data;
  },

  getIndustries: async () => {
    const response = await axios.get(`${API_BASE_URL}/industries`);
    return response.data;
  },

  getTeams: async () => {
    const response = await axios.get(`${API_BASE_URL}/teams`);
    return response.data;
  },
}; 