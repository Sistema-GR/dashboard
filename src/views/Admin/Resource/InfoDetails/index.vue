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

                <div class="flex flex-col w-full mt-5 p-4 bg-white border rounded-[10px] shadow-lg">
                    <p class="text-15 font-bold mb-4">Gerar Resposta em PDF</p>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Selecione um Template</label>
                            <select v-model="selectedTemplateId" class="mt-1 block w-full pl-3 pr-10 py-2 border rounded-md">
                                <option :value="null" disabled>Escolha um template...</option>
                                <option v-for="template in templates" :key="template.id" :value="template.id">{{ template.titulo }}</option>
                            </select>
                        </div>
                        <div v-if="selectedTemplate">
                            <p class="text-sm font-medium text-gray-700 mb-2">Preencha os campos diretamente no texto:</p>
                            <RenderedTemplate
                                :htmlContent="selectedTemplate.corpo_html"
                                v-model="templateForm"
                                :resourceData="recurso"
                            />
                            <div class="flex justify-end mt-4">
                                <button @click="generateAndSendResponse" :disabled="!selectedTemplate || isGenerating" class="bg-green-600 text-white py-2 px-4 rounded-md disabled:bg-gray-400">
                                    {{ isGenerating ? 'Gerando...' : 'Gerar e Enviar Resposta' }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div v-if="recurso.respostas && recurso.respostas.length" class="flex flex-col w-full mt-5 p-4 bg-white border rounded-[10px] shadow-lg">
                    <p class="text-15 font-bold mb-2">Histórico de Respostas</p>
                    <ul class="space-y-3">
                        <li v-for="response in recurso.respostas" :key="response.id" class="border-b pb-3 text-sm">
                            <div class="flex justify-between items-start gap-4">
                                <div class="flex-grow">
                                    <p v-if="response.texto">{{ response.texto }}</p>
                                    <div v-if="response.arquivo_pdf" class="mt-2">
                                        <a :href="response.arquivo_pdf" download target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-blue-600 hover:underline font-medium">
                                            <PaperClipIcon class="w-4 h-4" />
                                            <span>Baixar Resposta em PDF</span>
                                        </a>
                                    </div>
                                    <p class="text-xs text-gray-500 mt-2">Por: {{ response.autor_nome }} em {{ new Date(response.created_at).toLocaleString() }}</p>
                                </div>
                                <button @click="deleteResponse(response.id)" class="flex-shrink-0 p-2 rounded-full hover:bg-red-100 text-red-500">
                                    <TrashIcon class="w-5 h-5" />
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { ref, onMounted, computed } from 'vue';

import axios from 'axios';
import Badges from '@/components/Badges/Badges.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { UserIcon, ChevronDownIcon, TrashIcon, ExclamationTriangleIcon, PaperClipIcon  } from "@heroicons/vue/24/outline";
import { MOTIVOS_RECURSO } from '@/config/resourceConstants.js';
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import RenderedTemplate from '@/views/Admin/Resource/components/RenderedTemplate/index.vue';

export default {
    name: "InfoDetails",
    components: { Whiteboard, UserIcon, Badges, ChevronDownIcon, Sidebar, TrashIcon, ExclamationTriangleIcon, PaperClipIcon, RenderedTemplate },
    props: {
      id: {
        type: [String, Number],
        required: true
      }
    },
    setup(props) {
        const isSidebarMinimized = ref(false);

        const resourceId = props.id;

        const recurso = ref(null);
        const isLoading = ref(true);
        const error = ref(null);
        
        const isBadgeDropdownOpen = ref(false);
        const todosMotivos = ref(MOTIVOS_RECURSO);
        
        const isReportResponseOpen = ref(false);
        const newResponseText = ref('');

        const templates = ref([]);
        const selectedTemplateId = ref(null);
        const templateForm = ref({});
        const isGenerating = ref(false);

        const selectedTemplate = computed(() => templates.value.find(t => t.id === selectedTemplateId.value) || null);

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

        async function fetchTemplates() {
            try {
                const response = await axios.get('/recursos/templates/', { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });
                templates.value = response.data;
            } catch (err) { console.error("Erro ao buscar templates:", err); }
        }
        
        async function generateAndSendResponse() {
            if (!selectedTemplateId.value) return alert("Por favor, selecione um template.");
            isGenerating.value = true;
            try {
                const response = await axios.post(`/recursos/${resourceId}/gerar-resposta-pdf/`, {
                    template_id: selectedTemplateId.value,
                    contexto_variaveis: templateForm.value
                }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } });
                
                recurso.value.respostas.unshift(response.data);
                recurso.value.status = 'respondido';
                
                alert("Resposta em PDF gerada com sucesso!");
                selectedTemplateId.value = null;
                templateForm.value = {};
            } catch (err) {
                console.error("Erro ao gerar resposta em PDF:", err);
                alert("Ocorreu um erro ao gerar a resposta.");
            } finally {
                isGenerating.value = false;
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
        
        async function deleteResponse(responseId) {

            if (!window.confirm("Tem certeza que deseja deletar esta resposta? A ação não pode ser desfeita.")) {
                return;
            }

            try {

                await axios.delete(`/recursos/resposta/${responseId}/`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });


                if (recurso.value && recurso.value.respostas) {
                    recurso.value.respostas = recurso.value.respostas.filter(
                        resp => resp.id !== responseId
                    );
                }

            } catch (err) {
                console.error("Erro ao deletar a resposta:", err);
            
                if (err.response && err.response.status === 403) {
                    alert("Você não tem permissão para deletar esta resposta.");
                } else {
                    alert("Ocorreu um erro ao tentar deletar a resposta.");
                }
            }
        }


        
        const downloadAuthenticatedFile = async (doc) => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) {
                    console.error("Token de acesso não encontrado.");
                    return;
                }

                const response = await axios({
                    url: doc.download_url, 
                    method: 'GET',
                    responseType: 'blob',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                
                const filename = doc.arquivo.split('/').pop();
                link.setAttribute('download', filename);
                
                document.body.appendChild(link);
                link.click();
                
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

            } catch (error) {
                console.error("Erro ao baixar o arquivo:", error);
                alert("Não foi possível baixar o arquivo.");
            }
        };



        function handleSidebarMinimized(value) {
        isSidebarMinimized.value = value
        }

        function getFilename(url) {
            if (!url) return 'Documento';
            return decodeURIComponent(url.split('/').pop());
        }

        onMounted(() => {
            fetchData();
            fetchTemplates();
        });


        return {
            isSidebarMinimized,
            handleSidebarMinimized,
            recurso,
            isLoading,
            error,
            isBadgeDropdownOpen,
            todosMotivos,
            toggleCriterio,
            isReportResponseOpen,
            newResponseText,
            submitReportResponse,
            getFilename,
            downloadAuthenticatedFile,
            templates,
            selectedTemplateId,
            templateForm,
            isGenerating,
            selectedTemplate,
            generateAndSendResponse,
            deleteResponse,
            resourceId
        };
    }
};
</script>