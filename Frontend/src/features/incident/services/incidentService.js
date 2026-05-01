import apiClient from '../../../lib/api';

const incidentService = {
  getIncidents: async (params) => {
    const response = await apiClient.get('/incidents', { params });
    return response.data;
  },
  getIncident: async (id) => {
    const response = await apiClient.get(`/incidents/${id}`);
    return response.data;
  },
  createIncident: async (payload) => {
    const response = await apiClient.post('/incidents', payload);
    return response.data;
  },
  updateIncident: async (id, payload) => {
    const response = await apiClient.patch(`/incidents/${id}`, payload);
    return response.data;
  },
  deleteIncident: async (id) => {
    const response = await apiClient.delete(`/incidents/${id}`);
    return response.data;
  },
};

export default incidentService;
