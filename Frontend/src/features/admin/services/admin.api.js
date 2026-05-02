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
