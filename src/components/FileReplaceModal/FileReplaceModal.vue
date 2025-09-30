<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" @click.self="closeModal">
    <div class="bg-white rounded-[10px] shadow-xl p-6 w-full max-w-lg">
      <h3 class="text-20 font-medium leading-6 text-gray-900 border-b pb-4">Substituir Arquivo de Entrada</h3>
      
      <div v-if="isLoading" class="py-12 flex flex-col items-center">
        <p class="text-gray-700 font-semibold">{{ loadingMessage }}</p>
        <p class="text-15 text-gray-500 mt-2">Isso pode levar alguns minutos. Por favor, não feche esta janela.</p>
      </div>
      
      <form v-else @submit.prevent="handleSubmit" class="mt-6 space-y-6">
        <div>
          <label for="file-key-selector" class="block text-15 font-medium text-gray-700">1. Escolha o arquivo que deseja substituir:</label>
          <select id="file-key-selector" v-model="selectedFileKey" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-15 rounded-[10px] shadow-sm">
            <option disabled value="">Selecione um arquivo...</option>
            <option v-for="file in editableFiles" :key="file.key" :value="file.key">{{ file.name }}</option>
          </select>
        </div>
        
        <div>
          <label for="file-upload" class="block text-15 font-medium text-gray-700">2. Envie o novo arquivo (.csv):</label>
          <input id="file-upload" type="file" @change="handleFileChange" class="mt-1 block w-full text-15 text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-[10px] file:border-0 file:text-15 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" accept=".csv" />
        </div>
        
        <div class="pt-4 flex justify-end space-x-3 border-t">
          <button type="button" @click="closeModal" class="bg-white py-2 px-4 border border-gray-300 rounded-[10px] shadow-sm text-15 font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button type="submit" :disabled="!selectedFileKey || !fileToUpload" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-15 font-medium rounded-[10px] text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400">Substituir e Reprocessar</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { getAccessToken } from '@/service/token';

const props = defineProps({
  show: Boolean,
  calculusId: [String, Number],
  editableFiles: Array,
});

const emit = defineEmits(['close', 'file-replaced']);

const isLoading = ref(false);
const loadingMessage = ref('');
const selectedFileKey = ref('');
const fileToUpload = ref(null);

function handleFileChange(event) {
  fileToUpload.value = event.target.files[0];
}

async function handleSubmit() {
  if (!selectedFileKey.value || !fileToUpload.value) {
    alert('Por favor, selecione um arquivo para substituir e envie o novo arquivo.');
    return;
  }

  isLoading.value = true;
  loadingMessage.value = 'Enviando e reprocessando, aguarde...';

  const formData = new FormData();
  formData.append('file', fileToUpload.value);

  try {
    const token = await getAccessToken();
    await axios.post(
      `http://127.0.0.1:8000/csv/calculus/${props.calculusId}/replace-file/${selectedFileKey.value}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    emit('file-replaced');
  } catch (err) {
    console.error("Erro ao substituir o arquivo:", err);
    alert(`Falha na substituição: ${err.response?.data?.error || 'Erro desconhecido'}`);
  } finally {
    isLoading.value = false;
    resetForm();
  }
}

function closeModal() {
  if (!isLoading.value) {
    emit('close');
    resetForm();
  }
}

function resetForm() {
    selectedFileKey.value = '';
    fileToUpload.value = null;
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = '';
}
</script>