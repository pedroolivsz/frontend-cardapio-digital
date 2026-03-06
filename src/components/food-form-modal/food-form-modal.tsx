import { useEffect, useState } from "react";
import { useFoodDataMutate } from "../../hooks/useFoodCreate.ts";
import { useFoodUpdate } from "../../hooks/useFoodUpdate.ts";
import type { FoodData } from "../../types/FoodData.ts";
import "./modal.css";

interface Props {
    mode: "create" | "update";
    food?: FoodData;
    closeModal: () => void;
}

export function FoodFormModal({ mode, food, closeModal }: Props) {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [price, setPrice] = useState<string>("");

    const createMutation = useFoodDataMutate();
    const updateMutation = useFoodUpdate();

    const isPending = createMutation.isPending || updateMutation.isPending;

    useEffect(() => {
        if(mode === "update" && food) {
            setTitle(food.title);
            setImage(food.image);
            setPrice(String(food.price));
        }
    }, [mode, food]);

    const handleSubmit = () => {
        console.log("Submit clicado")
        if(mode === "create") {
            createMutation.mutate(
                {title, image, price},
                { onSuccess: closeModal,
                  onError: (err) => console.log(err)
                }
            );
        } else if(mode === "update" && food?.id) {
            updateMutation.mutate(
                {
                    id: food.id,
                    data: { title, image, price }
                },
                { onSuccess: closeModal }
            );
        }
    };

    return (
    <div className="modal-overlay">
        <div className="modal-body">

            <h2>
                {mode === "create" ? "Criar produto" : "Atualizar produto"}
            </h2>

            <input
                value={title}
                onChange={(e)=>setTitle(e.target.value)}
                placeholder="Título do produto"
            />

            <input
                value={image}
                onChange={(e)=>setImage(e.target.value)}
                placeholder="URL da imagem"
            />

            <input
                type="number"
                value={price}
                onChange={(e)=>setPrice(e.target.value)}
                placeholder="Preço"
            />

            <div className="buttons">

                <button
                    className="btn-primary"
                    onClick={handleSubmit}
                    disabled={isPending}
                >
                    {isPending ? "Salvando..." : "Salvar"}
                </button>

                <button
                    className="btn-secondary"
                    onClick={closeModal}
                >
                    Cancelar
                </button>

            </div>

        </div>
    </div>
    );
}