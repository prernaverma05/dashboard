import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  getACVRanges: async () => {
    const response = await axios.get(`${API_BASE_URL}/acv-range`);
    return response.data;
  },

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