<template>
    <Whiteboard title="Status dos Meus Recursos" :isSidebarMinimized="isSidebarMinimized">

        <div v-if="isLoading" class="text-center p-10">
            <p class="text-gray-600">Buscando seus recursos...</p>
        </div>

        
        <div v-else-if="error" class="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-700 font-semibold">{{ error }}</p>
        </div>

       
        <div v-else-if="resource.length === 0" class="text-center p-10">
             <p class="text-gray-700">Você ainda não abriu nenhum recurso.</p>
             <router-link :to="{name: 'form'}" class="text-blue-600 hover:underline mt-2 inline-block">
                Clique aqui para abrir seu primeiro recurso.
             </router-link>
        </div>
        
        <div v-else class="flex flex-col w-full gap-4 px-4">
            <div v-for="resource in resource" :key="resource.id" class="flex flex-col items-center justify-start w-full bg-white border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div class="w-full">
                    <div class="flex items-center justify-between w-full pb-3 border-b mb-4">
                        <p class="text-lg font-semibold text-gray-700 capitalize">{{ (resource.status || 'aguardando_resposta').replace('_', ' ') }}</p>
                        <router-link class="w-full cursor-pointer" :to="{ name: 'edit', params: { id: resource.id } }">
                            <!-- <p class="group-hover:text-black text-sm">Editar</p>
                            <PencilSquareIcon class="w-5 h-auto stroke-black" /> -->
                        </router-link>
                    </div>

                    <router-link class="w-full cursor-pointer" :to="{ name: 'view', params: { id: resource.id } }">
                        <div class="flex w-full gap-4">
                            <div class="p-2 bg-gray-100 rounded-lg">
                                <UserIcon class="w-16 h-16 text-gray-400"/>
                            </div>
                            <div class="flex flex-row items-center justify-between w-full">
                                <div class="flex flex-col gap-2">
                                    <p class="text-base font-medium text-gray-800">{{ resource.nome_completo }}</p>
                                    <p class="text-sm text-gray-600">{{ resource.descricao }}</p>
                                </div>
                                <div class="flex flex-col items-end gap-2.5">
                                    
                                    <div class="flex flex-col items-end gap-2">
                                       
                                        <div class="flex flex-wrap justify-end gap-1">
                                            
                                            <Badge text="Geral"/>
                                            
                                        </div>
                                        <p class="text-sm font-semibold text-gray-500">{{ formatDate(resource.created_at) }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>

        </div>
    </Whiteboard>
</template>

<script>
import { UserIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import Whiteboard from "@/components/Whiteboard/Whiteboard.vue";

import Badge from "@/components/Badges/Badges.vue";

import { inject, ref, onMounted } from 'vue';
import axios from 'axios';

export default {
    name: "Status",
    components: { UserIcon, Whiteboard, Badge, PencilSquareIcon },
    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');

        const resource = ref([]);

        const isLoading = ref(true);
        const error = ref(null);

        
        const formatDate = (dateString) => {
            if (!dateString) return 'Data não informada';
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR');
        };
        
        const fetchResourceStatus = async () => {
            isLoading.value = true;
            error.value = null;
            try {


                const response = await axios.get('/recursos/meu-status/', {
                     headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                resource.value = response.data;
            } catch (err) {
                if (err.response && err.response.status === 404) {

                    resource.value = null; 
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
            isSidebarMinimized,
            resource,
            isLoading,
            error,
            formatDate
        };
    }
};
</script>