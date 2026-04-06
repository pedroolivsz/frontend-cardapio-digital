export type OrderItem = {
    id: number
    foodName: string,
    quantity: number,
    price: string
}

export type Order = {
    id: number,
    customerName: string,
    customerPhone: string,
    address: string,
    observation?: string,
    paymentMethod: string,
    changeFor: string,
    status: string,
    total: string
    items: OrderItem[]
}