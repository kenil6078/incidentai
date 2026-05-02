import axios from "axios";

const aiApiInstance = axios.create({
    baseURL: "/api/ai",
    withCredentials: true,
})

export async function getSummary(incidentId) {
    const response = await aiApiInstance.post("/summary", { incidentId })
    return response.data
}

export async function getRootCause(incidentId) {
    const response = await aiApiInstance.post("/root-cause", { incidentId })
    return response.data
}

export async function getPostmortem(incidentId) {
    const response = await aiApiInstance.post("/postmortem", { incidentId })
    return response.data
}
