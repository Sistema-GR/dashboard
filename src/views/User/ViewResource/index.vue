<template>

    <Whiteboard :title="`Detalhes do Recurso #${resourceId}`" :isSidebarMinimized="isSidebarMinimized">
        
        
        <div v-if="isLoading" class="text-center p-10">
            <p class="text-gray-600">Buscando detalhes do recurso...</p>
        </div>

        
        <div v-else-if="error" class="text-center p-10 bg-red-50 border border-red-200 rounded-[10px]">
            <p class="text-red-700 font-semibold">{{ error }}</p>
        </div>

        
        <div v-else class="flex flex-col w-full gap-5 px-4 sm:px-10 py-8 pb-10 relative z-0">
            
            
            <div class="flex justify-end">
                <router-link :to="{ name: 'edit', params: { id: resourceId } }">
                    <button class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600 transition-colors">
                        <PencilSquareIcon class="w-5 h-5 mr-2" />
                        Editar Recurso
                    </button>
                </router-link>
            </div>

           
            <div class="bg-white p-4 rounded-[10px] shadow-sm border relative z-10">
                <h2 class="text-20 font-bold mb-4 border-b pb-2">Informações do Recurso</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-15">
                    <div><strong>Protocolo:</strong> #{{ resource.id }}</div>
                    <div><strong>Status:</strong> <span class="capitalize font-semibold">{{ (resource.status || '').replace('_', ' ') }}</span></div>
                    <div><strong>Nome Completo:</strong> {{ resource.nome_completo }}</div>
                    <div><strong>Matrícula:</strong> {{ resource.matricula }}</div>
                    <div><strong>CPF:</strong> {{ resource.cpf }}</div>
                    <div><strong>Email:</strong> {{ resource.email }}</div>
                    <div><strong>Unidade de Atuação:</strong> {{ resource.unidade_atuacao }}</div>
                    <div><strong>Data de Abertura:</strong> {{ formatDate(resource.created_at) }}</div>
                </div>
            </div>
            
            <div class="bg-white p-4 rounded-[10px] shadow-sm border">
                <h3 class="text-20 font-bold mb-2">Descrição</h3>
                <p class="text-gray-700 whitespace-pre-wrap">{{ resource.descricao }}</p>
            </div>

            
            <div class="bg-white p-4 rounded-[10px] shadow-sm border">
                <h3 class="text-20 font-bold mb-2">Motivo do Recurso</h3>
                <p class="text-15 text-gray-500">A ser categorizado pelo responsável.</p>
            </div>

           
            <div class="bg-white p-4 rounded-[10px] shadow-sm border">
                <h3 class="text-20 font-bold mb-2">Documentos Anexados</h3>
                <div v-if="resource.documentos && resource.documentos.length > 0" class="space-y-2">
                    <a v-for="doc in resource.documentos" :key="doc.id" :href="doc.arquivo_url" download @click.stop class="flex items-center gap-2 p-2 rounded-[10px] bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors">
                        <PaperClipIcon class="w-5 h-5" />
                        <span class="underline">{{ doc.arquivo.split('/').pop() }}</span>
                    </a>
                </div>
                <p v-else class="text-15 text-gray-500">Nenhum documento foi anexado a este recurso.</p>
            </div>

        </div>
    </Whiteboard>
</template>

<script>
import { inject, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';


import Whiteboard from "@/components/Whiteboard/Whiteboard.vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import { UserIcon, PencilSquareIcon, PaperClipIcon } from "@heroicons/vue/24/outline";

export default {
    name: "ResourceView",
    components: { 
        Whiteboard, 
        PrimaryButton, 
        UserIcon, 
        PencilSquareIcon, 
        PaperClipIcon 
    },
    
    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');
        const route = useRoute(); 
        const resourceId = route.params.id; 

        const resource = ref(null);
        const isLoading = ref(true);
        const error = ref(null);

        const formatDate = (dateString) => {
            if (!dateString) return 'N/A';
            return new Date(dateString).toLocaleDateString('pt-BR', {
                year: 'numeric', month: 'long', day: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        };
        
        const fetchResourceDetails = async () => {
            isLoading.value = true;
            error.value = null;
            try {
                const response = await axios.get(`/recursos/${resourceId}/`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                resource.value = response.data;
            } catch (err) {
                console.error("Erro ao buscar detalhes do recurso:", err);
                error.value = "Não foi possível carregar os detalhes deste recurso. Verifique se ele existe e se você tem permissão para visualizá-lo.";
            } finally {
                isLoading.value = false;
            }
        };

        onMounted(fetchResourceDetails);

        return {
            isSidebarMinimized,
            resource,
            resourceId,
            isLoading,
            error,
            formatDate
        };
    }
};
</script>