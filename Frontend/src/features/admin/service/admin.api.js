
export const adminApi = {
  getOrganizations: async () => {
    const response = await api.get("/admin/organizations");
    return response.data;
  },
  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },
  getOrgUsers: async (orgId) => {
    const response = await api.get(`/admin/organizations/${orgId}/users`);
    return response.data;
  },
};
