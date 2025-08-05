<template>
    <Whiteboard title="Editar Recurso" :isSidebarMinimized="isSidebarMinimized">
        <div class="flex flex-col w-full px-4">
           
            <div v-if="isLoading" class="text-center p-10">
                <p>Carregando dados do recurso para edição...</p>
            </div>
            
            <div v-else-if="error" class="text-center p-10 text-red-500">
                <p>{{ error }}</p>
            </div>

            <div v-else class="flex flex-col">
                
                
                <div v-if="!isEditable" class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-[10px] my-4" role="alert">
                    <p class="font-bold">Prazo Excedido</p>
                    <p>Este recurso não pode mais ser editado, pois o prazo de {{ editTimeLimitInDays }} dias após a criação já passou.</p>
                </div>

                
                <div class="flex flex-col w-full border-t-2 py-4 mt-4">
                    <p class="text-lg font-bold mb-4">Dados do Servidor</p>
                    <div class="space-y-2 text-sm">
                        <div><strong>CPF:</strong> <span class="text-gray-600">{{ resource.cpf }}</span></div>
                        <div><strong>Email:</strong> <span class="text-gray-600">{{ resource.email }}</span></div>
                        <div><strong>Matrícula:</strong> <span class="text-gray-600">{{ resource.matricula }}</span></div>
                        <div><strong>Unidade:</strong> <span class="text-gray-600">{{ resource.unidade_atuacao }}</span></div>
                    </div>
                </div>

                
                <div class="flex flex-col border-t-2 py-1 mt-4">
                    
                    <div class="flex flex-col border-b-2 py-5">
                        <label class="text-lg font-bold mb-2">Descrição do Recurso</label>
                        <textarea v-model="form.descricao" class="w-full border rounded-[10px] p-2 text-sm" rows="4" :disabled="!isEditable"></textarea>
                    </div>
                    
                    <div class="flex flex-col border-b-2 py-4 gap-1">
                        <label class="font-semibold text-sm mb-1">Anexar Novos Documentos</label>
                        <input type="file" @change="handleFileUpload" multiple class="..." :disabled="!isEditable"/>
                    </div>
                    
                    
                    <div class="flex w-full justify-end mt-6 space-x-4">
                        <PrimaryButton 
                            value="Salvar Alterações" 
                            :disabled="isSaving || !isEditable" 
                            @click="saveChanges" 
                            :customColor="!isEditable ? 'bg-gray-400' : 'bg-blue-500'"
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
        const route = useRoute();
        const router = useRouter();
        const resourceId = route.params.id;
        
        // console.log("ID do recurso pego da URL:", resourceId);

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
        
        const handleFileUpload = (event) => { newFiles.value = Array.from(event.target.files); };

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
            form, 
            resource,
            newFiles,
            editTimeLimitInDays,
            isEditable,
            isLoading,
            isSaving,
            error,
            handleFileUpload, 
            saveChanges,
        };
    }
};
</script>