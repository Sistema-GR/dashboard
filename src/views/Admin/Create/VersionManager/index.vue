<template>
  <Whiteboard title="Selecionar Data Version" :isSidebarMinimized="isSidebarMinimized">
    <div class="flex flex-col w-full items-start justify-start mt-5 pb-5 px-10 space-y-6">
      <!-- Dropdown para selecionar a versão -->
      <label for="version" class="text-20 font-semibold">Selecione uma versão:</label>
      <div class="w-full p-3 shadow-lg rounded-[10px] bg-white">
        <select
          id="version"
          v-model="selectedVersionId"
          @change="handleVersionChange"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" class="text-gray-400" disabled selected>Escolha uma versão</option>
          <option
            v-for="version in versions"
            :key="version.general_data_id"
            :value="version.general_data_id"
          >
            {{ version.description }}
          </option>
        </select>
      </div>

      <!-- Detalhes da versão -->
      <div v-if="selectedVersionDetails" class="w-full">
        <div class="bg-white shadow-lg rounded-[10px] p-6 space-y-4">
          <h3 class="text-15 font-semibold text-blue-600">Detalhes da Versão Selecionada</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
            <TextInput label="Descrição" v-model="editableVersionDetails.description" label-class="text-black"/>
            <TextInput label="Ano Pagamento" v-model="editableVersionDetails.year_value" label-class="text-black"/>
            <TextInput label="Valor Máximo" v-model="editableVersionDetails.max_value" label-class="text-black"/>
            <TextInput label="Data de Início" v-model="editableVersionDetails.start_date" label-class="text-black"/>
            <TextInput label="Data de Fim" v-model="editableVersionDetails.end_date" label-class="text-black"/>
            <TextInput label="Carga Máxima" v-model="editableVersionDetails.max_workload" label-class="text-black"/>
            <TextInput label="Rede Etapa 1" v-model="editableVersionDetails.idem_network_step_1" label-class="text-black"/>
            <TextInput label="Rede Etapa 2" v-model="editableVersionDetails.idem_network_step_2" label-class="text-black"/>
            <TextInput label="Rede Etapa 3" v-model="editableVersionDetails.idem_network_step_3" label-class="text-black"/>
          </div>
        </div>

        <!-- Botões de ação -->
        <div class="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
          <button
            @click="submitData"
            class="w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 focus:outline-none"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchVersions, createDataset, createGeneralData } from '../../../../service/apiService';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import TextInput from '@/components/Inputs/TextInput.vue';

export default {
  name: "VersionManager",
  components: { Whiteboard, TextInput },
  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized');
    const router = useRouter();
    const versions = ref([]);
    const selectedVersionId = ref(null); // Armazenar apenas o ID da versão selecionada
    const selectedVersionDetails = ref(null); // Dados da versão original (não alterados)
    const editableVersionDetails = ref(null); // Dados editáveis da versão
    const loading = ref(false);
    const errorMessage = ref("");

    // Buscar versões
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

    // Atualizar versão selecionada
    const handleVersionChange = () => {
      const selectedVersion = versions.value.find(
        version => version.general_data_id === selectedVersionId.value
      );
      if (selectedVersion) {
        selectedVersionDetails.value = { ...selectedVersion }; // Preservar os dados originais
        editableVersionDetails.value = { ...selectedVersion }; // Copiar dados para edição
      }
    };

    // Validação dos campos do formulário
    const validateInputs = () => {
      return editableVersionDetails.value &&
        editableVersionDetails.value.description &&
        editableVersionDetails.value.year_value &&
        editableVersionDetails.value.start_date &&
        editableVersionDetails.value.end_date &&
        editableVersionDetails.value.max_value &&
        editableVersionDetails.value.max_workload;
    };

    // Função chamada ao clicar no botão "Continuar"
    const submitData = async () => {
      errorMessage.value = "";

      if (!validateInputs()) return;

      try {
        // Construir o payload com os dados do formulário
        const payload = {
          description: editableVersionDetails.value.description.trim(),
          year_value: parseInt(editableVersionDetails.value.year_value, 10),  // Convertendo para número
          start_date: new Date(editableVersionDetails.value.start_date).toISOString().split("T")[0],  // Convertendo para data
          end_date: new Date(editableVersionDetails.value.end_date).toISOString().split("T")[0],  // Convertendo para data
          max_value: parseFloat(editableVersionDetails.value.max_value),  // Convertendo para número
          max_workload: parseFloat(editableVersionDetails.value.max_workload),  // Convertendo para número
          idem_network_step_1: parseFloat(editableVersionDetails.value.idem_network_step_1),  // Convertendo para número
          idem_network_step_2: parseFloat(editableVersionDetails.value.idem_network_step_2),  // Convertendo para número
          idem_network_step_3: parseFloat(editableVersionDetails.value.idem_network_step_3),  // Convertendo para número
        };

        console.log("Payload enviado para general-data:", payload);

        // Enviar o payload para a API e criar o general data
        const response = await createGeneralData(payload);

        // Verificar se a criação foi bem-sucedida e se o ID foi retornado
        const generalDataId = response.general_data?.general_data_id;
        if (!generalDataId) {
          throw new Error(`Erro: Nenhum general_data_id foi retornado pela API.`);
        }

        console.log("General Data ID retornado:", generalDataId);

        // Criar dataset com o ID do general data
        await createDataset(generalDataId);

        // Passar o generalDataId e a versão selecionada para a página de imports
        router.push({ 
          path: "/home/imports", 
          query: { generalDataId, versionId: selectedVersionId.value }
        });
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        errorMessage.value = "Ocorreu um erro ao enviar os dados.";
      }
    };

    onMounted(fetchVersionsData);

    return {
      isSidebarMinimized,
      versions,
      selectedVersionId,
      selectedVersionDetails,
      editableVersionDetails,
      handleVersionChange,
      submitData,
      loading,
      errorMessage,
      
    };
  },
};
</script>
