/**
 * billingService.js
 * Routes:  GET /billing/info
 *          POST /billing/create-order
 *          POST /billing/verify-payment
 */
import apiClient from '../../../shared/api/apiClient';

const billingService = {
  getInfo: () =>
    apiClient.get('/billing/info').then((r) => r.data),

  createOrder: (payload) =>
    apiClient.post('/billing/create-order', payload).then((r) => r.data),

  verifyPayment: (payload) =>
    apiClient.post('/billing/verify-payment', payload).then((r) => r.data),
};

export default billingService;
