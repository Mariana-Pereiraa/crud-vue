<template>
    <v-container>
        <v-card elevation="3" class="mb-4">
            <v-card-title class="d-flex align-center pa-4">
                <v-icon icon="mdi-tag" class="mr-2"></v-icon>
                <span class="font-weight-bold">Categorias</span>

                <v-spacer></v-spacer>

                <v-btn v-if="isGestor" color="primary" @click="abrirDialogoNovaCategoria">
                    <v-icon start>mdi-plus</v-icon>
                    Nova Categoria
                </v-btn>
            </v-card-title>

            <v-divider></v-divider>

            <v-data-table-server
            v-model:items-per-page="itensPorPagina"
                :headers="headers"
                :items="categorias"
                :items-length="totalCategorias"
                :loading="loading"
                loading-text="Carregando categorias..."
                item-value="id"
                @update:options="carregarCategorias"
            >
                <template v-slot:item.actions="{item}">
                    <div v-if="isGestor">
                        <v-icon class="mr-2" color="blue" @click="abrirDialogoParaEdicao(item)">mdi-pencil</v-icon>
                        <v-icon color="red" @click="excluirCategoria(item)">mdi-delete</v-icon>
                    </div>
                </template>
            </v-data-table-server>
        </v-card>

        <v-dialog v-model="dialog" max-width="500">
            <v-card>
                <v-card-title class="font-weight-bold">
                    {{ categoriaEditando ? 'Editar Categoria' : 'Nova Categoria' }}
                </v-card-title>

                <v-card-text>
                    <v-form ref="form" v-model="formValido">
                        <v-text-field
                            v-model="categoria.nome"
                            label="Nome da Categoria"
                            :rules="[v => !!v || 'Nome é obrigatório']"
                            required
                        />
                    </v-form>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text @click="fecharDialogo">Cancelar</v-btn>
                    <v-btn color="primary" :disabled="!formValido" @click="salvarCategoria">Salvar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
            {{ snackbar.text }}
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { ref,computed } from 'vue';
import type { Categoria } from '@/model/Categoria';
import CategoriaService from '@/services/CategoriaService';
import { useAuthStore } from '@/stores/Auth';


const categorias = ref<Categoria[]>([]);
const totalCategorias = ref(0);
const loading = ref(false);
const itensPorPagina = ref(10);

const options = ref({ page: 1, itemsPerPage: 10, sortBy: [] as any[] });

const headers = [
    { title: 'Nome', key: 'nome', sortable: true },
    { title: 'Ações', key: 'actions', sortable: false }
];

const dialog = ref(false);
const categoria = ref<Categoria>({id: undefined, nome: ''});
const categoriaEditando = ref(false);
const formValido = ref(false);
const form = ref();

const snackbar = ref({
    show: false,
    text: '',
    color: 'success'
});

const authStore = useAuthStore();
const isGestor = computed(() => authStore.isGestor);

async function carregarCategorias(newOptions: { page: number; itemsPerPage: number; sortBy: any[] }) {
    loading.value = true;
    options.value = newOptions;
    try{
        const response = await CategoriaService.listarPaginado(
            newOptions.page,
            newOptions.itemsPerPage,
            newOptions.sortBy
        );
        categorias.value = response.data.content;
        totalCategorias.value = response.data.totalElements;
    } finally{
        loading.value = false;
    }
}

function abrirDialogoNovaCategoria(){
    categoria.value = {id: undefined, nome: ''};
    categoriaEditando.value = false;
    dialog.value = true;
}

function abrirDialogoParaEdicao(cat: Categoria){
    categoria.value = {...cat};
    categoriaEditando.value = true;
    dialog.value = true;
}

function fecharDialogo(){
    dialog.value = false;
}

async function salvarCategoria(){
    try{
        if(categoria.value.id){
            await CategoriaService.atualizar(categoria.value.id, categoria.value);
            mostrarSnackbar('Categoria atualizada com sucesso.', 'success');
        } else {
            await CategoriaService.criar(categoria.value);
            mostrarSnackbar('Categoria criada com sucesso.', 'success');
        }
        fecharDialogo();
        carregarCategorias(
            { page: options.value.page, itemsPerPage: options.value.itemsPerPage, sortBy: options.value.sortBy }
        );
    } catch (e: any){
        mostrarSnackbar('Erro ao salvar categoria', 'error');
    }
}

async function excluirCategoria(cat: Categoria){
    if(confirm('Tem certeza que deseja deletar esta categoria?')){
        try{
            await CategoriaService.deletar(cat.id!);
            mostrarSnackbar('Categoria deletada com sucesso.', 'success');
            carregarCategorias(
                { page: options.value.page, itemsPerPage: options.value.itemsPerPage, sortBy: options.value.sortBy }
            );
        } catch (e: any){
            mostrarSnackbar('Erro ao deletar categoria', 'error');
        }
    }
}

function mostrarSnackbar(text: string, color: string){
    snackbar.value = {
        show: true,
        text,
        color
    }
}

</script>