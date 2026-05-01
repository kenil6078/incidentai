import apiClient from '../../../lib/api';

const timelineService = {
  getByIncident: (incidentId) =>
    apiClient.get(`/timeline/${incidentId}`).then((r) => r.data),

  addEvent: (incidentId, eventData) =>
    apiClient.post(`/timeline/${incidentId}`, eventData).then((r) => r.data),
};

export default timelineService;
