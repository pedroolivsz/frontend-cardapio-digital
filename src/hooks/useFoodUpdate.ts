import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { FoodData } from "../types/FoodData";

const API_URL = 'http://localhost:8080/food';

const putData = async({ id, data }: { id: number; data: FoodData }) => {
    return axios.put(`${API_URL}/${id}`, data);
}

export const useFoodUpdate = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: putData,

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["food-data"]});
        },

        onError: (error: any) => {
            console.error("Erro na atualização: ", error.response?.data)
        },
    });
};