import apiClient from '../../../shared/api/apiClient';

const analyticsService = {
  getStats: async () => {
    const response = await apiClient.get('/analytics/stats');
    return response.data;
  },
  getIncidentTrends: async () => {
    const response = await apiClient.get('/analytics/trends');
    return response.data;
  }
};

export default analyticsService;
