/**
 * teamService.js
 * Routes:  GET /team   POST /team/invite
 *          PUT /team/:id/role   DELETE /team/:id
 */
import apiClient from '../../../shared/api/apiClient';

const teamService = {
  getTeam: () =>
    apiClient.get('/team').then((r) => r.data),

  invite: (payload) =>
    apiClient.post('/team/invite', payload).then((r) => r.data),

  updateRole: (id, role) =>
    apiClient.put(`/team/${id}/role`, { role }).then((r) => r.data),

  remove: (id) =>
    apiClient.delete(`/team/${id}`).then((r) => r.data),
};

export default teamService;
