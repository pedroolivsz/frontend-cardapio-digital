import { useState } from "react";
import { useCart } from "../context/CartContext";
import styles from "./CheckoutPage.module.css"
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/OrderService";


export default function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        nome: "",
        telefone: "", 
        endereco: "",
        observacao: "",
        metodoDePagamento: "",
        troco: ""
    });

    const total = cart.reduce((acc, item) => {
        return acc + item.quantity * item.price;
    }, 0);

    const formatPhone = (value: string) => {
        value = value.replace(/\D/g, "");

        value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); 
        value = value.replace(/(\d{5})(\d)/, "$1-$2");

        return value.slice(0,15);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(!form.nome || !form.telefone || !form.endereco) {
            alert("Preencha todos os campos!");
            return;
        }

        if(!form.metodoDePagamento) {
            alert("Selecione a forma de pagamento!");
            return;
        }

        try {
            setLoading(true);

            await createOrder({
                customerName: form.nome,
                customerPhone: form.telefone.replace(/\D/g, ""),
                address: form.endereco,
                observation: form.observacao,
                paymentMethod: form.metodoDePagamento,
                changeFor: form.troco,
                items: cart.map(item => ({
                    foodId: item.id,
                    quantity: item.quantity
                }))
            });

            clearCart();
            setSuccess(true);

            setTimeout(() => {
                navigate("/")
                setLoading(false);
                setSuccess(false);
            }, 1200);
        } catch(error) {
            console.error(error);
            alert("Erro ao salvar seu pedido");
            setLoading(false);
        }
    }
        

    return (
        <div className={styles.container}>
            <button className={styles.backButton}
                onClick={() => navigate(-1)}>
                    ← Voltar
            </button>

            <h2>Finalizar Pedido</h2>

            <div className={styles.summary}>
                {cart.map(item => (
                    <div key={item.id} className={styles.item}>
                        <span>{item.title}</span>
                        <span>{item.quantity}</span>
                        <span>R$ {(item.quantity * item.price).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <h3 className={styles.total}>Total: R$ {total.toFixed(2)}</h3>

            <form className={styles.form} onSubmit={handleSubmit}>
                <input
                    type="text" 
                    placeholder="Seu nome"
                    value={form.nome}
                    onChange={e => setForm({ ...form, nome: e.target.value })}
                    required 
                />
                <input 
                    type="text" 
                    placeholder="Telefone" 
                    value={form.telefone}
                    onChange={e => setForm({ ...form, telefone: formatPhone(e.target.value) })}
                    required 
                />
                <input
                    type="text" 
                    placeholder="Endereço" 
                    value={form.endereco}
                    onChange={e => setForm({ ... form, endereco: e.target.value })}
                    required 
                />

                <textarea 
                    placeholder="Observações do pedido (opcional)"
                    value={form.observacao}
                    onChange={e => setForm({ ...form, observacao: e.target.value })}
                    maxLength={500}
                >
                </textarea>

                <select
                    value={form.metodoDePagamento}
                    onChange={e => setForm({ ...form, metodoDePagamento: e.target.value})}
                    required
                >
                    <option value="">Forma de pagamento</option>
                    <option value="CASH">Dinheiro</option>
                    <option value="PIX">Pix</option>
                    <option value="CREDIT_CARD">Cartão de Crédito</option>
                    <option value="DEBIT_CARD">Cartão de Débito</option>
                </select>

                {form.metodoDePagamento === "CASH" && (
                    <input
                        type="number"
                        placeholder="Troco para quanto? (Opcional)"
                        value={form.troco}
                        onChange={e => setForm({ ...form, troco: e.target.value })} />
                )}

                <button type="submit" disabled={loading}>
                    {loading ? "Enviando pedido..." : "Confirmar pedido"}
                </button>

                {success && (
                    <p className={styles.success}>
                        Pedido realizado! Você receberá uma confirmação no WhatsApp.
                    </p>
                )}
            </form>
        </div>
    );
}