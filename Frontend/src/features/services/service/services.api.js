
export const servicesApi = {
  getServices: async () => {
    const response = await api.get("/services");
    return response.data;
  },
  createService: async (payload) => {
    const response = await api.post("/services", payload);
    return response.data;
  },
  updateService: async (id, payload) => {
    const response = await api.patch(`/services/${id}`, payload);
    return response.data;
  },
  deleteService: async (id) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};
