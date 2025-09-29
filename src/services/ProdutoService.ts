import axios from "axios";
import type { Produto } from '@/model/Produto';
import type { Page } from '@/model/Page';

const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

type SortOption = {
    key: string;
    order: 'asc' | 'desc';
};

export default {
    listar(page: number, size: number, sortBy: SortOption[]): Promise<{ data: Page<Produto> }> {
        const sort = sortBy.map(s => `${s.key},${s.order}`).join(',');

        const params: any = {
            page: page - 1, 
            size
        };

        if(sort){
            params.sort = sort;
        }

        return apiClient.get("/produtos", {params});
            
    },

    criar(produto: any): Promise<{ data: Produto }> {
        return apiClient.post("/produtos", produto);
    },

    atualizar(id: number, produto: any): Promise<{ data: Produto }> {
        return apiClient.put(`/produtos/${id}`, produto);
    },

    deletar(id: number): Promise<any> {
        return apiClient.delete(`/produtos/${id}`);
    }
};