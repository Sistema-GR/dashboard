<template>
    <Whiteboard title="Editar Recurso" :isSidebarMinimized="isSidebarMinimized">
        <div class="flex flex-col w-full gap-5 px-4 sm:px-10 py-8">
           
            <div v-if="isLoading" class="text-center p-10">
                <p>Carregando dados do recurso para edição...</p>
            </div>
            
            <div v-else-if="error" class="text-center p-10 text-red-500">
                <p>{{ error }}</p>
            </div>

            <div v-else class="flex flex-col gap-5">
                
                <!-- Alerta de prazo excedido -->
                <div v-if="!isEditable" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-[10px]" role="alert">
                    <p class="font-bold">Prazo Excedido</p>
                    <p>Este recurso não pode mais ser editado, pois o prazo de {{ editTimeLimitInDays }} dias após a criação já passou.</p>
                </div>

                <!-- Dados do Servidor -->
                <div class="bg-white p-4 rounded-[10px] shadow-md border">
                    <h2 class="text-20 font-bold mb-4 border-b pb-2">Dados do Servidor</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-15">
                        <div><strong>CPF:</strong> {{ resource.cpf }}</div>
                        <div><strong>Email:</strong> {{ resource.email }}</div>
                        <div><strong>Matrícula:</strong> {{ resource.matricula }}</div>
                        <div><strong>Unidade:</strong> {{ resource.unidade_atuacao }}</div>
                    </div>
                </div>

                <!-- Formulário de Edição -->
                <div class="bg-white p-4 rounded-[10px] shadow-md border">
                    <h2 class="text-20 font-bold mb-4 border-b pb-2">Editar Informações</h2>
                    
                    <!-- Descrição do Recurso -->
                    <div class="mb-6">
                        <label class="block text-15 font-semibold mb-2" for="descricao">
                            Descrição do Recurso <span class="text-red-500">*</span>
                        </label>
                        <textarea 
                            id="descricao"
                            v-model="form.descricao" 
                            class="w-full border border-gray-300 rounded-[10px] p-3 text-15 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed" 
                            placeholder="Descreva detalhadamente o motivo do seu recurso..."
                            :disabled="!isEditable"
                        ></textarea>
                    </div>
                    
                    <!-- Anexar Documentos -->
                    <div class="mb-6">
                        <label class="block text-15 font-semibold mb-2">
                            Anexar Novos Documentos
                        </label>
                        <div class="border-2 border-dashed border-gray-300 rounded-[10px] p-6 text-center hover:border-gray-400 transition-colors">
                            <input 
                                type="file" 
                                id="file-upload"
                                @change="handleFileUpload" 
                                multiple 
                                :disabled="!isEditable"
                                class="hidden"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                            <label 
                                for="file-upload" 
                                class="cursor-pointer flex flex-col items-center"
                                :class="{ 'cursor-not-allowed opacity-50': !isEditable }"
                            >
                                <svg class="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" />
                                </svg>
                                <p class="text-15 text-gray-600 mb-1">
                                    <span class="font-semibold text-blue-600">Clique para selecionar</span> ou arraste arquivos aqui
                                </p>
                                <p class="text-13 text-gray-500">
                                    PDF, DOC, DOCX, JPG, PNG (máx. 10MB cada)
                                </p>
                            </label>
                        </div>
                        
                        <!-- Arquivos selecionados -->
                        <div v-if="newFiles.length > 0" class="mt-4">
                            <p class="text-15 font-semibold text-gray-700 mb-2">Arquivos selecionados:</p>
                            <div class="space-y-2">
                                <div v-for="(file, index) in newFiles" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded-[10px] border">
                                    <div class="flex items-center">
                                        <svg class="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                        </svg>
                                        <span class="text-15 text-gray-700">{{ file.name }}</span>
                                        <span class="text-13 text-gray-500 ml-2">({{ (file.size / 1024 / 1024).toFixed(2) }}MB)</span>
                                    </div>
                                    <button 
                                        @click="removeFile(index)" 
                                        type="button" 
                                        class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Botões -->
                    <div class="flex justify-end gap-3 pt-4 border-t">
                        <button 
                            @click="$router.push({ name: 'status' })"
                            class="px-6 py-2 border border-gray-300 text-gray-700 rounded-[10px] hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <PrimaryButton 
                            value="Salvar Alterações" 
                            :disabled="isSaving || !isEditable" 
                            @click="saveChanges" 
                            :customColor="!isEditable ? 'bg-gray-400' : 'bg-blue-600'"
                        />
                    </div>
                </div>
            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { inject, ref, onMounted, reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios'; 

import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';

export default {
    name: "ResourceEdit",
    components: { Whiteboard, PrimaryButton },
    
    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');
        const route = useRoute();
        const router = useRouter();
        const resourceId = route.params.id;

        const resource = ref(null);
        const form = reactive({
            descricao: '',
        });
        const newFiles = ref([]);
        const editTimeLimitInDays = 10; 
        
        const isLoading = ref(true);
        const isSaving = ref(false);
        const error = ref(null);

        const isEditable = computed(() => {
            if (!resource.value) return false;
            
            const createdAt = new Date(resource.value.created_at);
            const now = new Date();
            const differenceInMilliseconds = now - createdAt;
            const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
            
            return differenceInDays <= editTimeLimitInDays;
        });

        const fetchResourceData = async () => {
            isLoading.value = true;
            try {
                const response = await axios.get(`/recursos/${resourceId}/`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
                });
                resource.value = response.data;                 
                form.descricao = response.data.descricao;
            } catch (err) {
                error.value = "Não foi possível carregar o recurso para edição.";
            } finally {
                isLoading.value = false;
            }
        };

        onMounted(fetchResourceData);
        
        const handleFileUpload = (event) => { 
            newFiles.value = Array.from(event.target.files); 
        };

        const removeFile = (index) => {
            newFiles.value.splice(index, 1);
        };

        const saveChanges = async () => {
            if (!isEditable.value) {
                alert("O prazo para edição deste recurso já expirou.");
                return;
            }
            
            isSaving.value = true;
            const formData = new FormData();
            formData.append('descricao', form.descricao);

            newFiles.value.forEach(file => {
                formData.append('documentos', file);
            });

            try {
                await axios.patch(`/recursos/${resourceId}/`, formData, {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                router.push({ name: 'status' });
            } catch (err) {
                const apiError = err.response?.data?.detail || "Não foi possível salvar as alterações.";
                alert(apiError);
            } finally {
                isSaving.value = false;
            }
        };

        return { 
            isSidebarMinimized,
            form, 
            resource,
            newFiles,
            editTimeLimitInDays,
            isEditable,
            isLoading,
            isSaving,
            error,
            handleFileUpload,
            removeFile,
            saveChanges,
        };
    }
};
</script>