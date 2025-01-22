<template>
  <Whiteboard title="Importações" :isSidebarMinimized="isSidebarMinimized">
    <div class="w-full space-y-10">
      <!-- Dropdown de seleção de Dataset -->
      <div class="mb-4">
        <label for="dataset" class="block text-gray-700">Selecione o Dataset</label>
        <select v-model="selectedDataset" @change="loadDatasetFiles" class="p-2 border w-full rounded-lg">
          <option v-for="(dataset, index) in datasets" :key="dataset.folder_uuid" :value="dataset.folder_uuid">
            {{ dataset.folder_uuid }}
          </option>
        </select>
      </div>

      <div class="w-full space-y-10">
        <FileInput ref="aprenderMais" Label="Importar Arquivo com Nome: Aprender Mais.csv" :file="files.aprenderMais" @change="(event) => handleFileUpload(event, 'aprenderMais')" />
        <FileInput ref="atividades" Label="Importar Arquivo com Nome: Atividades.csv" :file="files.atividades" @change="(event) => handleFileUpload(event, 'atividades')" />
        <FileInput ref="dadosGerais" Label="Importar Arquivo com Nome: Dados Gerais.csv" :file="files.dadosGerais" @change="(event) => handleFileUpload(event, 'dadosGerais')" />
        <FileInput ref="definicaoEtapas" Label="Importar Arquivo com Nome: Definição Etapas.csv" :file="files.definicaoEtapas" @change="(event) => handleFileUpload(event, 'definicaoEtapas')" />
        <FileInput ref="demissoes" Label="Importar Arquivo com Nome: Demissões.csv" :file="files.demissoes" @change="(event) => handleFileUpload(event, 'demissoes')" />
        <FileInput ref="diasNaoContabilizados" Label="Importar Arquivo com Nome: Dias Não Contabilizados.csv" :file="files.diasNaoContabilizados" @change="(event) => handleFileUpload(event, 'diasNaoContabilizados')" />
        <FileInput ref="etapasMetas" Label="Importar Arquivo com Nome: Etapas Metas.csv" :file="files.etapasMetas" @change="(event) => handleFileUpload(event, 'etapasMetas')" />
        <FileInput ref="formacoes" Label="Importar Arquivo com Nome: Formações.csv" :file="files.formacoes" @change="(event) => handleFileUpload(event, 'formacoes')" />
        <FileInput ref="frequencia" Label="Importar Arquivo com Nome: Frequência.csv" :file="files.frequencia" @change="(event) => handleFileUpload(event, 'frequencia')" />
        <FileInput ref="funcoesGruposEtapas" Label="Importar Arquivo com Nome: Funções Grupos Etapas.csv" :file="files.funcoesGruposEtapas" @change="(event) => handleFileUpload(event, 'funcoesGruposEtapas')" />
        <FileInput ref="funcionarios" Label="Importar Arquivo com Nome: Funcionario.csv" :file="files.funcionarios" @change="(event) => handleFileUpload(event, 'funcionarios')" />
        <FileInput ref="motivosInfrequencia" Label="Importar Arquivo com Nome: Motivos Infrequência.csv" :file="files.motivosInfrequencia" @change="(event) => handleFileUpload(event, 'motivosInfrequencia')" />
        <FileInput ref="tipoLocal" Label="Importar Arquivo com Nome: Tipo Local.csv" :file="files.tipoLocal" @change="(event) => handleFileUpload(event, 'tipoLocal')" />
        <FileInput ref="uesPercGr" Label="Importar Arquivo com Nome: Ues Perc Gr.csv" :file="files.uesPercGr" @change="(event) => handleFileUpload(event, 'uesPercGr')" />
      </div>
      <div class="text-red-500" v-if="errorMessage">{{ errorMessage }}</div>

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
import { getAccessToken } from '@/service/token.js';

export default {
  components: { FileInput, Whiteboard, PrimaryButton, Loading },

  data() {
    return {
      datasets: [],
      selectedDataset: null,
      files: { // Inicializando os campos com valores nulos
        aprenderMais: null,
        atividades: null,
        dadosGerais: null,
        definicaoEtapas: null,
        demissoes: null,
        diasNaoContabilizados: null,
        etapasMetas: null,
        formacoes: null,
        frequencia: null,
        funcoesGruposEtapas: null,
        funcionarios: null,
        motivosInfrequencia: null,
        tipoLocal: null,
        uesPercGr: null
      },
      BASE_URL: "http://10.203.2.98:8000/csv",
      endpoint: {
        aprenderMais: "/process/aprender-mais/",
        atividades: "/process/atividades/",
        dadosGerais: "/process/dados-gerais/",
        definicaoEtapas: "/process/definicao-etapas/",
        demissoes: "/process/demissoes/",
        diasNaoContabilizados: "/process/dias-nao-contabilizados/", 
        etapasMetas: "/process/etapas-metas/",
        formacoes: "/process/formacoes/",
        frequencia: "/process/frequencia/",
        funcionarios: "/process/funcionarios/",
        funcoesGruposEtapas: "/process/funcoes-grupo/",
        motivosInfrequencia: "/process/motivos-infrequencia/",
        tipoLocal: "/process/tipo-local/",
        uesPercGr: "/process/percentual-gratificacao/",
      },
      isUploading: false,
      isSidebarMinimized: null,
      errorMessage: '',
    };
  },

  created() {
    this.isSidebarMinimized = inject('isSidebarMinimized');
    this.fetchDatasets();
  },

  methods: {
    async fetchDatasets() {
      const token = await getAccessToken();
      if (!token) {
        this.errorMessage = 'Usuário não autenticado';
        return;
      }

      try {
        const response = await axios.get(`${this.BASE_URL}/api/get-dataset`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.datasets = response.data;
      } catch (error) {
        this.errorMessage = `Erro: ${error.response?.status} - ${error.response?.data.error || 'Erro ao carregar datasets'}`;
        console.error(error);
      }
    },

    async loadDatasetFiles() {
      if (!this.selectedDataset) return;

      const token = await getAccessToken();
      if (!token) {
        this.errorMessage = 'Usuário não autenticado';
        return;
      }

      try {
        const response = await axios.get(`${this.BASE_URL}/api/raw-datafiles`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { dataset_id: this.selectedDataset },
        });

        console.log('Arquivos recebidos:', response.data.files);

        const fileMapping = {
          aprenderMais: 'Aprender Mais.csv',
          atividades: 'Atividades.csv',
          dadosGerais: 'Dados Gerais.csv',
          definicaoEtapas: 'Definição Etapas.csv',
          demissoes: 'Demissões.csv',
          diasNaoContabilizados: 'Dias Não Contabilizados.csv',
          etapasMetas: 'Etapas Metas.csv',
          formacoes: 'Formações.csv',
          frequencia: 'Frequência.csv',
          funcoesGruposEtapas: 'Funções Grupos Etapas.csv',
          funcionarios: 'Funcionario.csv',
          motivosInfrequencia: 'Motivos Infrequência.csv',
          tipoLocal: 'Tipo Local.csv',
          uesPercGr: 'Ues Perc Gr.csv',
        };

        response.data.files.forEach((file) => {
          for (let [key, value] of Object.entries(fileMapping)) {
            if (file.includes(value) && !this.files[key]) {
              const fileToAssign = new File([new Blob([file])], value);
              this.files[key] = fileToAssign;
              this.handleFileUpload({ target: { files: [fileToAssign] } }, key);
              break;
            }
          }
        });

        console.log("Arquivos correspondidos e atribuídos:", this);

      } catch (error) {
        this.errorMessage = `Erro ao carregar os arquivos do dataset: ${error.response?.status} - ${error.response?.data.error || 'Erro desconhecido'}`;
        console.error(error);
      }
    },

    handleFileUpload(event, fileType) {
      const file = event.target.files[0];
      if (file && file.type !== 'text/csv') {
        this.errorMessage = 'Por favor, selecione um arquivo CSV válido.';
        return;
      }
      this.files[fileType] = file;
      this.errorMessage = '';
    },

    async uploadFiles() {
      const filesToUpload = Object.entries(this.files).filter(([key, value]) => value !== null);

      if (filesToUpload.length === 0) {
        this.errorMessage = 'Por favor, selecione pelo menos um arquivo!';
        return;
      }

      this.isUploading = true;
      this.errorMessage = '';

      const token = await getAccessToken();
      if (!token) {
        this.errorMessage = 'Usuário não autenticado';
        this.isUploading = false;
        return;
      }

      try {
        for (const [key, file] of filesToUpload) {
          const formData = new FormData();
          formData.append('file', file);

          const config = {
            headers: { 'Authorization': `Bearer ${token}` }
          };

          const response = await axios.post(`${this.BASE_URL}${this.endpoint[key]}`, formData, config);
          console.log(`${key} arquivo carregado com sucesso`, response.data);
        }

        await axios.get(`${this.BASE_URL}/process/all-files/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        this.$router.push({ path: '/admin/dashboard' });
      } catch (error) {
        console.error('Erro ao carregar ou processar os arquivos:', error);
        this.errorMessage = 'Erro ao carregar ou processar os arquivos';
      } finally {
        this.isUploading = false;
      }
    },
  },
};
</script>
