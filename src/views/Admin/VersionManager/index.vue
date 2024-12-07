<template>
    <Whiteboard title="Selecionar Data Version" :isSidebarMinimized="isSidebarMinimized">
      <div class="flex flex-col w-full items-center justify-center mt-5 pb-5">
        <!-- Dropdown para selecionar a versão -->
        <label for="version" class="mb-2 text-lg font-semibold">Selecione uma versão:</label>
        <select
          id="version"
          v-model="selectedVersion"
          @change="handleVersionChange"
          class="w-1/2 p-3 mb-4 border border-gray-300 rounded-md"
        >
          <option value="" disabled selected>Escolha uma versão</option>
          <option
            v-for="version in versions"
            :key="version.general_data_id"
            :value="version.general_data_id"
          >
            {{ version.general_data_id }} - {{ version.start_date }} até {{ version.end_date }}
          </option>
        </select>
  
        <!-- Detalhes da versão selecionada -->
        <div
          v-if="selectedVersionDetails"
          class="mt-4 w-1/2 p-6 border rounded-md bg-gradient-to-r from-blue-50 via-white to-blue-50 shadow-lg"
        >
          <h3 class="text-lg font-semibold text-blue-600 mb-4">Detalhes da Versão Selecionada</h3>
          <ul class="text-gray-700 space-y-2">
            <li><strong>ID:</strong> {{ selectedVersionDetails.general_data_id }}</li>
            <li><strong>Data de Início:</strong> {{ selectedVersionDetails.start_date }}</li>
            <li><strong>Data de Fim:</strong> {{ selectedVersionDetails.end_date }}</li>
            <li><strong>Valor Máximo:</strong> {{ selectedVersionDetails.max_value }}</li>
            <li><strong>Carga Máxima:</strong> {{ selectedVersionDetails.max_workload }}</li>
          </ul>
        </div>
  
        <!-- Botões de ações -->
        <div v-if="selectedVersion" class="mt-6 w-1/2 flex flex-col gap-4">
          <!-- Botão para criar o dataset -->
          <div>
            <label for="datasetName" class="block text-lg font-semibold mb-2">Nome da nova versão:</label>
            <input
              type="text"
              id="datasetName"
              v-model="datasetName"
              placeholder="Digite o nome"
              class="w-full p-3 border border-gray-300 rounded-md"
            />
            <button
              @click="createDataset"
              :disabled="!datasetName"
              class="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-md disabled:bg-gray-300"
            >
              Criar Dataset
            </button>
          </div>
  
          <!-- Botão para continuar -->
          <button
            @click="navigateToImports"
            class="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-md"
          >
            Continuar
          </button>
        </div>
  
        <!-- Botão para criar novo dataset -->
        <div class="mt-6 w-1/2">
          <button
            @click="navigateToNewCal"
            class="w-full bg-gray-700 hover:bg-gray-800 text-white py-3 rounded-md"
          >
            Criar Novo Data
          </button>
        </div>
  
        <!-- Mensagem de carregamento -->
        <p v-if="loading" class="text-gray-500 mt-4">Carregando versões...</p>
      </div>
    </Whiteboard>
  </template>
  
  <script>
  import { ref, inject, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { fetchVersions, createDataset } from '../../../service/apiService'; 
  import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
  
  export default {
    name: "VersionManager",
    components: { Whiteboard },
    setup() {
      const isSidebarMinimized = inject('isSidebarMinimized');
      const router = useRouter();
      const versions = ref([]);
      const selectedVersion = ref(null);
      const selectedVersionDetails = ref(null);
      const datasetName = ref('');
      const loading = ref(false);
  
      const fetchVersionsData = async () => {
        loading.value = true;
        try {
          versions.value = await fetchVersions();
        } catch (error) {
          console.error("Erro ao buscar versões:", error);
        } finally {
          loading.value = false;
        }
      };
  
      const handleVersionChange = () => {
        selectedVersionDetails.value = versions.value.find(
          version => version.general_data_id === selectedVersion.value
        );
      };
  
      const createNewDataset = async () => {
        try {
          await createDataset(selectedVersion.value, datasetName.value);
          alert("Dataset criado com sucesso!");
          datasetName.value = '';
          navigateToImports();
        } catch (error) {
          alert("Erro ao criar dataset.");
          console.error("Erro ao criar dataset:", error);
        }
      };
  
      const navigateToImports = () => {
        router.push('/home/imports');
      };
  
      const navigateToNewCal = () => {
        router.push('/home/newcal');
      };
  
      onMounted(fetchVersionsData);
  
      return {
        isSidebarMinimized,
        versions,
        selectedVersion,
        selectedVersionDetails,
        datasetName,
        handleVersionChange,
        createNewDataset,
        navigateToImports,
        navigateToNewCal,
        loading
      };
    }
  };
</script>
