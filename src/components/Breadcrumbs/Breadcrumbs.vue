<template>
  <nav class="grid grid-cols-3 items-center bg-[#3459a2] py-4 px-6 shadow-md w-full z-50" aria-label="Breadcrumb">
      <div class="flex justify-start">
        <button @click="goBack" class="flex items-center gap-2 text-white font-medium hover:underline text-sm sm:text-base"><img :src="voltarIcon" alt="Voltar" class="w-4 h-4" />Voltar</button>
      </div>
      <div class="flex justify-center">
        <h1 class="text-25 text-white text-center font-black uppercase tracking-wide sm:text-30 whitespace-nowrap">{{ titlePag }}</h1>
      </div>
  </nav>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
import voltarIcon from '@/assets/images/voltar.png'

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

const router = useRouter()
function goBack() {
  router.go(-1)
}

</script>
