<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>AutoEstudo</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Produtos</v-btn>
      <v-btn to="/categorias" text>Categorias</v-btn>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>