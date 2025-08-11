<template>
    <div class="['relative flex items-center justify-between w-full bg-[#e3f0ff] border rounded-[10px] p-4 shadow-sm hover:shadow-md transition-shadow duration-200', { 'z-10': isMenuOpen }]">
        
        <div v-if="recurso.is_overdue" class="absolute top-2 left-2" title="Este recurso está com o prazo de resposta vencido!">
            <ExclamationTriangleIcon class="w-6 h-6 text-yellow-500" />
        </div>
        
        <router-link class="flex-grow flex gap-4 items-center" :to="`/resource/info/${recurso.id}`">
            <!-- ... seu conteúdo de card dinâmico ... -->
            <div class="flex-shrink-0">
                <div class="w-14 h-14 flex items-center justify-center">
                    <UserIcon class="w-14 h-14 text-[#003965]"/>
                </div>
            </div>
            
            <div class="flex flex-col">
                <h3 class="text-15 font-bold text-black mb-1">{{ recurso.nome_completo }}</h3>
                <p class="text-15 text-black">Matrícula: {{ recurso.matricula }}</p>
            </div>

            <div class="flex flex-col items-center ml-auto">
                <p class="text-15 font-bold text-black mb-1">Motivo</p>

                
                <div v-if="recurso.criterios_selecionados && recurso.criterios_selecionados.length"
                    class="relative flex items-center gap-2"
                    @mouseenter="isHoveringBadges = true"
                    @mouseleave="isHoveringBadges = false"
                >
                    
                    <Badges :text="recurso.criterios_selecionados[0]" />

                    
                    <div v-if="remainingBadgesCount > 0" 
                        class="flex items-center justify-center h-5 w-5 bg-gray-300 text-gray-700 text-xs font-bold rounded-full">
                        +{{ remainingBadgesCount }}
                    </div>

                    
                    <Transition
                        enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95"
                        enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95"
                    >
                        <div v-if="isHoveringBadges"
                            class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-gray-800 text-white rounded-md shadow-lg z-30">
                            <ul class="space-y-1">
                                <li v-for="criterio in recurso.criterios_selecionados" :key="criterio">
                                    <span class="text-sm">{{ criterio }}</span>
                                </li>
                            </ul>
                            
                            <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-800"></div>
                        </div>
                    </Transition>
                </div>
                
                
                <span v-else class="text-15 text-gray-500">-</span>
            </div>


            <div class="flex flex-col items-end ml-4">
                <p class="text-15 font-medium text-black mb-1">Aberto em</p>
                <p class="text-15 text-black">{{ new Date(recurso.created_at).toLocaleDateString() }}</p>
            </div>
        </router-link>
            <div class="flex justify-between items-start gap-4">
                <div class="flex-grow">
                    <div class="flex flex-col items-center ml-auto">
                        <p class="text-15 font-bold text-black mb-1">Responsável</p>
                        
                        <span v-if="recurso.responsavel_nome" class="text-15 text-gray-700 font-semibold">
                            {{ recurso.responsavel_nome }}
                        </span>

                                <select v-model="selectedResponsavelId"  @change="updateResponsavel" class="w-36 text-xs border rounded px-1 py-0.5"  @click.stop>
                                    <option :value="null">Selecione...</option>
                                    <option v-for="staff in staffList" :key="staff.id" :value="staff.id">
                                        {{ staff.full_name }}
                                    </option>
                                </select>
                    </div>
                </div>
            </div>  
        </div>
            

        <div v-if="possibleStatuses.length > 0" class="relative ml-4 flex-shrink-0">
            <button @click="isMenuOpen = !isMenuOpen" class="p-2 rounded-full hover:bg-black/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                </svg>
            </button>
            <Transition
                enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95"
                enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75"
                leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95"
            >
            <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-20 border">
                <p class="px-4 py-2 text-sm text-gray-500 border-b">Alterar status para:</p>
            
                <ul>
                    <li v-for="status in possibleStatuses" :key="status.key" @click="changeStatus(status.key)" class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm">
                        {{ status.label }}
                    </li>
                </ul>
            </div>
            </transition>
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