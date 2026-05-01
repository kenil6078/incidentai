import apiClient from '../../../shared/api/apiClient';

const incidentService = {
  getIncidents: async () => {
    const response = await apiClient.get('/incidents');
    return response.data;
  },

  createIncident: async (incidentData) => {
    const response = await apiClient.post('/incidents', incidentData);
    return response.data;
  },

  getIncidentById: async (id) => {
    const response = await apiClient.get(`/incidents/${id}`);
    return response.data;
  },

  updateIncident: async (id, incidentData) => {
    const response = await apiClient.put(`/incidents/${id}`, incidentData);
    return response.data;
  },

  deleteIncident: async (id) => {
    const response = await apiClient.delete(`/incidents/${id}`);
    return response.data;
  },
};

export default incidentService;
