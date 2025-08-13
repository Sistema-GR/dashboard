<template>
    <Sidebar :route="'admin'" @update:isSidebarMinimized="handleSidebarMinimized" class="z-50"/>
    <Whiteboard :title="`Detalhes do Recurso #${resourceId}`" class="!overflow-visible overflow-y-auto z-40 relative" :isSidebarMinimized="isSidebarMinimized" >

        <div class="flex flex-col w-full gap-4 px-4 sm:px-6 lg:px-8 py-4">
            <div v-if="isLoading" class="text-center p-10">Carregando dados...</div>
            <div v-else-if="error" class="text-center p-10 text-red-500">{{ error }}</div>
            
            <div v-else-if="recurso" class="space-y-4">
                <!-- CARD DE IDENTIFICAÇÃO -->
                <div class="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center border rounded-[10px] p-4 shadow-md bg-white gap-4">
                    <div class="flex items-center w-full sm:w-auto">
                        <UserIcon class="w-12 h-12 sm:w-14 sm:h-14 text-[#003965] mr-3 flex-shrink-0" />
                        <div class="min-w-0 flex-1">
                            <p class="text-sm sm:text-15 font-semibold text-gray-900 truncate">{{ recurso.nome_completo }}</p>
                            <p class="text-sm sm:text-15 text-gray-600">{{ recurso.matricula }}</p>
                        </div>
                    </div>
                    
                    <div class="relative w-full sm:w-auto">
                        <button @click="isBadgeDropdownOpen = !isBadgeDropdownOpen" class="flex items-center justify-center sm:justify-start space-x-2 w-full sm:w-auto bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md transition-colors">
                            <span class="text-sm sm:text-15">Alterar Categoria</span>
                            <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        
                        <div v-if="isBadgeDropdownOpen" class="absolute right-0 mt-2 w-full sm:w-64 bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto border">
                            <ul>
                                <li v-for="motivo in todosMotivos" :key="motivo.text" @click="toggleCriterio(motivo.text)" class="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center">
                                    <input type="checkbox" :checked="recurso.criterios_selecionados.includes(motivo.text)" class="mr-2 flex-shrink-0">
                                    <div class="flex-1 min-w-0">
                                        <Badges :text="motivo.text" />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- CARD DE DADOS DO SERVIDOR -->
                <div class="flex flex-col w-full p-4 bg-white border rounded-[10px] shadow-lg">
                    <p class="text-sm sm:text-15 font-bold mb-3">Dados do Servidor</p>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                        <div class="break-words"><strong>CPF:</strong> {{ recurso.cpf }}</div>
                        <div class="break-words"><strong>Email:</strong> {{ recurso.email }}</div>
                        <div class="break-words sm:col-span-2"><strong>Unidade:</strong> {{ recurso.unidade_atuacao }}</div>
                        <div class="sm:col-span-2"><strong>Aberto em:</strong> {{ new Date(recurso.created_at).toLocaleString() }}</div>
                    </div>
                </div>

                <!-- CARD DE DESCRIÇÃO E MOTIVOS -->
                <div class="flex flex-col w-full p-4 bg-white border rounded-[10px] shadow-lg">
                    <p class="text-sm sm:text-15 font-bold mb-3">Descrição do Usuário</p>
                    <p class="text-xs sm:text-sm text-gray-700 mb-4 leading-relaxed">{{ recurso.descricao }}</p>
                    
                    <p class="text-sm sm:text-15 font-bold mb-3">Categorias Atuais</p>
                    <div v-if="recurso.criterios_selecionados && recurso.criterios_selecionados.length" class="flex flex-wrap gap-2">
                        <Badges v-for="criterio in recurso.criterios_selecionados" :key="criterio" :text="criterio" />
                    </div>
                    <p v-else class="text-xs sm:text-sm text-gray-500">Nenhuma categoria definida.</p>
                </div>

                <!-- CARD DE RESPOSTA -->
                <div class="flex flex-col w-full p-4 bg-white border rounded-[10px] shadow-lg">
                    <div class="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-3 mb-3">
                        <p class="text-sm sm:text-15 font-bold">Responder Recurso</p>
                        <button @click="isReportResponseOpen = !isReportResponseOpen" class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors w-full sm:w-auto text-sm sm:text-15">
                            {{ isReportResponseOpen ? 'Cancelar' : 'Responder' }}
                        </button>
                    </div>
                    
                    <div class="flex flex-col w-full" v-if="isReportResponseOpen">
                        <textarea 
                            v-model="newResponseText" 
                            rows="4" 
                            class="w-full border border-gray-300 rounded-md p-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical" 
                            placeholder="Digite sua resposta aqui..."
                        ></textarea>
                        <button @click="submitReportResponse" class="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md w-full sm:w-auto sm:self-end transition-colors text-sm sm:text-15">
                            Enviar Resposta
                        </button>
                    </div>
                </div>
                
                <!-- CARD DE RESPOSTAS ANTERIORES -->
                <div v-if="recurso.respostas && recurso.respostas.length" class="flex flex-col w-full p-4 bg-white border rounded-[10px] shadow-lg">
                    <p class="text-sm sm:text-15 font-bold mb-3">Histórico de Respostas</p>
                    <div class="space-y-3">
                        <div v-for="response in recurso.respostas" :key="response.id" class="border-b border-gray-200 pb-3 last:border-b-0">
                            <p class="text-xs sm:text-sm text-gray-700 mb-2 leading-relaxed">{{ response.texto }}</p>
                            <p class="text-xs text-gray-500">
                                <span class="font-medium">{{ response.autor_nome }}</span> • {{ new Date(response.created_at).toLocaleString() }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { ref, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Badges from '@/components/Badges/Badges.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { UserIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import { MOTIVOS_RECURSO } from '@/config/resourceConstants.js';
import Sidebar from '@/components/Sidebar/Sidebar.vue';

export default {
    name: "InfoDetails",
    components: { Whiteboard, UserIcon, Badges, ChevronDownIcon, Sidebar },
    
    setup() {
        const isSidebarMinimized = ref(false);
        const route = useRoute();
        const resourceId = route.params.id;

        const recurso = ref(null);
        const isLoading = ref(true);
        const error = ref(null);
        
        const isBadgeDropdownOpen = ref(false);
        const todosMotivos = ref(MOTIVOS_RECURSO);
        
        const isReportResponseOpen = ref(false);
        const newResponseText = ref('');

        async function fetchData() {
            isLoading.value = true;
            try {
                const response = await axios.get(`/recursos/${resourceId}/`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                recurso.value = response.data;
            } catch (err) {
                console.error("Erro ao buscar detalhes do recurso:", err);
                error.value = "Não foi possível carregar os dados.";
            } finally {
                isLoading.value = false;
            }
        }

        async function toggleCriterio(criterioText) {
            const currentCriterios = recurso.value.criterios_selecionados || [];
            const newCriterios = currentCriterios.includes(criterioText)
                ? currentCriterios.filter(c => c !== criterioText)
                : [...currentCriterios, criterioText];
            
            try {
                const response = await axios.patch(`/recursos/${resourceId}/`, { criterios_selecionados: newCriterios }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                recurso.value = response.data;
            } catch (err) {
                console.error("Erro ao atualizar critérios:", err);
                alert("Não foi possível salvar a categoria.");
            }
        }

        async function submitReportResponse() {
            if (!newResponseText.value.trim()) return;
            try {
                await axios.post(`/recursos/${resourceId}/responder/`, { texto: newResponseText.value }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                newResponseText.value = '';
                isReportResponseOpen.value = false;
                await fetchData();
            } catch (err) {
                console.error("Erro ao enviar resposta:", err);
                alert("Não foi possível enviar a resposta.");
            }
        }
        
        function handleSidebarMinimized(value) {
            isSidebarMinimized.value = value
        }

        onMounted(fetchData);

        return {
            isSidebarMinimized,
            handleSidebarMinimized,
            resourceId,
            recurso,
            isLoading,
            error,
            isBadgeDropdownOpen,
            todosMotivos,
            toggleCriterio,
            isReportResponseOpen,
            newResponseText,
            submitReportResponse,
        };
    }
};
</script>