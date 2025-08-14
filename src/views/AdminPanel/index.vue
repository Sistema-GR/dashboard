<template>
    <Whiteboard :title="titulo" :isSidebarMinimized="isSidebarMinimized">
        <div class="flex flex-row w-full items-center gap-3 justify-between px-4 sm:px-10 mt-4">
            <Search @search="handleSearch" />
            <div v-if="selectedRoute == 'Frequency'" class="flex flex-row items-center  gap-1 w-full max-w-64 cursor-pointer">
               <p class="text-gray-800 font-medium hover:text-blue-900" @click="handleRouteUpdate('Infrequency')">Dados de Infrequência</p>
            </div>
        </div>   
        <div class="w-full pb-5 capitalize">        
            <PrimaryTable :route="selectedRoute" :searchQuery="searchQuery" />
        </div>
    </Whiteboard>

    <Sidebar :route="selectedRoute"
             @update:isSidebarMinimized="handleSidebarMinimized"
             @update:route="handleRouteUpdate" />
</template>

<script>
import { ref, provide } from 'vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import TextInput from '@/components/Inputs/TextInput.vue';
import PrimaryTable from '@/components/Table/PrimaryTable.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Search from '@/components/Search/Search.vue';
import Pagination from '@/components/Pagination/Pagination.vue';

export default {
    name: "AdminPanel",
    components: {Sidebar, Whiteboard, PrimaryTable, TextInput, Search, Pagination},

    setup() {
    const isSidebarMinimized = ref(false)
    const searchQuery = ref('');
    const selectedRoute = ref('Report') // default
    const titulo = ref('Admin Panel') // default
    const handleSearch = (query) => {
        searchQuery.value = query
    }
    function handleSidebarMinimized(value) {
      isSidebarMinimized.value = value
    }
    function handleRouteUpdate(newRoute) {
      selectedRoute.value = newRoute
      // Optionally map route to page title
      titulo.value = routeToTitle(newRoute)
    }
    function routeToTitle(route) {
      const map = {
        'Results': 'Resultados IDEM',
        'Calendar': 'Calendário Escolar',
        'Profissional': 'Profissionais',
        'Groups': 'Turmas',
        'Steps': 'Etapas Ues',
        'StageGroup': 'Etapas Por Grupo',
        'Frequency': 'Frequência',
        'Infrequency': 'Infrequência',
        'Resignation': 'Demissão',
        'Activities': 'Atividades',
        'Service': 'Tempo de Atuação',
        'Training': 'Formação',
        'Report': 'Relatórios Finais',
      }
      return map[route] || 'Page'
    }
    provide('isSidebarMinimized', isSidebarMinimized)

    return {
      handleSidebarMinimized,
      isSidebarMinimized,
      searchQuery,
      handleSearch,
      selectedRoute,
      titulo,
      handleRouteUpdate,
    }
  }
}  
</script>
