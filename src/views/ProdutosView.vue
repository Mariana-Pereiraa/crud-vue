<template>
  <v-container>
    <v-card class="pa-4" elevation="3">
      <div class="d-flex align-center mb-4">
        <h1 class="text-h5">Gerenciamento de Produtos</h1>
        <v-spacer></v-spacer>
        <v-btn v-if="isGestor" color="primary" elevation="2" @click="abrirDialogParaCriar">
          <v-icon icon="mdi-plus" class="mr-1"></v-icon>
          Novo Produto
        </v-btn>
      </div>

      <v-divider class="mb-4"></v-divider>

      <v-data-table-server
        v-model:items-per-page="itensPorPagina"
        :headers="headers"
        :items-length="totalProdutos"
        :items="produtos"
        :loading="loading"
        loading-text="Carregando produtos..."
        item-value="id"
        @update:options="carregarProdutos"
      >

      <template v-slot:item.quantidade="{ item }">
        <div v-if="editandoQuantidadeId === item.id">
          <v-text-field
            v-model="novaQuantidade"
            type="number"
            dense
            hide-details
            style="width: 80px"
            @blur="salvarQuantidade(item)"
            @keyup.enter="salvarQuantidade(item)"
          />
        </div>
        <div
          v-else
          @click="permitirEdicaoQuantidade(item)"
          style="cursor: pointer; color: #1976d2;"
        >
          {{ item.quantidade }}
        </div>
      </template>

      <template v-slot:item.actions="{ item }">
          <div v-if="isGestor" class="d-inline-block">
            <v-icon class="mr-2" color="blue" @click="abrirDialogParaEditar(item)">mdi-pencil</v-icon>
            <v-icon color="red" @click="deletarProduto(item)">mdi-delete</v-icon>

          </div>

      </template>

      


        <template v-slot:item.preco="{ item }">
          {{ formartCurrency(item.preco) }}

        </template>

        <template v-slot:item.categoriaNome="{ item }">
          {{ item.categoriaNome || '-' }}
        </template>

      </v-data-table-server>



    </v-card>

    <ProdutoDialogForm
      :produto="produtoSelecionado"
      :visible="dialog"
      :categorias="categorias"
      @salvar="salvarProduto"
      @fechar="fecharDialog"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import { formartCurrency } from '@/utils/Formatters';
  import { ref, onMounted, computed } from 'vue';
  import ProdutoDialogForm from '@/components/ProdutoDialogForm.vue';
  import CategoriaService from '@/services/CategoriaService';
  import ProdutoService from '@/services/ProdutoService';
  import type { Produto } from '@/model/Produto';
  import type { Categoria } from '@/model/Categoria';
  import { useAuthStore } from '@/stores/Auth';
import axios from 'axios';


  const editandoQuantidadeId = ref<number | null>(null);
  const novaQuantidade = ref<number | null>(null);

  function permitirEdicaoQuantidade(item: Produto) {
    const auth = useAuthStore();
    if(!auth.isAuthenticated) {
      return;
    } 
    editandoQuantidadeId.value = item.id!;
    novaQuantidade.value = item.quantidade ?? 0;
  }

  
  async function salvarQuantidade(item: Produto) {
    if(novaQuantidade.value == null){
      return;
    }
    try {
      const response = await ProdutoService.atualizarQuantidade(item.id!, novaQuantidade.value);
      item.quantidade = response.data.quantidade;
      mostrarSnackbar('Quantidade atualizada com sucesso!', 'success');
  } catch (error) {
      mostrarSnackbar('Erro ao atualizar quantidade.', 'error');
  } finally {
      editandoQuantidadeId.value = null;
      novaQuantidade.value = null;
  }
  }

  const produtos = ref<Produto[]>([]);
  const loading = ref(true);
  const totalProdutos = ref(0);
  const itensPorPagina = ref(10);
  const options = ref({ 
    page: 1, 
    itemsPerPage: 10, 
    sortBy: [] as any[] 
  });

  const authStore = useAuthStore();
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isGestor = computed(() => authStore.isGestor);


  const dialog = ref(false);
  const produtoSelecionado = ref<Produto | null>(null);
  const categorias = ref<Categoria[]>([]);
  const snackbar = ref({ 
    show: false, 
    message: '', 
    color: '' 
  });

  const headersBase = [
    { title: 'Nome', key: 'nome', sortable: true },
    { title: 'Preço (R$)', key: 'preco', sortable: true },
    {title: 'Quantidade', key: 'quantidade', sortable: true },
    { title: 'Categoria', key: 'categoria.nome', sortable: false },
    { title: 'Ações', key: 'actions', sortable: false}
  ];

  const headers = computed(() => {
  return isGestor.value
    ? headersBase
    : headersBase.filter(h => h.key !== 'actions');
});

  onMounted(carregarCategorias);

  async function carregarCategorias() {
    try {
      const response = await CategoriaService.listarTodos(); 
      categorias.value = response.data;
    } catch (error) {
      mostrarSnackbar('Erro ao carregar categorias.', 'error');
    }
  }


async function carregarProdutos(newOptions: { page: number, itemsPerPage: number, sortBy: any[] }) {
    loading.value = true;
    options.value = newOptions;
    try{
        const response = await ProdutoService.listar(
            newOptions.page,
            newOptions.itemsPerPage,
            newOptions.sortBy
        );
        produtos.value = response.data.content;
        totalProdutos.value = response.data.totalElements;
    } finally{
        loading.value = false;
    }
}

async function salvarProduto(produtoFormData: any) {
  try {
    if (produtoFormData.id) {
      await ProdutoService.atualizar(produtoFormData.id, produtoFormData);
      mostrarSnackbar('Produto atualizado com sucesso!', 'success');
    } else {
      await ProdutoService.criar(produtoFormData);
      mostrarSnackbar('Produto criado com sucesso!', 'success');
    }
    fecharDialog();
    await carregarProdutos(
      { page: options.value.page, itemsPerPage: options.value.itemsPerPage, sortBy: options.value.sortBy }
    );
  } catch (error) {
    mostrarSnackbar('Erro ao salvar produto.', 'error');
  }
}

  async function deletarProduto(produto: Produto) {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        if (produto.id) {
          await ProdutoService.deletar(produto.id);
          mostrarSnackbar('Produto deletado com sucesso!', 'success');
          await carregarProdutos(
            { page: options.value.page, itemsPerPage: options.value.itemsPerPage, sortBy: options.value.sortBy }
          );
        }
      } catch (error) {
        mostrarSnackbar('Erro ao deletar produto.', 'error');
      }
    }
  }

  function abrirDialogParaCriar() {
    produtoSelecionado.value = null;
    dialog.value = true;
  }

  function abrirDialogParaEditar(produto: Produto) {
    produtoSelecionado.value = produto;
    dialog.value = true;
  }

  function fecharDialog() {
    dialog.value = false;
    produtoSelecionado.value = null;
  }

  function mostrarSnackbar(message: string, color: string) {
    snackbar.value.message = message;
    snackbar.value.color = color;
    snackbar.value.show = true;
  }
</script>