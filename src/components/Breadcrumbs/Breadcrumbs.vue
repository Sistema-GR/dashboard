<template>
  <nav class="grid grid-cols-3 items-center bg-[#3459a2] py-3 px-4 shadow-md w-full z-50 md:py-4 md:px-6" aria-label="Breadcrumb">
      <div class="flex justify-start">
        <button @click="goBack" class="flex items-center gap-2 text-white font-medium hover:underline text-15 sm:text-base"><img :src="voltarIcon" alt="Voltar" class="w-4 h-4" />Voltar</button>
      </div>
      <div class="flex justify-center">
        <h1 class="text-20 text-white text-center font-black uppercase tracking-wide leading-6 sm:text-25 sm:leading-7 lg:text-30 lg:leading-8 sm:whitespace-nowrap">{{ titlePag }}</h1>
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
