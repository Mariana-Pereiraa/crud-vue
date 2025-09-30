<template>
  <v-container>
    <v-card class="pa-4" elevation="3">
      <div class="d-flex align-center mb-4">
        <h1 class="text-h5">Gerenciamento de Produtos</h1>
        <v-spacer></v-spacer>
        <v-btn color="primary" elevation="2" @click="abrirDialogParaCriar">
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
        <template v-slot:item.preco="{ item }">
          {{ formartCurrency(item.preco) }}

        </template>

        <template v-slot:item.categoriaNome="{ item }">
          {{ item.categoriaNome || '-' }}
        </template>

        <template v-slot:item.actions="{ item }">
          <v-icon class="mr-2" color="blue" @click="abrirDialogParaEditar(item)">mdi-pencil</v-icon>
          <v-icon color="red" @click="deletarProduto(item)">mdi-delete</v-icon>
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
  import { ref, onMounted } from 'vue';
  import ProdutoDialogForm from '@/components/ProdutoDialogForm.vue';
  import CategoriaService from '@/services/CategoriaService';
  import ProdutoService from '@/services/ProdutoService';
  import type { Produto } from '@/model/Produto';
  import type { Categoria } from '@/model/Categoria';

  const produtos = ref<Produto[]>([]);
  const loading = ref(true);
  const totalProdutos = ref(0);
  const itensPorPagina = ref(10);
  const options = ref({ 
    page: 1, 
    itemsPerPage: 10, 
    sortBy: [] as any[] 
  });

  const dialog = ref(false);
  const produtoSelecionado = ref<Produto | null>(null);
  const categorias = ref<Categoria[]>([]);
  const snackbar = ref({ 
    show: false, 
    message: '', 
    color: '' 
  });

  const headers = [
    { title: 'Nome', key: 'nome', sortable: true },
    { title: 'Preço (R$)', key: 'preco', sortable: true },
    { title: 'Categoria', key: 'categoria.nome', sortable: false },
    { title: 'Ações', key: 'actions', sortable: false}
  ];

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