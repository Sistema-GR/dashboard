<template>
    <Whiteboard title="." >

        <div class="flex py-4 px-6 shadow-md w-full z-50 items-center justify-center bg-gradient-to-r from-azure-800 to-primary-900">
            <h1 id="tutorial-title" class="text-20 text-white text-center font-black uppercase tracking-wide sm:text-25 lg:text-30 whitespace-nowrap">Painel da Gratificação</h1>
        </div>
       
        <div class="flex flex-col items-center justify-center w-full gap-5 pt-8 pb-4 lg:px-10 lg:gap-10 lg:flex-row">

            <div id="tutorial-server-name" class="w-full px-10" v-if="savedData.length > 0">
                <div :class="`flex flex-col items-center justify-center bg-transparent rounded-[10px]`">
                    <div class="flex items-center justify-center w-full py-3 rounded-[10px] bg-azure-800">
                        <p class="text-white text-20 font-semibold">Nome Do Servidor</p>
                    </div>
                    <div class="flex w-full items-center justify-center py-2.5 rounded-b-lg -translate-y-1 bg-solitude-100 shadow-lg shadow-slate-200">
                        <p class="font-medium whitespace-nowrap capitalize text-15">{{ savedData[0]?.dados?.nome || 'Nome não disponível' }}</p>
                    </div>  
                </div>
            </div>

            <div id="tutorial-value" class="w-full px-10" v-if="savedData.length > 0">
                <div :class="`flex flex-col items-center justify-center bg-transparent rounded-[10px]`">
                    <div class="flex items-center justify-center w-full py-3 rounded-[10px] bg-azure-800">
                        <p class="text-white text-20 font-semibold">Valor</p>
                    </div>
                    <div class="flex w-full items-center justify-center py-2.5 rounded-b-lg -translate-y-1 bg-solitude-100 shadow-lg shadow-slate-200">
                        <p class="font-medium text-15">R${{ (savedData[0]?.dados?.valor_total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '') }}</p>
                    </div>  
                </div>
            </div>

        </div>

        <div id="tutorial-warning" class="flex w-full items-center justify-center py-8 px-10">
            <p class="text-red-600 text-20 lg:text-25 font-medium text-center">Aviso: os valores nesta página não consideram eventuais descontos de impostos.</p>
        </div>

        <div class="flex flex-row w-full items-center bg-solitude-200">
            <div class="flex w-full items-center justify-center">
                <img src="@/assets/images/Ilustração.png" class="w-full lg:w-2/4 lg:-translate-x-8 pt-4"/>
            </div>

            <div class="flex flex-col items-center text-center justify-center w-full text-15 mx-2 sm:text-20 lg:text-25 gap-3 lg:gap-0">
                <p>Ficou com alguma <span class="font-bold uppercase">DÚVIDA</span> sobre <span class="font-bold uppercase">VALOR</span>?</p>
                <p>Consulte o <span class="font-bold uppercase">DETALHAMENTO</span> abaixo!</p>
                <div class="flex items-center justify-center p-1 border-2 border-black rounded-full animate-bounce lg:mt-10">
                    <ArrowDownIcon class="w-6 h-auto stroke-black" />
                </div>
            </div>
        </div>

        <Disclosure>
            <template #default="{ open }">
                <DisclosureButton id="tutorial-details" class="flex flex-row w-full items-center justify-between py-4 px-5 bg-azure-800 hover:bg-gray-400 ease-in-out duration-200 cursor-pointer">
                    <p class="text-20 font-bold text-white">Detalhamento por matrícula</p>
                    <ChevronDownIcon class="w-6 h-auto transform transition-transform text-white" :class="{ 'rotate-180': open }" />
                </DisclosureButton>
                <DisclosurePanel class="grid w-full py-8 gap-1">

                    <Disclosure v-for="(item, index) in savedData" :key="index">
                        <template #default="{open}">
                            <DisclosureButton :id="`tutorial-matricula-${index}`" class="flex flex-row w-full items-center justify-between py-4 px-5 bg-[#7597da] text-black ease-in-out duration-200 cursor-pointer">
                                <p class="text-20 font-bold text-white">Matrícula {{ item?.dados?.matricula }}</p>
                                <ChevronDownIcon class="w-6 h-auto transform text-white transition-transform " :class="{'rotate-180': open}" />
                            </DisclosureButton>
                            <DisclosurePanel class="mx-4 lg:mx-10 overflow-x-scroll sm:overflow-x-hidden">

                                <div class="w-full mt-10 min-w-[875px]">
                                    <div class="min-w-[875px]">
                                        <table id="painel-infos" class="w-full border-collapse rounded-[10px] shadow-lg">
                                            <thead>
                                                <tr class="bg-azure-800 text-gray-100 text-20">
                                                    <th v-for="(header, index) in ['Descrição', 'Dados', 'Valores a Receber', 'Total']" :key="index" class="p-4 font-semibold text-left whitespace-nowrap">{{ header }}</th>
                                                </tr>
                                            </thead>

                                            <tbody class="bg-white divide-y divide-gray-200 text-15">
                                                <tr>
                                                    <td class="p-4 border-r border-gray-200 text-gray-700 font-medium whitespace-nowrap">
                                                        <p v-for="(label, index) in ['Nome:', 'CPF:', 'Matrícula:', 'Cargo:']" :key="index">{{ label }}</p>
                                                    </td>

                                                    <td id="tutorial-table-dados" class="p-4 border-r border-gray-200 text-gray-700 whitespace-nowrap">
                                                        <p class="capitalize">{{ item?.dados?.nome }}</p>
                                                        <p>{{ item?.dados?.cpf }}</p>
                                                        <p>{{ item?.dados?.matricula }}</p>
                                                        <p class="capitalize">{{ item?.dados?.cargo }}</p>
                                                    </td>

                                                    <td class="p-4 border-r border-gray-200 text-gray-700 whitespace-nowrap">
                                                        <p v-for="(label, index) in ['Valor Máximo Rede:', 'Valor Máximo Unidades:', 'Desconto:', 'Valor Total:']" :key="index">{{ label }}</p>
                                                    </td>

                                                    <td class="p-4 text-gray-700 font-semibold whitespace-nowrap">
                                                        <p id="tutorial-valor-rede">{{ formatCurrency(item?.profissionais[0]?.valor_gr_rede) }}</p>
                                                        <p id="tutorial-valor-unidade">{{ formatCurrency(item?.profissionais[0]?.valor_gr_unidade) }}</p>
                                                        <p id="tutorial-desconto">{{ formatCurrency(item?.dados?.desconto) }}</p>
                                                        <p id="tutorial-valor-total">{{ formatCurrency(item?.dados?.valor_total) }}</p>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div id="tutorial-criteria" class="flex flex-col w-full items-center shadow-lg mt-10 min-w-[875px]  rounded-[10px] bg-white">
                                    <div class="flex w-full border-b items-center justify-center bg-azure-800 py-4 rounded-t-lg">
                                        <p class="text-25  text-center font-semibold text-white">Critérios de verificação para gratificação</p>
                                    </div>

                                    <div class="w-full min-w-[875px]">
                                        <div class="min-w-[875px]">
                                            <table class="w-full border-collapse text-15">
                                                <thead>
                                                    <tr class="bg-gray-200 text-gray-800 text-left text-15">
                                                        <th class="border border-gray-200 px-4 py-3 font-medium w-1/3 whitespace-nowrap">Critério</th>
                                                        <th class="border border-gray-200 px-4 py-3 font-medium w-1/3 whitespace-nowrap">Valor</th>
                                                        <th class="border border-gray-200 px-4 py-3 font-medium w-1/3 whitespace-nowrap">Status</th>
                                                    </tr>
                                                </thead>
                                                <tbody class="text-15">
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
                                                        <td class="border border-gray-200 px-4 py-3 text-gray-700">Tempo de atuação</td>
                                                        <td class="border border-gray-200 px-4 py-3 text-gray-700">
                                                            {{ item?.dados?.tempo_atuacao === true ? 'Atua há mais de 6 meses' : 'Não atua há mais de 6 meses' }}
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
                                                            {{ item?.dados?.percentual_formacao === 100 ? '100,00%' : item?.dados?.percentual_formacao === 0 ? '0,00%' : 'Indefinido' }}
                                                        </td>                                                                                   
                                                        <td class="border border-gray-200 px-4 py-3">
                                                            <span :class="item?.dados?.formacoes === true ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                                                                {{ item?.dados?.formacoes === true ? 'Apto' : 'Não Apto' }}
                                                            </span>
                                                        </td>
                                                    </tr>

                                                    <tr class="hover:bg-gray-50 transition-shadow hover:shadow-md">
                                                        <td class="border border-gray-200 px-4 py-3 text-gray-700">Atividades</td>
                                                        <td class="border border-gray-200 px-4 py-3 text-gray-700">{{ item?.dados?.percentual_atividade === 100.0 ? '100,00%' : '0,00%' }}</td>
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
                                </div>

                                <div id="tutorial-allocations" class="flex flex-col w-full items-center mt-10 shadow-lg rounded-[10px] bg-gray-50 min-w-[875px]">
                                    <div class="flex w-full items-center justify-center bg-azure-800 py-4 rounded-t-lg border shadow-md">
                                        <p class="text-25 font-semibold text-white">Alocações em 2024</p>
                                    </div>

                                    <div class="flex flex-col w-full"> 
                                        <div v-if="item.profissionais && item.profissionais.length > 0">
                                            <div 
                                                v-for="(prof, profIndex) in item.profissionais" 
                                                :key="profIndex" 
                                                class="flex-col w-full"
                                            >
                                                <div class="flex flex-row w-full justify-between items-center bg-[#C3DFFF] px-4 py-2 rounded-t-lg">
                                                    <span class="text-20 font-medium text-black normal-case whitespace-nowrap mr-10 lg:mr-0">{{ prof?.nome_unidade }}</span>
                                                    <div class=" text-20 flex flex-row w-full lg:w-auto items-center justify-end space-x-4">
                                                        <span class="lg:text-20 font-medium text-black">
                                                            Etapa 1: <span class="font-semibold text-black">{{ prof?.idem_unidade_etapa_1 }}%</span>
                                                        </span>
                                                        <span class="lg:text-20 font-medium text-black">
                                                            Etapa 2: <span class="font-semibold text-black">{{ prof?.idem_unidade_etapa_2 }}%</span>
                                                        </span>
                                                        <span class="lg:text-20 font-medium text-black">
                                                            Etapa 3: <span class="font-semibold text-black">{{ prof?.idem_unidade_etapa_3 }}%</span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div class="w-full" style="max-width: 100vw;"> 
                                                    <div class="min-w-[875px]">
                                                        <table class="w-full border-collapse text-gray-700"> 
                                                            <thead>
                                                                <tr class="bg-gray-200 text-gray-800 text-15 border-b">
                                                                    <th v-for="header in ['Ínicio', 'Fim', 'Função', 'Carga horária', 'Grupo']" 
                                                                        :key="header" 
                                                                        class="px-4 lg:px-6 py-3 font-semibold text-15 lg:text-15 tracking-wide text-center text-gray-800 border-b border-gray-300 whitespace-nowrap">
                                                                        {{ header }}
                                                                    </th>
                                                                </tr>
                                                            </thead>

                                                            <tbody>
                                                                <tr class="hover:bg-gray-50 transition-shadow hover:shadow-md text-center whitespace-nowrap">
                                                                    <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ new Date(prof.inicio_atividade_local).toLocaleDateString('pt-BR') }}</td>
                                                                    <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ new Date(prof.fim_atividade_local).toLocaleDateString('pt-BR') }}</td>
                                                                    <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ prof.nome_disciplina || 'N/A' }}</td>
                                                                    <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ prof.hora_aula || 'N/A' }}h</td> 
                                                                    <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ prof.grupo_gr || 'N/A' }}</td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div id="tutorial-frequency" class="flex flex-col w-full items-center normal-case overflow-hidden mt-10 min-w-[875px] shadow-lg mb-10 rounded-[10px] bg-gray-50">

                                    <div class="flex w-full border-b items-center justify-center bg-azure-800 py-3 rounded-t-lg">
                                        <p class="text-25 text-center font-semibold text-white">Frequência (Afastamentos)</p>
                                    </div>

                                    <div class="w-full min-w-[875px]">
                                        <div class="min-w-[875px]">
                                            <table class="w-full border-collapse bg-white shadow-sm rounded-[10px]">
                                                <thead>
                                                    <tr class="bg-gray-200 text-gray-800 text-15">
                                                        <th v-for="header in ['Início', 'Fim', 'Tipo de afastamento', 'Total dias', 'Contabilizados']" 
                                                            :key="header" 
                                                            class="px-4 py-3 text-gray-800 font-semibold text-center border-b border-gray-200 whitespace-nowrap">
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
                                </div>

                            </DisclosurePanel>
                        </template>
                    </Disclosure>

                </DisclosurePanel>
            </template>
        </Disclosure>

        <div class="flex w-full items-center justify-end mr-3 mb-3">
            <router-link to="/user/form">
                <div id="tutorial-resource" class="flex flex-row items-center justify-center px-5 py-2 mt-10 gap-1 bg-tropical-blue-200 hover:bg-gray-400 ease-in-out duration-200 cursor-pointer rounded-[10px]">
                    <ExclamationCircleIcon class="w-6 h-auto" />
                    <p class="font-medium">Recurso</p>
                </div>
            </router-link>
        </div>
      
    </Whiteboard>
    <Tutorial ref="tutorialComponent"/>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ChevronDownIcon, ExclamationCircleIcon, ArrowDownIcon } from "@heroicons/vue/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Tutorial from '@/components/Tutorial/Tutorial.vue';
import axios from 'axios'; 
import { getAccessToken } from '@/service/token';
import { useRoute } from 'vue-router';

const savedData = ref([]);
const isLoading = ref(true); 
const errorMessage = ref(null);
const route = useRoute();
const tutorialComponent = ref(null);


const fetchRewardsData = async () => {
    
    const targetCpfFromStorage = localStorage.getItem('tempTargetCpf');

    try {
        isLoading.value = true;
        errorMessage.value = null;
        
        const token = await getAccessToken();
        if (!token) {
            throw new Error("Token de autenticação não encontrado.");
        }

        const referenceYear = new Date().getFullYear();
        
        let payload = { reference: referenceYear };

        if (targetCpfFromStorage) {
            payload.cpf = targetCpfFromStorage;
        }

        const response = await axios.post('http://127.0.0.1:8000/csv/user-get/', 
            payload,
            {
                headers: { Authorization: `Bearer ${token}` } 
            }
        );
        
        savedData.value = response.data;

    } catch (error) {
        console.error('Erro ao buscar dados da gratificação:', error);
        if (error.response && error.response.data && error.response.data.error) {
        errorMessage.value = error.response.data.error;
        } else {
        errorMessage.value = "Não foi possível carregar seus dados. Tente novamente mais tarde.";
        }
    } finally {
        isLoading.value = false;
    }
};

const formatCurrency = (value) => {
  if (value === null || value === undefined) return 'R$ 0,00';
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}


onMounted(() => {
  fetchRewardsData();

  const hasSeenTutorial = localStorage.getItem('hasSeenGratificationTutorial');
  if (!hasSeenTutorial) {
    setTimeout(() => {
      if (tutorialComponent.value) {
        tutorialComponent.value.startTutorial();
      }
      localStorage.setItem('hasSeenGratificationTutorial', 'true');
    }, 1000);
  }
});

watch(
  () => route.params.cpf, 
  (newCpf, oldCpf) => {
    if (newCpf !== oldCpf) {
      console.log(`Parâmetro CPF mudou para ${newCpf}. Buscando novos dados...`);
      fetchRewardsData();
    }
  }
);

</script>