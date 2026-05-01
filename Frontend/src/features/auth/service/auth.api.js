import apiClient from '../../../lib/api';

export async function register(payload) {
    const response = await apiClient.post("/auth/register", payload);
    return response.data;
}

export async function login({ email, password }) {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
}

export async function getMe() {
    const response = await apiClient.get("/auth/me");
    return response.data;
}

export async function resendVerificationEmail({ email }) {
    const response = await apiClient.post("/auth/resend-verification", { email });
    return response.data;
}

export async function logout() {
    const response = await apiClient.post("/auth/logout");
    return response.data;
}

export async function verifyEmail(token) {
    const response = await apiClient.get(`/auth/verify-email/${token}`);
    return response.data;
}
