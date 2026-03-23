import { useEffect, useState } from "react";
import { getProduct } from "../services/ProductService";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter"

export default function Home() {
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState("Todas");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
        try {
            const data = await getProduct();
            setProducts(data);
        } catch (err) {
            console.error(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

        fetchProducts();
    }, []);

    if(loading) return <p>Carregando...</p>
    if(error) return <p>Erro ao carregar produtos</p>

    const categories = [
        "Todas",
        ...new Set(products.map(p => p.category?.name || p.category))
    ];

    const productsFiltered = 
        category === "Todas"
        ? products
        : products.filter(p => 
            p.category?.name || p.category
        );

    return (
        <div className="container">
            <h1 className="title">Cardápio</h1>

            <CategoryFilter 
            categories = {categories}
            setCategory = {setCategory}/>

            <div className="card">
                {productsFiltered.map(product => (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
        </div>
    );
}