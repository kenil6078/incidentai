import axios from "axios";
import { API_URL } from "../../../utils/config";

const servicesApiInstance = axios.create({
    baseURL: `${API_URL}/api/services`,
    withCredentials: true,
})

export async function getServices() {
    const response = await servicesApiInstance.get("/")
    return response.data
}

export async function createService(payload) {
    const response = await servicesApiInstance.post("/", payload)
    return response.data
}

export async function updateService(id, payload) {
    const response = await servicesApiInstance.patch(`/${id}`, payload)
    return response.data
}

export async function deleteService(id) {
    const response = await servicesApiInstance.delete(`/${id}`)
    return response.data
}
