import axios from "axios";
import { API_URL } from "../../../utils/config";

const notificationApiInstance = axios.create({
    baseURL: `${API_URL}/api/notifications`,
    withCredentials: true,
})

export async function getAll() {
    const response = await notificationApiInstance.get("/")
    return response.data
}

export async function markAllRead() {
    const response = await notificationApiInstance.post("/read-all")
    return response.data
}
