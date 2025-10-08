<template>
    <v-card elevation="3">
        <v-card-title class="d-flex align-center pa-4">
            <v-icon icon="mdi-package-variant-closed" class="mr-2"></v-icon>
            <span class="font-weight-bold">Produtos Cadastrados</span>
        </v-card-title>
        <v-divider></v-divider>

        <v-data-table-server
            :headers="headers"
            :items="produtos"
            :items-length="totalProdutos"
            :loading="loading"
            item-value="id"
            @update:options="$emit('update:options', $event)"
        >
            <template v-if="isGestor" v-slot:item.actions="{ item }">
                <v-icon class="mr-2" color="blue" @click="$emit('editar', item)">mdi-pencil</v-icon>
                <v-icon color="red" @click="$emit('deletar', item)">mdi-delete</v-icon>
            </template>
        </v-data-table-server>
    </v-card>
</template>

<script setup lang="ts">
import type { Produto } from '@/model/Produto'; 
import { useAuthStore } from '@/stores/Auth';

const authStore = useAuthStore();
const isGestor = authStore.isGestor;




defineProps<{
    produtos: Produto[];
    loading: boolean;
    totalProdutos: number; 
}>();

defineEmits<{
    (e: 'editar', produto: Produto): void;
    (e: 'deletar', produto: Produto): void;
    (e: 'update:options', options: any): void;
}>();

const headers = [
    { title: 'Nome', key: 'nome', sortable: true },
    { title: 'Preço (R$)', key: 'preco', sortable: true },
    {title: 'Quantidade', key: 'quantidade', sortable: true },
    { title: 'Categoria', key: 'categoriaNome', sortable: false }, 
    { title: 'Ações', key: 'actions', sortable: false, align: 'end' }
] as const;

</script>