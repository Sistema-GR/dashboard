<template>
    <Whiteboard title="Promover Cálculo para Visualização" :isSidebarMinimized="isSidebarMinimized">
        <div class="flex flex-col w-full items-center justify-center p-5">

            <div class="flex w-full p-5 pt-8">
                <p class="text-center w-full font-semibold text-15 text-gray-800">
                    Selecione um cálculo finalizado abaixo para torná-lo disponível na tela de ativação para os usuários.
                </p>
            </div>

            <!-- Seção de Loading -->
            <div v-if="isLoading" class="text-center p-10">
                <p class="text-gray-600">Carregando cálculos...</p>
                <!-- Você pode adicionar um componente de spinner aqui -->
            </div>

            <!-- Seção de Lista de Cálculos -->
            <div v-else-if="Object.keys(calculusByYear).length > 0" class="w-full max-w-4xl space-y-6">
                <div v-for="(calculations, year) in calculusByYear" :key="year">
                    
                    <h2 class="text-20 font-bold text-gray-700 border-b-2 border-gray-200 pb-2 mb-4">
                        Ano de Referência: {{ year }}
                    </h2>
                    <ul class="space-y-3">
                        <li v-for="calc in calculations" :key="calc.calculus_id" class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center">
                            <div class="flex flex-col">
                                <span class="font-semibold text-gray-900">{{ calc.description }}</span>
                                <span class="text-sm text-gray-500">Criado em: {{ new Date(calc.created_at).toLocaleDateString('pt-BR') }}</span>
                            </div>
                            <!-- Desabilitamos o botão se ele já foi promovido para evitar duplicatas -->
                            <PrimaryButton
                                :value="calc.is_promoted ? 'Já Promovido' : 'Promover'"
                                :disabled="calc.is_promoted"
                                @click="promoteToOpenCalc(calc.calculus_id)"
                                :customColor="calc.is_promoted ? 'bg-gray-400' : 'bg-[#4168b5] hover:bg-blue-700'"
                                class="px-4 py-2 shadow-md"
                            />
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Seção de Nenhum Cálculo Encontrado -->
            <div v-else class="text-center p-10">
                <p class="text-gray-500">Nenhum cálculo encontrado.</p>
            </div>
        </div>
    </Whiteboard>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import axios from 'axios';
import { getAccessToken } from '@/service/token';

const isSidebarMinimized = inject('isSidebarMinimized', ref(false));
const calculusByYear = ref({});
const isLoading = ref(true);

async function fetchCalculusList() {
    isLoading.value = true;
    try {
        const token = await getAccessToken();
        const response = await axios.get('http://127.0.0.1:8000/csv/get-list-calculus/', {
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