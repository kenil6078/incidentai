/**
 * authService.js
 * All HTTP calls for the auth feature.
 * Routes: POST /auth/login  POST /auth/register  GET /auth/me  POST /auth/logout
 */
import apiClient from '../../../shared/api/apiClient';

const authService = {
  login: (credentials) =>
    apiClient.post('/auth/login', credentials).then((r) => r.data),

  register: (userData) =>
    apiClient.post('/auth/register', userData).then((r) => r.data),

  getMe: () =>
    apiClient.get('/auth/me').then((r) => r.data),

  logout: () =>
    apiClient.post('/auth/logout').then((r) => r.data),
};

export default authService;
