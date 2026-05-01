/**
 * timelineService.js
 * Routes:  GET /timeline/:incidentId   POST /timeline/:incidentId
 */
import apiClient from '../../../shared/api/apiClient';

const timelineService = {
  getByIncident: (incidentId) =>
    apiClient.get(`/timeline/${incidentId}`).then((r) => r.data),

  addEntry: (incidentId, payload) =>
    apiClient.post(`/timeline/${incidentId}`, payload).then((r) => r.data),
};

export default timelineService;
