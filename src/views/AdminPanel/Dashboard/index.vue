<template>
  <Whiteboard title="Dashboard" :isSidebarMinimized="isSidebarMinimized">
    <div class="flex flex-row w-full gap-6 py-6 overflow-x-auto lg:overflow-x-hidden">

      <!-- Cartões com dados gerais -->
      <div class="flex flex-col bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 text-gray-800 rounded-lg shadow-md p-6 w-full sm:w-1/3">
        <div class="flex flex-row justify-between items-center mb-4">
          <p class="text-lg font-semibold">Total Users Ativos</p>
          <UsersIcon class="w-8 h-auto text-gray-600" />
        </div>
        <p class="text-3xl font-bold">13,599</p>
      </div>

      <div class="flex flex-col bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 text-gray-800 rounded-lg shadow-md p-6 w-full sm:w-1/3">
        <div class="flex flex-row justify-between items-center mb-4">
          <p class="text-lg font-semibold">Total Users Inativos</p>
          <UsersIcon class="w-8 h-auto text-gray-600" />
        </div>
        <p class="text-3xl font-bold">7,824</p>
      </div>

      <div class="flex flex-col bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 text-gray-800 rounded-lg shadow-md p-6 w-full sm:w-1/3">
        <div class="flex flex-row justify-between items-center mb-4">
          <p class="text-lg font-semibold">Total que Não Recebe</p>
          <UsersIcon class="w-8 h-auto text-gray-600" />
        </div>
        <p class="text-3xl font-bold">2,700</p>
      </div>

      <div class="flex flex-col bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 text-gray-800 rounded-lg shadow-md p-6 w-full sm:w-1/3">
        <div class="flex flex-row justify-between items-center mb-4">
          <p class="text-lg font-semibold">Total a Pagar</p>
          <BanknotesIcon class="w-8 h-auto text-gray-600" />
        </div>
        <p class="text-3xl font-bold">R$ 567.000,00</p>
      </div>

    </div>

    <!-- Gráficos: Motivo de Não Recebimento -->
    <div v-for="(section, index) in chartSections" :key="index" class="w-full bg-white p-6 rounded-lg shadow-lg mt-6 bg-gradient-to-r from-gray-50 to-gray-400">
      <h2 class="text-xl font-semibold mb-4">{{ section.title }}</h2>

      <div class="space-y-4">
        <div v-for="(data, idx) in section.data" :key="idx" class="flex items-center">
          <span class="w-1/4 text-gray-700 font-medium">{{ data.label }}</span>
          <div class="w-3/4 bg-gray-200 rounded-lg h-8 overflow-hidden ">
            <div
              class="bg-primary-800 h-full flex items-center justify-start text-white font-semibold text-center px-2"
              :style="{ width: data.percentage < 20 ? '20%' : data.percentage + '%' }"
            >
              {{ data.percentage }}% ({{ data.value }} pessoas)
            </div>
          </div>
        </div>
      </div>

      <!-- Total Geral para cada seção -->
      <div class="mt-6 border-t pt-4">
        <p class="text-lg font-semibold">Total Geral: {{ section.total }} pessoas</p>
      </div>
    </div>

  

  </Whiteboard>
</template>

<script>
import { inject, computed } from 'vue';
import { UsersIcon, BanknotesIcon } from "@heroicons/vue/24/outline";
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';

export default {
  name: "AdminPanel",
  components: { Whiteboard, UsersIcon, BanknotesIcon },

  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized');

    // Dados do gráfico com cálculos automáticos de porcentagem
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
      },

    ];

    // Função para calcular o total e as porcentagens
    const calculatePercentages = (sections) => {
      sections.forEach((section) => {
        const total = section.data.reduce((sum, item) => sum + item.value, 0);
        section.total = total; // Atualiza o total para exibir no template

        section.data.forEach((item) => {
          item.percentage = ((item.value / total) * 100).toFixed(1); // Calcula a porcentagem e formata com uma casa decimal
        });
      });
      return sections;
    };

    // Atualiza os dados das seções com porcentagens calculadas
    const updatedChartSections = calculatePercentages(chartSections);

    // Cálculo do total geral de todas as seções
    const totalPeople = computed(() =>
      updatedChartSections.reduce((acc, section) => acc + section.total, 0)
    );

    return {
      isSidebarMinimized,
      chartSections: updatedChartSections,
      totalPeople
    };
  }
};
</script>

<style scoped>
/* Estilos adicionais podem ser aplicados aqui */
</style>
