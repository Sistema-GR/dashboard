<template>
  <Sidebar v-if="sidebar.isVisible" />
  <router-view />
</template>

<script setup>
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import { useSidebarStore } from '@/stores/sidebarStore'
import { watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebar = useSidebarStore()

watch(
  () => route.path,
  (newPath) => {
    if (newPath === '/' || newPath.startsWith('/auth')) {
      sidebar.setVisible(false)
    } else {
      sidebar.setVisible(true)
    }
  },
  { immediate: true }
)
</script>