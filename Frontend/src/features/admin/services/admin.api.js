import axios from "axios";

const adminApiInstance = axios.create({
    baseURL: "/api/admin",
    withCredentials: true,
})

export async function getOrganizations() {
    const response = await adminApiInstance.get("/organizations")
    return response.data
}

export async function getUsers() {
    const response = await adminApiInstance.get("/users")
    return response.data
}

export async function getOrgUsers(orgId) {
    const response = await adminApiInstance.get(`/organizations/${orgId}/users`)
    return response.data
}

export async function updateUser(userId, userData) {
    const response = await adminApiInstance.put(`/users/${userId}`, userData)
    return response.data
}

export async function toggleUserStatus(userId) {
    const response = await adminApiInstance.patch(`/users/${userId}/toggle-status`)
    return response.data
}

export async function updateOrgPlan(orgId, plan) {
    const response = await adminApiInstance.put(`/organizations/${orgId}/plan`, { plan })
    return response.data
}

export async function deleteUser(userId) {
    const response = await adminApiInstance.delete(`/users/${userId}`)
    return response.data
}

export async function deleteOrg(orgId) {
    const response = await adminApiInstance.delete(`/organizations/${orgId}`)
    return response.data
}
