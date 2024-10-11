<template>
    <Whiteboard title="" class="-translate-y-20" :isSidebarMinimized="isSidebarMinimized" :hideBreadcrumbs="true">
      <div class="flex flex-col w-full 4 gap-10 lg:flex-row">

            <div class="flex-1 px-2 border rounded-lg shadow-lg">

                <div class="flex items-center justify-between border-b-2 m-3">
                    <p class="text-xl font-semibold my-2">Em Progresso</p>
                    <FunnelIcon class="w-5 h-auto stroke-gray-400 cursor-pointer" />
                </div>

                <div class="m-3 space-y-3">
                    <infoCard situation="Novo" />
                    <infoCard situation="Novo" />
                    <infoCard situation="Novo" />
                </div>

            </div>

        </div>
    </Whiteboard>
</template>
<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import infoCard from '@/views/Admin/Resource/components/infoCard/index.vue'
import { FunnelIcon } from "@heroicons/vue/24/outline";
import { inject } from 'vue';

export default {
    components: {infoCard, Whiteboard, FunnelIcon},
    setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')

    return {
      isSidebarMinimized
    }
  }
}
</script>