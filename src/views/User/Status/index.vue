<template>
    <Whiteboard title="Status dos Meus Recursos" >

        <div v-if="isLoading" class="text-center p-10">
            <p class="text-gray-600">Buscando seu recurso...</p>
        </div>
        
        <div v-else-if="error" class="text-center p-10 bg-red-50 border border-red-200 rounded-[10px]">
            <p class="text-red-700 font-semibold">{{ error }}</p>
        </div>
       
        <div v-else-if="resources.length === 0" class="text-center p-10">
             <p class="text-gray-700">Você ainda não abriu nenhum recurso.</p>
             <router-link :to="{name: 'form'}" class="text-blue-600 hover:underline mt-2 inline-block">
                Clique aqui para abrir seu primeiro recurso.
             </router-link>
        </div>
        
        <div v-else class="flex flex-col w-full gap-4 px-4 py-4">
            <div class="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-center text-sm">
                <p>Você já possui um recurso aberto. Acompanhe o status abaixo. Só é permitido um recurso por usuário.</p>
            </div>

            <div class="flex flex-col w-full bg-white border border-gray-200 rounded-lg shadow-lg transition-shadow duration-300">
                
                <div @click="toggleDetails" class="p-4 cursor-pointer hover:bg-gray-50 rounded-t-lg">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-4">
                            <div class="p-2 bg-gray-100 rounded-[10px]"><UserIcon class="w-12 h-12 text-gray-400"/></div>
                            <div>
                                <p class="text-lg font-semibold text-gray-700 capitalize">{{ (resources[0].status || '').replace('_', ' ') }}</p>
                                <p class="text-sm text-gray-600">Clique para ver os detalhes</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4">
                            <div v-if="resources[0].status === 'respondido'" class="flex items-center gap-2 text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                                <ChatBubbleBottomCenterTextIcon class="w-5 h-5"/>
                                <span>Recurso Respondido</span>
                            </div>
                            <ChevronDownIcon class="w-6 h-6 text-gray-500 transition-transform" :class="{ 'rotate-180': isDetailsExpanded }" />
                        </div>
                    </div>
                </div>

                <div v-if="isDetailsExpanded" class="border-t bg-gray-50 px-4 py-6">
                    <div class="flex flex-col gap-6">
                        <div class="flex justify-end" v-if="resources[0].can_edit">
                            <router-link :to="{ name: 'edit', params: { id: resources[0].id } }" class="bg-blue-500 text-white text-sm font-bold py-2 px-4 rounded-lg flex items-center hover:bg-blue-600 transition-colors">
                                <PencilSquareIcon class="w-5 h-5 mr-2" />
                                Editar Recurso
                            </router-link>
                        </div>
                        <div v-else class="p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg text-sm text-center">
                            O prazo para edição deste recurso expirou.
                        </div>

                        <div class="bg-white p-4 rounded-md border">
                            <h3 class="text-lg font-bold mb-3 border-b pb-2">Informações do Recurso</h3>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div><strong>Protocolo:</strong> #{{ resources[0].id }}</div>
                                <div><strong>Nome Completo:</strong> {{ resources[0].nome_completo }}</div>
                                <div><strong>Matrícula(s):</strong> {{ (resources[0].matriculas || []).join(', ') }}</div>
                                <div><strong>CPF:</strong> {{ resources[0].cpf }}</div>
                                <div><strong>Email:</strong> {{ resources[0].email }}</div>
                                <div><strong>Unidade de Atuação:</strong> {{ resources[0].unidade_atuacao }}</div>
                                <div><strong>Data de Abertura:</strong> {{ formatDate(resources[0].created_at) }}</div>
                            </div>
                        </div>

                        <div class="bg-white p-4 rounded-md border">
                            <h3 class="text-lg font-bold mb-2">Sua Descrição</h3>
                            <p class="text-gray-700 whitespace-pre-wrap">{{ resources[0].descricao }}</p>
                        </div>

                        <div class="bg-white p-4 rounded-md border">
                            <h3 class="text-lg font-bold mb-2">Seus Documentos Anexados</h3>
                            <div v-if="resources[0].documentos && resources[0].documentos.length > 0" class="space-y-2">
                                <a v-for="doc in resources[0].documentos" :key="doc.id" @click.prevent="downloadAuthenticatedFile(doc)" class="flex items-center gap-2 text-blue-600 hover:underline cursor-pointer">
                                    <PaperClipIcon class="w-5 h-5" /><span>{{ doc.arquivo.split('/').pop() }}</span>
                                </a>
                            </div>
                            <p v-else class="text-sm text-gray-500">Nenhum documento foi anexado.</p>
                        </div>

                        <div v-if="resources[0].respostas && resources[0].respostas.length > 0" class="bg-white p-4 rounded-md border">
                            <h3 class="text-lg font-bold mb-2">Respostas</h3>
                            <div v-for="resposta in resources[0].respostas" :key="resposta.id" class="pt-3 mt-3 border-t first:mt-0 first:pt-0 first:border-t-0">
                                <a v-if="resposta.arquivo_pdf" :href="resposta.arquivo_pdf" download target="_blank" class="inline-flex items-center gap-2 font-semibold text-green-700 hover:underline">
                                    <PaperClipIcon class="w-5 h-5" /><span>Baixar Resposta Oficial em PDF</span>
                                </a>
                                <p class="text-xs text-gray-500 mt-2">Respondido por: {{ resposta.autor_nome }} em {{ formatDate(resposta.created_at) }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { UserIcon, PencilSquareIcon, ChatBubbleBottomCenterTextIcon, PaperClipIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
import Whiteboard from "@/components/Whiteboard/Whiteboard.vue";

import Badge from "@/components/Badges/Badges.vue";

import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    name: "Status",
    components: { UserIcon, Whiteboard, Badge, PencilSquareIcon, ChatBubbleBottomCenterTextIcon, PaperClipIcon, ChevronDownIcon },
    setup() {
        const resources = ref([]);
        const isLoading = ref(true);
        const error = ref(null);
        const isDetailsExpanded = ref(false);
        
         function toggleDetails() {
            isDetailsExpanded.value = !isDetailsExpanded.value;
        }
        
        const formatDate = (dateString) => {
            if (!dateString) return 'Data não informada';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        };
        

        const downloadAuthenticatedFile = async (doc) => {
            try {
                const accessToken = localStorage.getItem('accessToken');
                if (!accessToken) return;

                const response = await axios({
                    url: doc.download_url, 
                    method: 'GET',
                    responseType: 'blob',
                    headers: { 'Authorization': `Bearer ${accessToken}` }
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


        const fetchResourceStatus = async () => {
            isLoading.value = true;
            error.value = null;
            try {
                const response = await axios.get('/recursos/meu-status/', {
                     headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                resources.value = response.data;
            } catch (err) {
                if (err.response && err.response.status === 404) {

                    resource.value = []; 
                } else {
                    console.error("Erro ao buscar status do recurso:", err);
                    error.value = "Não foi possível carregar os dados. Por favor, tente recarregar a página.";
                }
            } finally {
                isLoading.value = false;
            }
        };
        
        onMounted(fetchResourceStatus);

        return {
            resources,
            isLoading,
            error,
            formatDate,
            isDetailsExpanded, 
            toggleDetails,    
            downloadAuthenticatedFile 
        };
    }
};
</script>