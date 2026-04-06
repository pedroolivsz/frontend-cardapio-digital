import { api } from "./api"
import type { Product } from "../types/Product"
import type { Category } from "../types/Category"

export const getProducts = async (): Promise<Product[]> => {
    const [productsRes, categoriesRes] = await Promise.all([
        api.get<Product[]>("/food"),
        api.get<Category[]>("/categories")
    ])

    const products = productsRes.data
    const categories = categoriesRes.data

    return products.map((p) => {
        const category = categories.find(c => c.id === p.categoryId)

        return {
            id: p.id,
            title: p.title,
            description: p.description,
            categoryId: p.categoryId,
            category: category ? category.name : "Sem categoria",
            image: p.image,
            price: p.price,
            stock: p.stock
        }
    })
}

export const createProduct = async (product: {
    title: string
    description: string
    categoryId: number
    image: string
    price: string
    stock: number
}) => {
    return await api.post("/food", product)
}
export const updateProduct = async (
    id: number,
    product: {
    title: string
    description: string
    categoryId: number
    image: string
    price: string
    stock: number
}) => {
    return await api.put(`/food/${id}`, product)
}

export const deleteProduct = async (id: number) => {
    return await api.delete(`/food/${id}`);
}