<template>
  <Sidebar v-if="sidebar.isVisible && !isMobile" />
  <!-- <MobileSidebar v-if="sidebar.isVisible && isMobile"/> -->
  <router-view />
</template>

<script setup>
import Sidebar from '@/components/Sidebar/Sidebar.vue'
// import MobileSidebar from './components/Sidebar/MobileSidebar.vue'
import { useSidebarStore } from '@/stores/sidebarStore'
import { watch, ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const sidebar = useSidebarStore()
const width = ref(window.innerWidth);
// const MOBILE_BREAKPOINT = 768;

// const isMobile = computed(() => width.value < MOBILE_BREAKPOINT);

const handleResize = () => {
  width.value = window.innerWidth;
};

onMounted(() => window.addEventListener('resize', handleResize));
onUnmounted(() => window.removeEventListener('resize', handleResize));

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