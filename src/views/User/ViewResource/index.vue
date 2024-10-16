<template>
    <Whiteboard title="Formulário de Recurso" :isSidebarMinimized="isSidebarMinimized">

        <div class="flex flex-col w-full py-2 bg-white">
            <p class="text-lg font-bold mb-4">Dados do Servidor</p>
            <div class="space-y-2">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p class="font-semibold text-sm mb-1">CPF:</p>
                    <p class="text-gray-600 text-sm">123.456.789-00</p>
                </div>

                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p class="font-semibold text-sm mb-1">Email:</p>
                    <p class="text-gray-600 text-sm">example@domain.com</p>
                </div>

                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p class="font-semibold text-sm mb-1">Cargo:</p>
                    <p class="text-gray-600 text-sm">Desenvolvedor</p>
                </div>

                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p class="font-semibold text-sm mb-1">Unidade:</p>
                    <p class="text-gray-600 text-sm">TI</p>
                </div>
            </div>
        </div>

        <div class="flex flex-col w-full mt-5 bg-white pb-8 border-t-2">
            <p class="text-lg font-bold mb-2 mt-5">Descrição</p>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p> 
        </div>

        <div class="flex flex-col w-full border-t-2">
            <div class="py-4">
                <h3 class="text-lg font-bold">Arquivos Anexados:</h3>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                <div class="flex flex-col w-full gap-3 border-2 border-blue-500 rounded-lg p-1">
                    <div class="flex items-center justify-between gap-4 w-full text-sm text-blue-500 cursor-pointer">
                        <div class="flex items-center gap-2">
                            <PaperClipIcon class="w-5 h-5 text-gray-500"/> 
                            <span class="underline"> Atividades </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <ArrowDownTrayIcon class="w-6 h-6 text-gray-700 cursor-pointer" @click="downloadFile(file)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-col w-full border-t-2 pt-4 mt-5">
            <div>
                <button @click="toggleResposta" class="flex justify-between items-center w-full text-left">
                    <span class="text-lg font-bold">Resposta</span>
                    <span class="transform transition-transform duration-300" :class="{'rotate-180': isRespostaOpen}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </span>
                </button>
            </div>
            <div v-if="isRespostaOpen" class="mt-2">
                <p v-if="resposta">Resposta do administrador: {{ resposta }}</p>
                <p v-else class="text-gray-500">Sem resposta disponível.</p>
            </div>
        </div>

    </Whiteboard>
</template>

<script setup>
import { inject, ref } from 'vue';
import { PaperClipIcon, ArrowDownTrayIcon } from "@heroicons/vue/24/outline";
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';

const isSidebarMinimized = inject('isSidebarMinimized');
const isRespostaOpen = ref(false);
const resposta = ref(''); 

function toggleResposta() {
    isRespostaOpen.value = !isRespostaOpen.value;
}
</script>
