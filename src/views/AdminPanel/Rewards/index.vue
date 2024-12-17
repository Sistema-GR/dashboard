<template>
    <Whiteboard title="." :isSidebarMinimized="isSidebarMinimized" class="-translate-y-20">
        <div class="flex w-full items-center justify-center bg-gradient-to-r from-azure-800 to-primary-900 -translate-y-3">
            <p class="text-white text-3xl py-5 uppercase font-bold w-full text-center">Painel da Gratificação</p>
        </div>
       
        <div class="flex flex-col items-center justify-center w-full gap-5 pt-8 pb-4 lg:px-10 lg:gap-10 lg:flex-row">

            <div class="w-full" v-if="savedData.length > 0">
                <div :class="`flex flex-col items-center justify-center bg-transparent rounded-lg`">
                    <div class="flex items-center justify-center w-full py-3 rounded-lg bg-azure-800">
                        <p class="text-white text-lg font-medium">Nome Do Servidor</p>
                    </div>
                    <div class="flex w-full items-center justify-center py-2.5 rounded-b-lg -translate-y-1 bg-solitude-100 shadow-lg shadow-slate-200">
                        <p class="font-medium whitespace-nowrap capitalize">{{ savedData[0]?.dados?.nome || 'Nome não disponível' }}</p>
                    </div>  
                </div>
            </div>

            <div class="w-full" v-if="savedData.length > 0">
                <div :class="`flex flex-col items-center justify-center bg-transparent rounded-lg`">
                    <div class="flex items-center justify-center w-full py-3 rounded-lg bg-azure-800">
                        <p class="text-white text-lg font-medium">Valor</p>
                    </div>
                    <div class="flex w-full items-center justify-center py-2.5 rounded-b-lg -translate-y-1 bg-solitude-100 shadow-lg shadow-slate-200">
                        <p class="font-medium">R${{ (savedData[0]?.dados?.valor_total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '') }}</p>
                    </div>  
                </div>
            </div>


        </div>

        <div class="flex w-full items-center justify-center py-8 px-5 lg:px-0">
            <p class="text-red-600 text-2xl font-medium text-center">Aviso: os valores nesta página não consideram eventuais descontos de impostos.</p>
        </div>

        <div class="flex flex-row w-full items-center bg-solitude-200">
            <div class="flex w-full items-center justify-center">
                <img src="@/assets/images/Ilustração.png" class="w-full lg:w-2/4 lg:-translate-x-8 pt-4"/>
            </div>

            <div class="flex flex-col items-center justify-center w-full text-normal mx-2 lg:text-2xl gap-3 lg:gap-0">
                <p>Ficou com alguma <span class="font-bold uppercase">DÚVIDA</span> sobre <span class="font-bold uppercase">VALOR</span>?</p>
                <p>Consulte o <span class="font-bold uppercase">DETALHAMENTO</span> abaixo!</p>
                <div class="flex items-center justify-center p-1 border-2 border-black rounded-full animate-bounce lg:mt-6">
                    <ArrowDownIcon class="w-6 h-auto stroke-black" />
                </div>
            </div>
        </div>

        <Disclosure>
            <template #default="{ open }">
                <DisclosureButton class="flex flex-row w-full items-center justify-between mt-0.5 py-4 px-5 bg-solitude-200 hover:bg-gray-400 ease-in-out duration-200 cursor-pointer">
                    <p class="text-lg font-medium">Detalhamento por Matrícula</p>
                    <ChevronDownIcon class="w-6 h-auto transform transition-transform" />
                </DisclosureButton>
                <DisclosurePanel class="w-full py-8">

                    <Disclosure v-for="(item, index) in savedData" :key="index">
                        <template #default="{open}">
                            <DisclosureButton class="flex flex-row w-full items-center justify-between mt-0.5 py-4 px-5 bg-solitude-200 hover:bg-gray-400 ease-in-out duration-200 cursor-pointer">
                                <p class="text-lg font-medium">Matrícula {{ item?.dados?.matricula }}</p>
                                <ChevronDownIcon class="w-6 h-auto transform transition-transform ${open ? 'rotate-180' : 'rotate-0'}" />
                            </DisclosureButton>
                            <DisclosurePanel class="w-full">

                                <div class="overflow-x-auto w-full py-5 mt-5">
                                    <table class="min-w-full border-collapse rounded-lg shadow-lg">
                                        <thead>
                                            <tr class="bg-azure-800 text-gray-100">
                                                <th v-for="(header, index) in ['Descrição', 'Dados', 'Valores a Receber', 'Total']" :key="index" class="p-4 font-semibold text-left">{{ header }}</th>
                                            </tr>
                                        </thead>

                                        <tbody class="bg-white divide-y divide-gray-200">
                                            <tr>
                                                <td class="p-4 border-r border-gray-200 text-gray-700 font-medium">
                                                    <p v-for="(label, index) in ['Nome:', 'CPF:', 'Matrícula:', 'Cargo:']" :key="index">{{ label }}</p>
                                                </td>

                                                <td class="p-4 border-r border-gray-200 text-gray-700 whitespace-nowrap">
                                                    <p class="capitalize">{{ item?.dados?.nome }}</p>
                                                    <p>{{ item?.dados?.cpf }}</p>
                                                    <p>{{ item?.dados?.matricula }}</p>
                                                    <p class="capitalize">{{ item?.dados?.cargo }}</p>
                                                </td>

                                                <td class="p-4 border-r border-gray-200 text-gray-700 whitespace-nowrap">
                                                    <p v-for="(label, index) in ['Valor Máximo Rede:', 'Valor Máximo Unidades:', 'Desconto:', 'Valor Total:']" :key="index">{{ label }}</p>
                                                </td>

                                                <td class="p-4 text-gray-700 font-semibold whitespace-nowrap">
                                                    <td class="p-4 text-gray-700 font-semibold whitespace-nowrap">
                                                        <p>{{ formatCurrency(item?.profissionais[0]?.valor_rede_maximo) }}</p>
                                                        <p>{{ formatCurrency(item?.profissionais[0]?.valor_unidade_maximo) }}</p>
                                                        <p>{{ formatCurrency(item?.profissionais[0]?.desconto) }}</p>
                                                        <p>{{ formatCurrency(item?.dados?.valor_total) }}</p>
                                                    </td>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>


                                <div class="flex flex-col w-full items-center overflow-hidden py-5 shadow-lg rounded-lg bg-white">
                                    <div class="flex w-full border-b items-center justify-center bg-azure-800 py-4 rounded-t-lg">
                                        <p class="text-xl text-center font-semibold text-white">Critérios de Verificação para Gratificação</p>
                                    </div>

                                    <div class="w-full overflow-x-auto">
                                        <table class="w-full border-collapse text-sm">
                                            <thead>
                                                <tr class="bg-gray-200 text-gray-800 uppercase text-left">
                                                    <th class="border border-gray-200 px-4 py-3 font-medium w-1/3">Critério</th>
                                                    <th class="border border-gray-200 px-4 py-3 font-medium w-1/3">Valor</th>
                                                    <th class="border border-gray-200 px-4 py-3 font-medium w-1/3">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr class="hover:bg-gray-50 transition-shadow hover:shadow-md">
                                                    <td class="border border-gray-200 px-4 py-3 text-gray-700">Frequência</td>
                                                    <td class="border border-gray-200 px-4 py-3 text-gray-700">
                                                        {{ item?.frequencia[0]?.percentual_frequencia ? Number(item.frequencia[0].percentual_frequencia).toFixed(2) + '%' : '100%' }}
                                                    </td>
                                                    <td 
                                                        :class="{
                                                            'text-red-600 font-semibold': item?.frequencia[0]?.percentual_frequencia !== undefined && Number(item.frequencia[0].percentual_frequencia) < 96,
                                                            'text-green-600 font-semibold': !item?.frequencia[0]?.percentual_frequencia || Number(item.frequencia[0].percentual_frequencia) >= 96
                                                        }"
                                                        class="border border-gray-200 px-4 py-3"
                                                    >
                                                        {{ item?.frequencia[0]?.percentual_frequencia ? (Number(item.frequencia[0].percentual_frequencia) >= 96 ? 'Apto' : 'Não Apto') : 'Apto' }}
                                                    </td>
                                                </tr>



                                                <tr class="hover:bg-gray-50 transition-shadow hover:shadow-md">
                                                    <td class="border border-gray-200 px-4 py-3 text-gray-700">Tempo de Atuação</td>
                                                    <td class="border border-gray-200 px-4 py-3 text-gray-700">
                                                        {{ item?.dados?.tempo_atuacao === true ? 'Sim' : 'Não' }}
                                                    </td>
                                                    <td 
                                                        :class="{
                                                            'text-red-600 font-semibold': item?.dados?.tempo_atuacao === false,
                                                            'text-green-600 font-semibold': item?.dados?.tempo_atuacao === true
                                                        }"
                                                        class="border border-gray-200 px-4 py-3"
                                                    >
                                                        {{ item?.dados?.tempo_atuacao === true ? 'Apto' : 'Não Apto' }}
                                                    </td>
                                                </tr>




                                                <tr class="hover:bg-gray-50 transition-shadow hover:shadow-md">
                                                    <td class="border border-gray-200 px-4 py-3 text-gray-700">Formação</td>
                                                    <td class="border border-gray-200 px-4 py-3 text-gray-700">
                                                        {{ item?.dados?.formacoes === 'True' ? 'Sim' : item?.dados?.formacoes === 'False' ? 'Não' : item?.dados?.formacoes === 'Sem Dados' ? 'Sim' : 'Indefinido' }}
                                                    </td>                                                                                   
                                                    <td class="border border-gray-200 px-4 py-3">
                                                        <span :class="item?.dados?.formacoes === 'True' || item?.dados?.formacoes === 'Sem Dados' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                                                            {{ item?.dados?.formacoes === 'True' || item?.dados?.formacoes === 'Sem Dados' ? 'Apto' : 'Não Apto' }}
                                                        </span>
                                                    </td>
                                                </tr>




                                                <tr class="hover:bg-gray-50 transition-shadow hover:shadow-md">
                                                    <td class="border border-gray-200 px-4 py-3 text-gray-700">Atividades</td>
                                                    <td class="border border-gray-200 px-4 py-3 text-gray-700">{{ item?.dados?.recebe_atividade ? 'Sim' : 'Não' }}</td>
                                                    <td 
                                                        :class="{
                                                            'text-red-600 font-semibold': !item?.dados?.recebe_atividade,
                                                            'text-green-600 font-semibold': item?.dados?.recebe_atividade
                                                        }"
                                                        class="border border-gray-200 px-4 py-3"
                                                    >
                                                        {{ item?.dados?.recebe_atividade ? 'Apto' : 'Não Apto' }}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div class="flex flex-col w-full items-center py-5 mt-5 shadow-lg rounded-lg bg-gray-50">
                                    <div class="flex w-full items-center justify-center bg-azure-800 py-4 rounded-t-lg mb-5 border shadow-md">
                                        <p class="text-xl font-semibold text-white">Alocações em 2024</p>
                                    </div>

                                    <div class="flex flex-col w-full"> 
                                        <div v-if="item.profissionais && item.profissionais.length > 0">
                                            <div 
                                                v-for="(prof, profIndex) in item.profissionais" 
                                                :key="profIndex" 
                                                class="flex-col w-full shadow-md rounded-lg mb-4"
                                            >
                                                <div class="flex overflow-x-auto flex-row w-full justify-between items-center bg-azure-800 px-4 py-2 rounded-t-lg">
                                                    <span class="text-lg font-medium text-white capitalize whitespace-nowrap mr-10 lg:mr-0">{{ prof?.nome_unidade }}</span>
                                                    <div class="flex flex-row w-full lg:w-auto items-center justify-end space-x-4">
                                                        <span class="text-sm lg:text-lg font-medium text-white">
                                                            Etapa 1: <span class="font-semibold text-white">{{ prof?.idem_rede_etapa_1 }}%</span>
                                                        </span>
                                                        <span class="text-sm lg:text-lg font-medium text-white">
                                                            Etapa 2: <span class="font-semibold text-white">{{ prof?.idem_rede_etapa_2 }}%</span>
                                                        </span>
                                                        <span class="text-sm lg:text-lg font-medium text-white">
                                                            Etapa 3: <span class="font-semibold text-white">{{ prof?.idem_rede_etapa_3 }}%</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div class="w-full overflow-x-auto"> 
                                                    <table class="min-w-full border-collapse text-gray-700"> 
                                                        <thead>
                                                            <tr class="bg-gray-200 text-gray-800 uppercase text-sm border-b">
                                                                <th v-for="header in ['Ínicio', 'Fim', 'Função', 'Carga Horária', 'Grupo']" 
                                                                    :key="header" 
                                                                    class="px-4 lg:px-6 py-3 font-semibold text-xs lg:text-sm uppercase tracking-wide text-center text-gray-800 border-b border-gray-300">
                                                                    {{ header }}
                                                                </th>
                                                            </tr>
                                                        </thead>

                                                        <tbody>
                                                            <tr class="hover:bg-gray-50 transition-shadow hover:shadow-md text-center capitalize whitespace-nowrap">
                                                                <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ new Date(prof.inicio_atividade_local).toLocaleDateString('pt-BR') }}</td>
                                                                <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ new Date(prof.fim_atividade_local).toLocaleDateString('pt-BR') }}</td>
                                                                <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ prof.nome_disciplina || 'N/A' }}</td>
                                                                <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ prof.percentual_carga_horaria || 'N/A' }}h</td>
                                                                <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ prof.grupo || 'N/A' }}</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="flex flex-col w-full items-center overflow-hidden py-5 mt-5 shadow-lg rounded-lg bg-gray-50">

                                    <div class="flex w-full border-b items-center justify-center bg-azure-800 py-3 rounded-t-lg">
                                        <p class="text-xl text-center font-semibold text-white">Frequência (Afastamentos)</p>
                                    </div>

                                    <div class="w-full overflow-x-auto">
                                        <table class="min-w-full border-collapse bg-white shadow-sm rounded-lg">
                                            <thead>
                                                <tr class="bg-gray-200 text-gray-800 uppercase text-sm">
                                                    <th v-for="header in ['Início', 'Fim', 'Tipo de Afastamento', 'Total Dias', 'Contabilizados']" 
                                                        :key="header" 
                                                        class="px-4 py-3 text-gray-800 font-semibold text-center border-b border-gray-200">
                                                        {{ header }}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(freq, freqIndex) in item.frequencia.filter(freq => ![false].includes(freq.contabiliza))" :key="freqIndex" class="text-center hover:bg-gray-50 hover:shadow-md transition-all duration-200 whitespace-nowrap capitalize">
                                                    <td class="border border-gray-200 px-4 py-3">{{ new Date(freq.inicio_afastamento).toLocaleDateString('pt-BR') }}</td>
                                                    <td class="border border-gray-200 px-4 py-3">{{ new Date(freq.fim_afastamento).toLocaleDateString('pt-BR') }}</td>
                                                    <td class="border border-gray-200 px-4 py-3">{{ freq.motivo || 'N/A' }}</td>
                                                    <td class="border border-gray-200 px-4 py-3">{{ freq.dias_afastado || '0' }}</td>
                                                    <td class="border border-gray-200 px-4 py-3">{{ freq.contabiliza ? 'Sim' : 'Não' }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </DisclosurePanel>
                        </template>
                    </Disclosure>

                </DisclosurePanel>
            </template>
        </Disclosure>

        <div class="flex w-full items-center justify-end">
            <router-link to="/user/form">
                <div class="flex flex-row items-center justify-center px-3 py-2 mt-3 gap-1 bg-tropical-blue-200 hover:bg-gray-400 ease-in-out duration-200 cursor-pointer">
                    <ExclamationCircleIcon class="w-6 h-auto" />
                    <p class="font-medium">Recurso</p>
                </div>
            </router-link>
        </div>
      
    </Whiteboard>
</template>
  
<script setup>
import { inject, ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { ChevronDownIcon, ExclamationCircleIcon, ArrowDownIcon } from "@heroicons/vue/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';

const isSidebarMinimized = inject('isSidebarMinimized');
const savedData = ref([]);

const processarDados = (rawData) => {
  const matriculaMap = {};

  rawData.forEach(item => {
    const matricula = item.dados?.matricula; 
    const cpf = item.dados?.cpf; 
    if (item.dados && matricula && cpf) {
      if (!matriculaMap[matricula]) {
        matriculaMap[matricula] = {
          cpf,
          dados: item.dados,
          frequencia: [],
          profissionais: []
        };
      }

      const frequenciasFiltradas = (item.frequencia || []).filter(freq => freq.matricula === matricula);
      const profissionaisFiltrados = (item.profissionais || []).filter(prof => prof.matricula === matricula);

      matriculaMap[matricula].frequencia.push(...frequenciasFiltradas);
      matriculaMap[matricula].profissionais.push(...profissionaisFiltrados);
    }
  });

  return removerDuplicatas(Object.entries(matriculaMap).map(([matricula, data]) => ({
    matricula,
    ...data
  })));
};

const props = defineProps({
  item: {
    type: Object,
    required: true
  },
});


const removerDuplicatas = (dados) => {
  const seen = new Set();
  return dados.filter(item => {
    const key = `${item.matricula}-${item.cpf}`;
    if (seen.has(key)) {
      return false; 
    }
    seen.add(key); 
    return true; 
  });
};

const carregarDados = () => {
  try {
    const savedRowData = JSON.parse(localStorage.getItem('rowSave')) || {};
    let rawData = Object.values(savedRowData).flatMap(item => Object.values(item));

    savedData.value = processarDados(rawData);

    console.log('Dados organizados:', savedData.value);
  } catch (error) {
    console.error('Erro ao recuperar dados do localStorage:', error);
  }
};
const formatCurrency = (value) => {
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

onMounted(() => {
  carregarDados();
});

onBeforeUnmount(() => {
  localStorage.removeItem('rowSave');
});
</script>