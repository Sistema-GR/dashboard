<template>
    <Whiteboard title="Editar Recurso" :isSidebarMinimized="isSidebarMinimized">

        <div class="flex flex-col w-full px-4">

            <p class="font-medium text-sm text-justify mb-8 mt-4">
                Utilize este formulário para editar a solicitação de recurso relacionada à Gratificação por Resultados. Certifique-se de fornecer todas as informações necessárias e anexar documentos que justifiquem sua solicitação.
            </p>

            <p class="font-bold text-sm mb-5 text-justify pb-1">
                Lembre-se de revisar todas as informações antes de salvar as alterações. A data limite para a submissão de recursos é 16/06/2024.
            </p>

           
            <div class="flex flex-col w-full border-t-2 py-4 bg-white">
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

            <div class="flex flex-col border-t-2 py-1">

                <div class="flex flex-col border-b-2 py-5">
                    <label class="text-lg font-bold mb-2">Descrição do Recurso</label>
                    <textarea v-model="description"class="w-full border rounded-md p-2 text-sm" rows="4" placeholder="Descreva o motivo do recurso aqui..." :class="{ 'border-red-500': descriptionError }" @input="validateDescription" />
                    <p v-if="descriptionError" class="text-red-500 text-xs mt-1">A descrição é obrigatória.</p>
                </div>

                <div class="flex flex-col border-b-2 py-4 gap-1">
                    <label class="font-semibold text-sm mb-1">Documentos Anexados</label>
                    <input type="file" @change="handleFileUpload" multiple  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>

                    <div v-if="files.length > 0" class="mt-4">
                        <h3 class="font-semibold text-sm mb-2">Arquivos Anexados:</h3>
                        <div class="flex flex-col space-y-2">
                            <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between border p-2 rounded-lg bg-blue-50 border-blue-500 text-blue-700">
                                <div class="flex items-center gap-2">
                                    <PaperClipIcon class="w-5 h-5 text-gray-500"/> 
                                    <span class="underline">{{ file.name }}</span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <ArrowDownTrayIcon class="w-6 h-6 text-gray-700 cursor-pointer" @click="downloadFile(file)" />
                                    <XMarkIcon class="w-5 h-5 text-red-500 cursor-pointer" @click="removeFile(index)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <RouterLink to="sucess" class="flex w-full justify-end mt-6 space-x-4">
                    <PrimaryButton customColor="bg-blue-500 text-sm w-6/12 md:w-3/12" value="Salvar" :disabled="isSaving" @click="saveChanges" />
                </RouterLink>

            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { inject, ref } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import { PaperClipIcon, ArrowDownTrayIcon, XMarkIcon  } from '@heroicons/vue/20/solid';
import { RouterLink } from 'vue-router';

export default {
    name: "ResourceEdit",
    components: { Whiteboard, PrimaryButton, PaperClipIcon, ArrowDownTrayIcon, XMarkIcon  },
    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');
        const title = ref('');
        const description = ref('');
        const files = ref([]);
        const isSaving = ref(false);
        const titleError = ref(false);
        const descriptionError = ref(false);

        const handleFileUpload = (event) => {
            files.value = Array.from(event.target.files);
        };

        const validateTitle = () => {
            titleError.value = !title.value.trim();
        };

        const validateDescription = () => {
            descriptionError.value = !description.value.trim();
        };

        const saveChanges = () => {
            validateTitle();
            validateDescription();

            if (titleError.value || descriptionError.value) return;

            isSaving.value = true;
            // Simula uma chamada de API para salvar as alterações
            setTimeout(() => {
                isSaving.value = false;
                // Redirecionar ou mostrar mensagem de sucesso
            }, 2000);
        };

        const downloadFile = (file) => {
            
        };

        const removeFile = (index) => {
            files.value.splice(index, 1);
        };

        return { isSidebarMinimized, title, description, files, handleFileUpload, saveChanges, isSaving, titleError, descriptionError, downloadFile, removeFile };
    }
};
</script>
