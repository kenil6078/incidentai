
const aiService = {
  getSummary: (incidentId) =>
    apiClient.post('/ai/summary', { incidentId }).then((r) => r.data),

  getRootCause: (incidentId) =>
    apiClient.post('/ai/root-cause', { incidentId }).then((r) => r.data),

  getPostmortem: (incidentId) =>
    apiClient.post('/ai/postmortem', { incidentId }).then((r) => r.data),
};

export default aiService;
