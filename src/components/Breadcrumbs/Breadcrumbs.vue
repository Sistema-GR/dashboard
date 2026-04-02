<template>
  <nav class="sticky top-0 z-30 w-full bg-[#3459a2] shadow-md transition-all duration-300" aria-label="Breadcrumb">
    <div class="grid grid-cols-3 items-center h-16 px-4 md:h-20 md:px-6">
    
      <div class="flex justify-start">
          <button 
            @click="goBack" 
            class="flex items-center gap-2 text-white font-medium hover:text-white/80 transition-colors text-sm md:text-base group"
          >
            <img :src="voltarIcon" alt="Voltar" class="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span class="hidden sm:inline">Voltar</span>
          </button>
        </div>

      <div class="flex justify-center min-w-0">
        <h1 class="text-lg font-black uppercase tracking-wide text-white truncate text-center leading-tight sm:text-xl lg:text-2xl w-full px-2">
          {{ titlePag }}
        </h1>
      </div>

      <div class="flex justify-end items-center">
        <NotificationBell />
      </div>
    </div>  
  </nav>
</template>

<script setup>

import { useRouter } from 'vue-router';
import voltarIcon from '@/assets/images/voltar.png'
import NotificationBell from '@/components/NotificationBell/NotificationBell.vue';

const props = defineProps({
  pages: {
    type: Array,
    required: true,
  },
  titlePag: {
    type: String,
    default: '',
  },
});

const hoverTxt = (hoveredText) => {
  return hoveredText;
}

const router = useRouter()
function goBack() {
  router.go(-1)
}

</script>
