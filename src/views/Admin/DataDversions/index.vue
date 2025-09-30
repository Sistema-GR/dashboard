<template>
  <Whiteboard title="Ativação de Versão para Usuários" :hideBreadcrumbs="false">
    <div class="flex w-full p-8">
      <h1 class="text-center w-full font-semibold text-15 text-gray-800">
        Selecione a versão que será exibida no painel para todos os usuários. Apenas uma versão pode estar ativa.
      </h1>
    </div>

    <div class="flex flex-col gap-8 w-full pb-10 px-4 sm:px-10">
      <!-- Loop sobre as "Famílias" de Cálculos -->
      <div v-for="family in calculusFamilies" :key="family.parent_id" class="border rounded-lg bg-white shadow-sm">
        <!-- Cabeçalho da Família -->
        <div class="bg-[#c2ddfd] px-6 py-4 rounded-t-lg border-b">
          <h2 class="text-lg font-semibold text-gray-800">{{ family.description }}</h2>
        </div>
        
        <!-- Tabela de Versões da Família -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <!-- Cabeçalho da Tabela -->
            <thead class="bg-blue-50">
              <tr>
                <th class="px-6 py-3 text-left text-sm font-semibold text-blue-900">Nome</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-blue-900">Descrição</th>
                <th class="px-6 py-3 text-left text-sm font-semibold text-blue-900">Criado em</th>
                <th class="px-6 py-3 text-center text-sm font-semibold text-blue-900">Ativo</th>
                <th class="px-6 py-3 text-center text-sm font-semibold text-blue-900">Ação</th>
              </tr>
            </thead>
            <!-- Corpo da Tabela -->
            <tbody>
              <tr v-for="(versao, index) in family.versions" :key="versao.id" 
                  class="border-b border-gray-200 hover:bg-gray-50">
                <!-- Nome -->
                <td class="px-6 py-4 text-sm font-medium text-gray-900">
                  {{ versao.nome || 'funciona' }}
                </td>
                <!-- Descrição -->
                <td class="px-6 py-4 text-sm text-gray-700">
                  {{ versao.descricao }}
                </td>
                <!-- Data -->
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ formatDate(versao.data) }}
                </td>
                <!-- Status Ativo -->
                <td class="px-6 py-4 text-center">
                  <span v-if="versao.ativa" 
                        class="inline-flex px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                    Ativo
                  </span>
                  <span v-else 
                        class="inline-flex px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                    Inativo
                  </span>
                </td>
                <!-- Toggle Action -->
                <td class="px-6 py-4 text-center">
                  <Toggle
                    class="scale-90"
                    :modelValue="versao.ativa"
                    @update:modelValue="() => handleToggle(versao)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-lg font-semibold mb-4">Deseja realmente alterar a versão ativa?</h3>
        <p class="text-sm text-gray-600 mb-6">A versão atualmente ativa será desativada.</p>
        <div class="flex justify-center gap-4">
          <button @click="confirmToggle" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Sim, Ativar
          </button>
          <button @click="cancelToggle" class="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Não
          </button>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import { ref, onMounted } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Toggle from '@/components/Toggle/Toggle.vue';
import axios from 'axios';
import { getAccessToken } from '@/service/token';

export default {
  name: 'DataVersions',
  components: { Whiteboard, Toggle },
  setup() {
    const calculusFamilies = ref([]);
    const showConfirmation = ref(false);
    const pendingVersion = ref(null);

    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get('http://127.0.0.1:8000/csv/opencalc/list-versions/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        calculusFamilies.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar as famílias de cálculo:", error);
      }
    };

    const handleToggle = (versionToActivate) => {
      if (!versionToActivate.ativa) {
        pendingVersion.value = versionToActivate;
        showConfirmation.value = true;
      }
    };

    const confirmToggle = async () => {
      if (!pendingVersion.value) return;

      const idParaAtivar = pendingVersion.value.id;
      
      try {
        const token = await getAccessToken();
        
        const response = await axios.post('http://127.0.0.1:8000/csv/opencalc/activate-opencalc/', 
          { calc_id: idParaAtivar },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          // Atualiza o estado local para refletir a mudança imediatamente
          calculusFamilies.value.forEach(family => {
            family.versions.forEach(version => {
              version.ativa = (version.id === idParaAtivar);
            });
          });
        }
      } catch (error) {
        console.error("Erro detalhado ao ativar a versão:", error.response || error);
        alert("Falha ao ativar a versão.");
      } finally {
        showConfirmation.value = false;
        pendingVersion.value = null;
      }
    };

    const cancelToggle = () => {
      showConfirmation.value = false;
      pendingVersion.value = null;
    };

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    };

    onMounted(fetchData);

    return { 
      calculusFamilies, 
      showConfirmation, 
      handleToggle, 
      confirmToggle, 
      cancelToggle,
      formatDate 
    };
  }
}
</script>