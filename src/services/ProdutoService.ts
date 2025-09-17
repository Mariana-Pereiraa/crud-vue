import axios from "axios";
import type { Produto } from '@/model/Produto';

const api = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json"
    }
});

export default {
    listar(): Promise<{data: Produto[]}>{
        return api.get("/produtos");
    },

    criar(produto: Produto): Promise<{data: Produto}> {
        return api.post("/produtos", produto);
    },

    atualizar(id: number, produto: Produto): Promise<{data: Produto}> {
        return api.put(`/produtos/${id}`, produto);
    },

    deletar(id: number): Promise<any>{
        return api.delete(`/produtos/${id}`);
    }
};

