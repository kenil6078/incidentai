import axios from "axios";

const analyticsApiInstance = axios.create({
    baseURL: "/api/analytics",
    withCredentials: true,
})

export async function getOverview() {
    const response = await analyticsApiInstance.get("/overview")
    return response.data
}

export async function getIncidentTrends() {
    const response = await analyticsApiInstance.get("/incidents")
    return response.data
}
