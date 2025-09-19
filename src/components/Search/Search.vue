<template>

  <div class="flex items-center w-full lg:w-9/10">
    <div class="relative">
      
      <select
        v-model="selectedColumn"
        @change="emitSearch"
        class="appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-[10px] leading-tight focus:outline-none focus:bg-white focus:border-blue-500 hover:cursor-pointer"
      >
        
        <option value="all">Todas as Colunas</option>
        <option v-for="column in columns" :key="column.key" :value="column.key">
          {{ column.label }}
        </option>

      </select>
      
      <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    
    </div>
    <div class="relative w-full">

        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon class="w-5 h-5 text-gray-500" />
        </div>

        <input
          v-model="searchQuery"
          @input="emitSearch"
          type="text"
          class="w-full pl-10 pr-20 py-2 border border-gray-300 rounded-[10px] focus:ring-blue-500 focus:border-blue-500"
          placeholder="Buscar..."
        />

    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline"

const props = defineProps({
  columns: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['search'])

const searchQuery = ref('')
const selectedColumn = ref('all')

const emitSearch = () => {
  emit('search', { 
    query: searchQuery.value, 
    column: selectedColumn.value 
  });
};
</script>
