import { api } from "./api"

export const getProduct = async () => {
    const response = await api.get("/food");
    return response.data;
}