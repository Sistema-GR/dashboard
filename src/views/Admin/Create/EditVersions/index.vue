<template>
  <Whiteboard :title="pageTitle" :isSidebarMinimized="isSidebarMinimized">
    <!-- Overlay de Carregamento para Ações em Tela Cheia -->
    <div v-if="isReprocessing" class="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center z-50">
      <p class="text-xl font-semibold text-gray-700">Reprocessando o cálculo...</p>
      <p class="text-gray-500 mt-2">Isso pode levar alguns instantes. Por favor, aguarde.</p>
    </div>

    <div class="p-4 sm:p-6 lg:p-8 w-full">
      <!-- Navegação em Abas -->
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="activeTab = tab.key"
            :class="[
              activeTab === tab.key
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>

      <!-- Conteúdo da Aba: Editar Dados -->
      <div v-if="activeTab === 'editData'" class="mt-6">
        <div class="mb-4">
          <Search 
            :columns="filterableColumns"
            @search="handleSearch" 
          />
        </div>
        <p class="text-gray-600 mb-4">
          Clique em "Edit" em uma linha para modificar seus valores. As alterações são salvas individualmente.
        </p>
        <PrimaryTable 
          :key="tableKey"
          :route="`calculus/${calculusId}/processed-file/criterios`"
          :isDynamicRoute="true" 
          :searchCriteria="searchCriteria"
          @row-updated="handleRowUpdate"
          :is-view-only="isViewOnlyMode"
          @columns-loaded="handleColumnsLoaded"
        />
      </div>

      <!-- Conteúdo da Aba: Gerenciar Arquivos -->
      <div v-if="activeTab === 'manageFiles'" class="mt-6 max-w-4xl mx-auto">
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md mb-6">
          <p class="text-yellow-800">
            <strong>Atenção:</strong> Substituir um arquivo de entrada fará com que o cálculo seja <strong class="font-bold">totalmente reprocessado</strong>. Quaisquer edições manuais feitas na aba "Editar Dados" serão perdidas.
          </p>
        </div>

        <ul class="space-y-3">
          <li v-for="file in fileTypes" :key="file.key" class="bg-white p-3 border rounded-lg flex justify-between items-center">
            <span class="font-medium text-gray-700">{{ file.name }}</span>
            <PrimaryButton 
              value="Substituir"
              @click="triggerFileInput(file.key)"
              customColor="bg-gray-600 hover:bg-gray-700 text-sm py-2 px-3"
            />
          </li>
        </ul>
        <input type="file" ref="fileInput" @change="handleFileChange" class="hidden" accept=".csv" />
      </div>
    </div>
  </Whiteboard>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { getAccessToken } from '@/service/token';

import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import PrimaryTable from '@/components/Table/PrimaryTable.vue';
import Search from '@/components/Search/Search.vue';

const route = useRoute();
const isSidebarMinimized = inject('isSidebarMinimized', ref(false));
const isViewOnlyMode = computed(() => route.query.viewOnly === 'true');

const pageTitle = computed(() => {
  if (isViewOnlyMode.value) {
    return "Visualizando Versão Arquivada";
  }
  return "Editando Rascunho";
});

const activeTab = ref('editData');
const isReprocessing = ref(false);
const fileInput = ref(null);
const selectedFileKey = ref(null);
const tableKey = ref(0); 
const searchCriteria = ref({ query: '', column: 'all' });
const filterableColumns = ref([]);


const handleSearch = (criteria) => {
  searchCriteria.value = criteria;
};

const handleColumnsLoaded = (columns) => {
  filterableColumns.value = columns;
}

const calculusId = computed(() => route.params.id);

const tabs = computed(() => {
  const allTabs = [
    { name: 'Visualizar Dados Processados', key: 'editData' },
    { name: 'Gerenciar Arquivos de Entrada', key: 'manageFiles' },
  ];
  if (isViewOnlyMode.value) {
    return allTabs.filter(tab => tab.key === 'editData');
  }
  return allTabs;
});

const fileTypes = ref([
  { name: 'Funcionários', key: 'funcionarios' }, { name: 'Demissões', key: 'demissoes' },
  { name: 'Frequência', key: 'frequencia' }, { name: 'Atividades', key: 'atividades' },
  { name: 'Formações', key: 'formacoes' }, { name: 'Dias Não Contabilizados', key: 'dias_nao_contabilizados' },
  { name: 'Motivos de Infrequência', key: 'motivos_infrequencia' }, { name: 'Metas por Etapa (UE)', key: 'etapas_metas_ue' },
  { name: 'Percentual de Gratificação (UE)', key: 'ues_perc_gr' }, { name: 'Tipo de Local', key: 'tipo_local' },
  { name: 'Definição de Etapas (Professores)', key: 'definicao_etapas' }, { name: 'Aprender Mais', key: 'aprender_mais' },
  { name: 'Dados Gerais (Nomes de Unidades)', key: 'dados_gerais' }, { name: 'Função, Grupo e Etapas', key: 'funcao_grupo_etapas' },
]);

function triggerFileInput(fileKey) {
  selectedFileKey.value = fileKey;
  fileInput.value.click();
}

async function handleFileChange(event) {
  const file = event.target.files[0];
  if (!file) return;

  isReprocessing.value = true;
  const formData = new FormData();
  formData.append('file', file);

  try {
    const token = await getAccessToken();
    await axios.post(
      `http://127.0.0.1:8000/csv/calculus/${calculusId.value}/replace-file/${selectedFileKey.value}/`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` } }
    );
    alert('Arquivo substituído e cálculo reprocessado com sucesso!');
    tableKey.value++; 
    activeTab.value = 'editData'; 
  } catch (err) {
    console.error("Erro ao substituir arquivo:", err);
    alert(`Falha ao substituir o arquivo: ${err.response?.data?.error || 'Erro desconhecido'}`);
  } finally {
    isReprocessing.value = false;
    fileInput.value.value = ''; 
  }
}

async function handleRowUpdate(updatedData) {
  const { matricula, ...updatedFields } = updatedData;
  
  try {
    const token = await getAccessToken();
    await axios.patch(
      `http://127.0.0.1:8000/csv/calculus/${calculusId.value}/update-data/`,
      {
        file_name: 'criterios', 
        row_identifier: { matricula: matricula },
        updated_data: updatedFields
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Linha atualizada com sucesso!');
  } catch (err) {
    console.error("Erro ao atualizar a linha:", err);
    alert(`Falha ao atualizar dados: ${err.response?.data?.error || 'Erro desconhecido'}`);
    tableKey.value++;
  }
}

</script>