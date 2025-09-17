<template>
    <v-card elevation="3">

        <v-card-title class="d-flex align-center pa-4">
            <v-icon icon="mdi-packpage-variant-closed" class="mr-2"></v-icon>
            <span class="font-weight-bold">Produtos Cadastrados</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-data-table
            :headers="headers"
            :items="produtos"
            :loading="loading"
            loading-text="Carregando produtos..."
            item-value="id"
        >

            <template v-slot:headers="{ columns }">
                    <tr>
                        <th v-for="column in columns" :key="column.key ?? column.title">
                            <span class="font-weight-bold">{{ column.title }}</span>
                        </th>
                    </tr>
            </template>

            <template v-slot:['item.actions']="{item}">
                <v-icon class="mr-2" color="blue" @click="emit('editar', item)">mdi-pencil</v-icon>
                <v-icon color="red" @click="emit('deletar', item)">mdi-delete</v-icon>
            </template>
        </v-data-table>
    </v-card>
</template>

<script setup lang="ts">
import type {Produto} from '@/model/Produto';

defineProps<{
    produtos: Produto[];
    loading: boolean;
}>();

const emit = defineEmits<{
    (e: 'editar', produto: Produto): void;
    (e: 'deletar', produto: Produto): void;
}>();

const headers = [
    {title: 'Nome', key: 'nome', sortable: true},
    {title: 'Preço (R$)', key: 'preco', sortable: true},
    {title: 'Ações', key: 'actions', sortable: false}
];

</script>