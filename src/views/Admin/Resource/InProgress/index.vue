<template>
    <Whiteboard title="Em Progresso" class="" :isSidebarMinimized="isSidebarMinimized" :hideBreadcrumbs="true">
      <div class="flex flex-col w-full lg:flex-row">

            <div class="flex-1 rounded-lg shadow-lg">

                <div class="flex items-center justify-center bg-[#6668d4] p-4">
                    <p class="text-20 font-bold text-white">Em Progresso</p>
                </div>

                <div class="flex items-center justify-end p-3 px-10">
                    <div class="flex items-center gap-2 text-black cursor-pointer">
                        <FunnelIcon class="w-5 h-5" />
                        <span class="text-15 text-black">Filtrar</span>
                    </div>
                </div>

                <div class="mt-1 my-5 space-y-4 px-10">
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
import { inject, ref } from 'vue';

export default {
    components: {infoCard, Whiteboard, FunnelIcon},
    setup() {
    const isSidebarMinimized = inject('isSidebarMinimized', ref(false))

    return {
      isSidebarMinimized
    }
  }
}
</script>