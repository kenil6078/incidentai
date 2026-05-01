/**
 * analyticsService.js
 * Routes:  GET /analytics/overview   GET /analytics/summary
 */
import apiClient from '../../../shared/api/apiClient';

const analyticsService = {
  getOverview: () =>
    apiClient.get('/analytics/overview').then((r) => r.data),

  getSummary: () =>
    apiClient.get('/analytics/summary').then((r) => r.data),
};

export default analyticsService;
