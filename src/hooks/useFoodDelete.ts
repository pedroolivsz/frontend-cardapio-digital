import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://localhost:8080/food"

const deleteFood = async (id: number) => {
    return axios.delete(`${API_URL}/${id}`);
};

export const useFoodDelete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteFood,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["food-data"] });
        },

        onError: (error: any) => {
            console.error("Erro ao deletar: ", error.response?.data);
            
        }
    });
};