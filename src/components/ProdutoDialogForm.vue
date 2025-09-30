<template>
    <v-dialog :model-value="visible" @update:model-value="fechar" max-width="500px" persistent>   
        <v-card>

            <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>
            
            <v-card-text>

                <v-form ref = "form">
                    <v-text-field v-model="formData.nome" 
                    :rules="[rules.required]"
                    label = "Nome do Produto">
                    </v-text-field>
                    
                    <v-text-field v-model="formData.preco" 
                    :rules="[rules.required]"
                    label="Preço" 
                    type="number" 
                    prefix="R$"
                    required
                    />

                    <v-select
                        v-model="formData.categoriaId"
                        :items="props.categorias"
                        item-title="nome"
                        item-value="id"
                        :rules="[rules.required]"
                        label="Categoria"
                        required
                    />
                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="fechar">Cancelar</v-btn>
                <v-btn color="primary" @click="salvar">Salvar</v-btn>
            </v-card-actions>
        
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Produto } from '@/model/Produto';
import type { Categoria } from '@/model/Categoria';
import CategoriaService from '@/services/CategoriaService';

const props = defineProps<{
    produto: Produto | null;
    visible: boolean;
    categorias: Categoria[];
}>();

const emits = defineEmits<{
    (e: 'salvar', produto: Produto): void;
    (e: 'fechar'): void;
}>();



const form = ref<any>(null);
const categorias = ref<Categoria[]>([]);
const formData = ref<Produto>({
    nome: '',
    preco: null,
    categoriaId: undefined as number | undefined,
});

const rules = {
    required: (value: any) => !!value || 'Campo obrigatório.',
    positive: (value: number) => value > 0 || 'O valor deve ser positivo.'
};

const formTitle = computed(() => (props.produto ? 'Editar Produto' : 'Novo Produto'));

watch(() => props.visible, (isVisible) => {
    if (isVisible) {
        formData.value = {
            id: props.produto?.id,
            nome: props.produto?.nome || '',
            preco: props.produto?.preco || null,
            categoriaId: props.produto?.categoriaId
        }; 
        form.value?.resetValidation();
    }
});

// onMounted(carregarCategorias);

// async function carregarCategorias(){
//     try{
//         const response = await CategoriaService.listarTodos();
//         categorias.value = response.data;
//     } catch (e) {
//         console.error('Erro ao carregar categorias:', e);
//     }
// }



async function salvar(){
    const {valid} = await form.value.validate();
    if(valid){
        const produtoPlayload = {
            id: formData.value.id,
            nome: formData.value.nome,
            preco: formData.value.preco,
            categoria: {
                id: formData.value.categoriaId
            }
        };
        emits('salvar', produtoPlayload);
    }
}

function fechar (){
    emits('fechar');
}

</script>