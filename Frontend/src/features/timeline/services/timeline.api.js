import axios from "axios";

const timelineApiInstance = axios.create({
    baseURL: "/api/timeline",
    withCredentials: true,
})

export async function getByIncident(incidentId) {
    const response = await timelineApiInstance.get(`/${incidentId}`)
    return response.data
}

export async function addEntry(incidentId, eventData) {
    const response = await timelineApiInstance.post(`/${incidentId}`, eventData)
    return response.data
}
