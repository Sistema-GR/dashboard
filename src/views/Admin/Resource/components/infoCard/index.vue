<template>
    <div class="flex items-center justify-between w-full bg-[#e3f0ff] border rounded-[10px] p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
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

            <div class="flex flex-col  items-center ml-auto">
                <p class="text-15 justify-between font-bold text-black mb-1">Motivo</p>
                
                    <Badges v-if="recurso.criterios_selecionados && recurso.criterios_selecionados.length" :text="recurso.criterios_selecionados[0]" />
                    <span v-else class="text-15 text-gray-500">-</span>
                
                
            </div>

            <div class="flex flex-col items-end ml-4">
                <p class="text-15 font-medium text-black mb-1">Aberto em</p>
                <p class="text-15 text-black">{{ new Date(recurso.created_at).toLocaleDateString() }}</p>
            </div>
        </router-link>


        <div v-if="possibleStatuses.length > 0" class="relative ml-4 flex-shrink-0">
            <button @click="isMenuOpen = !isMenuOpen" class="p-2 rounded-full hover:bg-black/10 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
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
</template>

<script>
import { ref, computed, watch } from 'vue';
import { UserIcon } from "@heroicons/vue/24/outline";
import Badges from '@/components/Badges/Badges.vue';
import { STATUS_DEFINITIONS } from '@/config/resourceConstants.js';

export default {
    name: "infoCard",
    components: { UserIcon, Badges },
    props: {
        recurso: {
            type: Object,
            required: true
        }
    },
    emits: ['status-updated'],
    setup(props, { emit }) {
        const isMenuOpen = ref(false);

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

        watch(() => props.recurso, (newVal, oldVal) => {
            console.log(`--- WATCH: A prop 'recurso' para o ID ${newVal.id} mudou! ---`);
            console.log("Valor antigo:", oldVal);
            console.log("Novo valor:", newVal);
        }, { deep: true });


        function changeStatus(newStatus) {
            emit('status-updated', { recursoId: props.recurso.id, newStatus: newStatus });
            isMenuOpen.value = false;
        }

        return {
            isMenuOpen,
            possibleStatuses,
            changeStatus
        };
    }
}
</script>