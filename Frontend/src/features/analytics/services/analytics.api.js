import axios from "axios";
import { API_URL } from "../../../utils/config";

const analyticsApiInstance = axios.create({
    baseURL: `${API_URL}/api/analytics`,
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

export async function getSummary() {
    const response = await analyticsApiInstance.get("/summary")
    return response.data
}
