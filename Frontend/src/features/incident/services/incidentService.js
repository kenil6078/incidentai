/**
 * incidentService.js
 * Routes:  GET /incidents  POST /incidents  GET /incidents/:id
 *          PUT /incidents/:id  DELETE /incidents/:id
 */
import apiClient from '../../../shared/api/apiClient';

const incidentService = {
  getAll: (params = {}) =>
    apiClient.get('/incidents', { params }).then((r) => r.data),

  getById: (id) =>
    apiClient.get(`/incidents/${id}`).then((r) => r.data),

  create: (data) =>
    apiClient.post('/incidents', data).then((r) => r.data),

  update: (id, data) =>
    apiClient.put(`/incidents/${id}`, data).then((r) => r.data),

  remove: (id) =>
    apiClient.delete(`/incidents/${id}`).then((r) => r.data),
};

export default incidentService;
