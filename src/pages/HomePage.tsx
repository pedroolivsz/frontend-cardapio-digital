import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

import { getProducts } from "../services/ProductService";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter"
import ProductSkeleton from "../components/ProductSkeleton";

import type { Product } from "../types/Product";
import styles from "./HomePage.module.css"
import type { Category } from "../types/Category";
import { getCategory } from "../services/CategoryService";

export default function Home() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [category, setCategory] = useState<string>("Todas");
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    const { cart } = useCart();
    const navigate = useNavigate();

    const totalItens = cart.reduce((acc, item) => {
        return acc + item.quantity;
    }, 0);

    useEffect(() => {
        const fetchData = async () => {
        try {
            const [data, cats] = await Promise.all([
                getProducts(),
                getCategory()
            ]);
            setProducts(data);
            setCategories(cats);
        } catch (err) {
            console.error("Erro real: ", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

        fetchData();
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

    const categoryNames = ["Todas", ...categories.map(c => c.name)];

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
            categories = {categoryNames}
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