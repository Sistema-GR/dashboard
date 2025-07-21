<template>
  <nav class="flex items-center justify-between bg-gray-50 py-4 px-6 shadow-md w-full z-50 lg:fixed" aria-label="Breadcrumb">
      <button @click="goBack" class="hover:underline">Voltar</button>
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
});

const router = useRouter()
function goBack() {
  router.go(-1)
}

</script>
