import apiClient from '../../../lib/api';

const notificationService = {
  getAll: () =>
    apiClient.get('/notifications').then((r) => r.data),

  markAllRead: () =>
    apiClient.post('/notifications/read-all').then((r) => r.data),
};

export default notificationService;
