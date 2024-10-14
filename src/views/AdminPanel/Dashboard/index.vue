<template>
  <Whiteboard title="Dashboard" :isSidebarMinimized="isSidebarMinimized">
    <!-- Cabeçalho do Dashboard -->
    <div class="flex flex-row w-full items-center justify-between py-4 border-b bg-white">
      <p class="text-2xl italic font-semibold text-gray-900">Primeira Versão</p>

      <div class="flex flex-col items-end">
        <p class="text-sm text-gray-600 mr-3">
          Valor Global: <span class="font-semibold text-gray-900">R$ 8.640,60</span>
        </p>
        <p class="text-sm text-gray-600 mr-3">
          Período: <span class="font-semibold text-gray-900">01/02/2023 a 20/12/2023</span>
        </p>
      </div>
    </div>

    <!-- Seleção de Gráficos -->
    <div class="flex items-center w-full py-4">
      <label for="selectChart" class="mr-3 text-lg font-semibold text-gray-800">Escolha um gráfico:</label>
      <select v-model="selectedChart" id="selectChart" class="border p-2 rounded-lg">
        <option value="paymentDistribution">Distribuição de Pagamento</option>
        <option value="nonPaymentReasons">Motivos do Não Recebimento</option>
        <option value="professionals">Situação dos Profissionais</option>
        <option value="faixaPayments">Faixa de Pagamento</option>
      </select>
    </div>

    <!-- Renderização condicional dos gráficos -->
    <div class="flex flex-wrap w-full items-center justify-center gap-6 p-6 border border-gray-300 rounded-lg shadow-md bg-white">
      <!-- Gráfico de Distribuição de Pagamento -->
      <div v-if="selectedChart === 'paymentDistribution'" class="flex flex-col items-center gap-3 shadow-lg p-6 bg-white rounded-lg">
        <p class="font-medium text-lg text-gray-700">Distribuição de Pagamento</p>
        <DoughnutChart :chart-data="paymentDistributionData" :options="paymentDistributionOptions" />
      </div>

      <!-- Gráfico de Motivos do Não Recebimento -->
      <div v-if="selectedChart === 'nonPaymentReasons'" class="flex flex-col items-center gap-3 shadow-lg p-6 bg-white rounded-lg">
        <p class="font-medium text-lg text-gray-700">Motivos do Não Recebimento</p>
        <BarChart :chart-data="nonPaymentReasonsData" :options="nonPaymentReasonsOptions" />
      </div>

      <!-- Gráfico de Situação dos Profissionais -->
      <div v-if="selectedChart === 'professionals'" class="flex flex-col items-center gap-3 shadow-lg p-6 bg-white rounded-lg">
        <p class="font-medium text-lg text-gray-700">Situação dos Profissionais</p>
        <BarChart :chart-data="professionalsData" :options="professionalsOptions" />
      </div>

      <!-- Gráfico de Faixa de Pagamento -->
      <div v-if="selectedChart === 'faixaPayments'" class="flex flex-col items-center gap-3 shadow-lg p-6 bg-white rounded-lg">
        <p class="font-medium text-lg text-gray-700">Faixa de Pagamento</p>
        <BarChart :chart-data="faixaPaymentsData" :options="faixaOptions" />
      </div>
    </div>

    <!-- Seção de Relatórios -->
    <div class="flex w-full justify-center py-6">
        <div class="bg-white p-6 rounded-lg shadow-lg w-full">
          <p class="text-xl font-semibold text-gray-800 mb-4">Relatórios</p>
            <div class="flex flex-col justify-between mb-4">
            
              <!-- Relatório de Critérios -->
              <div class="flex flex-row gap-2 cursor-pointer group" @click="downloadReport('criterios')">
                <p class="text-blue-600 group-hover:text-blue-800">Emitir Relatório de Critérios</p>
                <DocumentArrowDownIcon class="w-5 h-5 stroke-blue-600 group-hover:stroke-blue-800" />
              </div>

              <!-- Relatório de Pagamento -->
              <div class="flex flex-row gap-2 cursor-pointer group" @click="downloadReport('pagamento')">
                <p class="text-blue-600 group-hover:text-blue-800">Emitir Relatório de Pagamento</p>
                <DocumentArrowDownIcon class="w-5 h-5 stroke-blue-600 group-hover:stroke-blue-800" />
              </div>

              <div class="flex flex-row gap-2 cursor-pointer group" @click="downloadReport('criterios')">
                <p class="text-blue-600 group-hover:text-blue-800">Emitir Relatório de Critérios</p>
                <DocumentArrowDownIcon class="w-5 h-5 stroke-blue-600 group-hover:stroke-blue-800" />
              </div>

              <!-- Relatório de Pagamento -->
              <div class="flex flex-row gap-2 cursor-pointer group" @click="downloadReport('pagamento')">
                <p class="text-blue-600 group-hover:text-blue-800">Emitir Relatório de Pagamento</p>
                <DocumentArrowDownIcon class="w-5 h-5 stroke-blue-600 group-hover:stroke-blue-800" />
              </div>

            </div>

        </div>
    </div>


  </Whiteboard>
</template>

<script>
import { ref, inject } from 'vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { DoughnutChart, BarChart } from 'vue-chart-3';
import { DocumentArrowDownIcon } from "@heroicons/vue/24/outline";

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  DoughnutController,
  BarController
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, PointElement, LineElement, BarElement, LinearScale, DoughnutController, BarController);

export default {
  name: "AdminPanel",
  components: { Sidebar, Whiteboard, DoughnutChart, BarChart, DocumentArrowDownIcon },

  data() {
    return {
      selectedChart: 'paymentDistribution', // Controla o gráfico selecionado
      paymentDistributionData: {
        labels: ['Pessoas que Receberam', 'Pessoas que Não Receberam'],
        datasets: [
          {
            label: 'Distribuição de Pagamento',
            backgroundColor: ['#00CC00', '#A9A9A9'], 
            data: [4142, 2150], 
          },
        ],
      },
      paymentDistributionOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top', 
          },
        },
      },
      nonPaymentReasonsData: {
        labels: [
          'Atividades',
          'Formação',
          'Frequência',
          'Mais de 1 critério individual',
          'Múltiplos critérios.',
          'Tempo de atuação'
        ],
        datasets: [
          {
            label: 'Motivos do Não Recebimento',
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733', '#33FF57', '#3357FF'], 
            data: [12, 53, 1210, 502, 93, 1427], 
          },
        ],
      },
      nonPaymentReasonsOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top', 
          },
        },
      },
      professionalsData: {
        labels: ['Total Geral', 'Ativos', 'Inativos'],
        datasets: [
          {
            label: 'Nº de Profissionais',
            backgroundColor: ['#36A2EB', '#FF6384', '#FFA500'], 
            data: [4137, 3668, 469], 
          },
        ],
      },
      professionalsOptions: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'none', 
          },
        },
      },
      faixaPaymentsData: {
        labels: [
          'Até R$ 1.500',
          'De R$ 1.500 a R$ 3.000',
          'De R$ 3.000 a R$ 4.500',
          'De R$ 4.500 a R$ 6.000',
          'Mais que R$ 6.000',
          'Não recebe nada',
          'Total'
        ],
        datasets: [
          {
            label: 'Nº de profissionais',
            data: [2046, 1814, 139, 26, 112, 3204, 7341],
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#FF3340',
            ],
          },
        ],
      },
      faixaOptions: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Distribuição de Profissionais por Faixa de Pagamento',
          },
        },
      },
    };
  },

  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')

    return {
      isSidebarMinimized
    }
  }
}
</script>
