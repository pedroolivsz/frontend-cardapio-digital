import type { Order } from "../types/Order";
import { api } from "./api";

export const createOrder = async (order: {
    customerName: string,
    customerPhone: string,
    address: string,
    observation: string,
    paymentMethod: string,
    changeFor: string
    items: {
        foodId: number,
        quantity: number
    } [];
}) => {
    return await api.post("/orders", order);
}

export const getOrders = async (): Promise<Order[]> => {
    const response = await api.get<Order[]>("/orders");
    return response.data
}

export const updateOrderStatus = async (id: number, status: string) => {
    await api.patch(`/orders/${id}/status?status=${status}`);
}