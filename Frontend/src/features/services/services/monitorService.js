/**
 * monitorService.js  (frontend name for the backend "service" resource)
 * Routes:  GET /services   POST /services
 */
import apiClient from '../../../shared/api/apiClient';

const monitorService = {
  getAll: () =>
    apiClient.get('/services').then((r) => r.data),

  create: (payload) =>
    apiClient.post('/services', payload).then((r) => r.data),
};

export default monitorService;
