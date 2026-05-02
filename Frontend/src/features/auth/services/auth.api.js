import axios from "axios";

const authApiInstance = axios.create({
    baseURL: "/api/auth",
    withCredentials: true,
})

export async function register(payload) {
    const response = await authApiInstance.post("/register", payload)
    return response.data
}

export async function login({ email, password }) {
    const response = await authApiInstance.post("/login", { email, password })
    return response.data
}

export async function getMe() {
    const response = await authApiInstance.get("/me")
    return response.data
}

export async function resendVerificationEmail({ email }) {
    const response = await authApiInstance.post("/resend-verification", { email })
    return response.data
}

export async function logout() {
    const response = await authApiInstance.post("/logout")
    return response.data
}

export async function verifyEmail(token) {
    const response = await authApiInstance.get(`/verify-email/${token}`)
    return response.data
}

export async function getOrganizations() {
    const response = await authApiInstance.get("/organizations")
    return response.data
}

export async function finalizeProfile(payload) {
    const response = await authApiInstance.post("/finalize-profile", payload)
    return response.data
}

export async function updateProfile(profileData) {
    const response = await authApiInstance.put("/update-profile", profileData)
    return response.data
}
