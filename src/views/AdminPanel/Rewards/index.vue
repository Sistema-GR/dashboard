<template>
    <Whiteboard title="Painel da Gratificação" >
       
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
                                                    <template v-if="item.dados.periodos_frequencia && item.dados.periodos_frequencia.length > 0">
                                                        <tr v-for="(periodo, pIndex) in item.dados.periodos_frequencia" :key="pIndex" class="hover:bg-gray-50 transition-shadow hover:shadow-md">
                                                            <td class="border border-gray-200 px-4 py-3 text-gray-700 font-medium">
                                                                Frequência (Período {{ periodo.numero_periodo }})
                                                            </td>
                                                            <td class="border border-gray-200 px-4 py-3 text-gray-700">
                                                                {{ periodo.percentual ? Number(periodo.percentual).toFixed(2) + '%' : 'N/A' }}
                                                            </td>
                                                            <td 
                                                                :class="{
                                                                    'text-red-600 font-semibold': !periodo.apto,
                                                                    'text-green-600 font-semibold': periodo.apto
                                                                }"
                                                                class="border border-gray-200 px-4 py-3"
                                                            >
                                                                {{ periodo.apto ? 'Apto' : 'Não Apto' }}
                                                            </td>
                                                        </tr>
                                                    </template>

                                                    <template v-else>
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
                                                    </template>

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
                                        <p class="text-25 font-semibold text-white">Alocações em {{ referenceYear }}</p>
                                    </div>

                                    <div class="flex flex-col w-full"> 
                                        <div v-if="item.profissionais && item.profissionais.length > 0">
                                            <div 
                                                v-for="(prof, profIndex) in item.profissionais" 
                                                :key="profIndex" 
                                                class="flex-col w-full"
                                            >
                                                <div class="flex flex-row w-full justify-between items-center bg-[#C3DFFF] px-4 py-2 rounded-t-lg">
                                                    <span class="text-20 font-medium text-black normal-case whitespace-nowrap mr-10 lg:mr-0">{{ formatUnidade(prof?.nome_unidade) }}</span>
                                                    <div class=" text-20 flex flex-row w-full lg:w-auto items-center justify-end space-x-4">
                                                        <span class="lg:text-20 font-medium text-black">
                                                            Etapa 1: <span class="font-semibold text-black">{{ prof?.percentual_idem_etapa_1 }}%</span>
                                                        </span>
                                                        <span class="lg:text-20 font-medium text-black">
                                                            Etapa 2: <span class="font-semibold text-black">{{ prof?.percentual_idem_etapa_2 }}%</span>
                                                        </span>
                                                        <span class="lg:text-20 font-medium text-black">
                                                            Etapa 3: <span class="font-semibold text-black">{{ prof?.percentual_idem_etapa_3 }}%</span>
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
                                                                    <td class="px-4 lg:px-6 py-4 border-b border-gray-300">{{ prof.nome_disciplina.charAt(0).toUpperCase()+prof.nome_disciplina.slice(1) || 'N/A' }}</td>
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

        const response = await axios.post('/csv/user-get/', 
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

const formatUnidade = (key) => {
    const unidadeMap = {
        'ea carlos heins funke':'EA Carlos Heins Funke',
        'biblioteca publica':'Biblioteca Publica',
        'sede':'Sede',
        'sed nucleo de gestao de pessoas':'SED - Núcleo de Gestão de Pessoas',
        'gerencia de administracao e financas':'Gerência de Administração e Finanças',
        'educacao profissional centro xv':'Educação Profissional Centro XV',
        'em dr nelson de miranda coutinho':'EM Dr. Nelson de Miranda Coutinho',
        'gerencia de infraestrutura':'Gerência de Infraestrutura',
        'cei prof iraci schmidlin':'Cei Prof Iraci Schmidlin',
        'almoxarifado':'Almoxarifado',
        'em prof laura andrade':'EM Prof Laura Andrade',
        'em prof edgar m castanheira':'EM Prof Edgar M Castanheira',
        'em joao costa':'EM Joao Costa',
        'gerencia de educacao basica sede':'Gerência de Educação Básica - Sede',
        'em sen carlos g de oliveira':'EM Sen Carlos G De Oliveira',
        'em pref nilson wilson bender':'EM Pref Nilson Wilson Bender',
        'em pref geraldo wetzel':'EM Pref Geraldo Wetzel',
        'em prof virginia soares':'EM Prof Virginia Soares',
        'em dr abdon batista':'EM Dr Abdon Batista',
        'em dr ruben roberto schmidlin':'EM Dr Ruben Roberto Schmidlin',
        'educacao profissional textil':'Educação Profissional Textil',
        'em enf hilda anna krisch':'EM Enf. Hilda Anna Krisch',
        'em pres castello branco':'EM Pres Castello Branco',
        'em padre valente simioni':'EM Padre Valente Simioni',
        'em prof elizabeth von dreifuss':'EM Prof Elizabeth Von Dreifuss',
        'em pref wittich freitag':'EM Pref Wittich Freitag',
        'em lauro carneiro de loyola':'EM Lauro Carneiro De Loyola',
        'gerencia de tecnologias educacionais':'Gerência de Tecnologias Educacionais',
        'educacao profissional cespi':'Educação Profissional CESPI',
        'em nove de marco':'EM Nove De Marco',
        'em karin barkemeyer':'Em Karin Barkemeyer',
        'cei jose francisco vieira':'Cei José Francisco Vieira',
        'em prof oswaldo cabral':'EM Prof Oswaldo Cabral',
        'em dr sadalla amin ghanem':'EM Dr Sadalla Amin Ghanem',
        'caic prof mariano costa':'Caic Prof Mariano Costa',
        'em prof ada s da silveira':'EM Prof Ada S Da Silveira',
        'em prof eladir skibinski':'EM Prof Eladir Skibinski',
        'em hans dieter schimidt':'EM Hans Dieter Schimidt',
        'em prof saul santanna o dias':'EM Prof Saul Santanna O Dias',
        'em prof lacy luiza da c flores':'EM Prof Lacy Luiza Da C Flores',
        'escola municipal de jovens e adultos':'Escola Municipal de Jovens e Adultos',
        'cei doce infancia':'Cei Doce Infância',
        'cei sigelfrid poffo':'Cei Sigelfrid Poffo',
        'em prof zulma do r miranda':'EM Prof Zulma Do R Miranda',
        'em prof anna maria harger':'EM Prof Anna Maria Harger',
        'cei salete konecki':'CEI Salete Konecki',
        'cei espaco da crianca':'Cei Espaço da Criança',
        'caic francisco j r de oliveira':'Caic Francisco J R De Oliveira',
        'cartorio':'CARTÓRIO',
        'em jose antonio navarro lins':'EM Jose Antonio Navarro Lins',
        'em ver curt alvino monich':'EM Ver. Curt Alvino Monich',
        'cei silvia regina cavalheiro':'CEI Silvia Regina Cavalheiro',
        'em placido xavier vieira':'EM Plácido Xavier Vieira',
        'em prof avelino marcante':'EM Prof Avelino Marcante',
        'em prof joao bernardino da s j':'EM Prof Joao Bernardino Da S J',
        'em prof rosa maria berezoski':'EM Prof Rosa Maria Berezoski',
        'em ver arinor vogelsanger':'EM Ver. Arinor Vogelsanger',
        'em paul harris':'EM Paul Harris',
        'em pref baltasar buschle':'EM Pref Baltasar Buschle',
        'em gov pedro ivo campos':'EM Gov. Pedro Ivo Campos',
        'cei zilda arns neumann':'CEI Zilda Arns Neumann',
        'educacao profissional casa brasil sul':'Educação Profissional Casa Brasil Sul',
        'em prof aluizius sehnem':'EM Prof Aluizius Sehnem',
        'em prof orestes guimaraes':'EM Prof Orestes Guimaraes',
        'cei pedro ivo':'Cei Pedro Ivo',
        'em pref max colin':'EM Pref. Max Colin',
        'em anita garibaldi':'EM Anita Garibaldi',
        'em emilio paulo r hardt':'EM Emilio Paulo R Hardt',
        'em dom jaime de barros camara':'EM Dom Jaime De Barros Camara',
        'a disposicao sindicato dos servidores':'A Disposição - Sindicato dos Servidores',
        'em prefeito luiz gomes':'EM Prefeito Luiz Gomes',
        'em anaburgo':'EM Anaburgo',
        'em pauline parucker':'EM Pauline Parucker',
        'em pres arthur costa e silva':'EM Pres Arthur Costa E Silva',
        'em joao de oliveira':'EM Joao De Oliveira',
        'em prof bernardo tank':'EM Prof Bernardo Tank',
        'educacao profissional cesita':'Educação Profissional CESITA',
        'em gov heriberto hulse':'EM Gov. Heriberto Hulse',
        'em adolfo bartsch':'EM Adolfo Bartsch',
        'em prof sylvio sniecikovski':'EM Prof Sylvio Sniecikovski',
        'em pref joaquim felix moreira':'EM Pref Joaquim Felix Moreira',
        'polo':'POLO',
        'em monsenhor sebastiao scarzello':'EM Monsenhor Sebastião Scarzello',
        'em dr amador aguiar':'EM Dr Amador Aguiar',
        'educacao profissional casa brasil norte':'Educação Profissional Casa Brasil Norte',
        'em valentin joao da rocha':'EM Valentin Joao Da Rocha',
        'gerencia de assistencia ao educando sede':'Gerência de Assistência ao Educando - Sede',
        'em prof thereza mazzolli hreisem':'EM Prof Thereza Mazzolli Hreisem',
        'em pastor hans muller':'EM Pastor Hans Muller',
        'escola municipal portaria 028gab':'Escola Municipal - Portaria 028/GAB',
        'escola municipal portaria 072 avelino extensao':'Escola Municipal Portaria 072 (Avelino -Extensão)',
        'em prof maria regina leal':'EM Prof Maria Regina Leal',
        'em prof honorio saldo':'EM Prof Honorio Saldo',
        'em portaria 1275 karin extensao':'EM Portaria 1275 (Karin -Extensão)',
        'cei marilene dos passos santos':'Cei Marilene dos Passos Santos',
        'cei aventuras de crianca':'Cei Aventuras de Criança',
        'cei odorico fortunato':'Cei Odorico Fortunato',
        'cei alegria de viver':'Cei Alegria de Viver',
        'cei luiza maria veiga':'Cei Luiza Maria Veiga',
        'cei ademar garcia':'Cei Ademar Garcia',
        'cei branca de neve':'Cei Branca De Neve',
        'cei meu pequeno mundo':'Cei Meu Pequeno Mundo',
        'cei parque guarani':'Cei Parque Guarani',
        'cei ponte serrada':'Cei Ponte Serrada',
        'cei namir alfredo zattar':'Cei Namir Alfredo Zattar',
        'cei espinheiros':'Cei Espinheiros',
        'cei prof juliana de c vieira':'Cei Prof Juliana de C. Vieira',
        'em hermann muller':'EM Hermann Muller',
        'em sete de setembro':'EM Sete De Setembro',
        'cei fatima':'Cei Fatima',
        'em prof reinaldo de franca':'EM Prof Reinaldo De Franca',
        'cei raio de sol':'Cei Raio De Sol',
        'em eugenio klug':'EM Eugenio Klug',
        'cei prof miraci dereti':'Cei Prof. Miraci Dereti',
        'cei dep pedro p h colin':'Cei Dep. Pedro P. H. Colin',
        'em otto ristow filho':'EM Otto Ristow Filho',
        'em padre carlos':'EM Padre Carlos',
        'cei estrelinha brilhante':'Cei Estrelinha Brilhante',
        'cei esperanca':'Cei Esperança',
        'cei prof herondina da s vieira':'Cei Prof. Herondina da S. Vieira',
        'cei justina rosa fachini':'CEI Justina Rosa Fachini',
        'cei miosotis':'Cei Miosotis',
        'cei celio gomes de oliveira':'Cei Celio Gomes De Oliveira',
        'cei pao de mel':'Cei Pão de Mel',
        'cei adolfo artmann':'Cei Adolfo Artmann',
        'em jose do patrocinio':'EM Jose Do Patrocinio',
        'cei beija flor':'Cei Beija Flor',
        'em pref emilio stock jr':'EM Pref Emilio Stock Jr',
        'em prof alfonso fiedler':'EM Prof Alfonso Fiedler',
        'cei mundo azul':'Cei Mundo Azul',
        'cei lirio do campo':'Cei Lirio Do Campo',
        'em fritz benkendorf':'EM Fritz Benkendorf',
        'cei pequena sereia':'Cei Pequena Sereia',
        'em prof senhorinha soares':'EM Prof Senhorinha Soares',
        'em prof jose mota pires':'EM Prof Jose Mota Pires',
        'cei girassol':'Cei Girassol',
        'em prof isabel silveira machado':'EM Prof Isabel Silveira Machado',
        'e r prof waleska may engelmann':'E. R. Prof Waleska May Engelmann',
        'cei arte e vida':'Cei Arte e Vida',
        'cei castelo branco':'Cei Castelo Branco',
        'cei morro do meio':'Cei Morro Do Meio',
        'cei amandos finder':'Cei Amandos Finder',
        'cei antonio bruhmuller':'CEI Antônio Bruhmuller',
        'cei ivan rodrigues':'Cei Ivan Rodrigues',
        'cei pequeno principe':'Cei Pequeno Principe',
        'cei azelir t pacheco':'Cei Azelir T. Pacheco',
        'cei maria laura cardoso eleoterio':'CEI Maria Laura Cardoso Eleotério',
        'cei pedacinho do ceu':'Cei Pedacinho Do Ceu',
        'cei jardim sofia':'Cei Jardim Sofia',
        'cei jorge luiz vanderwegen':'Cei Jorge Luiz Vanderwegen',
        'cei teresa campregher moreira':'CEI Teresa Campregher Moreira',
        'cei bemmequer':'Cei Bem-Me-Quer',
        'cei abdon da silveira':'CEI Abdon da Silveira',
        'cei itaum':'Cei Itaum',
        'cei cachinhos de ouro':'Cei Cachinhos De Ouro',
        'cei sol nascente':'Cei Sol Nascente',
        'cei espaco encantado':'Cei Espaço Encantado',
        'cei juarez machado':'Cei Juarez Machado',
        'cei eliane kruger':'Cei Eliane Kruger',
        'cei bianca carolina pinheiro':'CEI Bianca Carolina Pinheiro',
        'cei ciranda cirandinha':'Cei Ciranda Cirandinha',
        'cei prof felicia cardoso vieira':'CEI Prof Felícia Cardoso Vieira',
        'cei monteiro lobato':'CEI Monteiro Lobato',
        'cei gustavo zietz':'Cei Gustavo Zietz',
        'cei portaria 1276 cachinhos extensao':'CEI Portaria 1276 (Cachinhos - Extensão)',
        'cei prof debora cristina neves da silva ruiz paloma':'Cei Prof Débora Cristina Neves da Silva Ruiz Paloma',
        'cei mario avancini':'Cei Mario Avancini',
        'educacao profissional casa brasil nordeste':'Educação Profissional Casa Brasil Nordeste',
        'em prof francisco rieper':'EM Prof Francisco Rieper',
        'e r germano lenschow':'E. R. Germano Lenschow',
        'em cel alire carneiro':'EM Cel Alire Carneiro',
        'em alfredo g henrique':'EM Alfredo G. Henrique',
        'em prof julio machado da luz':'EM Prof Julio Machado Da Luz',
        'e r prof maria madalena mazzoli':'E. R. Prof Maria Madalena Mazzoli',
        'em ver hubert hubener':'EM Ver. Hubert Hubener',
        'e r evaldo koehler':'E. R. Evaldo Koehler',
        'escola municipal portaria 092 nilson bender extensao':'Escola Municipal Portaria 092 (Nilson Bender - Extensão)',
        'e r prof joao meerholz':'E. R. Prof Joao Meerholz',
        'em hans muller':'Em Hans Muller',
        'cei botaozinho de rosa':'Cei Botaozinho De Rosa',
        'cei paraiso da crianca':'Cei Paraiso Da Crianca',
        'cei sonho de crianca':'Cei Sonho de Criança',
        'cei peter pan':'Cei Peter Pan',
        'cei ze carioca':'Cei Ze Carioca',
        'cei sementinha':'Cei Sementinha',
        'a disposicao associacao servidores':'A Disposição - Associação Servidores',
        'ama':'AMA',
        'apiscae':'APISCAE',
        'a disposicao fundacao cultural':'A Disposição - Fundação Cultural',
        'ajidevi':'AJIDEVI',
        'a disposicao sede':'A Disposição - SEDE',
        'a disposicao secretaria da saude':'A Disposição - Secretaria da Saúde',
        'a disposicao fundacao cultural':'A Disposição - Fundação Cultural',
        'cei professora zelandia thomazi bratti':'Cei Professora Zelândia Thomazi Bratti',
        'cei prof herondina da silva vieira':'Cei Prof Herondina da Silva Vieira',
        'escola municipal portaria 028gab castelo branco extensao':'Escola Municipal - Portaria 028/GAB - (Castelo Branco Extensão)',
        'ensino regular':'Ensino Regular',
        'sed sede':'SED - Sede',
        'sed gerencia de assistencia ao educando sede':'SED - Gerência de Assistência ao Educando - Sede',
        'sed almoxarifado':'SED - Almoxarifado',
        'sed gerencia de educacao basica sede':'SED - Gerência de Educação Básica - Sede',
        'sed polo':'SED - POLO',
        'sed ajidevi':'SED - AJIDEVI',
        'sed ama':'SED - AMA',
        'sed apae':'SED - APAE',
        'sed apiscae':'SED - APISCAE',
        'sed cartorio':'SED - CARTÓRIO',
        'sed a disposicao sede':'SED - A Disposição - SEDE',
        'sed a disposicao associacao servidores':'SED - A Disposição - Associação Servidores',
        'sed a disposicao fundacao cultural':'SED - A Disposição - Fundação Cultural',
        'sed a disposicao secretaria da saude':'SED - A Disposição - Secretaria da Saúde',
        'sed a disposicao sindicato dos servidores':'SED - A Disposição - Sindicato dos Servidores',
        'sed a disposicao fundacao cultural':'SED - A Disposição - Fundação Cultural',
        'sed gerencia de infraestrutura':'SED - Gerência de Infraestrutura',
        'sed gerencia de administracao e financas':'SED - Gerência de Administração e Finanças',
        'sed educacao profissional textil':'SED - Educação Profissional Textil',
        'sed educacao profissional cesita':'SED - Educação Profissional CESITA',
        'sed educacao profissional centro xv':'SED - Educação Profissional Centro XV',
        'sed educacao profissional cespi':'SED - Educação Profissional CESPI',
        'sed educacao profissional casa brasil sul':'SED - Educação Profissional Casa Brasil Sul',
        'sed educacao profissional casa brasil norte':'SED - Educação Profissional Casa Brasil Norte',
        'sed educacao profissional casa brasil nordeste':'SED - Educação Profissional Casa Brasil Nordeste',
        'sed gerencia de tecnologias educacionais':'SED - Gerência de Tecnologias Educacionais',
        'em gov heriberto hulse':'Em Gov Heriberto Hulse',
        'ss area de patrimonio':'SS - Área de Patrimônio',
        'area de apoio gabinete':'Area de Apoio Gabinete',
        'em anna maria harger':'Em Anna Maria Harger',
        'em prof ada santana silveir':'Em Prof Ada Santana Silveir',
        'em carlos gomes de oliveira':'Em Carlos Gomes De Oliveira',
        'em portaria 028 castello branco extensao':'EM Portaria 028 (Castello Branco - Extensão)',
        'em professora rosangela martinowsky baptista':'EM Professora Rosangela Martinowsky Baptista',
        'sgp uss unidade saude servidor':'SGP - USS - Unidade Saude Servidor'
    };
    if (!key) return '';
    return unidadeMap[key] || key;
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