<template>
  <Sidebar v-if="sidebar.isVisible && !isMobile" />
  <MobileSidebar v-if="sidebar.isVisible && isMobile"/>
  <Toast
    v-model:visible="toast.visible"
    :duration="toast.duration"
    :type="toast.type"
    :message="toast.message" />
  <router-view />
</template>

<script setup>
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import MobileSidebar from './components/Sidebar/MobileSidebar.vue'
import { useSidebarStore } from '@/stores/sidebarStore'
import { useToastStore } from '@/stores/toastStore'
import { watch, ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Toast from '@/components/Toast/Toast.vue'

const route = useRoute()
const sidebar = useSidebarStore()
const toast = useToastStore()
const width = ref(window.innerWidth);
const MOBILE_BREAKPOINT = 1024;

const isMobile = computed(() => width.value < MOBILE_BREAKPOINT);

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