import axios, { type AxiosPromise } from "axios";
import type { FoodData } from "../interface/FoodData";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = 'http://localhost:8080';

const postData = async (data: FoodData): AxiosPromise<any> => {
    const response = axios.post(API_URL + '/food/create', data);
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
        }
    })

    return mutate;
}