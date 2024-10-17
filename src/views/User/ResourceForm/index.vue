<template>
    <Whiteboard title="Formulário de Recurso" :isSidebarMinimized="isSidebarMinimized">
        <div class="flex flex-col w-full px-4">
            <div class="flex flex-col space-y-6 py-4">

                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">Motivo de não recebimento</label>
                    <RouterLink to="criteria">
                        <span class="text-blue-700 font-medium w-3/4 ml-3 text-sm cursor-pointer">Não Recebeu? Clique Aqui e veja o Detalhamento</span>
                    </RouterLink>
                </div>

                <div class="flex items-center border-b-2 py-2 pb-6">
                    <label class="font-semibold w-1/4 text-sm">Nome completo</label>
                    <span class="text-gray-700 w-3/4 ml-4 text-sm">Tom Cock Harris</span>
                </div>
                
                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">E-mail</label>
                    <span class="text-gray-700 w-3/4 ml-4 text-sm">tom.harris@example.com</span>
                </div>

                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">CPF</label>
                    <span class="text-gray-700 w-3/4 ml-4 text-sm">123.456.789-00</span>
                </div>

                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">Matrícula</label>
                    <span class="text-gray-700 w-3/4 ml-4 text-sm">u04444</span>
                </div>

                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">Unidade de atuação</label>
                    <span class="text-gray-700 w-3/4 ml-4 text-sm">Abdon Batista</span>
                </div>

                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">Descrição</label>
                    <div class="w-3/4 ml-4">
                        <textarea v-model="description" class="w-full border rounded-md p-2 text-sm" rows="4" placeholder="Descreva o motivo do recurso aqui..."></textarea>
                        <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
                    </div>
                </div>
                
                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">Documentos</label>
                    <div class="w-3/4 ml-4">
                        <input type="file" @change="handleFileUpload" multiple class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        <p v-if="errors.files" class="text-red-500 text-sm mt-1">{{ errors.files }}</p>
                    </div>
                </div>

                <div v-if="files.length > 0" class="mt-4">
                    <div class="mb-2">
                        <h3 class="font-semibold text-sm sm:text-base">Arquivos Anexados:</h3>
                    </div>

                    <div class="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                        <div class="flex flex-col w-full gap-3 border-2 border-blue-500 rounded-lg p-1">
                            <div v-for="(file, index) in files" :key="index" class="flex items-center justify-between gap-4 w-full text-sm text-blue-500 cursor-pointer">
                                <div class="flex items-center gap-2">
                                    <PaperClipIcon class="w-5 h-5 text-gray-500"/> 
                                    <span class="underline"> {{ file.name }} </span>
                                </div>
                                <div class="flex items-center gap-2">
                                    <ArrowDownTrayIcon class="w-6 h-6 text-gray-700 cursor-pointer" @click="downloadFile(file)" />
                                    <XMarkIcon class="w-5 h-5 text-red-500 cursor-pointer" @click="removeFile(index)" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col items-start mt-6 space-y-4 md:space-x-3">
                    <div class="space-y-4 px-4 md:px-0">
                        <p class="font-medium text-sm text-start">
                            Este formulário é destinado à interposição de recursos por parte dos profissionais vinculados à Secretaria de Educação de Joinville, referente à Gratificação por Resultados, conforme estabelecido pela Lei nº 9.214/2022 e pelo Decreto Municipal nº 49.309/2022.
                            <br><br>
                            O período para submissão de recursos neste formulário é de 17/05/2024 a 16/06/2024, encerrando-se às 23h59 do último dia.
                        </p>

                        <p class="font-bold text-sm text-start">
                            Atenção: Para a validação do recurso, é imprescindível anexar documentos que justifiquem e comprovem as alegações, incluindo eventuais divergências nos dados utilizados no cálculo da Gratificação por Resultados. O envio de documentos falsos ou informações inverídicas está sujeito à responsabilização administrativa, civil e criminal, conforme legislação vigente.
                        </p>

                        <div class="flex flex-col items-start gap-2">
                            <div class="flex flex-row items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="terms" 
                                    v-model="termsAccepted" 
                                    class="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" 
                                />
                                <label for="terms" class="text-sm">
                                    Declaro que li e aceito os termos acima.
                                </label>
                            </div>
                            <p v-if="errors.termsAccepted" class="text-red-500 text-sm">{{ errors.termsAccepted }}</p>
                        </div>
                        
                    </div>
                </div>

                <div class="flex w-full justify-end">
                    <PrimaryButton
                        @click="submitForm"
                        customColor="bg-blue-500 text-sm w-6/12 md:w-3/12"
                        value="Enviar"
                    />
                </div>

            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { inject, ref } from 'vue';
import { ArrowDownTrayIcon, PaperClipIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import { useRouter } from 'vue-router';

export default {
    name: "ResourceForm",
    components: { Whiteboard, PrimaryButton, ArrowDownTrayIcon, PaperClipIcon, XMarkIcon },

    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');
        const files = ref([]);
        const description = ref('');
        const termsAccepted = ref(false);
        const errors = ref({});
        const router = useRouter();

        const handleFileUpload = (event) => {
            files.value = Array.from(event.target.files);
        };

        const removeFile = (index) => {
            files.value.splice(index, 1);
        };

        const validateForm = () => {
            errors.value = {};

            if (!description.value) {
                errors.value.description = 'A descrição é obrigatória.';
            }
            if (!files.value.length) {
                errors.value.files = 'É necessário anexar pelo menos um documento.';
            }
            if (!termsAccepted.value) {
                errors.value.termsAccepted = 'Você deve aceitar os termos.';
            }

            return Object.keys(errors.value).length === 0;
        };

        const submitForm = () => {
            if (validateForm()) {
                router.push('/user/sucess');
            }
        };

        return {
            isSidebarMinimized, files, description, termsAccepted, errors, handleFileUpload, removeFile, submitForm,
        };
    }
};
</script>
