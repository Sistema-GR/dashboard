<template>
  <Whiteboard title="Selecionar Data Version" >
    <div class="flex flex-col w-full items-start justify-start mt-5 pb-5 px-10 space-y-6">
      <!-- Dropdown para selecionar a versão -->
      <label for="version" class="text-20 font-semibold">Selecione uma versão:</label>
      <div class="w-full p-3 shadow-lg rounded-[10px] bg-white">
        <select
          id="version"
          v-model="selectedGeneralDataId"
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
        <h3 class="text-15 font-semibold text-blue-600">Detalhes da Versão Selecionada (Edição)</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black p-4 border rounded-md">
          
          <div v-for="field in fields" :key="field.name" class="flex flex-col space-y-1 group">
              <div class="flex justify-between items-center">
                <strong class="font-semibold text-sm text-gray-600">{{ field.label }}:</strong>
                <button @click="setEditing(field.name)" class="text-blue-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  editar
                </button>
              </div>

              <input 
                v-if="editingField === field.name"
                v-model="editableData[field.name]"
                @blur="editingField = null"
                :class="['border-b', 'border-blue-500', 'focus:outline-none', 'bg-blue-50', 'p-1']"
                autoFocus
              />
              <p v-else class="p-1" @click="setEditing(field.name)">{{ editableData[field.name] }}</p>
          </div>

        </div>
      </div>

      <div class="flex mt-4">
        <button @click="submitData" class="bg-green-500 text-white px-6 py-3 rounded-[10px] font-bold">
          Continuar
        </button>
      </div>
    </div>
    </div>
  </Whiteboard>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { getAccessToken } from '@/service/token';
import { fetchVersions, createDataset, createGeneralData, apiClient } from '../../../../service/apiService';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';

export default {
  name: "CreateFromTemplate",
  components: { Whiteboard },
  setup() {
    const router = useRouter();
    const versions = ref([]);
    const selectedGeneralDataId = ref(null); 
    let selectedCalcId = ref(null);
    const selectedVersionDetails = ref(null);
    const editableData = ref(null);
    const editingField = ref(null);    
    const loading = ref(false);
    const errorMessage = ref("");
    const fields = [
      { name: 'name', label: 'Nome' },
      { name: 'description', label: 'Descrição' },
      { name: 'year_value', label: 'Ano Pagamento' },
      { name: 'max_value', label: 'Valor Máximo' },
      { name: 'start_date', label: 'Data de Início' },
      { name: 'end_date', label: 'Data de Fim' },
      { name: 'max_workload', label: 'Carga Máxima' },
      { name: 'idem_network_step_1', label: 'Rede Etapa 1 (%)' },
      { name: 'idem_network_step_2', label: 'Rede Etapa 2 (%)' },
      { name: 'idem_network_step_3', label: 'Rede Etapa 3 (%)' },
    ];

    const setEditing  = (fieldName) => {
      editingField.value = fieldName;
    };

    const fetchVersionsData = async () => {
      loading.value = true;
      try {
        versions.value = await fetchVersions();
        selectedCalcId.value = (await fetchCalculus()).find(c => c.general_data_id == selectedGeneralDataId.value)?.calculus_id;
        console.log("Versões disponíveis:", versions.value);
        console.log("calculo: ", selectedCalcId)
      } catch (error) {
        console.error("Erro ao buscar versões:", error);
      } finally {
        loading.value = false;
      }
    };

    const fetchCalculus = async () => {
      try {
        const token = getAccessToken();

        const calcList = await apiClient.get(`/csv/get-list-calculus/`,{
          headers: { Authorization: `Bearer ${token}` }
        });

        const calcAtivos = Object.values(calcList.data).flatMap(yearObject => Object.values(yearObject)).filter(calc => calc.is_finalized === true);
        return calcAtivos

      } catch (error) {
        console.error("Erro ao buscar detalhes da versão:", error);
      }
    };

    const handleVersionChange = async () => {
      const selectedVersion = versions.value.find(
        version => version.general_data_id === selectedGeneralDataId.value
      );
      
      if (selectedVersion) {
        selectedVersionDetails.value = { ...selectedVersion };
        editableData.value = { ...selectedVersion };
        selectedCalcId.value = (await fetchCalculus()).find(c => c.general_data_id == selectedGeneralDataId.value)?.calculus_id;
      }
    };

    const submitData = async () => {
      errorMessage.value = "";

      if (!selectedVersionDetails.value) return;

      try {
        const payload = {
          ...editableData.value,
          description: editableData.value.description.trim() 
        };
        delete payload.general_data_id;
        if (payload.general_data_id) {
          fetchFilesFromCalc(payload.general_data_id);
        }
        const response = await createGeneralData(payload);

        const generalDataId = response.general_data?.general_data_id;
        if (!generalDataId) {
          throw new Error(`Erro: Nenhum general_data_id foi retornado pela API.`);
        }
        selectedCalcId.value = (await fetchCalculus()).find(c => c.general_data_id == selectedGeneralDataId.value)?.calculus_id;
        await createDataset(generalDataId);

        router.push({ 
          name: "create-imports", 
          query: {  generalDataId,
                    versionId: selectedCalcId.value}
        });
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        errorMessage.value = "Ocorreu um erro ao enviar os dados.";
      }
    };

    watch(selectedVersionDetails, (newVal) => {
      if (newVal) {
        editableData.value = { ...newVal };
      }
    }, { immediate: true });

    onMounted(fetchVersionsData);

     return {
      versions,
      selectedGeneralDataId,
      selectedVersionDetails,
      editableData,
      editingField,
      fields,
      selectedCalcId,
      fetchCalculus,
      setEditing,
      handleVersionChange,
      submitData,
      loading,
      errorMessage,
    };
  },
};
</script>
