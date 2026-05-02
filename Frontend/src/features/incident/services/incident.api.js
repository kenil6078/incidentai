import axios from "axios";

const incidentApiInstance = axios.create({
    baseURL: "/api/incidents",
    withCredentials: true,
})

export async function getIncidents(params) {
    const response = await incidentApiInstance.get("/", { params })
    return response.data
}

export async function getIncident(id) {
    const response = await incidentApiInstance.get(`/${id}`)
    return response.data
}

export async function createIncident(payload) {
    const response = await incidentApiInstance.post("/", payload)
    return response.data
}

export async function updateIncident(id, payload) {
    const response = await incidentApiInstance.patch(`/${id}`, payload)
    return response.data
}

export async function deleteIncident(id) {
    const response = await incidentApiInstance.delete(`/${id}`)
    return response.data
}
