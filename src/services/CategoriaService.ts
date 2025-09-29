import { Categoria } from "@/model/Categoria";
import { Page } from "@/model/Page";
import axios from "axios";

const api = axios.create({
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
    listarPaginado(page: number, size: number, sortBy: SortOption[]): Promise<{data: Page<Categoria>}> {
        const sort = sortBy.map(s => `${s.key}, ${s.order}`).join(',');

    const params: any = {
                page: page - 1,
                size
    };

        if(sort){
            params.sort = sort;

        }

        return api.get("/categorias", {params});
    },

    listarTodos(): Promise<{data: Categoria[]}> {
        return api.get("/categorias/all");
    },


    criar(categoria: Categoria): Promise<{data: Categoria}> {
        return api.post("/categorias", categoria);
    },

    atualizar(categoria: Categoria): Promise<{data: Categoria}> {
        return api.put(`/categorias/${categoria.id}`, categoria);
    },

    deletar(id: number): Promise<any>{
        return api.delete(`/categorias/${id}`);
    }
}