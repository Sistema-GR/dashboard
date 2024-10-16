<template>
    <Whiteboard title="Status do Recurso" :isSidebarMinimized="isSidebarMinimized">
        
        <div class="flex flex-col items-center justify-start w-full bg-white border border-gray-200 rounded-lg p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
           <router-link class="w-full" to="/user/view">
                <div class="flex items-center justify-between w-full pb-3 border-b mb-4">
                    <p class="text-lg font-semibold text-gray-700">Aberto</p>
                    <router-link class="flex items-center gap-1 justify-end p-2 hover:bg-slate-300 rounded-lg group duration-100 ease-in-out" to="edit">
                        <p class="group-hover:text-white">Editar</p>
                        <PencilSquareIcon class="w-5 h-auto stroke-black group-hover:stroke-white" />
                    </router-link>

                </div>

                <div class="flex w-full gap-4">
                    <div class="p-2 bg-gray-100 rounded-lg">
                        <UserIcon class="w-16 h-16 text-gray-400"/>
                    </div>

                    <div class="flex flex-row items-center justify-between w-full">
                        <div class="flex flex-col gap-2">
                            <p class="text-base font-medium text-gray-800">Matheus Gabriel Grawe</p>
                            <p class="text-sm text-gray-600">Erro no processamento do pagamento</p>
                        </div>

                        <div class="flex flex-col items-end gap-2.5">
                            <div class="flex flex-col gap-2 items-center"> 
                                <Badges text="Formação" />
                                <p class="text-sm font-semibold text-gray-500">01/02/2023</p>
                            </div>
                        </div>

                    </div>

                </div>
            </router-link>
        </div>
    </Whiteboard>
</template>

<script>
import { UserIcon, PencilSquareIcon } from "@heroicons/vue/24/outline";
import Whiteboard from "@/components/Whiteboard/Whiteboard.vue";
import Badges from "@/components/Badges/Badges.vue";
import { inject } from 'vue';

export default {
    name: "Status",
    components: { UserIcon, Whiteboard, Badges, PencilSquareIcon },
    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');

        return {
            isSidebarMinimized
        };
    }
};
</script>
