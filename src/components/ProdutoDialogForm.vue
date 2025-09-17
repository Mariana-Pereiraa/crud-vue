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
                    label="Preço" type="number" 
                    prefix="R$">
                    </v-text-field>
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
import { ref, computed, watch } from 'vue';
import { Produto } from '@/model/Produto';

//PROPOS (DADOS QUE O COMPONENTE RECEBE DO PAI)
const props = defineProps<{
    produto: Produto | null;
    visible: boolean;
}>();

//EMITS (EVENTOS QUE O COMPONENTE RECEBE DO PAI)
const emits = defineEmits<{
    (e: 'salvar', produto: Produto): void;
    (e: 'fechar'): void;
}>();

const form = ref<any>(null);
const formData = ref<Produto>({
    nome: '',
    preco: null
});

const rules = {
    required: (value: any) => !!value || 'Campo obrigatório.',
    positive: (value: number) => value > 0 || 'O valor deve ser positivo.'
};

const formTitle = computed(() => (props.produto ? 'Editar Produto' : 'Novo Produto'));


//para que o form de produto limpe os dados quando fechar
watch(() => props.visible, (isVisible) => {
    if (isVisible) {
        formData.value = props.produto ? { ...props.produto } : { nome: '', preco: null };
        form.value?.resetValidation();
    }
});

async function salvar(){
    const {valid} = await form.value.validate();
    if(valid){
        emits('salvar', formData.value);
    }
}

function fechar (){
    emits('fechar');
}

</script>