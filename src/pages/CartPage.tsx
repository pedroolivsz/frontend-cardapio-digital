import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import styles from "./CartPage.module.css"

export default function CartPage() {
    const {cart, removeFromCart, decreaseQuantity, increaseQuantity } = useCart();
    const navigate = useNavigate();

    const total = cart.reduce((acc, item) => {
        return acc + item.price * item.quantity;
    }, 0);

    return (
        <div className={styles.cartContainer}>

            <button className={styles.backButton}
                onClick={() => navigate(-1)}>
                    ← Voltar
            </button>

            <h2>Seu carrinho</h2>

            {cart.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "20px", color: "#666"}}>
                    Seu carrinho está vazio 🛒
                </p>
            ) : (
                <>
                    {cart.map(item => (
                        <div key={item.id} className={styles.cartItem}>
                            <img src={item.image} alt={item.title} />

                            <div className={styles.info}>
                                <h4>{item.title}</h4>

                                <p>R$ {item.price.toFixed(2)}</p>

                                <p>Subtotal: R$ {(item.price * item.quantity).toFixed(2)}</p>

                                {item.quantity >= item.stock && <small>Limite em estoque</small>}
                            </div>

                            <div className={styles.actions}>
                                <button onClick={() => decreaseQuantity(item.id)}>-</button>

                                <span>{item.quantity}</span>

                                <button 
                                    onClick={() => increaseQuantity(item.id)}
                                    disabled={item.quantity >= item.stock}
                                >
                                    +
                                </button>

                                <button onClick={() => removeFromCart(item.id)}>
                                Remover
                                </button>
                            </div>
                        </div>
                    ))}

                    <h3>Total: R$ {total.toFixed(2)}</h3>

                    <button 
                        className={styles.checkoutButton}
                        onClick={() => navigate("/checkout")}
                    >
                        Finalizar pedido
                    </button>
                </>
            )}
        </div>
    );
}
