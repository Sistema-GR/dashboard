<template>
  <Whiteboard :title="pageTitle" :isSidebarMinimized="isSidebarMinimized">
    <div class="p-4 sm:p-6 lg:p-8 w-full">

      <div v-if="isLoading" class="text-center py-10">
        <p class="text-gray-600">Carregando histórico de versões...</p>
      </div>

      <div v-else-if="error" class="text-center py-10 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-700 font-semibold">Ocorreu um erro</p>
        <p class="text-red-600 mt-1">{{ error }}</p>
      </div>

      <div v-else-if="versionTree.length > 0" class="max-w-5xl mx-auto">
        <ul class="version-tree-root space-y-4">
          <VersionItem
            v-for="version in versionTree"
            :key="version.id"
            :version="version"
            @create-new-version="createNewVersion"
            @go-to-edit="goToEditPage"
            @go-to-view="goToViewPage"
          />
        </ul>
      </div>
      
    </div>
  </Whiteboard>
</template>

<script setup>
import { ref, onMounted, computed, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiClient } from '@/service/apiService';
import { getAccessToken } from '@/service/token';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import VersionItem from '@/components/VersionItem/VersionItem.vue';

const route = useRoute();
const router = useRouter();
const isSidebarMinimized = inject('isSidebarMinimized', ref(false));

const versions = ref([]);
const isLoading = ref(true);
const error = ref(null);

const pageTitle = computed(() => {
  if (versions.value.length > 0) {
    return `Gerenciador de Versões: ${versions.value[0].description}`;
  }
  return 'Gerenciador de Versões';
});

const versionTree = computed(() => {
  if (!versions.value.length) return [];

  const versionMap = new Map(versions.value.map(v => [v.id, { ...v, children: [] }]));
  const tree = [];

  for (const version of versionMap.values()) {
    if (version.created_from_id && versionMap.has(version.created_from_id)) {
      const parent = versionMap.get(version.created_from_id);
      parent.children.push(version);
    } else {
      tree.push(version);
    }
  }
  tree.sort((a, b) => a.version_number - b.version_number);
  
  return tree;
});

async function fetchCalculusVersions() {
  isLoading.value = true;
  error.value = null;
  let calculusIdToFetch = null;

  try {
    const token = await getAccessToken();

    if (route.params.id) {
      calculusIdToFetch = route.params.id;
    } else {
      const activeCalcResponse = await apiClient.get('/csv/opencalc/get-active-info/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      calculusIdToFetch = activeCalcResponse.data.calculus_id;
    }

    if (!calculusIdToFetch) {
        throw new Error("Não foi possível determinar um cálculo para buscar. Nenhum OpenCalc ativo encontrado ou ID inválido.");
    }

    const versionsResponse = await apiClient.get(`/csv/calculus/${calculusIdToFetch}/versions/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    versions.value = versionsResponse.data;

  } catch (err) {
    console.error("[VersionManager] Erro ao buscar histórico de versões:", err);
    error.value = err.message || "Não foi possível carregar o histórico de versões. Verifique se o cálculo existe ou se há um OpenCalc ativo.";
  } finally {
    isLoading.value = false;
  }
}

async function createNewVersion(sourceId) {
  if (!confirm("Tem certeza que deseja criar uma nova versão para edição a partir deste ponto?")) {
    return;
  }
  try {
    const token = await getAccessToken();
    const response = await apiClient.post('/csv/calculus/create-version/', 
      { calculus_id: sourceId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    await fetchCalculusVersions();
    alert('Nova versão de rascunho criada com sucesso!');

  } catch (err) {
    console.error("Erro ao criar nova versão:", err);
    alert(`Falha ao criar nova versão: ${err.response?.data?.error || 'Erro desconhecido'}`);
  }
}

function goToEditPage(draftId) {
  router.push({ name: 'editversion', params: { id: draftId } });
}

function goToViewPage(archivedId) {
  router.push({ 
    name: 'editversion', 
    params: { id: archivedId },
    query: { viewOnly: 'true' }
  });
}

function getStatusClass(isFinalized) {
  if (isFinalized) return 'bg-green-100 text-green-800';
  return 'bg-yellow-100 text-yellow-800';
}

onMounted(fetchCalculusVersions);
</script>