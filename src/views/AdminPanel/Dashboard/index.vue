<template>
  <Whiteboard title="Dashboard" :isSidebarMinimized="isSidebarMinimized">
    <!-- Total Recebe, Total Não Recebe e Total a Pagar -->
    <div class="grid w-full py-8 mx-8">
      <div class="flex flex-wrap justify-center gap-8 xl:justify-between mx-8">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="flex flex-col rounded-lg shadow-md overflow-hidden flex-1 min-w-[280px] max-w-[100%] border border-gray-200"
        >
          <!-- Cabeçalho -->
          <div
            class="flex items-center justify-between px-4 py-2 text-white text-sm font-semibold"
            :class="[
              index === 0 ? 'bg-blue-700' :
              index === 1 ? 'bg-blue-500' :
              'bg-blue-900'
            ]"
          >
            <span>{{ card.title }}</span>
            <component :is="card.icon" class="w-5 h-5 text-white opacity-80" />
          </div>

          <!-- Valor -->
          <div class="bg-blue-50 py-6 flex items-center justify-center text-2xl font-bold text-gray-800">
            {{ formattedDashboardData[card.dataKey] }}
          </div>
        </div>
      </div>
    </div>

    <!-- Seções do gráfico -->
    <div
      v-for="(section, index) in updatedChartSections"
      :key="index"
      class="w-full bg-white p-6 rounded-lg shadow-lg mt-6 border border-gray-200"
    >
      <div class="bg-blue-800 text-white text-center py-2 rounded-md mb-6 mx-4 font-bold text-lg">
        {{ section.title }}
      </div>
      <div class="space-y-4 mx-4">
        <div v-for="(data, idx) in section.data" :key="idx" class="flex items-center gap-8">
          <span class="w-1/4 text-gray-800 font-semibold">{{ data.label }}</span>
          <div class="flex flex-row w-3/4 bg-gray-200 rounded-lg h-6 overflow-hidden items-center">
            <div
              class="bg-blue-700 h-full text-white text-xs px-2 flex items-center justify-start font-semibold"
              :style="{ width: data.percentage + '%' }"
            ></div>
            <div class="text-xs text-black font-bold ml-3 whitespace-nowrap">
              {{ data.percentage }}% ({{ data.value }} pessoas)
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 border-t pt-4">
        <p class="text-base font-semibold text-blue-900">TOTAL GERAL: {{ section.total }} pessoas</p>
      </div>
    </div>

    <!-- Seção de Downloads -->
    <div class="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-lg my-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Relatório Final</h2>
      <div
        v-for="(file, index) in files"
        :key="index"
        class="flex items-center justify-between bg-gray-100 border border-gray-200 rounded-lg p-4 mb-4"
      >
        <div class="flex items-center space-x-4">
          <DocumentDuplicateIcon class="h-8 w-8 text-gray-500" />
          <div class="flex flex-col">
            <p class="text-gray-800 font-medium">{{ file.name }}</p>
            <span class="text-sm text-gray-600">{{ file.size }}</span>
          </div>
        </div>
        <button
          @click="downloadCriteriosCSV"
          class="flex items-center text-blue-600 hover:text-blue-800 font-semibold"
        >
          <ArrowDownTrayIcon class="h-5 w-5 mr-2" />
          <span class="text-sm">Baixar CSV</span>
        </button>
      </div>
    </div>

    <!-- Arquivos importados -->
    <div class="flex flex-col w-full mt-3 bg-white border border-gray-200 p-6 rounded-lg shadow-lg mb-5">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Arquivos importados</h2>
      <p class="text-gray-700 mb-4">
        Aqui você pode gerenciar os arquivos importados. Clique no botão abaixo para visualizar os detalhes.
      </p>
      <button
        class="self-start bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        @click="$router.push('files-manager')"
      >
        Visualizar arquivos
      </button>
    </div>

    <!-- Informações sobre a versão -->
    <div class="flex flex-col w-full mt-3 bg-white border border-gray-200 p-6 rounded-lg shadow-lg">
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
          class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
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
import { getAccessToken } from '../../../service/token';
import { useRouter } from 'vue-router';

export default {
  name: "AdminPanel",
  components: { Whiteboard, UsersIcon, BanknotesIcon, DocumentDuplicateIcon, ArrowDownTrayIcon },

  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized', ref(false));
    const dashboardData = ref(null); // Iniciar como nulo para verificações mais fáceis
    const dashboardMotivos = ref(null);
    const totalRecebem = ref(0);
    const totalNaoRecebem = ref(0);
    const totalAPagar = ref(0);
    const chartDataFaixaPagamento = ref([]); // Manter os dados do gráfico como reativos
    const router = useRouter();

    const fetchDashboardData = async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          console.error("Erro: Token de acesso não encontrado.");
          return;
        }

        // Requisição para critérios para calcular quem recebe/não recebe
        const responseCriterios = await axios.get('http://127.0.0.1:8000/csv/process/criterios/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const dataCriterios = responseCriterios.data;

        // Atualiza os totais reativos
        totalRecebem.value = dataCriterios.filter(item => item.recebe_gratificacao === true).length;
        totalNaoRecebem.value = dataCriterios.filter(item => item.recebe_gratificacao === false).length;
        totalAPagar.value = dataCriterios.reduce((sum, item) => sum + parseFloat(item.valor_total || 0), 0);
        
        // Lógica para faixa de pagamento
        const faixaPagamento = [
          { label: "Até R$ 1.500", value: 0 },
          { label: "De R$ 1.500 a R$ 3.000", value: 0 },
          { label: "De R$ 3.000 a R$ 4.500", value: 0 },
          { label: "De R$ 4.500 a R$ 6.000", value: 0 },
          { label: "Mais que R$ 6.000", value: 0 },
          { label: "Não recebem nada", value: 0 },
        ];

        dataCriterios.forEach(item => {
          const valorTotal = parseFloat(item.valor_total || 0);
          if (valorTotal === 0) faixaPagamento[5].value++;
          else if (valorTotal <= 1500) faixaPagamento[0].value++;
          else if (valorTotal <= 3000) faixaPagamento[1].value++;
          else if (valorTotal <= 4500) faixaPagamento[2].value++;
          else if (valorTotal <= 6000) faixaPagamento[3].value++;
          else faixaPagamento[4].value++;
        });

        chartDataFaixaPagamento.value = faixaPagamento;

        // Requisição para os dados principais do dashboard
        const responseFuncionarios = await axios.get('http://127.0.0.1:8000/csv/process/funcionarios/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Funcionarios response:', responseFuncionarios.data);
        dashboardData.value = responseFuncionarios.data;


        // Requisição para os motivos de não recebimento
        const responseMotivos = await axios.get('http://127.0.0.1:8000/csv/get-import-files/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log('Motivos response:', responseMotivos.data);
        dashboardMotivos.value = responseMotivos.data;

      } catch (error) {
        console.error("Erro ao buscar os dados do dashboard:", error);
        // Considere definir um estado de erro aqui para exibir uma mensagem ao usuário
      }
    };

    onMounted(fetchDashboardData);

    const navigateHome = () => {
      router.push({ name: 'home' });
    };

    const formattedDashboardData = computed(() => {
      // Usar os valores reativos diretamente para os totais
      const totalRecebeFormatado = totalRecebem.value;
      const totalNaoRecebeFormatado = totalNaoRecebem.value;
      const totalAPagarFormatado = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(totalAPagar.value);

      return {
        registros_maiores_que_zero: totalRecebeFormatado,
        registros_iguais_a_zero: totalNaoRecebeFormatado,
        soma_valor_total: totalAPagarFormatado,
      };
    });

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

    const chartSections = computed(() => {
        const motivoCombinadoCounts = dashboardMotivos.value?.analysis_result?.motivo_combinado_counts || {};
        
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
                data: chartDataFaixaPagamento.value
            }
        ];
    });

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

    const updatedChartSections = computed(() => {
        return calculatePercentages(chartSections.value);
    });

    const files = [
      { name: 'Relatório Criterios.pdf', size: '3.4 MB', url: '/path/to/apresentacao.pptx' }
    ];

    const version = computed(() => {
      if (!dashboardData.value?.version_info) return [];
      const { version_info } = dashboardData.value;
      return [
        { label: 'Versão', value: version_info.description || 'Desconhecido' },
        { label: 'Data de Criação', value: new Date(version_info.created_at).toLocaleDateString('pt-BR') },
        { 
            label: 'Valor Máximo', 
            value: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(version_info.max_value || 0) 
        },
        { 
            label: 'Carga Horária Máxima', 
            value: version_info.max_workload ? `${version_info.max_workload} horas` : "Não disponível"
        },
        { 
            label: 'Data de Início', 
            value: version_info.start_date ? new Date(version_info.start_date + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não disponível'
        },
        { 
            label: 'Data de Fim', 
            value: version_info.end_date ? new Date(version_info.end_date + 'T00:00:00').toLocaleDateString('pt-BR') : 'Não disponível'
        },
        { 
            label: 'Resultados IDEM', 
            value: [
                version_info.idem_network_step_1 !== undefined ? `Etapa 01: ${version_info.idem_network_step_1}%` : null,
                version_info.idem_network_step_2 !== undefined ? `Etapa 02: ${version_info.idem_network_step_2}%` : null,
                version_info.idem_network_step_3 !== undefined ? `Etapa 03: ${version_info.idem_network_step_3}%` : null,
            ].filter(Boolean).join('\n') || "Não disponível"
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
      navigateHome,
    };
  }
};
</script>