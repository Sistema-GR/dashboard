<template>
  <Whiteboard :title="pageTitle" :isSidebarMinimized="isSidebarMinimized">
    <div class="p-4 sm:p-6 lg:p-8 w-full">

      <!-- Estado de Carregamento -->
      <div v-if="isLoading" class="text-center py-10">
        <p class="text-gray-600">Carregando histórico de versões...</p>
        <!-- Você pode adicionar um componente de spinner aqui se tiver um -->
      </div>

      <!-- Estado de Erro -->
      <div v-else-if="error" class="text-center py-10 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 font-semibold">Ocorreu um erro</p>
        <p class="text-red-600 mt-1">{{ error }}</p>
      </div>

      <!-- Conteúdo Principal -->
      <div v-else-if="versions.length > 0" class="max-w-5xl mx-auto">
        <div class="space-y-4">
          <div v-for="version in versions" :key="version.id" class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <!-- Informações da Versão -->
            <div class="flex-grow">
              <div class="flex items-center gap-3">
                <h3 class="text-lg font-bold text-gray-800">Versão {{ version.version_number }}</h3>
                <span :class="getStatusClass(version.status)" class="text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  {{ version.status_display }}
                </span>
              </div>
              <p class="text-sm text-gray-500 mt-1">Criado em: {{ version.created_at }}</p>
            </div>

            <!-- Botões de Ação -->
            <div class="mt-4 sm:mt-0 sm:ml-4 flex-shrink-0 flex items-center gap-2">
              <!-- Ação para versão PUBLICADA -->
              <PrimaryButton
                v-if="version.status === 'PUBLISHED'"
                value="Criar Nova Versão para Edição"
                @click="createNewVersion(version.id)"
                customColor="bg-blue-600 hover:bg-blue-700"
              />

              <!-- Ações para versão RASCUNHO -->
              <template v-if="version.status === 'DRAFT'">
                <PrimaryButton
                  value="Editar Rascunho"
                  @click="goToEditPage(version.id)"
                  customColor="bg-green-600 hover:bg-green-700"
                />
                <PrimaryButton
                  value="Publicar Versão"
                  @click="publishVersion(version.id)"
                  customColor="bg-indigo-600 hover:bg-indigo-700"
                />
              </template>
              
               <!-- Nenhuma ação para versão ARQUIVADA -->
              <p v-if="version.status === 'ARCHIVED'" class="text-sm text-gray-400 italic">Versão arquivada</p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  </Whiteboard>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { getAccessToken } from '@/service/token';

// Import dos seus componentes de UI
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';

const route = useRoute();
const router = useRouter();
const isSidebarMinimized = inject('isSidebarMinimized', ref(false));

const versions = ref([]);
const isLoading = ref(true);
const error = ref(null);

const calculusId = computed(() => route.params.id);
const pageTitle = computed(() => {
  if (versions.value.length > 0) {
    return `Gerenciador de Versões: ${versions.value[0].description}`;
  }
  return 'Gerenciador de Versões';
});

// Função para buscar os dados da API
async function fetchVersions() {
  isLoading.value = true;
  error.value = null;
  try {
    const token = await getAccessToken();
    const response = await axios.get(`http://127.0.0.1:8000/csv/calculus/${calculusId.value}/versions/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    versions.value = response.data;
  } catch (err) {
    console.error("Erro ao buscar versões:", err);
    error.value = "Não foi possível carregar o histórico de versões. Tente novamente mais tarde.";
  } finally {
    isLoading.value = false;
  }
}

// Ação para criar uma nova versão
async function createNewVersion(publishedId) {
  if (!confirm("Tem certeza que deseja criar uma nova versão para edição? Isso fará uma cópia de todos os arquivos do cálculo publicado.")) {
    return;
  }
  try {
    const token = await getAccessToken();
    const response = await axios.post('http://127.0.0.1:8000/csv/calculus/create-version/', 
      { calculus_id: publishedId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    const newDraftId = response.data.new_calculus.id;
    alert('Nova versão de rascunho criada com sucesso!');
    router.push({ name: 'editversion', params: { id: newDraftId } });

  } catch (err) {
    console.error("Erro ao criar nova versão:", err);
    alert(`Falha ao criar nova versão: ${err.response?.data?.error || 'Erro desconhecido'}`);
  }
}

// Ação para publicar um rascunho
async function publishVersion(draftId) {
  if (!confirm("Atenção: Publicar esta versão irá arquivar a versão publicada anterior. Deseja continuar?")) {
    return;
  }
  try {
    const token = await getAccessToken();
    await axios.post(`http://127.0.0.1:8000/csv/calculus/${draftId}/publish/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    alert('Versão publicada com sucesso!');
    await fetchVersions(); // Recarrega a lista para mostrar os status atualizados
    
  } catch (err) {
    console.error("Erro ao publicar versão:", err);
    alert(`Falha ao publicar versão: ${err.response?.data?.error || 'Erro desconhecido'}`);
  }
}

// Função para navegar para a página de edição
function goToEditPage(draftId) {
  router.push({ name: 'editversion', params: { id: draftId } });
}

// Helper para estilização do status
function getStatusClass(status) {
  const classes = {
    PUBLISHED: 'bg-green-100 text-green-800',
    DRAFT: 'bg-yellow-100 text-yellow-800',
    ARCHIVED: 'bg-gray-100 text-gray-800',
  };
  return classes[status] || 'bg-gray-100';
}

// Carrega os dados quando o componente é montado
onMounted(fetchVersions);
</script>