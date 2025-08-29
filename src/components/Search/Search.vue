<template>

    <div class="flex items-center w-full lg:w-9/10">

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
import { ref } from 'vue'
import { MagnifyingGlassIcon } from "@heroicons/vue/24/outline"

const emit = defineEmits(['search'])

const searchQuery = ref('')

const emitSearch = () => {
  emit('search', searchQuery.value)
}
</script>
