<template>
  <v-container>
    <div class="d-flex justify-end mb-4">
      <v-btn color="primary" @click="abrirDialogParaCriar">
        <v-icon icon="mdi-plus" class="mr-1"></v-icon>
        Novo Produto
      </v-btn>
    </div>

    <ProdutoTable
      :produtos="produtos"
      :loading="loading"
      @editar="abrirDialogParaEditar"
      @deletar="deletarProduto"
    />

    <ProdutoDialogForm
      :produto="produtoSelecionado"
      :visible="dialog"
      @salvar="salvarProduto"
      @fechar="fecharDialog"
    />

    <v-snackbar
      v-model="snackbar.show" :color="snackbar.color" :timeout="3000" >
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import ProdutoDialogForm from '@/components/ProdutoDialogForm.vue';
  import { Produto } from '@/model/Produto';
  import ProdutoTable from '@/components/ProdutoTable.vue';
  import ProdutoService from '@/services/ProdutoService';

  const produtos = ref<Produto[]>([]);
  const loading = ref(false);
  const dialog = ref(false);
  const produtoSelecionado = ref<Produto | null>(null);
  const snackbar = ref({
    show: false,
    message: '',
    color: ''
  });

  onMounted(carregarProdutos);

  async function carregarProdutos(){
    loading.value = true;
    try{
      const response = await ProdutoService.listar();
      produtos.value = response.data;
    } catch (error){
      mostrarSnaackbar('Erro ao carregar produtos.', 'error');
    } finally {
      loading.value = false;
    }
  }

  async function salvarProduto(produto: Produto){
    try{
      if(produto.id){
        await ProdutoService.atualizar(produto.id, produto);
        mostrarSnaackbar('Produto atualizado com sucesso.', 'success');
      } else {
        await ProdutoService.criar(produto);
        mostrarSnaackbar('Produto criado com sucesso.', 'success');
      }
      fecharDialog();
      await carregarProdutos();
    } catch (error){
      mostrarSnaackbar('Erro ao salvar produto.', 'error');
    }
  }

  async function deletarProduto(produto: Produto){
    if(confirm('Tem certeza que deseja excluir esse produto?')){
      try {
        if(produto.id){
          await ProdutoService.deletar(produto.id);
          mostrarSnaackbar('Produto deletado com sucesso.', 'success');
          await carregarProdutos();
        }
      } catch (error) {
        mostrarSnaackbar('Erro ao deletar produto.', 'error');
      }
    }
  }

  function abrirDialogParaCriar(){
    produtoSelecionado.value = null;
    dialog.value = true;
  }

  function abrirDialogParaEditar(produto: Produto){
    produtoSelecionado.value = produto;
    dialog.value = true;
  }

  function fecharDialog(){
    dialog.value = false;
    produtoSelecionado.value = null;
  }

  function mostrarSnaackbar(message: string, color: string){
    snackbar.value.message = message;
    snackbar.value.color = color;
    snackbar.value.show = true;
  }
</script>