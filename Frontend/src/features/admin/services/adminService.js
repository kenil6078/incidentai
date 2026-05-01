import apiClient from '../../../lib/api';

const adminService = {
  getOrganizations: async () => {
    const response = await apiClient.get('/admin/organizations');
    return response.data;
  },
  getUsers: async () => {
    const response = await apiClient.get('/admin/users');
    return response.data;
  },
  getOrgUsers: async (orgId) => {
    const response = await apiClient.get(`/admin/organizations/${orgId}/users`);
    return response.data;
  },
};

export default adminService;
