import axios from "axios";

const billingApiInstance = axios.create({
    baseURL: "/api/billing",
    withCredentials: true,
})

export async function getInfo() {
    const response = await billingApiInstance.get("/info")
    return response.data
}

export async function createOrder(payload) {
    const response = await billingApiInstance.post("/create-order", payload)
    return response.data
}

export async function verifyPayment(paymentData) {
    const response = await billingApiInstance.post("/verify-payment", paymentData)
    return response.data
}

export async function getTransactions() {
    const response = await billingApiInstance.get("/transactions")
    return response.data
}
