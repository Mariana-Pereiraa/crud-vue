<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Registro de Usuário</v-toolbar-title>
                    </v-toolbar>

                    <v-card-text>
                        <v-form @submit.prevent="handleRegister">
                            <v-text-field 
                                label="Email" 
                                v-model="email" 
                                type="email" 
                                required
                                >
                            </v-text-field>
                            <v-text-field 
                                label="Senha" 
                                v-model="senha" 
                                type="password" 
                                required
                                >
                            </v-text-field>

                            <v-select
                                label="Qual seu cargo?"
                                v-model="papel"
                                :items="['GESTOR', 'FUNCIONARIO']"
                                required
                            >
                            </v-select>

                            <v-alert
                                v-if="error"
                                type="error"
                                dense
                                class="mb-4"
                                >
                                {{ error }}
                            </v-alert>

                            <v-alert
                                v-if="success"
                                type="success"
                                dense
                                class="mb-4"
                                >
                                {{ success }}
                            </v-alert>

                            <v-card-actions>
                                <router-link to="/login">Voltar para o Login</router-link>
                                <v-spacer></v-spacer>
                                <v-btn color="primary" type="submit" :loading="loading">Registrar</v-btn>
                            </v-card-actions>

                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {useRouter} from 'vue-router';
import AuthService from '@/services/AuthService';

const email = ref('');
const senha = ref('');
const papel = ref(null);
const error = ref('');
const success = ref('');
const loading = ref(false);
const router = useRouter();

async function handleRegister() {
    loading.value = true;
    error.value = '';
    success.value = '';
    
    try{
        await AuthService.registrar({
            email: email.value,
            senha: senha.value,
            papel: papel.value
        });
        success.value = 'Registro realizado com sucesso! Redirecionando para o login...';
        setTimeout(() => router.push('/login'), 2000);
    }catch(err: any){
        error.value = err.response?.data?.message || 'Erro ao registrar.';
    }finally{
        loading.value = false;
    }
}
</script>