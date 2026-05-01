
const billingService = {
  getInfo: () =>
    apiClient.get('/billing/info').then((r) => r.data),

  createOrder: (planId) =>
    apiClient.post('/billing/create-order', { planId }).then((r) => r.data),

  verifyPayment: (paymentData) =>
    apiClient.post('/billing/verify-payment', paymentData).then((r) => r.data),
};

export default billingService;
