<template>
    <Whiteboard title="Etapas Ues" :isSidebarMinimized="isSidebarMinimized">
        <div class="flex w-full items-start justify-start px-4 sm:px-10 mt-4">
            <Search @search="handleSearch" />
        </div>   

        <div class="w-full pb-5 capitalize">
            <PrimaryTable :route="'Steps'" :searchQuery="searchQuery" />
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

export default {
    name: "Resultados IDEM",
    components: {Whiteboard, PrimaryTable, TextInput, Search, Pagination},

    setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')

    const searchQuery = ref('')

    const handleSearch = (query) => {
        searchQuery.value = query
    }

    return {
      isSidebarMinimized,
      searchQuery,
      handleSearch
    }
  }
}
</script>