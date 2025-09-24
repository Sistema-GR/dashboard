<template>
  <TransitionRoot as="template" :show="visible">
    <Dialog as="div" class="relative z-10" @close="$emit('close')">
      <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
            
            <DialogPanel class="relative flex flex-col transform rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 w-full sm:max-w-7xl max-h-[90vh]">
              
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200 flex-shrink-0">
                <DialogTitle as="h3" class="text-xl font-semibold leading-6 text-gray-900">
                  Visualização Rápida do Cálculo
                </DialogTitle>
              </div>

              <div class="flex-grow overflow-y-auto p-4 sm:p-6">
                <div v-if="isLoading" class="flex justify-center items-center h-full">
                    <Loading />
                </div>

                <div v-else class="space-y-8">
                  <section>
                    <h4 class="text-lg font-medium text-gray-800 mb-3">Resumo</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div class="p-4 rounded-lg shadow border border-gray-200 bg-blue-50">
                            <p class="text-sm font-medium text-gray-500">Total que Recebe</p>
                            <p class="text-2xl font-bold text-gray-800">{{ summaryData.registros_maiores_que_zero || 0 }}</p>
                        </div>
                        <div class="p-4 rounded-lg shadow border border-gray-200 bg-blue-50">
                            <p class="text-sm font-medium text-gray-500">Total que Não Recebe</p>
                            <p class="text-2xl font-bold text-gray-800">{{ summaryData.registros_iguais_a_zero || 0 }}</p>
                        </div>
                        <div class="p-4 rounded-lg shadow border border-gray-200 bg-green-50">
                            <p class="text-sm font-medium text-gray-500">Total a Pagar</p>
                            <p class="text-2xl font-bold text-green-800">{{ formatCurrency(summaryData.soma_valor_total) }}</p>
                        </div>
                    </div>
                  </section>
                  <section>
                    <h4 class="text-lg font-medium text-gray-800 mb-3">Relatórios Detalhados</h4>
                    <div class="flex items-center gap-4 mb-4">
                        <label for="report-select" class="font-medium">Selecione um relatório:</label>
                        <select id="report-select" v-model="selectedReport" class="block w-full max-w-xs rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            <option v-for="report in reportOptions" :key="report.value" :value="report.value">{{ report.label }}</option>
                        </select>
                    </div>

                    <PrimaryTable
                      v-if="selectedReport"
                      :key="tableKey"
                      :route="dynamicRoute"
                      :isDynamicRoute="true"
                      :isViewOnly="true"
                    />
                  </section>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 border-t border-gray-200 flex-shrink-0">
                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="$emit('close')">Fechar</button>
              </div>

            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { getAccessToken } from '@/service/token';
import axios from 'axios';
import PrimaryTable from '../Table/PrimaryTable.vue';
import Loading from '../Loading/Loading.vue';

const props = defineProps({
  calculusId: { type: Number, default: null },
  visible: { type: Boolean, default: false },
});
const emit = defineEmits(['close']);

const isLoading = ref(false);
const summaryData = ref({});
const selectedReport = ref('criterios'); 
const tableKey = ref(0);

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
        const response = await axios.get(`http://127.0.0.1:8000/csv/calculus/${id}/summary/`, {
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