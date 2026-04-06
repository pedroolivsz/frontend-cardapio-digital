import { useEffect, useState } from "react";
import { getOrders } from "../services/OrderService";
import { getProducts } from "../services/ProductService";

import styles from "./AdminDashboardPage.module.css"
import type { Order } from "../types/Order";
import type { Product } from "../types/Product";

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fatch = async () => {
            const ordersData = await getOrders();
            const productsData = await getProducts();

            setOrders(ordersData);
            setProducts(productsData);
        };

        fatch();
        
    }, []);

    const totalOrders = orders.length;

    const revenue = orders
    .filter(o => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.total), 0);

    const pendingOrders = orders.filter(o =>
        o.status === "RECEIVED" || o.status === "PREPARING"
    ).length;

    const deliveredOrders = orders.filter(o =>
        o.status === "DELIVERED"
    ).length;

    const outOfStock = products.filter(p => p.stock === 0);

    return (
        <div className={styles.container}>
            <h1>Dashboard</h1>

            <div className={styles.kpis}>
                <div className={styles.card}>
                    <h3>Faturamento</h3>
                    <p>R$ ${revenue.toFixed(2)}</p>
                </div>

                <div className={styles.card}>
                    <h3>Pedidos</h3>
                    <p>{totalOrders}</p>
                </div>

                <div className={styles.card}>
                    <h3>Pendentes</h3>
                    <p>{pendingOrders}</p>
                </div>

                <div className={styles.card}>
                    <h3>Entregues</h3>
                    <p>{deliveredOrders}</p>
                </div>
            </div>

            <div className={styles.section}>
                <h2>Últimos pedidos</h2>
                {orders.slice(0, 5).map(order => (
                    <div key={order.id} className={styles.orderItem}>
                        #{order.id} - {order.customerName} - R$ {Number(order.total).toFixed(2)}
                    </div>
                ))}
            </div>

            <div className={styles.section}>
                <h2>Atenção!</h2>

                {outOfStock.length === 0
                ? (<p>Sem problemas no momento</p>)
                : (outOfStock.map(p => (
                    <div key={p.id} className={styles.alert}>
                        {p.title} sem estoque
                    </div>
                ))
            )}
            </div>
        </div>
    );
}