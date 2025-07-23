<template>
      <div class="h-screen">
        <router-view   @update:isSidebarMinimized="handleSidebarMinimized"/>
      </div>
  </template>
  
  <script>
  import { inject } from 'vue'
  import Sidebar from '@/components/Sidebar/Sidebar.vue'
  
  export default {
    components: {
      Sidebar
    },
    setup() {
      const isSidebarMinimized = inject('isSidebarMinimized')
      
      return {
        isSidebarMinimized,
      }
    }
  }
  </script>
  