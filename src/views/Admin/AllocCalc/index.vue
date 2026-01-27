
<template>
    <Whiteboard title="Promover Cálculo para Publicação">
        <!-- Painel de versões elegíveis -->
        <div class="w-full px-4 sm:px-10 mt-8">
            <div class="bg-[#f5faff] rounded-[10px] shadow-lg p-6">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-20 font-bold text-[#4168b5]">Cálculos Prontos para Promoção</h2>
                        <p class="text-15 text-gray-600 mt-1">
                            Estes cálculos foram finalizados e estão aguardando para serem promovidos a 'OpenCalc'.
                        </p>
                    </div>
                    <PrimaryButton
                        customColor="bg-[#4168b5] hover:bg-[#27477a] w-40 h-10 text-15 font-semibold text-white rounded"
                        value="Atualizar lista"
                        @click="fetchEligibleCalculations"
                        :disabled="isLoading"
                    />
                </div>
                <div v-if="isLoading" class="text-gray-500 py-6 text-center">Carregando cálculos...</div>
                <div v-else-if="eligibleCalculations.length === 0" class="text-gray-500 py-6 text-center">
                    Nenhum cálculo elegível para promoção encontrado.
                </div>
                <table v-else class="w-full text-15 border-collapse">
                    <thead>
                        <tr class="bg-[#e3f0ff] rounded-[10px] text-15 text-[#4168b5]">
                            <th class="py-2 px-3 font-semibold text-left">Nome</th>
                            <th class="py-2 px-3 font-semibold text-left">Descrição</th>
                            <th class="py-2 px-3 font-semibold text-left">Criado em</th>
                            <th class="py-2 px-3 font-semibold text-center">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="calc in eligibleCalculations" :key="calc.calc_id" class="border-b hover:bg-[#f0f4fa] transition">
                            <td class="py-2 px-3">{{ calc.nome || '-' }}</td>
                            <td class="py-2 px-3">{{ calc.descricao || '-' }}</td>
                            <td class="py-2 px-3">{{ calc.data }}</td>
                            <td class="py-2 px-3 text-center">
                                <PrimaryButton
                                    customColor="bg-[#2d8f4b] hover:bg-[#23703a] text-white font-semibold py-1 px-4 rounded"
                                    value="Promover"
                                    :disabled="isPromoting[calc.calc_id]"
                                    @click="promoteToOpenCalc(calc.calc_id)"
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                 <p v-if="errorMessage" class="text-red-500 text-15 mt-4">{{ errorMessage }}</p>
                 <p v-if="successMessage" class="text-green-600 text-15 mt-4">{{ successMessage }}</p>
            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { ref, onMounted } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import { apiClient } from '@/service/apiService';
import { getAccessToken } from '@/service/token.js';

export default {
    name: "AllocCalc",
    components: { Whiteboard, PrimaryButton },
    setup() {
        const eligibleCalculations = ref([]);
        const isLoading = ref(false);
        const isPromoting = ref({});
        const errorMessage = ref('');
        const successMessage = ref('');

        const fetchEligibleCalculations = async () => {
            isLoading.value = true;
            errorMessage.value = '';
            successMessage.value = '';
            try {
                const token = await getAccessToken();
                const response = await apiClient.get('/csv/calculus/list-eligible-for-promotion/', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                eligibleCalculations.value = response.data;
            } catch (error) {
                console.error("Erro ao buscar cálculos elegíveis:", error);
                errorMessage.value = 'Não foi possível carregar os cálculos elegíveis.';
            } finally {
                isLoading.value = false;
            }
        };

        const promoteToOpenCalc = async (calc_id) => {
            if (!confirm(`Tem certeza que deseja promover o cálculo ID ${calc_id}? Ele se tornará um OpenCalc e poderá ser ativado para visualização.`)) {
                return;
            }

            isPromoting.value[calc_id] = true;
            errorMessage.value = '';
            successMessage.value = '';

            try {
                const token = await getAccessToken();
                const response = await apiClient.post('/csv/opencalc/create-opencalc/',
                    { calc_id: calc_id },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                if (response.status === 201) {
                    successMessage.value = 'Cálculo promovido com sucesso!';
                    await fetchEligibleCalculations(); // Atualiza a lista
                }
            } catch (error) {
                console.error("Erro ao promover o cálculo:", error.response?.data || error);
                const errorMsg = error.response?.data?.error || "Ocorreu um erro desconhecido.";
                errorMessage.value = `Falha ao promover o cálculo: ${errorMsg}`;
            } finally {
                isPromoting.value[calc_id] = false;
            }
        };

        onMounted(() => {
            fetchEligibleCalculations();
        });

        return {
            eligibleCalculations,
            isLoading,
            isPromoting,
            errorMessage,
            successMessage,
            fetchEligibleCalculations,
            promoteToOpenCalc,
        };
    },
};
</script>