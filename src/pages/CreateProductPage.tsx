import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import styles from "./CreateProductPage.module.css"
import { createProduct, updateProduct } from "../services/ProductService";
import { api } from "../services/api";

export default function CreateProductPage() {
    const navigate = useNavigate();

    const { id } = useParams();
    const isEdit = !!id;

    const [form, setForm] = useState({
        title: "",
        description: "",
        categoryId: "",
        image: "",
        price: "",
        stock: ""
    });

    useEffect(() => {
        if(isEdit) {
            api.get(`/food/${id}`).then(res => {
                const p = res.data;

                setForm({
                    title: p.title,
                    description: p.description,
                    categoryId: String(p.categoryId),
                    image: p.image,
                    price: String(p.price),
                    stock: String(p.stock)
                });
            });
        }
    }, [id]);

    const handleChange = (field: string, value: string) => {
        setForm(prev => ({  ...prev, [field]: value }))
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!form.title
            || !form.description
            || !form.categoryId
            || !form.image
            || !form.price
            || !form.stock
        ) {
            alert("Preencha os campos obrigatórios");
            return;
        };

        const productData = {
            title: form.title,
            description: form.description,
            categoryId: Number(form.categoryId),
            image: form.image,
            price: form.price,
            stock: Number(form.stock)
        }

        try {
            if(isEdit) {
                await updateProduct(Number(id), productData);
                alert("Produto atualizado com sucesso!");
            } else {
                await createProduct(productData);
                alert("Produto criado com sucesso!");
            }
            
            navigate("/admin");
            
        } catch (error) {
            console.error(error);
            alert("Erro ao criar o produto");
        }
    };

    return (
        <div className={styles.container}>
            <h1>{isEdit ? "Editar produto" : "Novo produto"}</h1>

            <form className={styles.form } onSubmit={handleSubmit}>

                <input
                    type="text" 
                    placeholder="Nome do produto"
                    value={form.title}
                    onChange={e => handleChange("title", e.target.value)}
                    required 
                />

                <input
                    type="text" 
                    placeholder="Descrição"
                    value={form.description}
                    onChange={e => handleChange("description", e.target.value)}
                    required 
                />

                <select
                    value={form.categoryId}
                    onChange={e => handleChange("categoryId", e.target.value)}>
                        <option value="">Selecione uma categoria</option>
                        <option value="1">Pizzas</option>
                        <option value="2">Hambúrgueres</option>
                </select>

                <input
                    type="text" 
                    placeholder="URL da imagem"
                    value={form.image}
                    onChange={e => handleChange("image", e.target.value)}
                    required 
                />

                {form.image && (
                    <img
                        src={form.image}
                        alt="preview"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                        style={{
                            width: "100%",
                            borderRadius: "10px",
                            marginTop: "10px"
                        }}
                    />
                )}

                <input
                    type="text" 
                    placeholder="Preco (ex: 19.90)"
                    value={form.price}
                    onChange={e => handleChange("price", e.target.value)}
                    required 
                />

                <input
                    type="text" 
                    placeholder="Estoque"
                    value={form.stock}
                    onChange={e => handleChange("stock", e.target.value)}
                    required 
                />

                <div className={styles.actions}>
                    <button type="button" onClick={() => navigate("/admin")}>
                        Cancelar
                    </button>

                    <button type="submit">
                        {isEdit ? "Atualizar produto" : "Salvar produto"}
                    </button>
                </div>

            </form>
        </div>
    );
}