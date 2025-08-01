<template>
        <div class="flex flex-col items-center justify-center h-screen mx-5 py-10 text-center lg:pl-40">
            <CheckCircleIcon class="w-24 h-auto" />

            <h1 class="text-4xl font-semibold text-gray-800 mb-4">Recurso enviado com sucesso!</h1>
            <p class="text-20 text-gray-600 mb-2">Sua solicitação foi realizada com sucesso.</p>
            <p class="text-md text-gray-500 mb-8">Você pode acompanhar o status da sua solicitação no painel de status.</p>

            <button 
                @click="goToStatus" 
                class="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition duration-300">
                Acompanhar Status
            </button>
        </div>
</template>

<script>
import { inject } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { useRouter } from 'vue-router';
import { CheckCircleIcon } from "@heroicons/vue/24/outline";

export default {
    name: "Success",
    components: { Whiteboard, CheckCircleIcon },

    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');
        const router = useRouter();

        const goToStatus = () => {
            router.push('status');  
        };

        return {
            isSidebarMinimized,
            goToStatus
        };
    }
}
</script>
