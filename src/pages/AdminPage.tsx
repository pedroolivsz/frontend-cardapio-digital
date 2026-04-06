import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { deleteProduct, getProducts } from "../services/ProductService";
import styles from "./AdminPage.module.css"
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetch = async () => {
            const data = await getProducts();
            setProducts(data);
        };

        fetch();
    }, []);

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm("Tem certeza que deseja excluir?");

        if(!confirmDelete) return;

        try {
            await deleteProduct(id);

            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir o produto");
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.navbar}>
                <button onClick={() => navigate("/admin")}>Produtos</button>
                <button onClick={() => navigate("/admin/orders")}>Pedidos</button>
            </div>

            <div className={styles.header}>
                <h1>Painel de Produtos</h1>

                <button
                    className={styles.addButton}
                    onClick={() => navigate("/admin/create")}>
                    + Adicionar produto
                </button>
            </div>

            <div className={styles.grid}>
                {products.map(product => (
                    <div key={product.id} className={styles.card}>
                        <img src={product.image} alt={product.title} />
                        <div className={styles.info}>

                            <h3>{product.title}</h3>

                            <p>R$ {product.price.toFixed(2)}</p>

                            <span className={
                                product.stock > 0
                                ? styles.inStock
                                : styles.outStock
                            }>
                                {product.stock > 0 ? "Em estoque" : "Sem estoque"}
                            </span>
                        </div>
                        <div className={styles.actions}>
                            <button onClick={() => navigate(`/admin/edit/${product.id}`)}>
                                Editar
                            </button>
                            
                            <button onClick={() => handleDelete(product.id)}>
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}