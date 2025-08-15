<template>
    <Sidebar route="admin-panel" @update:isSidebarMinimized="handleSidebarMinimized" />
    <RouterView></RouterView>
</template>

<script>
import { ref, provide } from 'vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue';

export default {
    name: "AdminPanel",
    components: {Sidebar},

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