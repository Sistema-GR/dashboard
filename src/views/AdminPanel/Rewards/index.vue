<template>
    <Whiteboard title="" :isSidebarMinimized="isSidebarMinimized" class="-translate-y-10">
        <div class="flex w-full items-center justify-center bg-gradient-to-r from-azure-800 to-primary-900 -translate-y-3">
            <p class="text-white text-3xl py-5 uppercase font-bold w-full text-center">Painel da Gratificação</p>
        </div>
        <!-- ######################################################################################################### -->
        <div class="flex flex-row items-center w-full px-10 gap-10 pt-8 pb-4">

            <div class="w-full" v-for="(item, index) in savedData" :key="index">
                <div :class="`flex flex-col items-center justify-center bg-transparent rounded-lg`">
                    <div class="flex items-center justify-center w-full py-3 rounded-lg bg-azure-800">
                        <p class="text-white text-lg font-medium">Nome Do Servidor</p>
                    </div>
                    <div class="flex w-full items-center justify-center py-2.5 rounded-b-lg -translate-y-1 bg-solitude-100 shadow-lg shadow-slate-200">
                        <p class="font-medium whitespace-nowrap">{{ item?.dados?.nome || 'Nome não disponível' }}</p>
                    </div>  
                </div>
            </div>

            <div class="w-full" v-for="(item, index) in savedData" :key="index">
                <div :class="`flex flex-col items-center justify-center bg-transparent rounded-lg`">
                    <div class="flex items-center justify-center w-full py-3 rounded-lg bg-azure-800">
                        <p class="text-white text-lg font-medium">Valor</p>
                    </div>
                    <div class="flex w-full items-center justify-center py-2.5 rounded-b-lg -translate-y-1 bg-solitude-100 shadow-lg shadow-slate-200">
                        <p class="font-medium">R$ {{ item?.dados?.valor_total || 'Valor não disponível' }}</p>
                    </div>  
                </div>
            </div>

        </div>

        <div class="flex w-full items-center justify-center py-8 px-5 lg:px-0">
            <p class="text-red-600 text-2xl font-medium text-center">Aviso: os valores nesta página não consideram eventuais descontos de impostos.</p>
        </div>

        <div class="flex flex-row w-full items-center bg-solitude-200">
            <div class="flex w-full items-center justify-center">
                <img src="../../../assets/images/Ilustração.png" class="w-full lg:w-2/4 lg:-translate-x-8 pt-4"/>
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

                                <div class="overflow-x-auto w-full" v-for="(prof, profIndex) in item.profissionais" :key="profIndex">
                                    <table class="min-w-full border-collapse rounded-lg shadow-lg">
                                        <thead>
                                            <tr class="bg-azure-800">
                                                <th class="p-3 font-semibold text-white text-left">Descrição</th>
                                                <th class="p-3 font-semibold text-white text-left">Dados</th>
                                                <th class="p-3 font-semibold text-white text-left">Valores a Receber</th>
                                                <th class="p-3 font-semibold text-white text-left">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td class="border p-3">
                                                    <p>Nome:</p>
                                                    <p>Matrícula:</p>
                                                    <p>Cargo:</p>
                                                </td>
                                                <td class="border p-3">
                                                    <p class="whitespace-nowrap">{{ item?.dados?.nome }}</p>
                                                    <p class="whitespace-nowrap">{{ item?.dados?.matricula }}</p>
                                                    <p class="whitespace-nowrap">{{ prof.cargo }}</p>
                                                </td>
                                                <td class="border p-3">
                                                    <p>Rede:</p>
                                                    <p>Unidades:</p>
                                                    <p>Total:</p>
                                                </td>
                                                <td class="border p-3">
                                                    <p class="whitespace-nowrap">R$ {{ prof.valor_gr_rede}}</p>
                                                    <p class="whitespace-nowrap">R$ {{ prof.valor_gr_unidade}}</p>
                                                    <p class="whitespace-nowrap">R$ {{ item?.dados?.valor_total}}</p>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <table class="w-full border-collapse border mt-8">
                                    <thead>
                                        <tr class="bg-azure-800">
                                            <th class="border-b p-2 text-center text-white">Tempo de Atuação</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="border p-2 text-center">{{ item?.dados?.tempo_atuacao}}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table class="w-full border-collapse border ">
                                    <thead>
                                        <tr class="bg-azure-800">
                                            <th class="border-b p-2 text-center text-white">Formação (Frequência)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="border p-2 text-center">{{ item?.dados?.formacoes }}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <table class="w-full border-collapse border mb-8">
                                    <thead>
                                        <tr class="bg-azure-800">
                                            <th class="border-b p-2 text-center text-white">Atividades</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="border p-2 text-center">{{ item?.dados?.percentual_atividade }}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div v-for="(item, itemIndex) in savedData" :key="itemIndex" class="flex flex-col w-full items-center border -translate-y-0.5">

                                    <div class="flex w-full items-center justify-center py-3 bg-azure-800">
                                        <p class="text-xl font-medium text-white">Alocações em 2024</p>
                                    </div>
                           

                                    <div class="w-full">
                                        <div v-if="item.profissionais && item.profissionais.length > 0">
                                            <div v-for="(prof, profIndex) in item.profissionais" :key="profIndex">
                                                <table class="min-w-full border-collapse border border-gray-200 mb-4">
                                                    <thead>
                                                        <tr>
                                                            <th class="border border-gray-200 px-4 py-2 w-6/12 text-lg" colspan="3">
                                                            {{ prof?.['NM_Local de alocação'] || 'Sem Local de Alocação' }}
                                                            </th>
                                                            <th class="border border-gray-200 px-4 py-2">Etapa 1<br>80%</th>
                                                            <th class="border border-gray-200 px-4 py-2">Etapa 2<br>0%</th>
                                                            <th class="border border-gray-200 px-4 py-2">Etapa 3<br>100%</th>
                                                        </tr>
                                                        <tr>
                                                            <th class="border border-gray-200 px-4 py-2">Início</th>
                                                            <th class="border border-gray-200 px-4 py-2">Fim</th>
                                                            <th class="border border-gray-200 px-4 py-2">Função</th>
                                                            <th class="border border-gray-200 px-4 py-2">Carga Horária</th>
                                                            <th class="border border-gray-200 px-4 py-2">Etapa</th>
                                                            <th class="border border-gray-200 px-4 py-2">Grupo</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="text-center">
                                                            <td class="border border-gray-200 px-4 py-2 whitespace-nowrap">{{ item?.dados?.data_inicio || 'N/A' }}</td>
                                                            <td class="border border-gray-200 px-4 py-2 whitespace-nowrap">{{ item?.dados?.data_fim|| 'N/A' }}</td>
                                                            <td class="border border-gray-200 px-4 py-2">{{ prof.nome_disciplina || 'N/A' }}</td>
                                                            <td class="border border-gray-200 px-4 py-2">{{ prof.percentual_carga_horaria_ue || 'N/A' }}</td>
                                                            <td class="border border-gray-200 px-4 py-2"></td>
                                                            <td class="border border-gray-200 px-4 py-2">{{ prof.grupo_gr || 'N/A' }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div class="flex flex-col w-full items-center border -translate-y-0.5 overflow-x-auto">
                                    <div class="flex w-full border-b items-center justify-center bg-azure-800 py-3">
                                        <p class="text-xl text-center font-medium text-white">Critério de Frequência (Afastamentos)</p>
                                    </div>

                                    <div class="overflow-x-auto w-full"> 
                                        <table class="min-w-full border-collapse border">
                                            <thead>
                                                <tr>
                                                    <th class="border border-gray-200 px-4 py-2">Início</th>
                                                    <th class="border border-gray-200 px-4 py-2">Fim</th>
                                                    <th class="border border-gray-200 px-4 py-2">Tipo de Afastamento</th>
                                                    <th class="border border-gray-200 px-4 py-2">Total Dias</th>
                                                    <th class="border border-gray-200 px-4 py-2">Contabilizados</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(freq, freqIndex) in item.frequencia" :key="freqIndex" class="text-center">
                                                    <td class="border border-gray-200 px-4 py-2">{{ freq.inicio_afastamento }}</td>
                                                    <td class="border border-gray-200 px-4 py-2">{{ freq.fim_afastamento }}</td>
                                                    <td class="border border-gray-200 px-4 py-2">{{ freq.motivo }}</td>
                                                    <td class="border border-gray-200 px-4 py-2">{{ freq.qtd_dias_afastados }}</td>
                                                    <td class="border border-gray-200 px-4 py-2">{{ freq.contabiliza }}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>


                                <div class="overflow-x-auto w-full">
                                    <div class="flex w-full border-b items-center justify-center bg-azure-800 py-3">
                                        <p class="text-xl text-center font-medium text-white">Critérios de Verificação para Gratificação</p>
                                    </div>

                                    <table class="min-w-full border-collapse border whitespace-nowrap">
                                        <thead>
                                            <tr>
                                                <th class="border border-gray-200 px-4 py-2 text-left">Critério</th>
                                                <th class="border border-gray-200 px-4 py-2 text-left">Valor</th>
                                                <th class="border border-gray-200 px-4 py-2 text-left">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(freq, freqIndex) in item.frequencia" :key="freqIndex" class="hover:bg-gray-50">
                                                <td class="border border-gray-200 px-4 py-2" v-if="freqIndex === 0">Frequência</td>
                                                <td class="border border-gray-200 px-4 py-2" v-if="freqIndex === 0" :class="{ 'text-red-500': freq.percentual_frequencia_ajustado < 0.96, 'text-black': freq.percentual_frequencia_ajustado >= 0.96 }">
                                                    {{ (freq['% frequencia para GR / profissional'] * 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}%
                                                </td>
                                                <td class="border border-gray-200 px-4 py-2" v-if="freqIndex === 0">
                                                    {{ freq['% frequencia para GR / profissional'] < 0.96 ? 'Não Apto' : 'Apto a Receber Gratificação' }}
                                                </td>
                                            </tr>
                                            <tr class="hover:bg-gray-50">
                                                <td class="border border-gray-200 px-4 py-2">Tempo de Atuação</td>
                                                <td class="border border-gray-200 px-4 py-2" :class="{ 'text-red-500': item?.dados?.tempo_atuacao === 'Não atua há mais de 6 meses na rede', 'text-black': item?.dados?.tempo_atuacao === 'Atua há mais de 6 meses na rede' }">
                                                    {{ item?.dados?.['Atua a mais de 6 meses?'] }}
                                                </td>
                                                <td class="border border-gray-200 px-4 py-2">
                                                    {{ item?.dados?.['Atua a mais de 6 meses?'] === 'Atua há mais de 6 meses na rede' ? 'Apto a Receber Gratificação' : 'Não Apto' }}
                                                </td>
                                            </tr>
                                            <tr class="hover:bg-gray-50">
                                                <td class="border border-gray-200 px-4 py-2">Formação</td>
                                                <td class="border border-gray-200 px-4 py-2">{{ item?.dados?.formacoes}}</td>
                                                <td class="border border-gray-200 px-4 py-2">Apto a Receber Gratificação</td>
                                            </tr>
                                            <tr class="hover:bg-gray-50">
                                                <td class="border border-gray-200 px-4 py-2">Atividades</td>
                                                <td class="border border-gray-200 px-4 py-2">{{ item?.dados?.percentual_atividade}}</td>
                                                <td class="border border-gray-200 px-4 py-2">Apto a Receber Gratificação</td>
                                            </tr>
                                        </tbody>
                                    </table>
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
import { inject, ref, onMounted, onBeforeUnmount } from 'vue';
import { ChevronDownIcon, ExclamationCircleIcon, ArrowDownIcon } from "@heroicons/vue/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';

  
const isSidebarMinimized = inject('isSidebarMinimized');; 
const savedData = ref([]); 
const groupedProfessionals = ref([]); // Profissionais agrupados

const groupProfessionals = () => {
  savedData.value.forEach(item => {
    if (item?.profissionais?.length > 0) {
      groupedProfessionals.value.push(item.profissionais);
    }
  });
};

onMounted(() => {
  const savedRowData = JSON.parse(localStorage.getItem('rowSave')) || {};
  savedData.value = Object.values(savedRowData).flatMap(item => Object.values(item));
  console.log('Dados recuperados do localStorage:', savedData.value);
});

onBeforeUnmount(() => {
  localStorage.removeItem('rowSave');
  console.log('Dados do localStorage limpos.');
});

</script>
  