<template>
  <Whiteboard title="Selecionar Data Version" :isSidebarMinimized="isSidebarMinimized">
    <div class="flex flex-col w-full items-start justify-start mt-5 pb-5 space-y-6">
      <!-- Dropdown para selecionar a versão -->
      <label for="version" class="text-lg font-semibold">Selecione uma versão:</label>
      <div class="w-full p-3 shadow-lg rounded-lg bg-white">
        <select
          id="version"
          v-model="selectedVersion"
          @change="handleVersionChange"
          class="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="" disabled selected>Escolha uma versão</option>
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
        <div class="bg-white shadow-lg rounded-lg p-6 space-y-4">
          <h3 class="text-xl font-semibold text-blue-600">Detalhes da Versão Selecionada</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-black">
            <TextInput label="ID" v-model="selectedVersionDetails.general_data_id" :disabled="true" label-class="text-black"  />
            <TextInput label="Descrição" v-model="selectedVersionDetails.description" :disabled="true" label-class="text-black"/>
            <TextInput label="Data de Início" v-model="selectedVersionDetails.year_value" :disabled="true" label-class="text-black"/>
            <TextInput label="Data de Fim" v-model="selectedVersionDetails.start_date" :disabled="true" label-class="text-black"/>
            <TextInput label="Valor Máximo" v-model="selectedVersionDetails.end_date" :disabled="true" label-class="text-black"/>
            <TextInput label="Carga Máxima" v-model="selectedVersionDetails.max_value" :disabled="true" label-class="text-black"/>
            <TextInput label="Rede Passo 1" v-model="selectedVersionDetails.idem_network_step_1" :disabled="true" label-class="text-black"/>
            <TextInput label="Rede Passo 2" v-model="selectedVersionDetails.idem_network_step_2" :disabled="true" label-class="text-black"/>
            <TextInput label="Rede Passo 3" v-model="selectedVersionDetails.idem_network_step_3" :disabled="true" label-class="text-black"/>
          </div>
        </div>

        <!-- Botões de ação -->
        <div class="flex flex-col sm:flex-row w-full space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
          <button
            @click="navigateToImports"
            class="w-full sm:w-auto px-6 py-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600 focus:outline-none"
          >
            Continuar
          </button>
          <button
            @click="editVersion"
            class="w-full sm:w-auto px-6 py-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 focus:outline-none"
          >
            Editar Dados
          </button>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import { ref, inject, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { fetchVersions } from '../../../../service/apiService';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import TextInput from '@/components/Inputs/TextInput.vue';

export default {
  name: "VersionManager",
  components: { Whiteboard, TextInput },
  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized');
    const router = useRouter();
    const versions = ref([]);
    const selectedVersion = ref(null);
    const selectedVersionDetails = ref(null);
    const loading = ref(false);

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
      selectedVersionDetails.value = versions.value.find(
        version => version.general_data_id === selectedVersion.value
      );
    };

    // Navegar para a página de imports
    const navigateToImports = () => {
      router.push('/home/imports');
    };

    // Editar dados da versão
    const editVersion = () => {
      alert("Função de edição de versão será implementada.");
    };

    onMounted(fetchVersionsData);

    return {
      isSidebarMinimized,
      versions,
      selectedVersion,
      selectedVersionDetails,
      handleVersionChange,
      navigateToImports,
      editVersion,
      loading,
    };
  },
};
</script>
