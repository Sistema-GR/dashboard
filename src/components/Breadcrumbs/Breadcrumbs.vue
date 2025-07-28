<template>
  <nav class="grid grid-cols-3 items-center bg-blue-800 py-4 px-6 shadow-md w-full z-50" aria-label="Breadcrumb">
      <div class="flex justify-start">
        <button @click="goBack" class="text-white hover:underline text-sm sm:text-base">Voltar</button>
      </div>
      <div class="flex justify-center">
        <h1 class="text-30 text-white text-center font-black uppercase tracking-wide">{{ titlePag }}</h1>
      </div>
  </nav>
</template>

<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router'

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
