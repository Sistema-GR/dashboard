<template>
  <Whiteboard title="Relatório Final" :isSidebarMinimized="isSidebarMinimized">

    <div class="flex flex-row w-full items-start justify-between px-4 sm:px-10 mt-4">
      <Search @search="handleSearch" />
    </div>   
    
    <div class="w-full pb-5 capitalize">
      <PrimaryTable :route="'Report'" :searchQuery="searchQuery" />
    </div>
    
  </Whiteboard>
</template>

<script>
import TextInput from '@/components/Inputs/TextInput.vue';
import PrimaryTable from '@/components/Table/PrimaryTable.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Search from '@/components/Search/Search.vue';
import { ref, inject } from 'vue';

export default {
  name: "Report",
  components: { Whiteboard, PrimaryTable, TextInput, Search, },
  
  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized');
    const searchQuery = ref('');

    const handleSearch = (query) => {
      searchQuery.value = query;
    };

    return {
      isSidebarMinimized,
      searchQuery,
      handleSearch,
    };
  }
};
</script>
