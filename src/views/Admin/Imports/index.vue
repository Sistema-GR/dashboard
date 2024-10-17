<template>
  <Whiteboard title="importações" :isSidebarMinimized="isSidebarMinimized">
    <div class="w-full space-y-10">
      <FileInput Label="Importar Arquivo com Nome Atividades.csv" @change="(event) => handleFileUpload(event, 'atividades')" />
      <FileInput Label="Importar Arquivo com Nome Dados Gerais.csv" @change="(event) => handleFileUpload(event, 'dadosGerais')" />
      <FileInput Label="Importar Arquivo com Nome Definição Etapas.csv" @change="(event) => handleFileUpload(event, 'definicaoEtapas')" />
      <FileInput Label="Importar Arquivo com Nome Demissões.csv" @change="(event) => handleFileUpload(event, 'demissoes')" />
      <FileInput Label="Importar Arquivo com Nome Dias Não Contabilizados.csv" @change="(event) => handleFileUpload(event, 'diasNaoContabilizados')" />
      <FileInput Label="Importar Arquivo com Nome Etapas Metas.csv" @change="(event) => handleFileUpload(event, 'etapasMetas')" />
      <FileInput Label="Importar Arquivo com Nome Formações.csv" @change="(event) => handleFileUpload(event, 'formacoes')" />
      <FileInput Label="Importar Arquivo com Nome Frequência.csv" @change="(event) => handleFileUpload(event, 'frequencia')" />
      <FileInput Label="Importar Arquivo com Nome Funcionario.csv" @change="(event) => handleFileUpload(event, 'funcionarios')" />
      <FileInput Label="Importar Arquivo com Nome Funções Grupos Etapas.csv" @change="(event) => handleFileUpload(event, 'funcoesGruposEtapas')" />
      <FileInput Label="Importar Arquivo com Nome Motivos Infrequência.csv" @change="(event) => handleFileUpload(event, 'motivosInfrequencia')" />
      <FileInput Label="Importar Arquivo com Nome Tipo Local.csv" @change="(event) => handleFileUpload(event, 'tipoLocal')" />
      <FileInput Label="Importar Arquivo com Nome Ues Perc Gr.csv" @change="(event) => handleFileUpload(event, 'uesPercGr')" />
      <FileInput Label="Importar Arquivo com Nome Valores Grupo.csv" @change="(event) => handleFileUpload(event, 'valoresGrupo')" />

      <div class="flex w-full items-end justify-end mt-8">
          <div class="w-4/12 lg:w-2/12">
            <PrimaryButton
              :disabled="isUploading"
              @click="uploadFiles"
              class="bg-blue-500 py-2 px-3 text-sm"
              value="Enviar"
            />
            <Loading v-if="isUploading" />
          </div>
      </div>

    </div>

  </Whiteboard>
</template>

<script>
import { inject } from 'vue';
import axios from 'axios';
import FileInput from '@/components/Inputs/FileInput.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import Loading from '@/components/Loading/Loading.vue';

export default {
  components: { FileInput, Whiteboard, PrimaryButton, Loading },

  data() {
    return {
      files: {
        funcionarios: null,
        atividades: null,
        tipoLocal: null,
        dadosGerais: null,
        funcoesGruposEtapas: null,
        valoresGrupo: null,
        etapasMetas: null,
        uesPercGr: null,
        definicaoEtapas: null,
        diasNaoContabilizados: null,
        demissoes: null,
        formacoes: null,
        motivosInfrequencia: null,
        frequencia: null,
      },
      BASE_URL: "http://localhost:8000/csv",
      endpoint: {
        funcionarios: "/process/funcionarios/",
        atividades: "/process/atividades/",
        tipoLocal: "/process/tipo-local/",
        dadosGerais: "/process/dados-gerais/",
        funcoesGruposEtapas: "/process/funcoes-grupo/",
        valoresGrupo: "/process/valores-grupo/",
        etapasMetas: "/process/etapas-metas/",
        uesPercGr: "/process/percentual-gratificacao/",
        definicaoEtapas: "/process/definicao-etapas/",
        diasNaoContabilizados: "/process/dias-nao-contabilizados/",
        demissoes: "/process/demissoes/",
        formacoes: "/process/formacoes/",
        motivosInfrequencia: "/process/motivos-infrequencia/",
        frequencia: "/process/frequencia/"
      },
      isUploading: false,
      isSidebarMinimized: null,
    };
  },
  created() {
    this.isSidebarMinimized = inject('isSidebarMinimized');
  },
  methods: {
  handleFileUpload(event, fileType) {
    const file = event.target.files[0];
    if (file && file.type !== 'text/csv') {
      alert('Por favor, selecione um arquivo CSV válido.');
      return;
    }
    this.files[fileType] = file;
    console.log(`${fileType} selecionado:`, file);
  },
  async uploadFiles() {
    const filesToUpload = Object.entries(this.files).filter(
      ([key, value]) => value !== null
    );
    if (filesToUpload.length === 0) {
      alert('Por favor, selecione pelo menos um arquivo!');
      return;
    }

    this.isUploading = true;

    try {
      // Faz upload de cada arquivo individualmente
      for (const [key, file] of filesToUpload) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(
          `${this.BASE_URL}${this.endpoint[key]}`,
          formData
        );
        console.log(`${key} arquivo carregado com sucesso`, response.data);
      }

      // Após o upload de todos os arquivos, chama a rota para processar todos eles
      await axios.get(`${this.BASE_URL}/process/all-files/`);
      console.log("Todos os arquivos processados com sucesso!");

      alert('Arquivos enviados e processados com sucesso!');

      // Redirecionar para a página de administração
      this.$router.push({ path: '/admin' });
    } catch (error) {
      console.error('Erro ao carregar ou processar os arquivos:', error);
      alert(
        'Erro ao carregar ou processar os arquivos: ' +
          (error.response?.data?.error || error.message)
      );
    } finally {
      this.isUploading = false;
    }
  },
},
};
</script>
