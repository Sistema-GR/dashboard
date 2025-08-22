<template>
    <Whiteboard title="Formulário de Recurso" >
        <!-- Header com ícone de alerta - largura total -->
        <div class="w-full bg-blue-50 border-b border-blue-200 mb-6">
            <div class="max-w-2xl mx-auto px-6 py-4">
                <div class="flex items-center gap-3">
                        <InformationCircleIcon class="w-20 h-20 text-black items-center" />
                    <div>
                        <h3 class="font-medium text-gray-900 text-20">Não recebeu?</h3>
                        <RouterLink to="criteria">
                            <span class="text-blue-600 underline hover:text-blue-800 cursor-pointer text-15">Clique aqui e veja o detalhamento</span>
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>

        <!-- Conteúdo do formulário -->
        <div class="max-w-2xl mx-auto p-6">
            <div v-if="isLoadingUserData" class="text-center p-10">
                <p class="text-gray-600">Carregando seus dados...</p>
            </div>
            <div v-else class="space-y-6">

                <!-- Formulário -->
                <form @submit.prevent="submitForm" class="space-y-4">
                    
                    <!-- Nome completo -->
                    <div>
                        <label class="block text-15 font-medium text-gray-700 mb-1">Nome completo</label>
                        <input 
                            v-model="form.nome_completo" 
                            type="text" 
                            readonly 
                            class="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-15 bg-gray-50 text-gray-500" 
                        />
                        <p v-if="errors.nome_completo" class="text-red-500 text-xs mt-1">{{ errors.nome_completo }}</p>
                    </div>

                    <!-- CPF -->
                    <div>
                        <label class="block text-15 font-medium text-gray-700 mb-1">CPF</label>
                        <input 
                            v-model="form.cpf" 
                            type="text" 
                            readonly 
                            class="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-15 bg-gray-50 text-gray-500" 
                        />
                        <p v-if="errors.cpf" class="text-red-500 text-xs mt-1">{{ errors.cpf }}</p>
                    </div>

                    <!-- Matrícula -->
                    <div>
                        <label class="block text-15 font-medium text-gray-700 mb-1">Matrícula</label>
                        <input 
                            v-model="form.matricula" 
                            type="text" 
                            readonly 
                            class="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-15 bg-gray-50 text-gray-500" 
                        />
                        <p v-if="errors.matricula" class="text-red-500 text-xs mt-1">{{ errors.matricula }}</p>
                    </div>

                    <!-- Unidade de atuação -->
                    <div>
                        <label class="block text-15 font-medium text-gray-700 mb-1">Unidade de atuação</label>
                        <input 
                            v-model="form.unidade" 
                            type="text" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-15 focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
                            placeholder="Digite sua unidade de atuação"
                        />
                        <p v-if="errors.unidade" class="text-red-500 text-xs mt-1">{{ errors.unidade }}</p>
                    </div>

                    <!-- Descrição -->
                    <div>
                        <label class="block text-15 font-medium text-gray-700 mb-1">Descrição</label>
                        <textarea 
                            v-model="form.descricao" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-[10px] text-15 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none" 
                            rows="4" 
                            placeholder="Descreva o motivo do recurso aqui..."
                        ></textarea>
                        <p v-if="errors.descricao" class="text-red-500 text-xs mt-1">{{ errors.descricao }}</p>
                    </div>
                    
                    <!-- Documentos -->
                    <div>
                        <label class="block text-15 font-medium text-gray-700 mb-1">Documentos</label>
                        <div class="border-2 border-dashed border-gray-300 rounded-[10px] p-6 text-center hover:border-gray-400 transition-colors">
                            <input 
                                id="file-upload" 
                                type="file" 
                                @change="handleFileUpload" 
                                multiple 
                                class="hidden" 
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <label for="file-upload" class="cursor-pointer">
                                <div class="space-y-2">
                                    <svg class="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                        <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                    <div class="text-15 text-gray-600">
                                        <span class="font-medium text-blue-600 hover:text-blue-500">Escolher arquivo</span>
                                    </div>
                                    <p class="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG</p>
                                </div>
                            </label>
                        </div>
                        <p v-if="errors.files" class="text-red-500 text-xs mt-1">{{ errors.files }}</p>
                    </div>

                    <!-- Lista de arquivos anexados -->
                    <div v-if="form.files.length > 0" class="space-y-2">
                        <h4 class="text-15 font-medium text-gray-700">Arquivos anexados:</h4>
                        <div class="space-y-1">
                            <div v-for="(file, index) in form.files" :key="index" class="flex items-center justify-between p-2 bg-gray-50 rounded border">
                                <div class="flex items-center gap-2">
                                    <PaperClipIcon class="w-4 h-4 text-gray-500" />
                                    <span class="text-15 text-gray-700">{{ file.name }}</span>
                                </div>
                                <button @click="removeFile(index)" type="button" class="text-red-500 hover:text-red-700">
                                    <XMarkIcon class="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Termos e condições -->
                    <div class="bg-gray-50 p-4 rounded border text-xs text-gray-600 space-y-2">
                        <p>
                            Este formulário é destinado à interposição de recursos por parte dos profissionais vinculados à Secretaria de Educação de Joinville, referente à Gratificação por Resultados.
                        </p>
                        <p class="font-medium">
                            Atenção: Para a validação do recurso, é imprescindível anexar documentos que justifiquem e comprovem as alegações.
                        </p>
                        
                        <div class="flex items-start gap-2 pt-2">
                            <input 
                                type="checkbox" 
                                id="terms" 
                                v-model="form.termsAccepted" 
                                class="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                            />
                            <label for="terms" class="text-xs text-gray-700 cursor-pointer">
                                Declaro que li e aceito os termos acima.
                            </label>
                        </div>
                        <p v-if="errors.termsAccepted" class="text-red-500 text-xs">{{ errors.termsAccepted }}</p>
                    </div>

                    <!-- Botão de envio -->
                    <div class="flex justify-end pt-4">
                        <button
                            type="submit"
                            :disabled="isSubmitting"
                            class="px-6 py-2 bg-blue-600 text-white text-15 font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {{ isSubmitting ? 'Enviando...' : 'Enviar' }}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { inject, ref, reactive, onMounted } from 'vue';
import { ArrowDownTrayIcon, PaperClipIcon, XMarkIcon, InformationCircleIcon } from "@heroicons/vue/24/outline";
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

export default {
    name: "ResourceForm",
    components: { 
        Whiteboard, 
        PrimaryButton, 
        ArrowDownTrayIcon, 
        PaperClipIcon, 
        XMarkIcon,
        InformationCircleIcon 
    },

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
        const isLoadingUserData = ref(true);

        const fetchUserData = async () => {
            isLoadingUserData.value = true;
            try {
                const response = await axios.get('/auth/user-info/', {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                const userData = response.data;

                form.nome_completo = (userData.first_name + ' ' + userData.last_name) || '';
                form.email = userData.email || '';
                form.cpf = userData.cpf || '';
                form.matricula = userData.employeeCode || '';

            } catch (error) {
                console.error("Erro ao buscar dados do usuário:", error);
                alert("Não foi possível carregar seus dados. Por favor, recarregue a página.");
            } finally {
                isLoadingUserData.value = false;
            }
        };

        onMounted(fetchUserData);

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
                        const errorData = error.response.data;
                        let errorMessage;

                        if (typeof errorData.detail === 'string') {
                            errorMessage = errorData.detail;
                        } 

                        else {
                            errorMessage = Object.entries(errorData)
                                .map(([field, messages]) => {
                                    const messageText = Array.isArray(messages) ? messages.join(', ') : messages;
                                    return `${field}: ${messageText}`;
                                })
                                .join('\n');
                        }
                        alert(`Ocorreram os seguintes erros:\n${errorMessage}`);

                    } else {
                        alert('Ocorreu um erro desconhecido ao enviar seu recurso. Tente novamente.');
                    }
                    // =============================================================

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
            isLoadingUserData,
            handleFileUpload, 
            removeFile, 
            submitForm,
        };
    }
};
</script>