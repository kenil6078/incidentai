import axios from "axios";

const chatApiInstance = axios.create({
    baseURL: "/api/chats",
    withCredentials: true,
})

export async function fetchChats() {
    const response = await chatApiInstance.get("/")
    return response.data
}

export async function fetchMessages(chatId, before) {
    const response = await chatApiInstance.get(`/${chatId}/messages`, {
        params: { before, limit: 20 }
    })
    return response.data
}

export async function createChat(data) {
    const response = await chatApiInstance.post("/", data)
    return response.data
}

export async function fetchUsers() {
    const response = await chatApiInstance.get("/users")
    return response.data
}
