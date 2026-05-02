import axios from "axios";

const billingApiInstance = axios.create({
    baseURL: "/api/billing",
    withCredentials: true,
})

export async function getInfo() {
    const response = await billingApiInstance.get("/info")
    return response.data
}

export async function createOrder(planId) {
    const response = await billingApiInstance.post("/create-order", { planId })
    return response.data
}

export async function verifyPayment(paymentData) {
    const response = await billingApiInstance.post("/verify-payment", paymentData)
    return response.data
}
