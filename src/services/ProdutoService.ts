import axios from "axios";
import type { Produto } from '@/model/Produto';
import type { Page } from '@/model/Page';
import apiClient from "./ApiClient";


type SortOption = {
    key: string;
    order: 'asc' | 'desc';
};

export default {
    listar(page: number, size: number, sortBy: SortOption[]): Promise<{ data: Page<Produto> }> {
        const sort = sortBy.map(s => `${s.key},${s.order}`).join(',');

        return apiClient.get("/produtos", {
            params: {
                page: page - 1,
                size,
                sort: sort || null
            }
        })
            
    },

    criar(produto: any): Promise<{ data: Produto }> {
        return apiClient.post("/produtos", produto);
    },

    atualizar(id: number, produto: any): Promise<{ data: Produto }> {
        return apiClient.put(`/produtos/${id}`, produto);
    },

    deletar(id: number): Promise<any> {
        return apiClient.delete(`/produtos/${id}`);
    },

    atualizarQuantidade(id: number, quantidade: number): Promise<{ data: Produto }> {
        return apiClient.patch(`/produtos/${id}/estoque`, { quantidade });
      }
      

};