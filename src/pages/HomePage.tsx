import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import { getProducts } from "../services/ProductService";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter"
import ProductSkeleton from "../components/ProductSkeleton";

import type { Product } from "../types/Product";
import styles from "./HomePage.module.css"

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [category, setCategory] = useState<string>("Todas");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const { cart } = useCart();
    const navigate = useNavigate();

    const totalItens = cart.reduce((acc, item) => {
        return acc + item.quantity;
    }, 0);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const data = await getProducts();
            setProducts(data);
        } catch (err) {
            console.error("Erro real: ", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

        fetchProducts();
    }, [])

    if(loading) {
        return (
        <div className={styles.container}>
            <h1 className={styles.title}>Cardápio</h1>
            <p className={styles.subTitle}>Carregando cardápio...</p>

            <div className={styles.grid}>
                <ProductSkeleton count={6} />
            </div>
        </div>
    )
    }
    
    if(error) return <p>Erro ao carregar produtos</p>

    const categories = [
        "Todas",
        ...new Set(products.map(p => p.category))
    ]

    const productsFiltered = 
        category === "Todas"
        ? products
        : products.filter(p => p.category === category
        )

    return (
        <div className={styles.container}>

            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Cardápio</h1>
                    <p className={styles.subTitle}>Peça rápido e sem complicação</p>
                </div>

                <button
                    className={styles.cartButton}
                    onClick={() => navigate("/cart")}
                >
                    🛒
                    {totalItens > 0 && (
                        <span className={styles.badge}>
                            {totalItens > 9
                            ? "9+"
                            : totalItens}
                        </span>
                    )}
                </button>

            </div>
            
            <CategoryFilter 
            categories = {categories}
            setCategory = {setCategory}
            activeCategory = {category}/>

            <div className={styles.grid}>
                {productsFiltered.map(product => (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
        </div>
    )
}