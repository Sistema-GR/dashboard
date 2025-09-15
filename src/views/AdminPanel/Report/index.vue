<template>
    <Whiteboard :title="titulo" >
        <div class="flex flex-row w-full items-center gap-3 justify-between px-4 sm:px-10 mt-4">
            <Search 
              :columns="filterableColumns"
              @search="handleSearch"
            />
            <div v-if=" sidebarStore.reportPage == 'Frequency'" class="flex flex-row items-center  gap-1 w-full max-w-64 cursor-pointer">
               <p class="text-gray-800 font-medium hover:text-blue-900" @click="sidebarStore.setReportPage('Infrequency')">Dados de Infrequência</p>
            </div>
        </div>   
        <div class="w-full pb-5 capitalize">        
            <PrimaryTable 
              :route="sidebarStore.reportPage"
              :searchQuery="searchQuery"
              :searchCriteria="searchCriteria"
              @columns-loaded="handleColumnsLoaded"
            />
        </div>
    </Whiteboard>
</template>

<script>
import { ref, computed } from 'vue'
import { useSidebarStore } from '@/stores/sidebarStore';
import TextInput from '@/components/Inputs/TextInput.vue';
import PrimaryTable from '@/components/Table/PrimaryTable.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Search from '@/components/Search/Search.vue';
import Pagination from '@/components/Pagination/Pagination.vue';

export default {
    name: "AdminPanel",
    components: { Whiteboard, PrimaryTable, TextInput, Search, Pagination},

    setup() {
    const searchCriteria = ref({ query: '', column: 'all' });
    const filterableColumns = ref([]);
    const selectedRoute = ref('Report')
    const titulo = ref('Admin Panel')

    const handleSearch = (criteria) => {
            searchCriteria.value = criteria
    }

    const handleColumnsLoaded = (columns) => {
            filterableColumns.value = columns;
    }

    function handleRouteUpdate(newRoute) {
      selectedRoute.value = newRoute
      titulo.value = routeToTitle(newRoute)
      filterableColumns.value = [];
    }

    const sidebarStore = useSidebarStore();
    const searchQuery = ref('');
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
    const titulo = computed(() => map[sidebarStore.reportPage] || 'Page')
    const handleSearch = (query) => {
        searchQuery.value = query
    }
    return {
      searchCriteria,
      filterableColumns,
      handleSearch,
      handleColumnsLoaded,
      selectedRoute,
      titulo,
      sidebarStore,
    }
  }
}  
</script>