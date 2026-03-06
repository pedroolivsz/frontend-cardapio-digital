import axios, { type AxiosPromise } from "axios";
import type { FoodData } from "../types/FoodData";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = 'http://localhost:8080/food';

const postData = async (data: FoodData): AxiosPromise<any> => {
    const response = axios.post(API_URL, data);
    return response;
}

export function useFoodDataMutate() {
    const queryClient = useQueryClient();
    const mutate = useMutation({
        mutationFn: postData, 
        retry: 2,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['food-data']
            })
        },

        onError: (error: any) => {
            console.error("Erro ao criar produto: ", error.response?.data);
        },
    });

    return mutate;
}