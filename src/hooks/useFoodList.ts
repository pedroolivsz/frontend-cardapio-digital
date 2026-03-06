import axios from "axios";
import type { FoodData } from "../types/FoodData";
import { useQuery } from "@tanstack/react-query";

const API_URL = 'http://localhost:8080';

const fetchData = async (): Promise<FoodData[]> => {
    const response = await axios.get(API_URL + '/food');
    return response.data;
}

export function useFoodData() {
    return useQuery<FoodData[]>({
        queryFn: fetchData, 
        queryKey: ['food-data'],
        retry: 2
    })
}