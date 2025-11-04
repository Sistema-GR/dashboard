<template>
  <Whiteboard title="Selecionar Data Version" >
    <div class="flex flex-col w-full items-start justify-start mt-5 pb-5 px-10 space-y-6">
      <!-- Dropdown para selecionar a versão -->
      <label for="version" class="text-20 font-semibold">Selecione uma versão:</label>
      <div class="w-full p-3 shadow-lg rounded-[10px] bg-white">
        <select
          id="version"
          v-model="selectedVersionId"
          @change="handleVersionChange"
          class="w-full p-3 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black p-4 border rounded-md">
            <div><strong class="font-semibold">Descrição:</strong> <p>{{ selectedVersionDetails.description }}</p></div>
            <div><strong class="font-semibold">Ano Pagamento:</strong> <p>{{ selectedVersionDetails.year_value }}</p></div>
            <div><strong class="font-semibold">Valor Máximo:</strong> <p>{{ selectedVersionDetails.max_value }}</p></div>
            <div><strong class="font-semibold">Data de Início:</strong> <p>{{ selectedVersionDetails.start_date }}</p></div>
            <div><strong class="font-semibold">Data de Fim:</strong> <p>{{ selectedVersionDetails.end_date }}</p></div>
            <div><strong class="font-semibold">Carga Máxima:</strong> <p>{{ selectedVersionDetails.max_workload }}</p></div>
            <div><strong class="font-semibold">Rede Etapa 1:</strong> <p>{{ selectedVersionDetails.idem_network_step_1 }}%</p></div>
            <div><strong class="font-semibold">Rede Etapa 2:</strong> <p>{{ selectedVersionDetails.idem_network_step_2 }}%</p></div>
            <div><strong class="font-semibold">Rede Etapa 3:</strong> <p>{{ selectedVersionDetails.idem_network_step_3 }}%</p></div>
          </div>
        </div>

        <!-- Botões de ação -->
        <div class="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
          <button
            @click="submitData"
            class="w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-[10px] hover:bg-green-600 focus:outline-none"
          >
            Continuar
          </button>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchVersions, createDataset, createGeneralData } from '../../../../service/apiService';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';

export default {
  name: "CreateFromTemplate",
  components: { Whiteboard },
  setup() {
    const router = useRouter();
    const versions = ref([]);
    const selectedVersionId = ref(null); 
    const selectedVersionDetails = ref(null); 
    const loading = ref(false);
    const errorMessage = ref("");

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
      const selectedVersion = versions.value.find(
        version => version.general_data_id === selectedVersionId.value
      );
      if (selectedVersion) {
        selectedVersionDetails.value = { ...selectedVersion };
      }
    };

    const submitData = async () => {
      errorMessage.value = "";

      if (!selectedVersionDetails.value) return;

      try {
        const payload = {
          ...selectedVersionDetails.value,
          description: selectedVersionDetails.value.description.trim() 
        };

        delete payload.general_data_id;

        const response = await createGeneralData(payload);

        const generalDataId = response.general_data?.general_data_id;
        if (!generalDataId) {
          throw new Error(`Erro: Nenhum general_data_id foi retornado pela API.`);
        }

        await createDataset(generalDataId);

        router.push({ 
          path: "/home/imports", 
          query: { generalDataId }
        });
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        errorMessage.value = "Ocorreu um erro ao enviar os dados.";
      }
    };

    onMounted(fetchVersionsData);

     return {
      versions,
      selectedVersionId,
      selectedVersionDetails,
      handleVersionChange,
      submitData,
      loading,
      errorMessage,
    };
  },
};
</script>
