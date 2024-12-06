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
        <p class="text-3xl font-bold">{{ formattedTotalAPagar }}</p> <!-- Exibe o valor formatado automaticamente -->
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
          <DocumentDuplicateIcon class="h-8 w-8 text-gray-500" />
          <div class="flex flex-col">
            <p class="text-gray-800 font-medium">{{ file.name }}</p>
            <span class="text-sm text-gray-600">{{ file.size }}</span>
          </div>
        </div>

        <!-- Botão de download -->
        <button @click="downloadCSV" class="flex items-center text-blue-500 hover:text-blue-700">
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
          Salvar e Sair
        </button>
      </div>
    </div>


  </Whiteboard>
</template>

<script>
import { inject, computed, ref, onMounted } from 'vue';
import { UsersIcon, BanknotesIcon, DocumentDuplicateIcon, ArrowDownTrayIcon } from "@heroicons/vue/24/outline";
import axios from 'axios';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { getAccessToken } from '../../../service/token'; // Certifique-se de importar a função getAccessToken
import { downloadCSV } from '@/service/download';

export default {
  name: "AdminPanel",
  components: { Whiteboard, UsersIcon, BanknotesIcon, DocumentDuplicateIcon, ArrowDownTrayIcon },

  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized', false); // Valor padrão

    // Armazenar a soma do valor total
    const totalAPagar = ref(0);

    // Função para buscar os dados da API e somar os valores
    const fetchTotalAPagar = async () => {
      try {
        const token = await getAccessToken();  // Obtém o token de acesso

        // Verifica se o token foi obtido com sucesso
        if (token) {
          // Realiza a requisição com o token no cabeçalho Authorization
          const response = await axios.get('http://10.203.2.116:8000/csv/process/criterios/', {
            headers: {
              Authorization: `Bearer ${token}`,  // Passando o token no cabeçalho
            },
          });
          
          const data = response.data; // Supondo que a resposta seja um JSON com os dados da tabela

          // Somar os valores de "valor_total"
          totalAPagar.value = data.reduce((sum, item) => sum + parseFloat(item.valor_total || 0), 0);
        } else {
          console.error("Erro: Token de acesso não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    // Chamar a função ao montar o componente
    onMounted(() => {
      fetchTotalAPagar();
    });

    // Função para formatar o valor como moeda brasileira
    const formattedTotalAPagar = computed(() => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(totalAPagar.value);
    });

    // Seções para o gráfico
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
          { label: "Não recebe nada", value: 3125 }
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

    // Função para calcular porcentagens dos dados do gráfico
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
      downloadCSV,
      totalAPagar, // Passando o valor total calculado para o template
      formattedTotalAPagar, // Passando o valor formatado para o template
    };
  }
};
</script>

