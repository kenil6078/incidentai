import apiClient from '../../../lib/api';

const servicesService = {
  getServices: async () => {
    const response = await apiClient.get('/services');
    return response.data;
  },
  createService: async (payload) => {
    const response = await apiClient.post('/services', payload);
    return response.data;
  },
  updateService: async (id, payload) => {
    const response = await apiClient.patch(`/services/${id}`, payload);
    return response.data;
  },
  deleteService: async (id) => {
    const response = await apiClient.delete(`/services/${id}`);
    return response.data;
  },
};

export default servicesService;
