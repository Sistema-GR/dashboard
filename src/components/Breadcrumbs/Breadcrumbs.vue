<template>
  <nav class="flex items-center justify-between bg-gray-50 py-4 px-6 shadow-md w-full z-50 lg:fixed" aria-label="Breadcrumb">
  
    <ol role="list" class="flex items-center space-x-4">

      <li v-for="(page, index) in pages" :key="index">
        <div class="flex items-center">
          <ChevronRightIcon class="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
          <a :href="page.href" class="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700" :aria-current="page.current ? 'page' : undefined">
            {{ page.name }}
          </a>
        </div>
      </li>
    </ol>

  </nav>
</template>

<script setup>
import { ChevronRightIcon } from '@heroicons/vue/20/solid';
import { defineProps } from 'vue';

const props = defineProps({
  pages: {
    type: Array,
    required: true,
  },
});


</script>
