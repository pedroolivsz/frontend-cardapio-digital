import { useEffect, useState } from "react";
import { getOrders } from "../services/OrderService";
import { getProducts } from "../services/ProductService";

import styles from "./AdminDashboardPage.module.css"
import type { Order } from "../types/Order";
import type { Product } from "../types/Product";
import { useNavigate } from "react-router-dom";

const STATUS_LABEL: Record<string, string> = {
    RECEIVED: "Recebido",
    PREPARING: "Preparando",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado"
};

const STATUS_BADGE: Record<string, string> = {
    RECEIVED: "badgeReceived",
    PREPARING: "badgePreparing",
    DELIVERED: "badgeDelivered",
    CANCELLED: "badgeCancelled"
};

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const navigate = useNavigate();

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
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + Number(o.total), 0);

    const pendingOrders = orders.filter((o) =>
        o.status === "RECEIVED" || o.status === "PREPARING"
    ).length;

    const deliveredOrders = orders.filter((o) =>
        o.status === "DELIVERED"
    ).length;

    const outOfStock = products.filter((p) => p.stock === 0);

    const today = new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    return (
        <div className={styles.container}>
            <nav className={styles.nav}>
                <button
                    className={`${styles.navBtn} ${styles.navBtnActive}`}
                    onClick={() => navigate("/admin/dashboard")}
                >
                    Dashboard
                </button>

                <button
                    className={styles.navBtn}
                    onClick={() => navigate("/admin")}
                >
                    Produtos
                </button>

                <button
                    className={styles.navBtn}
                    onClick={() => navigate("/admin/orders")}
                >
                    Pedidos
                </button>
            </nav>

            <div className={styles.header}>
                <h1>Dashboard</h1>
                <span className={styles.date}>{today}</span>
            </div>

            <div className={styles.kpis}>
                <div className={`${styles.kcard} ${styles.kcardGreen}`}>
                    <h3 className={styles.kcardLabel}>Faturamento</h3>
                    <p className={styles.kcardValue}>
                        R$ {revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <p className={styles.kcardSub}>Pedidos concluídos</p>
                </div>

                <div className={`${styles.kcard} ${styles.kcardBlue}`}>
                    <h3 className={styles.kcardLabel}>Pedidos</h3>
                    <p className={styles.kcardValue}>{totalOrders}</p>
                    <p className={styles.kcardSub}>Todos os status</p>
                </div>

                <div className={`${styles.kcard} ${styles.kcardAmber}`}>
                    <h3 className={styles.kcardLabel}>Pendentes</h3>
                    <p className={styles.kcardValue}>{pendingOrders}</p>
                    <p className={styles.kcardSub}>Recebidos + em preparo</p>
                </div>

                <div className={`${styles.kcard} ${styles.kcardTeal}`}>
                    <h3 className={styles.kcardLabel}>Entregues</h3>
                    <p className={styles.kcardValue}>{deliveredOrders}</p>
                    <p className={styles.kcardSub}>Finalizados com sucesso</p>
                </div>
            </div>

            <div className={styles.grid2}>
                <div className={styles.panel}>
                    <h2>Últimos pedidos</h2>
                    {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className={styles.orderRow}>
                        <span className={styles.orderId}>#{order.id}</span>
                        <span className={styles.orderName}>{order.customerName}</span>
                        <span className={`${styles.badge} ${
                            styles[STATUS_BADGE[order.status] ?? "badgeReceived"]
                        }`}>
                            {STATUS_LABEL[order.status] ?? order.status}
                        </span>
                        <span className={styles.orderTotal}>
                            R${" "}
                            {Number(order.total).toLocaleString("pt-BR", {
                                minimumFractionDigits: 2
                            })}
                        </span>
                    </div>
                    ))}
                </div>
                
                <div className={styles.panel}>
                    <h2>Alertas de estoque</h2>
                    {outOfStock.length === 0
                    ? (
                    <div className={styles.okState}>
                        <span className={styles.okDot}>
                            Sem problemas no momento
                        </span>
                    </div>)
                    : (
                        outOfStock.map((p) => (
                        <div key={p.id} className={styles.alertItem}>
                            <span className={styles.alertDot} />
                            <span className={styles.alertTex}>{p.title}</span>
                            <span className={styles.alertTag}>Sem estoque</span>
                        </div>
                    ))
                    )}
                </div>
            </div>
        </div>
    );
}