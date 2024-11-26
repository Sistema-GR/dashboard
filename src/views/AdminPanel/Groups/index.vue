<template>
    <Whiteboard title="Turmas" :isSidebarMinimized="isSidebarMinimized">

        <div class="flex flex-col w-full items-center justify-center mt-5 pb-5 capitalize">
        
            <PrimaryTable :route="'Groups'" />
        </div>

    </Whiteboard>
</template>

<script>
import TextInput from '@/components/Inputs/TextInput.vue';
import PrimaryTable from '@/components/Table/PrimaryTable.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Search from '@/components/Search/Search.vue';
import { inject } from 'vue'

export default {
    name: "Resultados IDEM",
    components: {Whiteboard, PrimaryTable, TextInput, Search},

    setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')

    return {
      isSidebarMinimized
    }
  }
}
</script>*/