import { api } from "./api"
import type { Category } from "../types/Category";

export const getCategory = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories")
    return response.data;
}