<template>
  <Whiteboard title="Dashboard" :isSidebarMinimized="isSidebarMinimized">
    <div class="flex flex-row w-full gap-6 py-6 overflow-x-auto lg:overflow-x-hidden">

      <div class="flex flex-col bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 text-gray-800 rounded-lg shadow-md p-6 w-full sm:w-1/3">
        <div class="flex flex-row justify-between items-center mb-4">
          <p class="text-lg font-semibold">Total que Recebe</p>
          <UsersIcon class="w-8 h-auto text-gray-600" />
        </div>
        <p class="text-3xl font-bold">13.599</p>
      </div>

      <div class="flex flex-col bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 text-gray-800 rounded-lg shadow-md p-6 w-full sm:w-1/3">
        <div class="flex flex-row justify-between items-center mb-4">
          <p class="text-lg font-semibold">Total que Não Recebe</p>
          <UsersIcon class="w-8 h-auto text-gray-600" />
        </div>
        <p class="text-3xl font-bold">2.824</p>
      </div>

      <div class="flex flex-col bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 text-gray-800 rounded-lg shadow-md p-6 w-full sm:w-1/3">
        <div class="flex flex-row justify-between items-center mb-4">
          <p class="text-lg font-semibold">Total a Pagar</p>
          <BanknotesIcon class="w-8 h-auto text-gray-600" />
        </div>
        <p class="text-3xl font-bold">R$ 567.000,00</p>
      </div>

    </div>

    <div v-for="(section, index) in chartSections" :key="index" class="w-full bg-white p-6 rounded-lg shadow-lg mt-6 bg-gradient-to-r from-gray-50 to-gray-400">
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

    <div class="w-full p-6 bg-gradient-to-r from-gray-100 to-gray-300 rounded-lg shadow-lg my-6">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Downloads</h2>

      <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between border border-gray-200 rounded-lg p-4 mb-4">
        <div class="flex items-center space-x-4">

          <document-duplicate-icon class="h-8 w-8 text-gray-500" />

          <div class="flex flex-col">
            <p class="text-gray-800 font-medium">{{ file.name }}</p>
            <span class="text-sm text-gray-600">{{ file.size }}</span>
          </div>
        </div>

        <a :href="file.url" download class="flex items-center text-blue-500 hover:text-blue-700">
          <ArrowDownTrayIcon  class="h-5 w-5 mr-2" />
          <span class="text-sm font-semibold">Baixar</span>
        </a>
      </div>
    </div>

    <div class="flex flex-col w-full mt-3 bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 p-6 rounded-lg shadow-lg">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">Informações sobre a Versão</h2>

      <!-- Exibição dos Dados -->
      <div class="space-y-4">
        <div v-for="(field, index) in version" :key="index" class="flex justify-between">
          <span class="font-medium text-gray-700">{{ field.label }}:</span>
          <span class="text-gray-800">{{ field.value }}</span>
        </div>
      </div>

      <!-- Botão de Salvar -->
      <div class="mt-6 text-right">
        <button class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          Salvar
        </button>
      </div>
    </div>


  </Whiteboard>
</template>

<script>
import { inject, computed } from 'vue';
import { UsersIcon, BanknotesIcon, DocumentDuplicateIcon, ArrowDownTrayIcon } from "@heroicons/vue/24/outline";
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';

export default {
  name: "AdminPanel",
  components: { Whiteboard, UsersIcon, BanknotesIcon, DocumentDuplicateIcon, ArrowDownTrayIcon },

  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized', false); // Valor padrão

    const chartSections = [
      {
        title: "Motivo de Não Recebimento",
        data: [
          { label: "Atividades", value: 12 },
          { label: "Formação", value: 53 },
          { label: "Frequência", value: 1146 },
          { label: "Mais de 1 critério individual", value: 487 },
          { label: "Não recebe valor total por mais de 1 critério", value: 108 },
          { label: "Tempo de atuação", value: 1427 }
        ]
      },
      {
        title: "Ativos e Inativos",
        data: [
          { label: "Ativo", value: 3777 },
          { label: "Ausência Temporária", value: 478 }
        ]
      },
      {
        title: "Faixa de Pagamento",
        data: [
          { label: "Até R$ 1.500", value: 471 },
          { label: "De R$ 1.500 a R$ 3.000", value: 998 },
          { label: "De R$ 3.000 a R$ 4.500", value: 969 },
          { label: "De R$ 4.500 a R$ 6.000", value: 550 },
          { label: "Mais que R$ 6.000", value: 1212 },
          { label: "Não receb nada", value: 3125 }
        ]
      }
    ];

    const files = [
      { name: 'Relatório Pagamento.pdf', size: '1.2 MB', url: '/path/to/relatorio-anual.pdf' },
      { name: 'Relatório Completo 399.pdf', size: '500 KB', url: '/path/to/dados-de-vendas.xlsx' },
      { name: 'Relatório Criterios.pdf', size: '3.4 MB', url: '/path/to/apresentacao.pptx' }
    ];

    const version = [
      { label: 'Nome da Versão', value: 'Versão 1.0' },
      { label: 'Descrição', value: 'Esta é a versão inicial da dashboard.' },
      { label: 'Data de Criação', value: '12/12/2024' },
      { label: 'Valor Total Usado', value: 'R$ 1.200,00' },
      { label: 'Data de Início', value: '02/02/2024' },
      { label: 'Data de Fim', value: '02/12/2024' }
    ];

    const calculatePercentages = (sections) => {
      sections.forEach((section) => {
        const total = section.data.reduce((sum, item) => sum + item.value, 0);
        section.total = total;

        section.data.forEach((item) => {
          item.percentage = parseFloat(((item.value / total) * 90).toFixed(1));
        });
      });
      return sections;
    };

    const updatedChartSections = calculatePercentages(chartSections);

    const totalPeople = computed(() =>
      updatedChartSections.reduce((acc, section) => acc + section.total, 0)
    );

    return {
      isSidebarMinimized,
      chartSections: updatedChartSections,
      totalPeople,
      files,
      version,
    };
  }
};
</script>


