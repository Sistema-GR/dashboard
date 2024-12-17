<template>
      <div class="h-screen">
        <router-view   @update:isSidebarMinimized="handleSidebarMinimized"/>
      </div>
  </template>
  
  <script>
  import { ref, provide } from 'vue'
  import Sidebar from '@/components/Sidebar/Sidebar.vue'
  
  export default {
    components: {
      Sidebar
    },
    setup() {
      const isSidebarMinimized = ref(false)
  
      function handleSidebarMinimized(value) {
        isSidebarMinimized.value = value
      }
  
      provide('isSidebarMinimized', isSidebarMinimized)
  
      return {
        handleSidebarMinimized
      }
    }
  }
  </script>
  