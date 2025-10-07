import { Categoria } from "@/model/Categoria";
import { Page } from "@/model/Page";
import axios from "axios";
import apiClient from "./ApiClient";

type SortOption = {
    key: string;
    order: 'asc' | 'desc';
};

export default {
    listarPaginado(page: number, size: number, sortBy: SortOption[]): Promise<{data: Page<Categoria>}> {
        const sort = sortBy.map(s => `${s.key}, ${s.order}`).join(',');

        return apiClient.get("/categorias", {
            params:{
                page: page - 1,
                size,
                sort: sort || null
            }
        })
    },

    listarTodos(): Promise<{data: Categoria[]}> {
        return apiClient.get("/categorias/all");
    },


    criar(categoria: Categoria): Promise<{data: Categoria}> {
        return apiClient.post("/categorias", categoria);
    },

    atualizar(id: number, categoria: Categoria): Promise<{data: Categoria}> {
        return apiClient.put(`/categorias/${categoria.id}`, categoria);
    },

    deletar(id: number): Promise<any>{
        return apiClient.delete(`/categorias/${id}`);
    }
}