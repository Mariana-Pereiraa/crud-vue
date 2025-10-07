import { Categoria } from "./Categoria";

export interface Produto {
    id?: number;
    nome: string;
    preco: number | null;
    quantidade?: number | null;
    categoriaId?: number;
    categoriaNome?: string;
}