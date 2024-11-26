<template>
    <Whiteboard title="Permissões" :isSidebarMinimized="isSidebarMinimized">

    </Whiteboard>
</template>

<script>
import { inject, ref } from 'vue'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';

export default {
    name: "Permissões",
    components: {Whiteboard},

    setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')

    return {
      isSidebarMinimized,
    }
  }
}
</script>