<template>
    <Whiteboard title="Calcular Alocação">
        <!-- Input de cálculo -->
        <div class="w-full px-4 sm:px-10 pt-8 flex flex-col items-center">
            <label for="calcId" class="font-semibold text-gray-700 mb-4 text-center">
                Adicionar um cálculo para alocação por ID:
            </label>
            <div class="flex flex-row items-center space-x-4 mb-2">
                <input
                    id="calcId"
                    v-model="calcId"
                    type="text"
                    class="border border-[#bfcbe2] rounded-[10px] px-4 py-2 w-56 text-15 focus:outline-none focus:ring-2 focus:ring-[#4168b5]"
                    placeholder="ID do cálculo"
                />
                <PrimaryButton
                    customColor="bg-[#2d8f4b] hover:bg-[#23703a] w-40 h-10 text-15 font-semibold text-white rounded-[10px]"
                    :value="isLoading ? 'Enviando...' : 'Definir'"
                    :disabled="isLoading || !calcId"
                    @click="submitCalcId"
                />
            </div>
            <p v-if="errorMessage" class="text-red-500 text-15 mt-2">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-green-600 text-15 mt-2">{{ successMessage }}</p>
        </div>

        <!-- Painel de versões de cálculo -->
        <div class="w-full px-4 sm:px-10 mt-8">
            <div class="bg-[#f5faff] rounded-[10px] shadow-lg p-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-20 font-bold text-[#4168b5]">Versões de cálculo ativas</h2>
                    <PrimaryButton
                        customColor="bg-[#4168b5] hover:bg-[#27477a] w-40 h-10 text-15 font-semibold text-white rounded"
                        value="Atualizar lista"
                        @click="fetchActiveCalcs"
                    />
                </div>
                <div v-if="isLoadingCalcs" class="text-gray-500 py-6 text-center">Carregando versões...</div>
                <div v-else-if="activeCalcs.length === 0" class="text-gray-500 py-6 text-center">Nenhuma versão ativa encontrada.</div>
                <table v-else class="w-full text-15 border-collapse">
                    <thead>
                        <tr class="bg-[#e3f0ff] rounded-[10px] text-15 text-[#4168b5]">
                            <th class="py-2 px-3 font-semibold text-left">Nome</th>
                            <th class="py-2 px-3 font-semibold text-left">Descrição</th>
                            <th class="py-2 px-3 font-semibold text-left">Criado em</th>
                            <th class="py-2 px-3 font-semibold text-center">Ativo</th>
                            <th class="py-2 px-3 font-semibold text-center">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="calc in activeCalcs" :key="calc.id" class="border-b hover:bg-[#f0f4fa] transition">
                            <td class="py-2 px-3">{{ calc.nome || '-' }}</td>
                            <td class="py-2 px-3">{{ calc.descricao || '-' }}</td>
                            <td class="py-2 px-3">{{ calc.data }}</td>
                            <td class="py-2 px-3 text-center">
                                <span
                                    class="inline-block px-3 py-1 rounded-[10px]text-15 font-semibold"
                                    :class="calc.ativa ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                                >
                                    {{ calc.ativa ? 'Ativo' : 'Inativo' }}
                                </span>
                            </td>
                            <td class="py-2 px-3 text-center">
                                <label class="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        class="sr-only"
                                        :checked="calc.ativa"
                                        @change="toggleActive(calc)"
                                        :disabled="isToggling[calc.id]"
                                        :id="'switch-' + calc.id"
                                    />
                                    <span
                                        class="relative inline-block w-10 h-6 rounded-full transition bg-gray-300"
                                        :class="calc.ativa ? 'bg-green-400' : 'bg-gray-300'"
                                        style="vertical-align: middle;"
                                    >
                                        <span
                                            class="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform"
                                            :style="calc.ativa ? 'transform: translateX(16px);' : ''"
                                        ></span>
                                    </span>
                                </label>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { ref, onMounted, inject } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import axios from 'axios';
import { getAccessToken } from '@/service/token.js';

const calculusByYear = ref({});
const isLoading = ref(true);

async function fetchCalculusList() {
    isLoading.value = true;
    try {
        const token = await getAccessToken();
        const response = await axios.get('http://127.0.0.1:8000/csv/calculus/list-eligible-for-promotion/', {
            headers: { Authorization: `Bearer ${token}` },
        });
        calculusByYear.value = response.data;
    } catch (error) {
        console.error("Erro ao buscar a lista de cálculos:", error);
        alert('Não foi possível carregar os cálculos.');
    } finally {
        isLoading.value = false;
    }
}
export default {
    name: "AllocCalc",
    components: { Whiteboard, PrimaryButton },
    data() {
        return {
            calcId: '',
            isLoading: false,
            errorMessage: '',
            successMessage: '',
            activeCalcs: [],
            isLoadingCalcs: false,
            isToggling: {}
        };
    },
    mounted() {
        this.fetchActiveCalcs();
    },
    methods: {
        async submitCalcId() {
            this.errorMessage = '';
            this.successMessage = '';
            if (!this.calcId) {
                this.errorMessage = 'Por favor, informe o ID do cálculo.';
                return;
            }
            this.isLoading = true;
            try {
                const token = await getAccessToken();
                if (!token) {
                    this.errorMessage = 'Usuário não autenticado ou token expirado.';
                    this.isLoading = false;
                    return;
                }
                await axios.post(
                    'http://127.0.0.1:8000/csv/opencalc/create-opencalc/',                    
                    { calc_id: this.calcId },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    },
                );
                this.successMessage = 'ID do cálculo definido com sucesso!';
                this.fetchActiveCalcs();
            } catch (error) {
                this.errorMessage =
                    error.response?.data?.error ||
                    error.response?.data?.detail ||
                    'Erro ao definir o ID do cálculo.';
            } finally {
                this.isLoading = false;
            }
        },
        async fetchActiveCalcs() {
            this.isLoadingCalcs = true;
            this.activeCalcs = [];
            try {
                const token = await getAccessToken();
                if (!token) {
                    this.errorMessage = 'Usuário não autenticado ou token expirado.';
                    this.isLoadingCalcs = false;
                    return;
                }
                const response = await axios.get(
                    'http://127.0.0.1:8000/csv/opencalc/list-opencalc/',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                this.activeCalcs = Array.isArray(response.data) ? response.data : [];
            } catch (error) {
                this.errorMessage =
                    error.response?.data?.error ||
                    error.response?.data?.detail ||
                    'Erro ao buscar versões ativas.';
            } finally {
                this.isLoadingCalcs = false;
            }
        },
        formatDate(dateStr) {
            if (!dateStr) return '-';
            const date = new Date(dateStr);
            return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
                ' ' +
                date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        },
        async toggleActive(calc) {
            this.isToggling[calc.id] = true;
            try {
                const token = await getAccessToken();
                if (!token) {
                    this.errorMessage = 'Usuário não autenticado ou token expirado.';
                    this.isToggling[calc.id] = false;
                    return;
                }
                const url = calc.ativa
                    ? 'http://127.0.0.1:8000/csv/opencalc/deactivate-opencalc/'
                    : 'http://127.0.0.1:8000/csv/opencalc/activate-opencalc/';
                const request = calc.ativa
                    ? { reference_year: calc.referencia }
                    : { calc_id: calc.id };
                await axios.post(
                    url,
                    request,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                this.successMessage = calc.ativa
                    ? 'Cálculo desativado com sucesso!'
                    : 'Cálculo ativado com sucesso!';
                await this.fetchActiveCalcs();
            } catch (error) {
                this.errorMessage =
                    error.response?.data?.error ||
                    error.response?.data?.detail ||
                    'Erro ao alterar status do cálculo.';
            } finally {
                this.isToggling = { ...this.isToggling, [calc.id]: false };
            }
        }
    }
}

async function promoteToOpenCalc(calcId) {
    if (!confirm(`Tem certeza que deseja promover o cálculo ID ${calcId} para a área de visualização?`)) {
        return;
    }

    try {
        const token = await getAccessToken();
        const response = await axios.post('http://127.0.0.1:8000/csv/opencalc/create-opencalc/',
            { calc_id: calcId },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 201) {
            alert('Cálculo promovido com sucesso!');
            // highlight-start
            // Recarrega a lista para obter o status mais recente do backend
            await fetchCalculusList();
            // highlight-end
        }
    } catch (error) {
        console.error("Erro ao promover o cálculo:", error.response?.data || error);
        const errorMessage = error.response?.data?.error || "Ocorreu um erro desconhecido.";
        alert(`Falha ao promover o cálculo: ${errorMessage}`);
    }
}

onMounted(() => {
    fetchCalculusList();
});
</script>