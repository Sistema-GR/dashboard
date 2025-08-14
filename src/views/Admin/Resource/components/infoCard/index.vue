<template>
    <div class="w-full bg-[#e3f0ff] border rounded-[10px] p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <!-- Layout Desktop/Tablet -->
        <div class="hidden md:flex items-center justify-between w-full">
            <router-link class="flex items-center justify-between w-full gap-4" :to="`/resource/info/${recurso.id}`">
                <!-- Avatar e informações do usuário -->
                <div class="flex items-center gap-4 flex-shrink-0">
                    <div class="flex-shrink-0">
                        <div class="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center">
                            <UserIcon class="w-12 h-12 lg:w-14 lg:h-14 text-[#003965]"/>
                        </div>
                    </div>
                    
                    <div class="flex flex-col">
                        <h3 class="text-sm lg:text-15 font-bold text-black mb-1">{{ recurso.nome_completo }}</h3>
                        <p class="text-sm lg:text-15 text-black">Matrícula: {{ recurso.matricula }}</p>
                    </div>
                </div>


                <!-- Motivo centralizado -->
                <div class="flex flex-col items-center flex-grow">
                    <p class="text-sm lg:text-15 font-bold text-black mb-1">Motivo</p>
                    <Badges v-if="recurso.criterios_selecionados && recurso.criterios_selecionados.length" :text="recurso.criterios_selecionados[0]" />
                    <span v-else class="text-sm lg:text-15 text-gray-500">-</span>
                </div>

                <!-- Data de abertura -->
                <div class="flex flex-col items-end flex-shrink-0">
                    <p class="text-sm lg:text-15 font-medium text-black mb-1">Aberto em</p>
                    <p class="text-sm lg:text-15 text-black">{{ new Date(recurso.created_at).toLocaleDateString() }}</p>
                </div>
            </router-link>

            <!-- Menu de ações -->
            <div v-if="possibleStatuses.length > 0" class="relative ml-4 flex-shrink-0">
                <button @click="isMenuOpen = !isMenuOpen" class="p-2 rounded-full hover:bg-black/10 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 lg:w-6 lg:h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                    </svg>
                </button>
                
                <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-60 border">
                    <p class="px-4 py-2 text-sm text-gray-500 border-b">Alterar status para:</p>
                    
                    <ul>
                        <li v-for="status in possibleStatuses" :key="status.key" @click="changeStatus(status.key)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                            {{ status.label }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>


        <!-- Layout Mobile -->
        <div class="md:hidden">
            <router-link :to="`/resource/info/${recurso.id}`" class="block">
                <!-- Primeira linha: Avatar, Nome e Menu -->
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <div class="flex-shrink-0">
                            <div class="w-12 h-12 flex items-center justify-center">
                                <UserIcon class="w-12 h-12 text-[#003965]"/>
                            </div>
                        </div>
                        
                        <div class="flex flex-col">
                            <h3 class="text-sm font-bold text-black mb-1">{{ recurso.nome_completo }}</h3>
                            <p class="text-xs text-black">Mat: {{ recurso.matricula }}</p>
                        </div>
                    </div>

                    <!-- Menu de ações mobile -->
                    <div v-if="possibleStatuses.length > 0" class="relative flex-shrink-0" @click.stop>
                        <button @click="isMenuOpen = !isMenuOpen" class="p-2 rounded-full hover:bg-black/10 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                            </svg>
                        </button>
                        
                        <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-60 border">
                            <p class="px-3 py-2 text-xs text-gray-500 border-b">Alterar status:</p>
                            
                            <ul>
                                <li v-for="status in possibleStatuses" :key="status.key" @click="changeStatus(status.key)" class="px-3 py-2 hover:bg-gray-100 cursor-pointer text-xs">
                                    {{ status.label }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Segunda linha: Motivo e Data -->
                <div class="flex items-center justify-between">
                    <div class="flex flex-col">
                        <p class="text-xs font-bold text-black mb-1">Motivo</p>
                        <div class="text-xs">
                            <Badges v-if="recurso.criterios_selecionados && recurso.criterios_selecionados.length" :text="recurso.criterios_selecionados[0]" />
                            <span v-else class="text-gray-500">-</span>
                        </div>
                    </div>

                    <div class="flex flex-col items-end">
                        <p class="text-xs font-medium text-black mb-1">Aberto em</p>
                        <p class="text-xs text-black">{{ new Date(recurso.created_at).toLocaleDateString() }}</p>
                    </div>
                </div>
            </router-link>
        </div>
    
</template>

<script>
import { ref, computed, onMounted, watch  } from 'vue';
import { UserIcon, ExclamationTriangleIcon } from "@heroicons/vue/24/outline";
import Badges from '@/components/Badges/Badges.vue';
import { STATUS_DEFINITIONS } from '@/config/resourceConstants.js';
import axios from 'axios';

export default {
    name: "infoCard",
    components: { UserIcon, Badges, ExclamationTriangleIcon },
    props: {
        recurso: {
            type: Object,
            required: true
        }
    },
    emits: ['status-updated', 'responsavel-updated'],
    setup(props, { emit }) {
        const isMenuOpen = ref(false);
        const isHoveringBadges = ref(false);

        const remainingBadgesCount = computed(() => {
            if (!props.recurso?.criterios_selecionados || props.recurso.criterios_selecionados.length <= 1) {
                return 0;
            }
            return props.recurso.criterios_selecionados.length - 1;
        });

        const allStatusesList = Object.entries(STATUS_DEFINITIONS).map(([key, value]) => ({
            key: key,
            label: value.label
        }));

        const possibleStatuses = computed(() => {
            const currentStatus = props.recurso?.status;
            if (!currentStatus) {
                return [];
            }
            
            const result = allStatusesList.filter(s => s.key !== currentStatus);
            return result;
        });

        const staffList = ref([]);
        const selectedResponsavelId = ref(props.recurso.responsavel);
        watch(() => props.recurso.responsavel, (newId) => {
            selectedResponsavelId.value = newId;
        });
        
        async function fetchStaffUsers() {
            try {
                const response = await axios.get('/auth/staff-users/', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                staffList.value = response.data;
            } catch (err) {
                console.error("Erro ao buscar lista de administradores:", err);
            }
        }

        onMounted(() => {
            fetchStaffUsers();
        });

 
        async function updateResponsavel() {

            const userId = selectedResponsavelId.value;

            try {
                const response = await axios.patch(`/recursos/${props.recurso.id}/`, { responsavel: userId }, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                emit('responsavel-updated', response.data);


            } catch (err) {
                console.error("Erro ao atribuir responsável:", err);
                alert("Não foi possível atualizar o responsável.");
                selectedResponsavelId.value = props.recurso.responsavel;
            }
        }

        function changeStatus(newStatus) {
            emit('status-updated', { recursoId: props.recurso.id, newStatus: newStatus });
            isMenuOpen.value = false;
        }

        return {
            isMenuOpen,
            possibleStatuses,
            changeStatus,
            isHoveringBadges,
            remainingBadgesCount,
            selectedResponsavelId,
            staffList,
            updateResponsavel,
        };
    }
}
</script>