<template>
  <Whiteboard title="Dashboard">
    <!-- Cards de Resumo Estilizados -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 sm:px-10 pt-8 pb-1">
      <div
        v-for="(card, index) in cards"
        :key="index"
        class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md"
      >
        <div 
          class="px-4 py-2 text-white text-xs font-bold uppercase tracking-wider flex justify-between items-center bg-[#3459A2]"
        >
          {{ card.title }}
          <component :is="card.icon" class="w-4 h-4 opacity-70" />
        </div>
        <div class="p-6 text-center">
          <span class="text-3xl font-black text-slate-800">
            {{ formattedDashboardData[card.dataKey] }}
          </span>
        </div>
      </div>
    </div>

    <!-- Botão de Ação -->
    <div v-if="isAdmin" class="flex justify-end items-center px-4 sm:px-10 py-3">
      <button 
        @click="navigateToPaymentAnalysis"
        class="bg-[#3459A2] hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center gap-2 font-bold text-sm"
      >
        <ChartBarIcon class=" w-4 h-4 " />
        ANÁLISE DE PAGAMENTO
      </button>
    </div>

    <!-- Seções de Gráficos (Visual Robusto) -->
    <div
      v-for="(section, index) in updatedChartSections"
      :key="index"
      class="mx-4 sm:mx-10 mb-10 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden"
    >
      <!-- Cabeçalho da Seção -->
      <div class="bg-[#3459A2] text-white px-6 py-4 flex justify-between items-center">
        <h2 class="font-black text-lg tracking-tight uppercase">{{ section.title }}</h2>
        <div class="bg-white/10 px-3 py-1 rounded-lg text-xs font-bold">
          TOTAL: {{ section.total }} pessoas
        </div>
      </div>

      <!-- Área do Gráfico -->
      <div class="p-6 space-y-5">
        <div v-for="(data, idx) in section.data" :key="idx" class="flex flex-col gap-1.5">
          <div class="flex justify-between text-xs font-bold text-slate-600 uppercase">
            <span>{{ data.label }}</span>
          </div>
          
          <div class="flex items-center gap-4">
            <!-- Barra Robusta -->
            <div class="flex-1 bg-slate-100 rounded-lg h-9 overflow-hidden flex items-center relative border border-slate-200">
              <div
                class="h-full bg-[#3459A2] transition-all duration-1000 ease-out shadow-[inset_-2px_0_4px_rgba(0,0,0,0.1)]"
                :style="{ width: data.percentage + '%' }"
              ></div>
              <!-- Badge de dados (fixo à esquerda se a barra for muito pequena ou flutuante) -->
              <div class="absolute left-3 flex items-center gap-2 pointer-events-none">
                 <span :class="data.percentage > 10 ? 'text-white' : 'text-slate-800'" class="text-sm font-black">
                   {{ data.percentage }}%
                 </span>
              </div>
            </div>
            <!-- Contador Lateral -->
            <div class="min-w-[100px] text-right text-sm font-bold text-slate-500">
              {{ data.value }} <span class="text-[10px] uppercase opacity-60">pessoas</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Grid de Relatórios e Versão -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 px-4 sm:px-10 mb-12">
      
      <!-- Relatório Final -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div class="bg-slate-100 px-6 py-4 border-b border-slate-200">
          <h3 class="font-bold text-slate-800 uppercase text-sm">Relatório Final</h3>
        </div>
        <div class="p-6">
          <div
            v-for="(file, index) in files"
            :key="index"
            class="flex items-center justify-between p-4 bg-indigo-50/50 rounded-xl border border-[#3459A2]"
          >
            <div class="flex items-center gap-4">
              <DocumentDuplicateIcon class="h-8 w-8 text-indigo-500" />
              <div>
                <p class="text-sm font-bold text-slate-800">{{ file.name }}</p>
                <span class="text-xs text-slate-500 uppercase font-semibold">{{ file.size }}</span>
              </div>
            </div>
            <button
              @click="downloadCriteriosCSV"
              class="bg-white text-[#3459A2] hover:bg-[#3459A2] hover:text-white border border-indigo-200 px-4 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-2"
            >
              <ArrowDownTrayIcon class="h-4 w-4" />
              BAIXAR CSV
            </button>
          </div>
        </div>
      </div>

      <!-- Arquivos Importados -->
      <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
        <div class="bg-slate-100 px-6 py-4 border-b border-slate-200">
          <h3 class="font-bold text-slate-800 uppercase text-sm">Arquivos</h3>
        </div>
        <div class="p-6 flex-1 flex flex-col justify-between">
          <button 
            class="mt-4 w-full bg-[#3459A2] hover:bg-slate-900 text-white font-bold py-3 px-4 rounded-xl transition duration-300 text-xs uppercase tracking-widest"
            @click="$router.push({name: 'files-manager'})"
          >
            Visualizar Arquivos
          </button>
        </div>
      </div>
    </div>

    <!-- Informações sobre a versão -->
    <div class="mx-4 sm:mx-10 mb-12 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden shadow-inner">
      <div class="bg-slate-200 px-6 py-3 border-b border-slate-300">
        <h3 class="font-bold text-slate-700 uppercase text-xs tracking-widest text-center">Informações Técnicas da Versão</h3>
      </div>
      <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(field, index) in version" :key="index" class="space-y-1">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-tighter">{{ field.label }}</p>
          <p class="text-sm font-bold text-slate-700">{{ field.value }}</p>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
/* LÓGICA MANTIDA 100% IGUAL */
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { downloadCriteriosCSV } from '@/service/download';
import { ArrowDownTrayIcon, BanknotesIcon, DocumentDuplicateIcon, UsersIcon, ChartBarIcon } from "@heroicons/vue/24/outline";
import { apiClient } from '@/service/apiService';
import { computed, onMounted, ref } from 'vue';
import { getAccessToken } from '../../../service/token';
import { useRouter } from 'vue-router';
import { getUserType } from '@/service/userType';

export default {
  name: "AdminPanel",
  components: { Whiteboard, UsersIcon, BanknotesIcon, DocumentDuplicateIcon, ArrowDownTrayIcon, ChartBarIcon },

  setup() {
    const dashboardAnalysisData = ref(null);
    const totalRecebem = ref(0);
    const totalNaoRecebem = ref(0);
    const totalAPagar = ref(0);
    const chartDataFaixaPagamento = ref([]);
    const router = useRouter();

    const fetchDashboardData = async () => {
      try {
        const token = await getAccessToken();
        if (!token) return;

        const responseIdCalculo = await apiClient.get(`/csv/opencalc/get-active-info/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let idCalculo = responseIdCalculo.data?.calculus_id;

        const responseCriterios = await apiClient.get(`/csv/calculus/${idCalculo}/summary/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dataCriterios = responseCriterios.data;
        totalRecebem.value = dataCriterios.analysis_result.registros_maiores_que_zero;
        totalNaoRecebem.value = dataCriterios.analysis_result.registros_iguais_a_zero;
        totalAPagar.value = dataCriterios.analysis_result.soma_valor_total;
        
        const faixaPagamento = [
          { label: "Até R$ 1.500", value: dataCriterios.analysis_result.faixa_counts.faixa_0_1500 },
          { label: "De R$ 1.500 a R$ 3.000", value: dataCriterios.analysis_result.faixa_counts.faixa_1500_3000 },
          { label: "De R$ 3.000 a R$ 4.500", value: dataCriterios.analysis_result.faixa_counts.faixa_3000_4500 },
          { label: "De R$ 4.500 a R$ 6.000", value: dataCriterios.analysis_result.faixa_counts.faixa_4500_6000 },
          { label: "Mais que R$ 6.000", value: dataCriterios.analysis_result.faixa_counts.faixa_6000_mais },
          { label: "Não recebem nada", value: dataCriterios.analysis_result.faixa_counts.faixa_0 },
        ];
        chartDataFaixaPagamento.value = faixaPagamento;

        const responseAnalysis = await apiClient.get('/csv/get-import-files/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        dashboardAnalysisData.value = responseAnalysis.data;
      } catch (error) {
        console.error("Erro ao buscar os dados do dashboard:", error);
      }
    };

    onMounted(fetchDashboardData);

    const formattedDashboardData = computed(() => {
      const totalAPagarFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL',
      }).format(totalAPagar.value);

      return {
        registros_maiores_que_zero: totalRecebem.value,
        registros_iguais_a_zero: totalNaoRecebem.value,
        soma_valor_total: totalAPagarFormatado,
      };
    });

    const cards = computed(() => [
      { title: 'Total que Recebe', icon: UsersIcon, dataKey: 'registros_maiores_que_zero' },
      { title: 'Total que Não Recebe', icon: UsersIcon, dataKey: 'registros_iguais_a_zero' },
      { title: 'Total a Pagar', icon: BanknotesIcon, dataKey: 'soma_valor_total' }
    ]);

    const chartSections = computed(() => {
        const motivoArray = dashboardAnalysisData.value?.analysis_result?.motivo_combinado_counts || []
        const motivoCounts = Object.fromEntries(motivoArray.map(m => [m.key, m.count]))
        
        return [
            {
                title: "Motivos de Não Recebimento",
                data: [
                  { label: "Estagiário", value: motivoCounts.estagiario || 0 },
                  { label: "Atividade", value: motivoCounts.atividade || 0 },
                  { label: "Formações", value: motivoCounts.formacoes || 0 },
                  { label: "Frequência", value: motivoCounts.frequencia || 0 },
                  { label: "Tempo de Atuação", value: motivoCounts.tempo_de_atuacao || 0 },
                  { label: "Mais de um critério", value: motivoCounts.mais_de_um_criterio || 0 },
                  { label: "Mais de dois critérios", value: motivoCounts.mais_de_dois_criterios || 0 },
                  { label: "Secretário e Diretores Executivos", value: (motivoCounts.diretor_executivo || 0) + (motivoCounts.secretario || 0) },
                  { label: "Outro", value: motivoCounts.outro || 0 },
                ].sort((a, b) => b.value - a.value)
            },
            { title: "Faixa de Pagamento", data: chartDataFaixaPagamento.value }
        ];
    });

    const isAdmin = computed(() => getUserType() === 'admin');

    const calculatePercentages = (sections) => {
      return sections.map(section => {
        const total = section.data.reduce((acc, curr) => acc + curr.value, 0);        
        const dataWithPercentage = section.data.map(item => ({
          ...item,
          percentage: total > 0 ? ((item.value / total) * 100).toFixed(2) : "0.00"
        }));
        return { ...section, data: dataWithPercentage, total };
      });
    };

    const updatedChartSections = computed(() => calculatePercentages(chartSections.value));

    const files = [{ name: 'Relatório Criterios.csv', size: '3.4 MB' }];

    const version = computed(() => {
      if (!dashboardAnalysisData.value?.version_info) return [];
      const { version_info } = dashboardAnalysisData.value;
      const fields = [
        { label: 'Versão', value: version_info.description || 'Desconhecido' },
        { label: 'Data de Criação', value: new Date(version_info.created_at).toLocaleDateString('pt-BR') },
        { label: 'Valor Máximo', value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(version_info.max_value || 0) },
        { label: 'Carga Horária Máxima', value: version_info.max_workload ? `${version_info.max_workload}h` : "N/D" },
        { label: 'Início', value: version_info.start_date ? new Date(version_info.start_date + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/D' },
        { label: 'Fim', value: version_info.end_date ? new Date(version_info.end_date + 'T00:00:00').toLocaleDateString('pt-BR') : 'N/D' },
        { label: 'Etapa 1', value: version_info.idem_network_step_1 ? version_info.idem_network_step_1 : 'N/D' },
        { label: 'Etapa 2', value: version_info.idem_network_step_2 ? version_info.idem_network_step_2 : 'N/D' },
        { label: 'Etapa 3', value: version_info.idem_network_step_3 ? version_info.idem_network_step_3 : 'N/D' },
        { label: 'Ano', value: version_info.year_value || 'N/D' },
      ];
      return fields;
    });

    const navigateToPaymentAnalysis = () => router.push({name: 'payment-analysis'});

    return {
      updatedChartSections, files, version, cards, downloadCriteriosCSV, formattedDashboardData, navigateToPaymentAnalysis, isAdmin
    };
  }
};
</script>