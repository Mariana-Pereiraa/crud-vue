<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @submit.prevent="handleLogin">
                <v-text-field
                  label="Email"
                  v-model="email"
                  prepend-icon="mdi-account"
                  type="email"
                  required
                ></v-text-field>
                <v-text-field
                  label="Senha"
                  v-model="senha"
                  prepend-icon="mdi-lock"
                  type="password"
                  required
                ></v-text-field>
                <v-alert v-if="error" type="error" dense class="mb-4">{{ error }}</v-alert>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" type="submit" :loading="loading">Entrar</v-btn>
                </v-card-actions>

                <div class="text-center mt-4">
                  <router-link to="/registro">Não tem uma conta? Registre-se</router-link>
                </div>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useAuthStore } from '@/stores/Auth';
  
  const email = ref('');
  const senha = ref('');
  const error = ref('');
  const loading = ref(false);
  
  const authStore = useAuthStore();
  
  async function handleLogin() {
    loading.value = true;
    error.value = '';
    try {
      await authStore.login({ email: email.value, senha: senha.value });
    } catch (err) {
      error.value = 'Email ou senha inválidos.';
    } finally {
      loading.value = false;
    }
  }
  </script>