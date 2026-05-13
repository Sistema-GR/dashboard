<template>
    <Whiteboard title="Painel da Gratificação">

        <!-- Topo: Nome + Valor -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 px-8 pt-8" v-if="savedData.length > 0">
            <div class="flex flex-col gap-0 bg-white border border-gray-300 rounded-xl overflow-hidden">
                <span class="bg-[#1a4a8a] text-[#b5d4f4] text-base font-medium px-4 py-2.5 tracking-wide">Nome do servidor</span>
                <span class="text-lg font-medium text-gray-900 px-4 py-3 capitalize">{{ savedData[0]?.dados?.nome || 'Nome não disponível' }}</span>
            </div>
            <div class="flex flex-col gap-0 bg-white border border-gray-300 rounded-xl overflow-hidden">
                <span class="bg-[#1a4a8a] text-[#b5d4f4] text-base font-medium px-4 py-2.5 tracking-wide">Valor total a receber</span>
                <span class="text-xl font-medium text-[#0c447c] px-5 py-3">
                    R${{ (totalRecebimento || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', '') }}
                </span>
            </div>
        </div>

        <!-- Aviso de impostos -->
        <div class="flex items-start gap-3 mx-8 mt-5 bg-red-50 border border-red-300 rounded-lg p-3.5">
            <ExclamationTriangleIcon class="w-6 h-6 pt-1 text-red-400" />
            <p class="text-base text-red-800 leading-relaxed">Os valores nesta página não consideram eventuais descontos de impostos.</p>
        </div>

        <!-- Ilustração + chamada para o detalhamento -->
        <div class="flex items-center gap-8 mx-8 mt-7 bg-[#f0f6ff] rounded-xl overflow-hidden pr-8">
            <div class="flex-shrink-0 w-[225px]">
                <img src="@/assets/images/ilustracao.png" class="w-full block" />
            </div>
            <div class="flex flex-col gap-2">
                <p class="text-3xl text-[#1e3a5f] leading-relaxed">Ficou com alguma <strong class="font-semibold">dúvida</strong> sobre o <strong class="font-semibold">valor</strong>?</p>
                <p class="text-3xl text-[#1e3a5f] leading-relaxed">Consulte o <strong class="font-semibold">detalhamento</strong> abaixo.</p>
            </div>
        </div>

        <!-- Seção de matrículas -->
        <div class="px-8 pt-7">
            <p class="text-sm font-semibold tracking-wider uppercase text-gray-500 mb-4">Clique sobre a matrícula desejada</p>

            <div class="flex flex-col gap-3">
                <Disclosure v-for="(item, index) in savedData" :key="index">
                    <template #default="{ open }">

                        <div class="bg-white border border-gray-300 rounded-xl overflow-hidden transition-shadow duration-200" :class="{ 'border-[#93b4dc] shadow-md shadow-[#1a4a8a]/10': open }">

                            <!-- Trigger -->
                            <DisclosureButton :id="`tutorial-matricula-${index}`" class="flex items-center justify-between w-full px-5 py-4 bg-transparent border-none cursor-pointer text-left transition-colors duration-150 hover:bg-[#f8faff]">
                                <div class="flex items-center gap-3 flex-wrap">
                                    <span class="bg-[#e6f1fb] text-[#0c447c] rounded-full px-3.5 py-1 text-base font-semibold whitespace-nowrap">Matrícula {{ item?.dados?.matricula }}</span>
                                    <span class="text-lg text-gray-600 capitalize">{{ item?.dados?.cargo }}</span>
                                </div>
                                <div class="flex items-center gap-4 flex-shrink-0">
                                    <span class="text-xl font-semibold text-[#0c447c] whitespace-nowrap">{{ formatCurrency(item?.dados?.valor_total) }}</span>
                                    <ChevronDownIcon class="w-5 h-5 text-gray-400 transition-transform duration-200 flex-shrink-0" :class="{ 'rotate-180': open }" />
                                </div>
                            </DisclosureButton>

                            <!-- Painel expandido -->
                            <DisclosurePanel class="border-t border-gray-200">

                                <!-- Dados pessoais -->
                                <div class="p-6">
                                    <p class="text-base font-semibold tracking-wider uppercase text-gray-500 mb-4">Dados pessoais</p>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div class="flex flex-col gap-1 bg-gray-50 rounded-lg px-4 py-3">
                                            <span class="text-base text-gray-500">Nome</span>
                                            <span class="text-xl font-medium text-gray-900 capitalize">{{ item?.dados?.nome }}</span>
                                        </div>
                                        <div class="flex flex-col gap-1 bg-gray-50 rounded-lg px-4 py-3">
                                            <span class="text-base text-gray-500">CPF</span>
                                            <span class="text-xl font-medium text-gray-900">{{ item?.dados?.cpf }}</span>
                                        </div>
                                        <div class="flex flex-col gap-1 bg-gray-50 rounded-lg px-4 py-3">
                                            <span class="text-base text-gray-500">Matrícula</span>
                                            <span class="text-xl font-medium text-gray-900">{{ item?.dados?.matricula }}</span>
                                        </div>
                                        <div class="flex flex-col gap-1 bg-gray-50 rounded-lg px-4 py-3">
                                            <span class="text-base text-gray-500">Cargo</span>
                                            <span class="text-xl font-medium text-gray-900 capitalize">{{ item?.dados?.cargo }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="h-px bg-gray-200"></div>

                                <!-- Métricas financeiras -->
                                <div class="p-6">
                                    <p class="text-base font-semibold tracking-wider uppercase text-gray-500 mb-4">Valores a receber</p>
                                    <div class="grid grid-cols-2 sm:grid-cols-2 gap-3">
                                        <div class="flex flex-col gap-1.5 bg-gray-50 rounded-lg px-4 py-3.5">
                                            <span class="text-base text-gray-500">Valor máx. rede</span>
                                            <span class="text-xl font-semibold text-gray-900" id="tutorial-valor-rede">{{ formatCurrency(item?.profissionais[0]?.valor_gr_rede) }}</span>
                                        </div>
                                        <div class="flex flex-col gap-1.5 bg-gray-50 rounded-lg px-4 py-3.5">
                                            <span class="text-base text-gray-500">Valor máx. unidades</span>
                                            <span class="text-xl font-semibold text-gray-900" id="tutorial-valor-unidade">{{ formatCurrency((totalUnidade[index] ?? 0) + (item?.dados?.desconto ?? 0)) }}</span>
                                        </div>
                                        <div class="flex flex-col gap-1.5 bg-gray-50 rounded-lg px-4 py-3.5">
                                            <span class="text-base text-gray-500">Desconto</span>
                                            <span class="text-xl font-semibold text-red-700" id="tutorial-desconto">{{ formatCurrency(item?.dados?.desconto) }}</span>
                                        </div>
                                        <div class="flex flex-col gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3.5">
                                            <span class="text-base text-gray-500">Total a receber</span>
                                            <span class="text-xl font-semibold text-[#0c447c]" id="tutorial-valor-total">{{ formatCurrency(item?.dados?.valor_total) }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="h-px bg-gray-200"></div>

                                <!-- Critérios -->
                                <div id="tutorial-criteria" class="p-6">
                                    <p class="text-base font-semibold tracking-wider uppercase text-gray-500 mb-4">Critérios de verificação para gratificação</p>
                                    <div class="flex flex-col border border-gray-200 rounded-lg overflow-hidden">

                                        <template v-if="item.dados.periodos_frequencia && item.dados.periodos_frequencia.length > 0">
                                            <div v-for="(periodo, pIndex) in item.dados.periodos_frequencia" :key="pIndex" class="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-gray-200 bg-white last:border-b-0 hover:bg-gray-50">
                                                <span class="text-base text-gray-700 flex-1">Frequência (Período {{ periodo.numero_periodo }})</span>
                                                <span class="text-base text-gray-500 whitespace-nowrap">{{ periodo.percentual ? Number(periodo.percentual).toFixed(2) + '%' : 'N/A' }}</span>
                                                <span class="rounded-full px-3 py-0.5 text-base font-semibold whitespace-nowrap flex-shrink-0" :class="periodo.apto ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
                                                    {{ periodo.apto ? 'Apto' : 'Não apto' }}
                                                </span>
                                            </div>
                                        </template>

                                        <template v-else>
                                            <div class="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-gray-200 bg-white last:border-b-0 hover:bg-gray-50">
                                                <span class="text-base text-gray-700 flex-1">Frequência</span>
                                                <span class="text-base text-gray-500 whitespace-nowrap">
                                                    {{ item?.frequencia[0]?.percentual_frequencia ? Number(item.frequencia[0].percentual_frequencia).toFixed(2) + '%' : '100%' }}
                                                </span>
                                                <span class="rounded-full px-3 py-0.5 text-sm font-semibold whitespace-nowrap flex-shrink-0"
                                                    :class="!item?.frequencia[0]?.percentual_frequencia || Number(item.frequencia[0].percentual_frequencia) === 100 ? 'bg-green-50 text-green-800' : Number(item.frequencia[0].percentual_frequencia) >= 96 ? 'bg-yellow-50 text-yellow-800' : 'bg-red-50 text-red-800'">
                                                    {{ !item?.frequencia[0]?.percentual_frequencia || Number(item.frequencia[0].percentual_frequencia) === 100 ? 'Apto' : Number(item.frequencia[0].percentual_frequencia) >= 96 ? 'Parcialmente Apto' : 'Não apto' }}
                                                </span>
                                            </div>
                                        </template>

                                        <div class="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-gray-200 bg-white last:border-b-0 hover:bg-gray-50">
                                            <span class="text-base text-gray-700 flex-1">Tempo de atuação</span>
                                            <span class="text-base text-gray-500 whitespace-nowrap">{{ item?.dados?.tempo_atuacao === true ? 'Atua há mais de 6 meses' : 'Não atua há mais de 6 meses' }}</span>
                                            <span class="rounded-full px-3 py-0.5 text-sm font-semibold whitespace-nowrap flex-shrink-0" :class="item?.dados?.tempo_atuacao === true ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
                                                {{ item?.dados?.tempo_atuacao === true ? 'Apto' : 'Não apto' }}
                                            </span>
                                        </div>

                                        <div class="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-gray-200 bg-white last:border-b-0 hover:bg-gray-50">
                                            <span class="text-base text-gray-700 flex-1">Formação</span>
                                            <span class="text-base text-gray-500 whitespace-nowrap">{{ item?.dados?.percentual_formacao === 100 ? '100,00%' : item?.dados?.percentual_formacao === 0 ? '0,00%' : 'Indefinido' }}</span>
                                            <span class="rounded-full px-3 py-0.5 text-sm font-semibold whitespace-nowrap flex-shrink-0" :class="item?.dados?.formacoes === true ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
                                                {{ item?.dados?.formacoes === true ? 'Apto' : 'Não apto' }}
                                            </span>
                                        </div>

                                        <div class="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-gray-200 bg-white last:border-b-0 hover:bg-gray-50">
                                            <span class="text-base text-gray-700 flex-1">Atividades</span>
                                            <span class="text-base text-gray-500 whitespace-nowrap">{{ item?.dados?.percentual_atividade === 100.0 ? '100,00%' : '0,00%' }}</span>
                                            <span class="rounded-full px-3 py-0.5 text-sm font-semibold whitespace-nowrap flex-shrink-0" :class="item?.dados?.recebe_atividade ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
                                                {{ item?.dados?.recebe_atividade ? 'Apto' : 'Não apto' }}
                                            </span>
                                        </div>

                                        <div v-if="motivosOutros.includes(item?.dados?.motivo_nao_recebimento)" class="flex items-center justify-between gap-3 px-4 py-3.5 border-b border-gray-200 bg-white last:border-b-0 hover:bg-gray-50">
                                            <span class="text-base text-gray-700 flex-1">Outro Motivo</span>
                                            <span class="text-base text-gray-500 whitespace-nowrap">{{ item?.dados?.motivo_nao_recebimento==='Outro' ? 'Unidade não bateu meta' : item?.dados?.motivo_nao_recebimento }}</span>
                                            <span class="rounded-full px-3 py-0.5 text-sm font-semibold whitespace-nowrap flex-shrink-0" :class="item?.dados?.recebe_gratificacao ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'">
                                                {{ item?.dados?.recebe_gratificacao ? 'Apto' : 'Não apto' }}
                                            </span>
                                        </div>

                                    </div>
                                </div>

                                <div class="h-px bg-gray-200"></div>

                                <!-- Alocações -->
                                <div id="tutorial-allocations" class="p-6">
                                    <p class="text-base font-semibold tracking-wider uppercase text-gray-500 mb-4">Alocações em {{ referenceYear }}</p>

                                    <div v-if="item.profissionais && item.profissionais.length > 0" class="flex flex-col gap-3">
                                        <div v-for="(prof, profIndex) in item.profissionais" :key="profIndex" class="border border-gray-200 rounded-lg overflow-hidden">
                                            <div class="flex items-center justify-between flex-wrap gap-2 bg-[#f0f6ff] px-4 py-3">
                                                <span class="text-lg font-semibold text-[#1e3a5f]">{{ formatUnidade(prof?.nome_unidade) }}</span>
                                                <div class="flex gap-2.5 flex-wrap">
                                                    <span class="text-base text-gray-700 bg-white border border-gray-300 rounded-full px-3 py-0.5">Etapa 1 <strong class="font-semibold text-[#0c447c]">{{ prof?.percentual_idem_etapa_1 }}%</strong></span>
                                                    <span class="text-base text-gray-700 bg-white border border-gray-300 rounded-full px-3 py-0.5">Etapa 2 <strong class="font-semibold text-[#0c447c]">{{ prof?.percentual_idem_etapa_2 }}%</strong></span>
                                                    <span class="text-base text-gray-700 bg-white border border-gray-300 rounded-full px-3 py-0.5">Etapa 3 <strong class="font-semibold text-[#0c447c]">{{ prof?.percentual_idem_etapa_3 }}%</strong></span>
                                                </div>
                                            </div>
                                            <div class="overflow-x-auto">
                                                <table class="w-full border-collapse text-base min-w-[600px]">
                                                    <thead class="bg-gray-100">
                                                        <tr>
                                                            <th v-for="h in ['Início', 'Fim', 'Função', 'Carga horária', 'Grupo']" :key="h" class="px-4 py-2.5 text-left text-xs font-semibold tracking-wide uppercase text-gray-500 whitespace-nowrap border-b border-gray-200">{{ h }}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr class="hover:bg-gray-50">
                                                            <td class="px-4 py-3 text-gray-700 whitespace-nowrap border-b border-gray-100">{{ new Date(prof.inicio_atividade_local).toLocaleDateString('pt-BR') }}</td>
                                                            <td class="px-4 py-3 text-gray-700 whitespace-nowrap border-b border-gray-100">{{ new Date(prof.fim_atividade_local).toLocaleDateString('pt-BR') }}</td>
                                                            <td class="px-4 py-3 text-gray-700 whitespace-nowrap border-b border-gray-100 capitalize">{{ prof.nome_disciplina.charAt(0).toUpperCase() + prof.nome_disciplina.slice(1) || 'N/A' }}</td>
                                                            <td class="px-4 py-3 text-gray-700 whitespace-nowrap border-b border-gray-100">{{ prof.hora_aula || 'N/A' }}h</td>
                                                            <td class="px-4 py-3 text-gray-700 whitespace-nowrap border-b border-gray-100">{{ formatGroups(prof.grupo_gr) || 'N/A' }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="h-px bg-gray-200"></div>

                                <!-- Frequência / Afastamentos -->
                                <div id="tutorial-frequency" class="p-6">
                                    <p class="text-base font-semibold tracking-wider uppercase text-gray-500 mb-4">Frequência (afastamentos)</p>
                                    <div class="overflow-x-auto">
                                        <table class="w-full border-collapse text-base min-w-[600px]">
                                            <thead class="bg-gray-100">
                                                <tr>
                                                    <th v-for="h in ['Início', 'Fim', 'Tipo de afastamento', 'Total dias', 'Contabilizados']" :key="h" class="px-4 py-2.5 text-left text-xs font-semibold tracking-wide uppercase text-gray-500 whitespace-nowrap border-b border-gray-200">{{ h }}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="(freq, freqIndex) in item.frequencia.filter(f => ![false].includes(f.contabiliza))" :key="freqIndex" class="capitalize hover:bg-gray-50">
                                                    <td class="px-4 py-3 text-gray-700 whitespace-nowrap border-b border-gray-100">{{ new Date(freq.inicio_afastamento).toLocaleDateString('pt-BR') }}</td>
                                                    <td class="px-4 py-3 text-gray-700 whitespace-nowrap border-b border-gray-100">{{ new Date(freq.fim_afastamento).toLocaleDateString('pt-BR') }}</td>
                                                    <td class="px-4 py-3 text-gray-700 whitespace-nowrap border-b border-gray-100">{{ freq.motivo || 'N/A' }}</td>
                                                    <td class="px-4 py-3 text-gray-700 whitespace-nowrap border-b border-gray-100">{{ freq.dias_afastado || '0' }}</td>
                                                    <td class="px-4 py-3 text-gray-700 whitespace-nowrap border-b border-gray-100">
                                                        <span class="rounded-full px-3 py-0.5 text-sm font-semibold whitespace-nowrap flex-shrink-0" :class="freq.contabiliza ? 'bg-green-50 text-green-800' : 'bg-gray-100 text-gray-600'">
                                                            {{ freq.contabiliza ? 'Sim' : 'Não' }}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </DisclosurePanel>
                        </div>

                    </template>
                </Disclosure>
            </div>
        </div>

        <!-- Área de recurso -->
        <div class="flex items-center justify-between gap-4 flex-wrap mx-8 my-8 bg-gray-50 border border-gray-200 rounded-xl px-7 py-6">
            <div class="flex flex-col gap-1.5">
                <p class="text-lg font-medium text-gray-900">Percebeu algum problema com o valor?</p>
                <p class="text-base text-gray-500">Abra um recurso para contestar o valor calculado.</p>
            </div>
            <router-link to="/resource/form">
                <button id="tutorial-resource" class="bg-[#1a4a8a] text-[#e6f1fb] border-none rounded-lg px-7 py-3 text-base font-semibold cursor-pointer whitespace-nowrap tracking-wide transition-colors duration-150 hover:bg-[#0c447c]">Abrir recurso</button>
            </router-link>
        </div>

    </Whiteboard>
    <Tutorial ref="tutorialComponent" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { ChevronDownIcon, ArrowDownIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Tutorial from '@/components/Tutorial/Tutorial.vue';
import { apiClient } from '@/service/apiService';
import { getAccessToken } from '@/service/token';
import { useRoute } from 'vue-router';
import { formatUnidade } from './unidadeMap';

const savedData = ref([]);
const totalRecebimento = ref(null);
const totalUnidade = ref(null);
const isLoading = ref(true);
const errorMessage = ref(null);
const route = useRoute();
const tutorialComponent = ref(null);
const referenceYear = ref(null);
const motivosOutros = ['Secretário', 'Estagiário', 'Diretor Executivo', 'Outro'];

const fetchRewardsData = async () => {
    const targetCpfFromStorage = localStorage.getItem('tempTargetCpf');

    try {
        isLoading.value = true;
        errorMessage.value = null;

        const token = await getAccessToken();
        if (!token) throw new Error("Token de autenticação não encontrado.");

        const fetchYear = await apiClient.get('/csv/opencalc/active-reference-year/', {
            headers: { Authorization: `Bearer ${token}` }
        });
        referenceYear.value = fetchYear.data.reference_year;

        let payload = { reference: referenceYear.value };
        if (targetCpfFromStorage) payload.cpf = targetCpfFromStorage;

        const response = await apiClient.post('/csv/user-get/', payload, {
            headers: { Authorization: `Bearer ${token}` }
        });

        savedData.value = response.data;

        totalUnidade.value = savedData.value.map(item => {
            const total = item?.profissionais?.reduce((acc, curr) => acc + (curr.valor_gr_unidade || 0), 0) ?? 0;
            return total > item?.dados?.valor_total ? item?.dados?.valor_total : total;
        });

        totalRecebimento.value = savedData.value.reduce((acc, item) => {
            return acc + (item?.dados?.valor_total || 0);
        }, 0);

    } catch (error) {
        console.error('Erro ao buscar dados da gratificação:', error);
        if (error.response?.data?.error) {
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
};

const formatGroups = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const romanMap = [
        { value: 'grupo i', numeral: 'Grupo I' },
        { value: 'grupo ii', numeral: 'Grupo II' },
        { value: 'grupo iii', numeral: 'Grupo III' },
        { value: 'grupo iv', numeral: 'Grupo IV' },
        { value: 'grupo v', numeral: 'Grupo V' },
        { value: 'indefinido', numeral: 'Indefinido' },
    ];
    const found = romanMap.find(r => r.value === value.toLowerCase());
    return found ? found.numeral : value;
    };


onMounted(() => {
    fetchRewardsData();
});

watch(route, (to, from) => {
    if (to.path !== from.path) fetchRewardsData();
});

watch(
    () => route.params.cpf,
    (newCpf, oldCpf) => {
        if (newCpf !== oldCpf) fetchRewardsData();
    }
);
</script>

<style scoped>
.capitalize {
    text-transform: capitalize;
}
</style>