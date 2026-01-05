<template>
  <Whiteboard title="Importações" >     
    <div class="w-full py-5 px-10 space-y-10">
      
      <div class="p-5 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">
          Arquivos Necessários para o Processo
        </h3>
        <p class="text-gray-600 mb-4">
          Por favor, certifique-se de que os nomes dos 14 arquivos .csv correspondem
          exatamente aos listados abaixo antes de fazer o upload.
        </p>
        
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1 text-sm text-gray-700">
          <li v-for="fileName in requiredFiles" :key="fileName">
            <code class="font-mono bg-gray-200 px-2 py-1 rounded">{{ fileName }}</code>
          </li>
        </ul>
      </div>

      <FileInput Label="Importar Arquivos em .CSV"
      @isUploading="loadingUpdate"
      @uploaded="onUnifiedUploaded"/>
    </div>
    <Loading v-if="isUploading" />
  </Whiteboard>
</template>

<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import FileInput from '@/components/Inputs/FileInput.vue';
import Loading from '@/components/Loading/Loading.vue';

export default {
  components: { FileInput, Whiteboard, Loading },
  
  data() {
    return {     
      isUploading: false,
      requiredFiles: [
        'funcionarios.csv',
        'demissoes.csv',
        'frequencia.csv',
        'atividades.csv',
        'formacoes.csv',
        'dias_nao_contabilizados.csv',
        'motivos_infrequencia.csv',
        'etapas_metas_ue.csv',
        'ues_perc_gr.csv',
        'tipo_local.csv',
        'definicao_etapas.csv',
        'aprender_mais.csv',
        'dados_gerais.csv',
        'funcao_grupo_etapas.csv',
      ],
    };
  },

  methods: {
    onUnifiedUploaded({ manifest }) {
      console.log('Unified upload manifest', manifest);
      this.isUploading = false;
      this.$router.push({ name: 'dash' });
    },
    loadingUpdate(valor) {
      this.isUploading = valor;      
    },
  },
};
</script>