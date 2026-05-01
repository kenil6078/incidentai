
export const incidentApi = {
  getIncidents: async () => {
    const response = await api.get("/incidents");
    return response.data;
  },
  getIncident: async (id) => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },
  createIncident: async (payload) => {
    const response = await api.post("/incidents", payload);
    return response.data;
  },
  updateIncident: async (id, payload) => {
    const response = await api.patch(`/incidents/${id}`, payload);
    return response.data;
  },
};
