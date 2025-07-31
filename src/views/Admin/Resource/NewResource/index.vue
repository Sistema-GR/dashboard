<template>
    <Whiteboard title="Novos Recursos" class="" :isSidebarMinimized="isSidebarMinimized" :hideBreadcrumbs="true">
      <div class="flex flex-col w-full lg:flex-row">

            <div class="flex-1 rounded-[10px] shadow-lg">

                <div class="flex items-center justify-center bg-[#6fa3ef] p-4">
                    <p class="text-20 font-bold text-white">Novos</p>
                </div>

                <div class="flex items-center justify-end p-3 px-4 sm:px-10">
                    <div class="flex items-center gap-2 text-black cursor-pointer" @click="toggleFilter">
                        <FunnelIcon class="w-5 h-5" />
                        <span class="text-15 text-black">Filtrar</span>
                    </div>
                </div>

                <!-- Painel de filtros -->
                <!-- <div v-if="showFilter" class="bg-gray-50 border-t border-gray-200 p-4 mx-3 mb-3 rounded-[10px]">
                    <div class="space-y-3">
                        <div>
                            <label class="block text-15 font-medium text-gray-700 mb-1">Status</label>
                            <select v-model="filters.status" class="w-full p-2 border border-gray-300 rounded-md text-15">
                                <option value="">Todos</option>
                                <option value="aberto">Aberto</option>
                                <option value="em_analise">Em Análise</option>
                                <option value="finalizado">Finalizado</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-15 font-medium text-gray-700 mb-1">Data</label>
                            <input v-model="filters.date" type="date" class="w-full p-2 border border-gray-300 rounded-md text-15">
                        </div>
                        <div class="flex gap-2">
                            <button @click="applyFilter" class="px-4 py-2 bg-blue-500 text-white rounded-md text-15 hover:bg-blue-600">
                                Aplicar
                            </button>
                            <button @click="clearFilter" class="px-4 py-2 bg-gray-500 text-white rounded-md text-15 hover:bg-gray-600">
                                Limpar
                            </button>
                        </div>
                    </div>
                </div> -->

                <div class="mt-1 my-5 space-y-4 px-4 sm:px-10">
                    <infoCard situation="Novo" />
                    <infoCard situation="Novo" />
                    <infoCard situation="Novo" />
                </div>

            </div>

        </div>
    </Whiteboard>
</template>
<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import infoCard from '@/views/Admin/Resource/components/infoCard/index.vue'
import { FunnelIcon } from "@heroicons/vue/24/outline";
import { inject, ref, reactive } from 'vue';

export default {
    components: {infoCard, Whiteboard, FunnelIcon},
    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized', ref(false))
        const showFilter = ref(false)
        
        const filters = reactive({
            status: '',
            date: ''
        })

        function toggleFilter() {
            showFilter.value = !showFilter.value
        }

        function applyFilter() {
            // Aqui você pode implementar a lógica de filtro
            console.log('Filtros aplicados:', filters)
            // Exemplo: chamar uma API com os filtros ou filtrar uma lista existente
            showFilter.value = false
        }

        function clearFilter() {
            filters.status = ''
            filters.date = ''
            // Aqui você pode resetar os dados para o estado original
            console.log('Filtros limpos')
        }

        return {
            isSidebarMinimized,
            showFilter,
            filters,
            toggleFilter,
            applyFilter,
            clearFilter
        }
    }
}
</script>