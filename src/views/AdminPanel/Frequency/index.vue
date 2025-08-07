<template>
    <Whiteboard title="Frequência" :isSidebarMinimized="isSidebarMinimized">

        <div class="flex flex-row w-full items-center gap-3 justify-between px-4 sm:px-10 mt-4">
            <Search @search="handleSearch" />
            <div class="flex flex-row items-center  gap-1 w-full max-w-64 cursor-pointer">
               <p class="text-gray-800 font-medium hover:text-blue-900" @click="navigateTo('infrequency')">Dados de Infrequência</p>
            </div>
        </div>   

        <div class="w-full pb-5 capitalize">
             <PrimaryTable :route="'Frequency'" :searchQuery="searchQuery"/>
        </div>

    </Whiteboard>
    
</template>

<script>
import TextInput from '@/components/Inputs/TextInput.vue';
import PrimaryTable from '@/components/Table/PrimaryTable.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Search from '@/components/Search/Search.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router';

export default {
    name: "Frequência",
    components: {Whiteboard, PrimaryTable, TextInput, Search, Pagination},

    setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')
    const searchQuery = ref('');
    const handleSearch = (query) => {
        searchQuery.value = query
    }

    const router = useRouter()

    function navigateTo(route) {
        router.push(route)
    }

    return {
      isSidebarMinimized,
      searchQuery,
      handleSearch,
      navigateTo
    }
  }
}
</script>