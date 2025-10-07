<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>AutoEstudo</v-toolbar-title>

      <v-spacer></v-spacer>

      <div v-if="authStore.isAuthenticated">
        <v-btn to="/" text>Produtos</v-btn>

        <v-btn v-if="authStore.isAuthenticated" to="/categorias">Categorias</v-btn>

        <v-btn @click="handleLogout" text>
          <v-icon start>mdi-logout</v-icon>
          Sair
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/Auth';

const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
}
</script>