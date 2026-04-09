import { useEffect, useState } from "react";
import type { Order } from "../types/Order";
import { getOrders, updateOrderStatus } from "../services/OrderService";
import { useNavigate } from "react-router-dom";
import styles from "./AdminOrdersPage.module.css"

import { Client } from "@stomp/stompjs"

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [newOrders, setNewOrders] = useState<Set<number>>(new Set());
    const navigate = useNavigate();

    const playSound = () => {
        try {
            const audio = new Audio("/sounds/new-order.mp3");
            audio.volume = 0.5;
            const playPromise = audio.play();
            if(playPromise) {
                playPromise.catch(() => {});
            }
        } catch (error) {
            console.error("Falha geral no áudio: ", error)
        }
    }

    useEffect(() => {
        const fetch = async () => {
            const data = await getOrders();
            setOrders(data);
        };

        fetch();
    }, []);

    useEffect(() => {

    const client = new Client({
        brokerURL: "ws://localhost:8080/ws",
        reconnectDelay: 5000
    });

    client.onConnect = () => {
        client.subscribe("/topic/orders", (message) => {
            const newOrder = JSON.parse(message.body);

            setOrders(prev => {
                if(prev.some(o => o.id === newOrder.id)) return prev;

                setNewOrders(prevSet => {
                    const updated = new Set(prevSet);
                    updated.add(newOrder.id);
                    return updated;
                });

                playSound();

                setTimeout(() => {
                    setNewOrders(prevSet => {
                        const updated = new Set(prevSet);
                        updated.delete(newOrder.id);
                        return updated;
                    });
                }, 5000);

                return [newOrder, ...prev];
            });
        });

        client.subscribe("/topic/orders/update", (message) => {
            const updatedOrder = JSON.parse(message.body);

            setOrders(prev =>
                prev.map(o =>
                    o.id === updatedOrder.id ? updatedOrder : o
                )
            );
        });
    };

    client.activate();

    return () => {
        client.deactivate();
    };
}, []);

    const handleStatusChange = async (id: number, status: string) => {
        try {
            await updateOrderStatus(id, status);

        } catch (error) {
            console.log(error);
            alert("Erro ao alterar o status do pedido");
        }
    }

    const groupedOrders = {
        RECEIVED: orders.filter(o => o.status === "RECEIVED"),
        PREPARING: orders.filter(o => o.status === "PREPARING"),
        READY: orders.filter(o => o.status === "READY"),
        DELIVERED: orders.filter(o => o.status === "DELIVERED"),
        CANCELLED: orders.filter(o => o.status === "CANCELLED"),
    };

    const getStatusClass = (status: string) => {
        switch(status) {
            case "RECEIVED": return styles.received;
            case "PREPARING": return styles.preparing;
            case "READY": return styles.ready;
            case "DELIVERED": return styles.delivered;
            case "CANCELLED": return styles.cancelled;
            default: "";
        }
    };

    const renderOrders = (title: string, orderList: Order[]) => (
        <div className={styles.column}>
            <h2>{title} ({orderList.length})</h2>
            {orderList.length === 0 && <p>Nenhum pedido</p>}

            {orderList.map(order => (
                <div key={order.id} className={`${styles.card} 
                    ${getStatusClass(order.status)}
                    ${newOrders.has(order.id) ? styles.newOrder : ""}`}
                    >
                    <h3>Cliente: {order.customerName}</h3>
                    <p>Telefone: {order.customerPhone}</p>
                    <p>Endereço: {order.address}</p>

                    {order.observation && (
                        <div className={styles.observation}>
                            <strong>Observação:</strong>
                            <p>{order.observation}</p>
                        </div>
                    )}

                    <p><strong>Pagamento:</strong>{order.paymentMethod}</p>

                    {order.paymentMethod === "CASH" && order.changeFor && (
                        <p><strong>Troco para: </strong> R$ ${Number(order.changeFor).toFixed(2)}</p>
                    )}

                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    >
                        <option value="RECEIVED">Recebido</option>
                        <option value="PREPARING">Preparando</option>
                        <option value="READY">Pronto</option>
                        <option value="DELIVERED">Entregue</option>
                        <option value="CANCELLED">Cancelado</option>
                    </select>

                    <hr style={{ margin: "8px 0", borderColor: "#E5E7EB" }} />

                    <strong>
                        Itens: 
                    </strong>

                    <ul style={{ marginTop: "6px", paddingLeft: "16px" }}>
                        {order.items.map((item, index) => (
                            <li key={index}>
                                {item.foodName} - {item.quantity}x
                            </li>
                        ))}
                    </ul>

                    <hr style={{ margin: "8px 0", borderColor: "#E5E7EB" }} />
                    
                    <p style={{ fontWeight: 600, color: "#111827", marginTop: "6px" }}>Total: R$ {Number(order.total).toFixed(2)}</p>
                </div>
            ))}
        </div>
    );

    return (
        <div>
            <nav className={styles.nav}>
                <button
                    className={styles.navBtn}
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
                    className={`${styles.navBtn} ${styles.navBtnActive}`}
                    onClick={() => navigate("/admin/orders")}
                >
                    Pedidos
                </button>
            </nav>

            <h1>Pedidos</h1>

            <div className={styles.container}>
                {renderOrders("Recebidos", groupedOrders.RECEIVED)}
                {renderOrders("Preparando", groupedOrders.PREPARING)}
                {renderOrders("Pronto", groupedOrders.READY)}
                {renderOrders("Entregues", groupedOrders.DELIVERED)}
                {renderOrders("Cancelados", groupedOrders.CANCELLED)}
            </div>
        </div>
    );
}