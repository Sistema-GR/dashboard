<template>
  <Whiteboard title="Relatório Final" :isSidebarMinimized="isSidebarMinimized">
    <div class="flex flex-row w-full items-start justify-between px-4 mt-4">
      <Search @search="handleSearch" />
      <div class="flex flex-row gap-1 cursor-pointer group" @click="downloadCSV">
          <p class="text-blue-800 group-hover:text-blue-900">Emitir Relatório</p>
          <DocumentArrowDownIcon class="w-5 h-auto stroke-blue-600 group-hover:stroke-blue-600" />
      </div>
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
import { DocumentArrowDownIcon } from "@heroicons/vue/24/outline";

export default {
  name: "Report",
  components: { Whiteboard, PrimaryTable, TextInput, Search, DocumentArrowDownIcon },
  
  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized');
    const searchQuery = ref('');

    const handleSearch = (query) => {
      searchQuery.value = query;
    };

    const downloadCSV = () => {
      const tableData = [
        { name: 'Example', start_date: '01/01/2023', end_date: '01/02/2023' },
        // Adicione mais dados conforme necessário
      ];

      if (!tableData.length) return;

      const csvRows = [];
      const headers = Object.keys(tableData[0]);
      csvRows.push(headers.join(',')); // Adiciona os cabeçalhos ao CSV

      for (const row of tableData) {
        const values = headers.map(header => {
          const escaped = ('' + row[header]).replace(/"/g, '\\"'); // Escape para aspas
          return `"${escaped}"`; // Corrigido para usar aspas ao redor dos valores
        });
        csvRows.push(values.join(',')); // Adiciona a linha ao CSV
      }

      const csvString = csvRows.join('\n');
      const blob = new Blob([csvString], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'report.csv';
      a.click();
      URL.revokeObjectURL(url);
    };

    return {
      isSidebarMinimized,
      searchQuery,
      handleSearch,
      downloadCSV
    };
  }
};
</script>
