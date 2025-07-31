<template>
    <Whiteboard title="Resultados IDEM" :isSidebarMinimized="isSidebarMinimized">

        <div class="flex flex-col items-center justify-center py-3">
            <p class="font-semibold text-sm lg:text-lg">Resultado da Rede</p>
        </div>
            
            <div class="flex w-full items-center justify-start px-4 sm:px-10 mt-2">
                <Search @search="handleSearch" />
            </div>
            
            <div class="w-full pb-5 capitalize">
                <PrimaryTable :route="'Results'" :searchQuery="searchQuery" />
            </div> 
           
    </Whiteboard>
</template>

<script>
import TextInput from '@/components/Inputs/TextInput.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import Search from '@/components/Search/Search.vue';
import PrimaryTable from '@/components/Table/PrimaryTable.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { inject, ref } from 'vue'

export default {
    name: "Resultados IDEM",
    components: {Whiteboard, PrimaryTable, TextInput, Search, Pagination},
    
    setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')
    const textValue = ref('');
    const errorMessage = ref('');
    const isSuccess = ref('');
    const isInfo = ref('');
    const isWarning = ref('');

    const searchQuery = ref('')

    const handleSearch = (query) => {
        searchQuery.value = query
      }

    return {
      isSidebarMinimized,
      textValue,
      errorMessage,
      isSuccess,
      isInfo,
      isWarning,
      searchQuery,
      handleSearch
    }
  }
}
</script>