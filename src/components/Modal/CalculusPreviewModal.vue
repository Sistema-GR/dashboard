<template>
  <Teleport to="body">
    <div v-if="visible" class="fixed inset-0 z-51 flex items-center justify-center  p-4 bg-black bg-opacity-50">
      <!-- Ajustar posição para ficar centralizado no conteúdo principal -->
      <div class="ml-64 w-full flex items-center justify-center">
        <div class="bg-white rounded-[10px] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
          
          <!-- Header do Modal -->
          <div class="bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 class="text-25 font-semibold text-gray-900">
              Visualização Rápida do Cálculo
            </h3>
            <button 
              @click="$emit('close')" 
              class="text-gray-400 hover:text-gray-600 text-2xl font-bold"
            >
              ×
            </button>
          </div>

          <!-- Conteúdo do Modal -->
          <div class="flex-1 overflow-y-auto p-6">
            <div v-if="isLoading" class="flex justify-center items-center h-64">
              <Loading />
            </div>

            <div v-else class="space-y-8">
              <!-- Seção de Resumo -->
              <section>
                <h4 class="text-20 font-medium text-gray-800 mb-4">Resumo</h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div class="p-4 rounded-[10px] shadow border border-gray-200 bg-blue-50">
                    <p class="text-15 font-medium text-gray-500">Total que Recebe</p>
                    <p class="text-25 font-bold text-gray-800">{{ summaryData.registros_maiores_que_zero || 0 }}</p>
                  </div>
                  <div class="p-4 rounded-[10px] shadow border border-gray-200 bg-blue-50">
                    <p class="text-15 font-medium text-gray-500">Total que Não Recebe</p>
                    <p class="text-25 font-bold text-gray-800">{{ summaryData.registros_iguais_a_zero || 0 }}</p>
                  </div>
                  <div class="p-4 rounded-[10px] shadow border border-gray-200 bg-green-50">
                    <p class="text-15 font-medium text-gray-500">Total a Pagar</p>
                    <p class="text-25 font-bold text-green-800">{{ formatCurrency(summaryData.soma_valor_total) }}</p>
                  </div>
                </div>
              </section>

              <!-- Seção de Relatórios -->
              <section>
                <h4 class="text-20 font-medium text-gray-800 mb-4">Relatórios Detalhados</h4>
                <div class="flex items-center gap-4 mb-4">
                  <label for="report-select" class="font-medium">Selecione um relatório:</label>
                  <select 
                    id="report-select" 
                    v-model="selectedReport" 
                    class="block w-full max-w-xs rounded-[10px] border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-15"
                  >
                    <option v-for="report in reportOptions" :key="report.value" :value="report.value">
                      {{ report.label }}
                    </option>
                  </select>
                </div>

                <div class="mb-8 px-4 sm:px-10 flex flex-col md:flex-row gap-6">
                  <div class="flex-1">
                    <Search 
                      :columns="filterableColumns"
                      @search="handleSearch" 
                    />
                  </div>
                </div>
                
                <div class="border rounded-[10px] overflow-hidden">
                  <PrimaryTable
                    v-if="selectedReport"
                    :key="tableKey"
                    :route="dynamicRoute"
                    :isDynamicRoute="true"
                    :isViewOnly="true"
                    :searchCriteria="searchCriteria"
                    @columns-loaded="handleColumnsLoaded"
                  />
                </div>
              </section>
            </div>
          </div>

          <!-- Footer do Modal -->
          <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
            <button 
              type="button" 
              class="px-6 py-2 bg-[#3459A2] border border-gray-300 rounded-[10px] text-15 font-semibold text-white hover:bg-[#203661] shadow-sm"
              @click="$emit('close')"
            >
              Fechar
            </button>
          </div>

        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { getAccessToken } from '@/service/token';
import axios from 'axios';
import PrimaryTable from '../Table/PrimaryTable.vue';
import Loading from '../Loading/Loading.vue';
import Search from '@/components/Search/Search.vue';

const props = defineProps({
  calculusId: { type: Number, default: null },
  visible: { type: Boolean, default: false },
});

const emit = defineEmits(['close']);

const isLoading = ref(false);
const summaryData = ref({});
const selectedReport = ref('criterios'); 
const tableKey = ref(0);
const searchCriteria = ref({ query: '', column: 'all' });
const filterableColumns = ref([]);

const handleSearch = (criteria) => {
  searchCriteria.value = criteria;
};

const handleColumnsLoaded = (columns) => {
  filterableColumns.value = columns;
}

const reportOptions = [
  { label: 'Critérios Finais', value: 'criterios' },
  { label: 'Profissionais', value: 'profissionais' },
  { label: 'Frequência', value: 'frequencia' },
  { label: 'Tempo de Atuação', value: 'tempo_atuacao' },
];

const dynamicRoute = computed(() => {
  if (!props.calculusId || !selectedReport.value) return '';
  return `calculus/${props.calculusId}/processed-file/${selectedReport.value}/`;
});

const fetchSummary = async (id) => {
  if (!id) return;
  isLoading.value = true;
  try {
    const token = await getAccessToken();
    const response = await axios.get(`/csv/calculus/${id}/summary/`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    summaryData.value = response.data.analysis_result;
  } catch (error) {
    console.error("Erro ao buscar resumo do cálculo:", error);
    summaryData.value = {};
  } finally {
    isLoading.value = false;
  }
};

const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'R$ 0,00';
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

watch(() => props.calculusId, (newId) => {
  if (newId && props.visible) {
    fetchSummary(newId);
    selectedReport.value = 'criterios'; 
    tableKey.value++; 
  }
}, { immediate: true });

watch(selectedReport, () => {
  tableKey.value++;
});
</script>