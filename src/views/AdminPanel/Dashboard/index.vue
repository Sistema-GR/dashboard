<template>
  <Whiteboard title="Dashboard" :isSidebarMinimized="isSidebarMinimized">
    <!-- Total Recebe, Total Não Recebe e Total a Pagar -->
    <div class="flex flex-row w-full gap-6 py-6 overflow-x-auto lg:overflow-x-hidden">
      <div v-for="(card, index) in cards" :key="index" class="flex flex-col bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 text-gray-800 rounded-lg shadow-md p-6 w-full sm:w-1/3">
        <div class="flex flex-row justify-between items-center mb-4">
          <p class="text-lg font-semibold">{{ card.title }}</p>
          <component :is="card.icon" class="w-8 h-auto text-gray-600" />
        </div>
        <p class="text-3xl font-bold">{{ formattedDashboardData[card.dataKey] }}</p>
      </div>
    </div>

    <!-- Seções do gráfico -->
    <div v-for="(section, index) in updatedChartSections" :key="index" class="w-full bg-white p-6 rounded-lg shadow-lg mt-6 bg-gradient-to-r from-gray-50 to-gray-400">
      <h2 class="text-xl font-semibold mb-4">{{ section.title }}</h2>
      <div class="space-y-4">
        <div v-for="(data, idx) in section.data" :key="idx" class="flex items-center">
          <span class="w-1/4 text-gray-700 font-medium">{{ data.label }}</span>
          <div class="flex flex-row w-3/4 bg-gray-200 rounded-lg h-8 overflow-hidden gap-2 items-center font-medium">
            <div class="bg-primary-800 h-full flex items-center justify-start text-white font-semibold text-center px-2" :style="{ width: data.percentage + '%' }"></div>
            <div class="whitespace-nowrap">{{ data.percentage }}% ({{ data.value }} pessoas)</div>
          </div>
        </div>
      </div>
      <div class="mt-6 border-t pt-4">
        <p class="text-lg font-semibold">Total Geral: {{ section.total }} pessoas</p>
      </div>
    </div>

    <!-- Seção de Downloads -->
    <div class="w-full p-6 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg my-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Relatório Final</h2>
      <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between border border-gray-200 rounded-lg p-4 mb-4">
        <div class="flex items-center space-x-4">
          <DocumentDuplicateIcon class="h-8 w-8 text-gray-500" />
          <div class="flex flex-col">
            <p class="text-gray-800 font-medium">{{ file.name }}</p>
            <span class="text-sm text-gray-600">{{ file.size }}</span>
          </div>
        </div>
        <button @click="downloadCriteriosCSV" class="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
          <span class="text-sm font-semibold">Baixar CSV</span>
        </button>
      </div>
    </div>

    <div class="flex flex-col w-full mt-3 bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 p-6 rounded-lg shadow-lg mb-5">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Arquivos importados</h2>
      <p class="text-gray-700 mb-4">
        Aqui você pode gerenciar os arquivos importados. Clique no botão abaixo para visualizar os detalhes.
      </p>
      <button 
        class="self-start bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        @click="$router.push('files-manager')">
        Visualizar arquivos
      </button>
    </div>


    <!-- Informações sobre a versão -->
    <div class="flex flex-col w-full mt-3 bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Informações sobre a Versão</h2>
      <div class="space-y-4">
        <div v-for="(field, index) in version" :key="index" class="flex justify-between">
          <span class="font-medium text-gray-700">{{ field.label }}:</span>
          <span class="text-gray-800">{{ field.value }}</span>
        </div>
      </div>
      <div class="mt-6 text-right">
        <button 
          @click="navigateHome" 
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Sair
        </button>
      </div>
    </div>
  </Whiteboard>
</template>


<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { downloadCriteriosCSV } from '@/service/download';
import { ArrowDownTrayIcon, BanknotesIcon, DocumentDuplicateIcon, UsersIcon } from "@heroicons/vue/24/outline";
import axios from 'axios';
import { computed, inject, onMounted, ref } from 'vue';
import { getAccessToken } from '../../../service/token'; // Certifique-se de importar a função getAccessToken
import { useRouter } from 'vue-router'; // Importando o useRouter para navegação

export default {
  name: "AdminPanel",
  components: { Whiteboard, UsersIcon, BanknotesIcon, DocumentDuplicateIcon, ArrowDownTrayIcon },

  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized', false);
    const dashboardData = ref({});
    const router = useRouter(); // Inicializando o router

    // Função para buscar os dados do dashboard
    const fetchDashboardData = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          const response = await axios.get('http://10.203.3.22:8000/csv/get-import-files/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          dashboardData.value = response.data;
        } else {
          console.error("Erro: Token de acesso não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados do dashboard:", error);
      }
    };

    // Chamar a função ao montar o componente
    onMounted(() => {
      fetchDashboardData();
    });

    // Função para navegar para a página inicial (Home)
    const navigateHome = () => {
      router.push({ name: 'home' }); // Substitua 'home' pelo nome da sua rota de home
    };

    // Formatação dos dados do dashboard
    const formattedDashboardData = computed(() => {
      if (!dashboardData.value.analysis_result) return {};

      return {
        ...dashboardData.value.analysis_result,
        soma_valor_total: new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(dashboardData.value.analysis_result.soma_valor_total),
      };
    });

    // Estrutura dos cartões
    const cards = computed(() => [
      {
        title: 'Total que Recebe',
        icon: UsersIcon,
        dataKey: 'registros_maiores_que_zero',
      },
      {
        title: 'Total que Não Recebe',
        icon: UsersIcon,
        dataKey: 'registros_iguais_a_zero',
      },
      {
        title: 'Total a Pagar',
        icon: BanknotesIcon,
        dataKey: 'soma_valor_total',
      }
    ]);

    // Seções para o gráfico
    const chartSections = computed(() => {
      const motivoCombinadoCounts = dashboardData.value.analysis_result?.motivo_combinado_counts || {};
      const faixaCounts = dashboardData.value.analysis_result?.faixa_counts || {};

      return [
        {
          title: "Motivo de Não Recebimento",
          data: [
            { label: "Estagiário", value: motivoCombinadoCounts["Estagiário"] || 0 },
            { label: "Atividade", value: motivoCombinadoCounts["Atividade"] || 0 },
            { label: "Formações", value: motivoCombinadoCounts["Formações"] || 0 },
            { label: "Frequência", value: motivoCombinadoCounts["Frequência"] || 0 },
            { label: "Tempo de Atuação", value: motivoCombinadoCounts["Tempo de atuação"] || 0 },
            { label: "Mais de um critério", value: motivoCombinadoCounts["Mais de um critério"] || 0 },
            { label: "Mais de dois critérios", value: motivoCombinadoCounts["Mais de dois critérios"] || 0 },
          ]
        },
        {
          title: "Faixa de Pagamento",
          data: [
            { label: "Até R$ 1.500", value: faixaCounts["faixa_0_1500"] || 0 },
            { label: "De R$ 1.500 a R$ 3.000", value: faixaCounts["faixa_1500_3000"] || 0 },
            { label: "De R$ 3.000 a R$ 4.500", value: faixaCounts["faixa_3000_4500"] || 0 },
            { label: "De R$ 4.500 a R$ 6.000", value: faixaCounts["faixa_4500_6000"] || 0 },
            { label: "Mais que R$ 6.000", value: faixaCounts["faixa_6000_mais"] || 0 },
          ]
        }
      ];
    });

    // Função para calcular porcentagens
    const calculatePercentages = (sections) => {
      return sections.map(section => {
        const total = section.data.reduce((acc, curr) => acc + curr.value, 0);
        section.data = section.data.map(item => ({
          ...item,
          percentage: total ? ((item.value / total) * 100).toFixed(2) : 0
        }));
        return { ...section, total };
      });
    };

    const updatedChartSections = computed(() => calculatePercentages(chartSections.value));

    // Arquivos para download
    const files = [
      { name: 'Relatório Criterios.pdf', size: '3.4 MB', url: '/path/to/apresentacao.pptx' }
    ];

    // Informações sobre a versão
    const version = computed(() => {
      if (!dashboardData.value.version_info) return [];

      return [
        { label: 'Versão', value: dashboardData.value.version_info.description || 'Desconhecido' },
        { label: 'Data de Criação', value: new Date(dashboardData.value.version_info.created_at).toLocaleDateString('pt-BR') },
        { 
            label: 'Valor Máximo', 
            value: new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
            }).format(dashboardData.value.version_info.max_value) 
        },
        { 
            label: 'Carga Horária Máxima', 
            value: dashboardData.value.version_info.max_workload 
                ? `${dashboardData.value.version_info.max_workload} horas` 
                : "Carga horária não disponível"
        },
        { 
            label: 'Data de Início', 
            value: dashboardData.value.version_info.start_date 
                ? new Date(dashboardData.value.version_info.start_date + 'T00:00:00').toLocaleDateString('pt-BR') 
                : 'Data não disponível'
        },
        { 
            label: 'Data de Fim', 
            value: dashboardData.value.version_info.end_date 
                ? new Date(dashboardData.value.version_info.end_date + 'T00:00:00').toLocaleDateString('pt-BR') 
                : 'Data não disponível'
        },
        { 
            label: 'Resultados IDEM', 
            value: [
                dashboardData.value.version_info.idem_network_step_1 !== undefined ? `Etapa 01: ${dashboardData.value.version_info.idem_network_step_1}%` : null,
                dashboardData.value.version_info.idem_network_step_2 !== undefined ? `Etapa 02: ${dashboardData.value.version_info.idem_network_step_2}%` : null,
                dashboardData.value.version_info.idem_network_step_3 !== undefined ? `Etapa 03: ${dashboardData.value.version_info.idem_network_step_3}%` : null,
            ].filter(Boolean).join('\n') || "Etapas não disponíveis"
        },
      ];
    });

    return {
      isSidebarMinimized,
      updatedChartSections,
      files,
      version,
      cards,
      downloadCriteriosCSV,
      formattedDashboardData,
      navigateHome, // Adicionando a função de navegação
    };
  }
};
</script>
