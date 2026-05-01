import apiClient from '../../../lib/api';

const teamService = {
  getTeam: async () => {
    const response = await apiClient.get('/team');
    return response.data;
  },
  inviteMember: async (payload) => {
    const response = await apiClient.post('/team/invite', payload);
    return response.data;
  },
  updateRole: async (id, role) => {
    const response = await apiClient.patch(`/team/${id}/role`, { role });
    return response.data;
  },
  removeMember: async (id) => {
    const response = await apiClient.delete(`/team/${id}`);
    return response.data;
  },
};

export default teamService;
