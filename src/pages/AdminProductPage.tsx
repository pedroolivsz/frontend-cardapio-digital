import { useEffect, useState } from "react";
import type { Product } from "../types/Product";
import { deleteProduct, getProducts } from "../services/ProductService";
import styles from "./AdminProductPage.module.css"
import { useNavigate } from "react-router-dom";

export default function AdminProductPage() {
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
    };

    const outOfStockCount = products.filter((p) => p.stock === 0).length;

    return (
        <div className={styles.page}>
            <nav className={styles.nav}>
                <button
                    className={styles.navBtn}
                    onClick={() => navigate("/admin/dashboard")}
                >
                    Dashboard
                </button>
                
                <button
                    className={`${styles.navBtn} ${styles.navBtnActive}`}
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

            <div className={styles.inner}>
                <div className={styles.header}>
                    <div>
                        <h1>Painel de Produtos</h1>

                        <p className={styles.headerMeta}>
                            {products.length} produto{products.length !== 1 ? "s" : ""} cadastrado{products.length !== 1 ? "s" : ""}
                            {outOfStockCount > 0 && (
                                <span className={styles.metaAlert}>
                                    {" "}. {outOfStockCount} sem estoque
                                </span>
                            )}
                        </p>
                    </div>
                    <button
                        className={styles.addBtn}
                        onClick={() => navigate("/admin/create")}>
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            aria-hidden="true"
                            >
                            <path
                                d="M7 2v10M2 7h10"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                        </svg>
                        Adicionar produto
                    </button>
                </div>

                {products.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Nenhum produto cadastrado ainda.</p>
                        <button
                            className={styles.addBtn}
                            style={{ margin: "16px auto 0", display: "flex" }}
                            onClick={() => navigate("/admin/create")}>
                            Adicionar primeiro produto
                        </button>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {products.map(product => (
                            <div key={product.id} className={styles.card}>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className={styles.cardImg}
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                                <div className={styles.cardBody}>
                                    <h3 className={styles.cardTitle}>{product.title}</h3>

                                    <p className={styles.cardPrice}>
                                        R${" "}
                                        {Number(product.price).toLocaleString("pt-BR", {
                                            minimumFractionDigits: 2
                                        })}
                                    </p>

                                    <span className={
                                        product.stock > 0
                                        ? styles.badgeIn
                                        : styles.badgeOut
                                    }>
                                        {product.stock > 0 ? "Em estoque" : "Sem estoque"}
                                    </span>
                                </div>
                                <div className={styles.cardActions}>
                                    <button
                                        className={styles.btnEdit}
                                        onClick={() => navigate(`/admin/edit/${product.id}`)}
                                    >
                                        Editar
                                    </button>
                                    
                                    <button
                                        className={styles.btnDelete}
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}