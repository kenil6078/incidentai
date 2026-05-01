
export const teamApi = {
  getTeam: async () => {
    const response = await api.get("/team");
    return response.data;
  },
  inviteMember: async (payload) => {
    const response = await api.post("/team/invite", payload);
    return response.data;
  },
  updateRole: async (id, role) => {
    const response = await api.patch(`/team/${id}/role`, { role });
    return response.data;
  },
  removeMember: async (id) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  },
};
