<template>
  <Whiteboard title="Dashboard" :isSidebarMinimized="isSidebarMinimized">
    <div class="flex flex-row w-full gap-6 py-6 overflow-x-auto lg:overflow-x-hidden">

      <div class="flex flex-col bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 text-gray-800 rounded-lg shadow-md p-6 w-full sm:w-1/3">
        <div class="flex flex-row justify-between items-center mb-4">
          <p class="text-lg font-semibold">Total que Recebe</p>
          <UsersIcon class="w-8 h-auto text-gray-600" />
        </div>
        <p class="text-3xl font-bold">{{ totalRecebem }}</p>
      </div>

      <div class="flex flex-col bg-gradient-to-r from-gray-100 to-gray-300 border border-gray-200 text-gray-800 rounded-lg shadow-md p-6 w-full sm:w-1/3">
        <div class="flex flex-row justify-between items-center mb-4">
          <p class="text-lg font-semibold">Total que Não Recebe</p>
          <UsersIcon class="w-8 h-auto text-gray-600" />
        </div>
        <p class="text-3xl font-bold">{{ totalNaoRecebem }}</p>
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
            <div class="whitespace-nowrap">{{ data.percentage.toFixed(2) }}% ({{ data.value }} pessoas)</div>
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
import { getAccessToken } from '../../../service/token'; 
import { downloadCSV } from '@/service/download';

export default {
  name: "AdminPanel",
  components: { Whiteboard, UsersIcon, BanknotesIcon, DocumentDuplicateIcon, ArrowDownTrayIcon },

  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized', false); 
    const totalAPagar = ref(0);
    const totalRecebem = ref(0);
    const totalNaoRecebem = ref(0);
    const chartSections = ref([]); 

    const fetchData = async () => {
      try {
        const token = await getAccessToken(); 

        if (token) {
          // Requisição à API - Rota de Formações
          const responseFormacoes = await axios.get('http://10.203.2.98:8000/csv/process/criterios/', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const dataFormacoes = responseFormacoes.data; 

          totalRecebem.value = dataFormacoes.filter(item => item.recebe_gratificacao === true).length;
          totalNaoRecebem.value = dataFormacoes.filter(item => item.recebe_gratificacao === false).length;

          const responseCriterios = await axios.get('http://10.203.2.98:8000/csv/process/criterios/', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const dataCriterios = responseCriterios.data; 

          totalAPagar.value = dataCriterios.reduce((sum, item) => sum + parseFloat(item.valor_total || 0), 0);

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
            if (valorTotal === 0) {
              faixaPagamento[5].value += 1; 
            } else if (valorTotal <= 1500) {
              faixaPagamento[0].value += 1; 
            } else if (valorTotal > 1500 && valorTotal <= 3000) {
              faixaPagamento[1].value += 1; 
            } else if (valorTotal > 3000 && valorTotal <= 4500) {
              faixaPagamento[2].value += 1; 
            } else if (valorTotal > 4500 && valorTotal <= 6000) {
              faixaPagamento[3].value += 1; 
            } else if (valorTotal > 6000) {
              faixaPagamento[4].value += 1; 
            }
          });

          const chartDataFaixaPagamento = {
            title: "Faixa de Pagamento",
            data: faixaPagamento
          };

          const response = await axios.get('http://10.203.2.139:8000/csv/process/funcionarios/', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const dataProfissional = response.data; 
          const totalAtividades = dataProfissional.filter(item => item.atividades === false).length;
          const totalFormacoes = dataProfissional.filter(item => item.formacoes === false).length;
          const totalInfrequencia = dataProfissional.filter(item => item.percentual_infrequencia_criterios === false).length;
          const totalTempoAtuacao = dataProfissional.filter(item => item.tempo_atuacao === false).length;

          const total = dataProfissional.length;

          chartSections.value = [
            {
              title: "Motivo de Não Recebimento",
              data: [
                { label: "Atividades", value: totalAtividades, percentage: (totalAtividades / total) * 100 },
                { label: "Formação", value: totalFormacoes, percentage: (totalFormacoes / total) * 100 },
                { label: "Infrequência por Critérios", value: totalInfrequencia, percentage: (totalInfrequencia / total) * 100 },
                { label: "Tempo de Atuação", value: totalTempoAtuacao, percentage: (totalTempoAtuacao / total) * 100 },
              ],
              total: total
            },
            {
              title: "Ativos e Inativos",
              data: [
                { label: "Ativo", value: 0 },
                { label: "Ausência Temporária", value: 0 }
              ]
            },
            chartDataFaixaPagamento 
          ];
        } else {
          console.error("Erro: Token de acesso não encontrado.");
        }
      } catch (error) {
        console.error("Erro ao buscar os dados:", error);
      }
    };

    const fetchActiveData = async () => {
      try {
        const token = await getAccessToken();  // Corrigido a sintaxe do await

        if (token) {
          // Realiza a requisição GET para a API
          const response = await axios.get('http://10.203.2.139:8000/csv/api/get-active-dataset/', {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log(response.data);  // Mostra os dados no console
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };



    const files = [
      { name: 'Relatório Criterios.csv', size: '3.4 MB', url: '/path/to/apresentacao.pptx' }
    ];

    onMounted(() => {
      fetchData();
      fetchActiveData();
    });

    const formattedTotalAPagar = computed(() => {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(totalAPagar.value);
    });

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

    const updatedChartSections = computed(() => calculatePercentages(chartSections.value));

    const totalPeople = computed(() =>
      updatedChartSections.value.reduce((acc, section) => acc + section.total, 0)
    );
    
    const version = [
      { label: 'Nome da Versão', value: 'Versão 1.0' },
      { label: 'Descrição', value: 'Esta é a versão inicial da dashboard.' },
      { label: 'Data de Criação', value: '12/12/2024' },
      { label: 'Valor Total Usado', value: 'R$ 1.200,00' },
      { label: 'Data de Início', value: '02/02/2024' },
      { label: 'Data de Fim', value: '02/12/2024' }
    ];

    return {
      isSidebarMinimized,
      chartSections: updatedChartSections,
      totalPeople,
      formattedTotalAPagar,
      totalAPagar, 
      totalRecebem,
      totalNaoRecebem,
      files,
      downloadCSV
    };
  }
};
</script>
