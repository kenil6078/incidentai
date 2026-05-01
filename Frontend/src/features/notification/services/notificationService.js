/**
 * notificationService.js
 * Routes:  GET /notifications    POST /notifications/read-all
 */
import apiClient from '../../../shared/api/apiClient';

const notificationService = {
  getAll: () =>
    apiClient.get('/notifications').then((r) => r.data),

  readAll: () =>
    apiClient.post('/notifications/read-all').then((r) => r.data),
};

export default notificationService;
