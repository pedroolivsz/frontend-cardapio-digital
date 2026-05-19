import { api } from "./api"
import type { Category } from "../types/category";

export const getCategory = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>("/categories")
    return response.data;
}

export const createCategory = async (name: string): Promise<Category> => {
    const response = await api.post<Category>("/categories", {name});
    return response.data;
}