import axios from "axios";

const teamApiInstance = axios.create({
    baseURL: "/api/team",
    withCredentials: true,
})

export async function getTeam() {
    const response = await teamApiInstance.get("/")
    return response.data
}

export async function inviteMember(payload) {
    const response = await teamApiInstance.post("/invite", payload)
    return response.data
}

export async function updateRole(id, role) {
    const response = await teamApiInstance.patch(`/${id}/role`, { role })
    return response.data
}

export async function removeMember(id) {
    const response = await teamApiInstance.delete(`/${id}`)
    return response.data
}
