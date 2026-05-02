import axios from "axios";

const notificationApiInstance = axios.create({
    baseURL: "/api/notifications",
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
