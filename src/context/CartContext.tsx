import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Product } from "../types/Product";

export interface CartItem extends Product {
    quantity: number
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: number) => void;
    increaseQuantity: (id: number) => void;
    decreaseQuantity: (id: number) => void;
    clearCart: () => void;
}

interface CartProviderProps {
    children: ReactNode
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: CartProviderProps) {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const itemExists = prev.find(p => p.id === product.id);

            if(itemExists) {
                if(itemExists.quantity >= product.stock) {
                    console.warn("Etoque máximo atingido");
                    return prev;
                }

                return prev.map(p => p.id === product.id
                    ? {...p, quantity: p.quantity + 1}
                    : p
                );
            }

            if(product.stock <= 0) {
                console.warn("Produto sem estoque");
                return prev;
            }

            return [...prev, { ...product, quantity: 1}]
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(p => p.id !== id));
    };

    const increaseQuantity = (id: number) => {
        setCart(prev => 
            prev.map(item =>
                item.id === id && item.quantity < item.stock
                ? {...item, quantity: item.quantity + 1}
                : item
            )
        );
    };

    const decreaseQuantity = (id: number) => {
        setCart(prev => 
            prev.map(item =>
                item.id === id && item.quantity < item.stock
                ? {...item, quantity: item.quantity - 1}
                : item
            ).filter(item => item.quantity > 0)
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const context = useContext(CartContext);

    if(!context) {
        throw new Error("useCart deve ser usado dentro de um CartProvider")
    }

    return context;
}