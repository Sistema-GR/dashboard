<template>

    <Sidebar :route="'admin'" @update:isSidebarMinimized="handleSidebarMinimized" class="z-50"/>
    <Whiteboard :title="`Detalhes do Recurso #${resourceId}`" class="!overflow-visible overflow-y-auto z-40 relative" :isSidebarMinimized="isSidebarMinimized" >

        <div v-if="isLoading" class="text-center p-10">Carregando dados...</div>
        <div v-else-if="error" class="text-center p-10 text-red-500">{{ error }}</div>
        
        <div v-else-if="recurso">

            <div v-if="recurso.is_overdue" class="w-full p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex items-center gap-3">
                <ExclamationTriangleIcon class="w-6 h-6" />
                    <p class="font-bold">Atenção: O prazo de resposta para este recurso está vencido.</p>
            </div>
            
             <div class="flex w-full justify-between items-center border rounded-[10px] p-4 shadow-md bg-white">
              <div class="flex items-center">
                <UserIcon class="w-14 h-14 text-[#003965] mr-3" />
                <div>
                  <p class="text-15 font-semibold text-gray-900">{{ recurso.nome_completo }}</p>
                  <p class="text-15 text-gray-600">{{ recurso.matricula }}</p>
                </div>
              </div>
              
              <div class="relative">
                <button @click="isBadgeDropdownOpen = !isBadgeDropdownOpen" class="flex items-center space-x-2">
                    <span>Alterar Categoria</span><ChevronDownIcon class="w-5 h-auto" />
                </button>
                <div v-if="isBadgeDropdownOpen" class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto">
                    <ul>
                      <li v-for="motivo in todosMotivos" :key="motivo.text" @click="toggleCriterio(motivo.text)" class="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center">
                        <input type="checkbox" :checked="recurso.criterios_selecionados.includes(motivo.text)" class="mr-2">
                        <Badges :text="motivo.text" />
                      </li>
                    </ul>
                </div>
              </div>
            </div>

            <div class="flex flex-col w-full py-4 mt-3 p-4 bg-white border rounded-[10px] shadow-lg">
                <p class="text-15 font-bold mb-2">Dados do Servidor</p>
                <div class="space-y-2 text-sm">
                    <div><strong>CPF:</strong> {{ recurso.cpf }}</div>
                    <div><strong>Email:</strong> {{ recurso.email }}</div>
                    <div><strong>Unidade:</strong> {{ recurso.unidade_atuacao }}</div>
                    <div><strong>Aberto em:</strong> {{ new Date(recurso.created_at).toLocaleString() }}</div>
                </div>
            </div>

            <div class="flex flex-col w-full mt-5 p-4 bg-white border rounded-[10px] shadow-lg">
                <p class="text-15 font-bold mb-2">Descrição do Usuário</p>
                <p>{{ recurso.descricao }}</p>
                <p class="text-15 font-bold mt-4 mb-2">Categorias Atuais</p>
                <div v-if="recurso.criterios_selecionados && recurso.criterios_selecionados.length" class="flex flex-wrap gap-2">
                    <Badges v-for="criterio in recurso.criterios_selecionados" :key="criterio" :text="criterio" />
                </div>
                <p v-else class="text-sm text-gray-500">Nenhuma categoria definida.</p>
            </div>

            <div v-if="recurso.documentos && recurso.documentos.length > 0" 
                class="flex flex-col w-full mt-5 p-4 bg-white border rounded-[10px] shadow-lg">
                <p class="text-15 font-bold mb-2">Documentos Anexados</p>
                <ul class="space-y-2">

                    <li v-for="doc in recurso.documentos" :key="doc.id">

                        <a @click.prevent="downloadAuthenticatedFile(doc)" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        class="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline transition-colors text-sm cursor-pointer">
                        <PaperClipIcon class="w-4 h-4" />
                        <span>{{ getFilename(doc.arquivo) }}</span>
                        </a>
                    </li>
                </ul>
            </div>


            <div class="flex flex-col items-center w-full mt-5 p-4 bg-white border rounded-[10px] shadow-lg">
                <div class="flex flex-row w-full justify-between">
                    <p class="text-15 font-bold">Responder Recurso</p>
                    <button @click="isReportResponseOpen = !isReportResponseOpen" class="bg-blue-500 text-white py-2 px-4 rounded-md">Responder</button>
                </div>
                <div class="flex flex-col w-full py-2 mt-2" v-if="isReportResponseOpen">
                    <textarea v-model="newResponseText" rows="5" class="w-full border rounded-md p-2 mb-4"></textarea>
                    <button @click="submitReportResponse" class="bg-green-500 text-white py-2 px-4 rounded-md w-auto self-end">Enviar Resposta</button>
                </div>
            </div>
            
            <div v-if="recurso.respostas && recurso.respostas.length" class="flex flex-col w-full mt-5 p-4 bg-white border rounded-[10px] shadow-lg">
              <p class="text-15 font-bold mb-2">Histórico de Respostas</p>
              <ul>
                <li v-for="response in recurso.respostas" :key="response.id" class="border-b py-2">
                  <p>{{ response.texto }}</p>
                  <p class="text-xs text-gray-500 mt-1">Por: {{ response.autor_nome }} em {{ new Date(response.created_at).toLocaleString() }}</p>
                    <button @click="deleteResponse(response.id)" 
                            class="flex-shrink-0 p-2 rounded-full hover:bg-red-100 text-red-500 transition-colors"
                            title="Deletar esta resposta">
                    <TrashIcon class="w-5 h-5" />
                    </button>
                </li>
              </ul>
            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import Badges from '@/components/Badges/Badges.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { UserIcon, ChevronDownIcon, TrashIcon, ExclamationTriangleIcon, PaperClipIcon  } from "@heroicons/vue/24/outline";
import { MOTIVOS_RECURSO } from '@/config/resourceConstants.js';
import Sidebar from '@/components/Sidebar/Sidebar.vue';

export default {
    name: "InfoDetails",
    components: { Whiteboard, UserIcon, Badges, ChevronDownIcon, Sidebar, TrashIcon, ExclamationTriangleIcon, PaperClipIcon },
    
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
            deleteResponse,
            getFilename,
            downloadAuthenticatedFile,
        };
    }
};
</script>