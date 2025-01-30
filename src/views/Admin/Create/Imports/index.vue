<template>
  <Whiteboard title="importações" :isSidebarMinimized="isSidebarMinimized">
     <!-- Dropdown para seleção de pasta -->
     <div class="mb-4">
        <label for="folderDropdown" class="block text-sm font-medium text-gray-700">
          Selecione uma versão de Dataset de Arquivos:
        </label>
        <select
          id="folderDropdown"
          class="mt-2 block w-full py-2 px-5 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          v-model="selectedFolder"
          @change="fetchFiles"
        >
          <option value="" disabled>Escolha uma pasta</option>
          <option v-for="folder in folders" :key="folder.folder_uuid" :value="folder.folder_uuid">
            {{ folder.folder_uuid }}
          </option>
        </select>
      </div>
      
    <div class="w-full space-y-10">
      <FileInput Label="Importar Arquivo com Nome: Aprender Mais.csv" @change="(event) => handleFileUpload(event, 'aprenderMais')" />
      <FileInput Label="Importar Arquivo com Nome: Atividades.csv" @change="(event) => handleFileUpload(event, 'atividades')" />
      <FileInput Label="Importar Arquivo com Nome: Dados Gerais.csv" @change="(event) => handleFileUpload(event, 'dadosGerais')" />
      <FileInput Label="Importar Arquivo com Nome: Definição Etapas.csv" @change="(event) => handleFileUpload(event, 'definicaoEtapas')" />
      <FileInput Label="Importar Arquivo com Nome: Demissões.csv" @change="(event) => handleFileUpload(event, 'demissoes')" />
      <FileInput Label="Importar Arquivo com Nome: Dias Não Contabilizados.csv" @change="(event) => handleFileUpload(event, 'diasNaoContabilizados')" />
      <FileInput Label="Importar Arquivo com Nome: Etapas Metas.csv" @change="(event) => handleFileUpload(event, 'etapasMetas')" />
      <FileInput Label="Importar Arquivo com Nome: Formações.csv" @change="(event) => handleFileUpload(event, 'formacoes')" />
      <FileInput Label="Importar Arquivo com Nome: Frequência.csv" @change="(event) => handleFileUpload(event, 'frequencia')" />
      <FileInput Label="Importar Arquivo com Nome: Funcionario.csv" @change="(event) => handleFileUpload(event, 'funcionarios')" />
      <FileInput Label="Importar Arquivo com Nome: Funções Grupos Etapas.csv" @change="(event) => handleFileUpload(event, 'funcoesGruposEtapas')" />
      <FileInput Label="Importar Arquivo com Nome: Motivos Infrequência.csv" @change="(event) => handleFileUpload(event, 'motivosInfrequencia')" />
      <FileInput Label="Importar Arquivo com Nome: Tipo Local.csv" @change="(event) => handleFileUpload(event, 'tipoLocal')" />
      <FileInput Label="Importar Arquivo com Nome: Ues Perc Gr.csv" @change="(event) => handleFileUpload(event, 'uesPercGr')" />

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
import CryptoJS from 'crypto-js';
import FileInput from '@/components/Inputs/FileInput.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import Loading from '@/components/Loading/Loading.vue';
import { getAccessToken } from '@/service/token.js'; // Importando o serviço de token

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
        aprenderMais: null,
        etapasMetas: null,
        uesPercGr: null,
        definicaoEtapas: null,
        diasNaoContabilizados: null,
        demissoes: null,
        formacoes: null,
        motivosInfrequencia: null,
        frequencia: null,
      },
      BASE_URL: "http://10.203.2.98:8000/csv",
      endpoint: {
        funcionarios: "/process/funcionarios/",
        atividades: "/process/atividades/",
        tipoLocal: "/process/tipo-local/",
        dadosGerais: "/process/dados-gerais/",
        funcoesGruposEtapas: "/process/funcoes-grupo/",
        aprenderMais: "/process/aprender-mais/",
        etapasMetas: "/process/etapas-metas/",
        uesPercGr: "/process/percentual-gratificacao/",
        definicaoEtapas: "/process/definicao-etapas/",
        diasNaoContabilizados: "/process/dias-nao-contabilizados/",
        demissoes: "/process/demissoes/",
        formacoes: "/process/formacoes/",
        motivosInfrequencia: "/process/motivos-infrequencia/",
        frequencia: "/process/frequencia/"
      },
      folders: [],
      selectedFolder: '',
      isUploading: false,
      isSidebarMinimized: null,
      errorMessage: '',
    };
  },

  created() {
    this.isSidebarMinimized = inject('isSidebarMinimized');
    this.fetchFolders();
  },

  methods: {
    handleFileUpload(event, fileType) {
      const file = event.target.files[0];
      if (file && file.type !== 'text/csv') {
        this.errorMessage = 'Por favor, selecione um arquivo CSV válido.';
        return;
      }
      this.files[fileType] = file;
      this.errorMessage = '';
      console.log(`${fileType} selecionado:`, file);
    },

    async fetchFolders() {
      try {
        const token = await getAccessToken();
        if (!token) {
          this.errorMessage = 'Usuário não autenticado. Faça login novamente.';
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${this.BASE_URL}/api/get-dataset/`, config);
        this.folders = response.data;
      } catch (error) {
        this.errorMessage = 'Erro ao buscar pastas. Verifique sua conexão ou credenciais.';
      }
    },

    async fetchFiles() {
      if (!this.selectedFolder) return;

      try {
        const token = await getAccessToken();
        if (!token) {
          this.errorMessage = 'Usuário não autenticado. Faça login novamente.';
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            folder_uuid: this.selectedFolder,
          },
        };

        const response = await axios.get(`${this.BASE_URL}/api/raw-datafiles/`, config);
        const encryptedUrls = response.data.file_urls;

        // Processa os URLs criptografados usando a chave Fernet
        this.fileInputs = await Promise.all(
          encryptedUrls.map(async (encryptedPath, index) => {
            const decryptedPath = await this.decryptData(encryptedPath); // Descriptografar com a função modificada

            if (!decryptedPath) {
              console.error(`Falha ao descriptografar o arquivo ${index + 1}`);
              return null;
            }

            try {
              const fileResponse = await axios.get(decryptedPath, { responseType: 'blob' });
              const file = new File([fileResponse.data], decryptedPath.split('/').pop(), { type: 'text/csv' });
              return { name: `Arquivo ${index + 1}`, file };
            } catch (error) {
              console.error('Erro ao baixar o arquivo:', error);
              return null;
            }
          })
        );

        console.log('Arquivos preparados para upload:', this.fileInputs.filter(Boolean));
      } catch (error) {
        this.errorMessage = 'Erro ao buscar arquivos. Verifique sua conexão ou credenciais.';
      }
    },

    decryptData(encryptedData, key) {
      try {
        // Verifica se os dados criptografados e a chave são válidos
        if (!encryptedData || !key) {
          throw new Error('Dados criptografados ou chave ausentes');
        }

        // Converte a chave para o formato base64, se não estiver nesse formato
        if (typeof key !== 'string' || !/^([A-Za-z0-9+\/=]{43})$/.test(key)) {
          throw new Error('Chave Fernet inválida. A chave deve estar em base64.');
        }

        // Cria uma instância do Fernet com a chave base64
        const fernet = new Fernet(key);

        // Descriptografa os dados criptografados
        const decryptedData = fernet.decrypt(encryptedData);

        // Verifica se os dados descriptografados são válidos
        if (!decryptedData || decryptedData.trim() === "") {
          throw new Error('Descriptografia falhou ou retornou dados vazios');
        }

        console.log('Dados Descriptografados:', decryptedData);  // Verifique os dados descriptografados no console
        return decryptedData;
      } catch (error) {
        // Tratamento de erro aprimorado
        console.error('Erro de descriptografia:', error);
        this.errorMessage = `Erro ao descriptografar os dados: ${error.message}`;
        return null;
      }
    },


    // Converter base64 para ArrayBuffer
    base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64);
      const length = binaryString.length;
      const bytes = new Uint8Array(length);
      for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    },

    // Criar uma chave para o processo de descriptografia
    async getCryptoKey() {
      const keyData = new TextEncoder().encode("your-secret-key"); // A chave de criptografia
      return window.crypto.subtle.importKey(
        'raw', keyData, { name: 'AES-GCM' }, false, ['decrypt']
      );
    },

    async uploadFiles() {
      const filesToUpload = Object.entries(this.files).filter(
        ([key, value]) => value !== null
      );

      if (filesToUpload.length === 0) {
        this.errorMessage = 'Por favor, selecione pelo menos um arquivo!';
        return;
      }

      const invalidFiles = filesToUpload.filter(
        ([key, file]) => file.type !== 'text/csv'
      );
      if (invalidFiles.length > 0) {
        this.errorMessage = 'Todos os arquivos devem ser do tipo CSV.';
        return;
      }

      this.isUploading = true;
      this.errorMessage = '';

      const token = await getAccessToken();
      if (!token) {
        this.errorMessage = 'Usuário não autenticado ou token expirado.';
        this.isUploading = false;
        return;
      }

      try {
        for (const [key, file] of filesToUpload) {
          const formData = new FormData();
          formData.append('file', file);

          const config = {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          };

          const response = await axios.post(
            `${this.BASE_URL}${this.endpoint[key]}`,
            formData,
            config
          );
          console.log(`${key} arquivo carregado com sucesso`, response.data);
        }

        await axios.get(`${this.BASE_URL}/process/all-files/`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        console.log("Todos os arquivos processados com sucesso!");

        this.$router.push({ path: '/admin/dashboard' });
      } catch (error) {
        this.errorMessage =
          'Erro ao carregar ou processar os arquivos: ' +
          (error.response?.data?.error || error.message);
      } finally {
        this.isUploading = false;
      }
    },
  },
};
</script>