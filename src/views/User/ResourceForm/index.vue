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
                    <div class="w-3/4 ml-4">
                        <input v-model="form.nome_completo" type="text" class="w-full border rounded-md p-2 text-sm" placeholder="Digite seu nome completo" />
                        <p v-if="errors.nome_completo" class="text-red-500 text-sm mt-1">{{ errors.nome_completo }}</p>
                    </div>
                </div>

                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">E-mail</label>
                    <div class="w-3/4 ml-4">
                        <input v-model="form.email" type="email" class="w-full border rounded-md p-2 text-sm" placeholder="Digite seu e-mail" />
                        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>
                    </div>
                </div>

                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">CPF</label>
                    <div class="w-3/4 ml-4">
                        <input v-model="form.cpf" type="text" class="w-full border rounded-md p-2 text-sm" placeholder="Digite seu CPF" />
                        <p v-if="errors.cpf" class="text-red-500 text-sm mt-1">{{ errors.cpf }}</p>
                    </div>
                </div>

                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">Matrícula</label>
                    <div class="w-3/4 ml-4">
                        <input v-model="form.matricula" type="text" class="w-full border rounded-md p-2 text-sm" placeholder="Digite sua matrícula" />
                        <p v-if="errors.matricula" class="text-red-500 text-sm mt-1">{{ errors.matricula }}</p>
                    </div>
                </div>

                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">Unidade de atuação</label>
                    <div class="w-3/4 ml-4">
                        <input v-model="form.unidade" type="text" class="w-full border rounded-md p-2 text-sm" placeholder="Digite sua unidade de atuação" />
                        <p v-if="errors.unidade" class="text-red-500 text-sm mt-1">{{ errors.unidade }}</p>
                    </div>
                </div>

                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">Descrição</label>
                    <div class="w-3/4 ml-4">
                        <textarea v-model="form.descricao" class="w-full border rounded-md p-2 text-sm" rows="4" placeholder="Descreva o motivo do recurso aqui..."></textarea>
                        <p v-if="errors.descricao" class="text-red-500 text-sm mt-1">{{ errors.descricao }}</p>
                    </div>
                </div>
                
                <div class="flex items-center border-b-2 py-0 pb-6">
                    <label class="font-semibold w-1/4 text-sm">Documentos</label>
                    <div class="w-3/4 ml-4">
                        <input type="file" @change="handleFileUpload" multiple class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
                        <p v-if="errors.files" class="text-red-500 text-sm mt-1">{{ errors.files }}</p>
                    </div>
                </div>

                <div v-if="form.files.length > 0" class="mt-4">
                    <div class="mb-2">
                        <h3 class="font-semibold text-sm sm:text-base">Arquivos Anexados:</h3>
                    </div>

                    <div class="flex flex-col sm:flex-row sm:items-start sm:gap-4">
                        <div class="flex flex-col w-full gap-3 border-2 border-blue-500 rounded-lg p-1">
                            <div v-for="(file, index) in form.files" :key="index" class="flex items-center justify-between gap-4 w-full text-sm text-blue-500 cursor-pointer">
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
                                    v-model="form.termsAccepted" 
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
                        :disabled="isSubmitting"
                        customColor="bg-blue-500 text-sm w-6/12 md:w-3/12"
                        :value="isSubmitting ? 'Enviando...' : 'Enviar'"
                    />
                </div>

            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { inject, ref, reactive } from 'vue';
import { ArrowDownTrayIcon, PaperClipIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    name: "ResourceForm",
    components: { Whiteboard, PrimaryButton, ArrowDownTrayIcon, PaperClipIcon, XMarkIcon },

    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');
        const router = useRouter();

        const form = reactive({
            nome_completo: '',
            email: '',
            cpf: '',
            matricula: '',
            unidade: '',
            descricao: '',
            files: [],
            termsAccepted: false,
        });
        
        const errors = ref({});
        const isSubmitting = ref(false);

        const handleFileUpload = (event) => {
            form.files = Array.from(event.target.files);
        };

        const removeFile = (index) => {
            form.files.splice(index, 1);
        };

       const validateForm = () => {
            errors.value = {};
            if (!form.nome_completo) errors.value.nome_completo = 'O nome completo é obrigatório.';
            if (!form.email) errors.value.email = 'O e-mail é obrigatório.';
            if (!form.cpf) errors.value.cpf = 'O CPF é obrigatório.';
            if (!form.matricula) errors.value.matricula = 'A matrícula é obrigatória.';
            if (!form.unidade) errors.value.unidade = 'A unidade de atuação é obrigatória.';
            if (!form.descricao) errors.value.descricao = 'A descrição é obrigatória.';
            if (!form.files.length) errors.value.files = 'É necessário anexar pelo menos um documento.';
            if (!form.termsAccepted) errors.value.termsAccepted = 'Você deve aceitar os termos.';
            return Object.keys(errors.value).length === 0;
        };

         const submitForm = async () => {
            if (validateForm()) {
                isSubmitting.value = true;

                const formData = new FormData();
                formData.append('nome_completo', form.nome_completo);
                formData.append('email', form.email);
                formData.append('cpf', form.cpf);
                formData.append('matricula', form.matricula);
                formData.append('unidade_atuacao', form.unidade);
                formData.append('descricao', form.descricao);
                
                form.files.forEach(file => {
                    formData.append('documentos', file);
                });

                try {
                    await axios.post('/recursos/criar/', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
                        }
                    });

                    router.push({ name: 'status' });

                } catch (error) {
                    console.error("Erro ao criar recurso:", error.response ? error.response.data : error.message);
                    if (error.response && error.response.data) {
                        const errorMessages = Object.entries(error.response.data)
                        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
                        .join('\n');
                        alert(`Ocorreram os seguintes erros:\n${errorMessages}`);
                    } else {
                        alert('Ocorreu um erro desconhecido ao enviar seu recurso. Tente novamente.');
                 }
                } finally {
                    isSubmitting.value = false;
                }
            }
        };

        return {
            isSidebarMinimized, 
            form, 
            errors,
            isSubmitting, 
            handleFileUpload, 
            removeFile, 
            submitForm,
        };
    }
};
</script>