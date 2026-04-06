import type { Product } from "../types/Product";
import { useCart } from "../context/CartContext";
import styles from "./ProductCard.module.css"

type ProductCardProps = {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
    const { cart, addToCart} = useCart();

    const cartItem = cart.find(p => p.id === product.id);
    const quantityInCart = cartItem?.quantity || 0;

    const isOutOfStock = product.stock === 0;
    const reachedLimit = quantityInCart >= product.stock;

    console.log(typeof product.stock, product.stock);

    return (
        <div className={styles.card}>
            <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.title}
            />

            <div className={styles.cardInfo}>

                <h3>{product.title}</h3>

                <p className={styles.description}>{
                    product.description}
                </p>

                <p className={styles.price}>
                    R$ {product.price.toFixed(2)}
                </p>

                <p className={styles.stock}>
                    {isOutOfStock
                    ? "Sem estoque"
                    : ``}
                </p>

                <button 
                    className={`${styles.btnAdd} ${
                        isOutOfStock ? styles.disabled :
                        reachedLimit ? styles.limit : ""
                    }`}
                    onClick={() => addToCart(product)}
                    disabled={isOutOfStock || reachedLimit}
                >
                    {isOutOfStock
                    ? "Indisponível"
                    : reachedLimit
                    ? "Limíte atingido"
                    : "Adicionar"}
                </button>
            </div>
        </div>
    );
}