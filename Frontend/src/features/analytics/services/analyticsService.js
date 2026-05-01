import apiClient from '../../../lib/api';

const analyticsService = {
  getOverview: async () => {
    const response = await apiClient.get('/analytics/overview');
    return response.data;
  },
  getIncidentTrends: async () => {
    const response = await apiClient.get('/analytics/incidents');
    return response.data;
  },
};

export default analyticsService;
