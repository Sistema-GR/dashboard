<template>
  <Whiteboard :title="pageTitle" :isSidebarMinimized="isSidebarMinimized">
    <!-- Overlay de Carregamento -->
    <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center z-50">
      <p class="text-xl font-semibold text-[#3459a2]">{{ loadingMessage }}</p>
      <p class="text-gray-500 mt-2">Isso pode levar alguns instantes. Por favor, aguarde.</p>
    </div>

    <div class="w-full">
      <div v-if="isViewOnlyMode">
        <div class="mb-6   px-4 sm:px-10 p-8">
          <p class="text-20 font-semibold text-black">Visualizando Dados Processados</p>
          <p class="text-15 text-black">Estes são os resultados finais que foram publicados para esta versão. A edição não está disponível para versões arquivadas.</p>
        </div>
        <!-- Removido o padding da tabela -->
        <PrimaryTable 
          :key="tableKey"
          :route="`calculus/${calculusId}/processed-file/criterios`"
          :isDynamicRoute="true" 
          :is-view-only="true"
        />
      </div>

      <div v-else>
        <!-- Seleção de arquivo e botões -->
        <div class="grid px-4 sm:px-10 pt-8 grid-cols-1 md:grid-cols-2 gap-8 items-center mb-10">
          <div class="max-w-md">
            <label for="file-selector" class="block text-15 font-medium text-black mb-3">Selecione o arquivo de entrada para editar:</label>
            <select id="file-selector" v-model="selectedFileToEdit" class="mt-1 block w-full pl-3 pr-10 p-3 text-15 border-[#c2ddfd] focus:outline-none focus:ring-[#3459a2] focus:border-[#3459a2] rounded-[10px] shadow">
              <option v-for="file in editableFiles" :key="file.key" :value="file.key">{{ file.name }}</option>
            </select>
          </div>
          
          <div class="md:text-right flex items-center justify-end gap-4">
            <PrimaryButton
              value="Substituir Arquivo"
              @click="showReplaceModal = true"
              customColor="bg-[#f7b731] hover:bg-[#e0a800] w-48 h-12 text-15 font-semibold text-white rounded-[10px]"
              title="Substituir um arquivo de entrada completo por uma nova versão."
            />
            <PrimaryButton 
              value="Visualizar Criterios"
              @click="showSummaryModal = true"
              customColor="bg-[#5a67d8] hover:bg-[#434190] w-48 h-12 text-15 font-semibold text-white rounded-[10px]"
              title="Abre uma visualização dos resultados processados (critérios) com base nos dados atuais."
            />
            <PrimaryButton 
              value="Reprocessar Dados"
              @click="reprocessVersion"
              customColor="bg-[#3459a2] hover:bg-[#27477a] w-48 h-12 text-15 font-semibold text-white rounded-[10px]"
              title="Executa novamente o cálculo com os dados atuais, sem publicar a versão."
            />
            <PrimaryButton 
              value="Finalizar Edição"
              @click="publishVersion"
              customColor="bg-[#2d8f4b] hover:bg-[#23703a] w-48 h-12 text-15 font-semibold text-white rounded-[10px]"
              title="Marca esta versão como finalizada e a envia para a tela de promoção."
            />
          </div>
        </div>

        </div>
        <!-- Filtros -->
        <div class="mb-8 px-4 sm:px-10 flex flex-col md:flex-row gap-6">
          <div class="flex-1">
            <Search 
              :columns="filterableColumns"
              @search="handleSearch" 
            />
          </div>
        </div>
        <!-- Removido o padding da tabela -->
        <PrimaryTable 
          v-if="selectedFileToEdit"
          :key="tableKey"
          :route="tableRoute"
          :isDynamicRoute="true"
          :searchCriteria="searchCriteria"  
          @row-updated="handleRowUpdate"
          @columns-loaded="handleColumnsLoaded"
          :is-view-only="isViewOnlyMode"
          :editable-columns="currentEditableColumns"
          :file-key="selectedFileToEdit"
          @show-hover="handleShowHover"
          @hide-hover="handleHideHover"
          :is-appeals-mode="isAppealsModeActive"
        />
      </div>
  </Whiteboard>

  <FileReplaceModal
    :show="showReplaceModal"
    :calculus-id="calculusId"
    :editable-files="editableFiles"
    @close="showReplaceModal = false"
    @file-replaced="handleFileReplaced"
  />

  <div v-if="showSummaryModal" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col">
      <header class="p-4 border-b flex justify-between items-center">
        <div>
          <h2 class="text-xl font-bold text-[#3459a2]">Resumo do Cálculo - Critérios Processados</h2>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="downloadSummaryFile"
            :disabled="isDownloading"
            class="flex items-center gap-2 px-4 py-2 text-15 bg-gray-100 text-gray-700 rounded-[10px] hover:bg-gray-200 transition disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{{ isDownloading ? 'Baixando...' : 'Baixar CSV' }}</span>
          </button>
          <button @click="showSummaryModal = false" class="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
        </div>
      </header>
      <div class="p-4 border-b">
        <Search
          :columns="summaryTableColumns"
          @search="handleSummarySearch"
        />
      </div>
      <main class="flex-grow overflow-auto p-1">
        <PrimaryTable
            :key="'summary-table-' + calculusId"
            :route="`calculus/${calculusId}/processed-file/criterios`"
            :isDynamicRoute="true"
            :is-view-only="true"
            :searchCriteria="summarySearchCriteria"
            @columns-loaded="handleSummaryColumnsLoaded"
        />
      </main>
    </div>
  </div>

  <Teleport to="body">
    <EditHover
      v-if="hoveredAppealData"
      :appeal-data="hoveredAppealData"
      :style="hoverStyle"
    />
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { getAccessToken } from '@/service/token';

import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import PrimaryTable from '@/components/Table/PrimaryTable.vue';
import Search from '@/components/Search/Search.vue';
import EditHover from '@/components/EditHover/EditHover.vue';
import FileReplaceModal from '@/components/FileReplaceModal/FileReplaceModal.vue';

const route = useRoute();
const router = useRouter();

const isSidebarMinimized = inject('isSidebarMinimized', ref(false));
const tableKey = ref(0);
const isLoading = ref(false);
const loadingMessage = ref('Carregando...');

const showReplaceModal = ref(false);

const calculusId = computed(() => route.params.id);
const isViewOnlyMode = computed(() => route.query.viewOnly === 'true');

const searchCriteria = ref({ query: '', column: 'all' });
const filterableColumns = ref([]);

const isAppealsModeActive = ref(false);
const hoveredAppealData = ref(null);
const hoverPosition = ref({ top: '0px', left: '0px' });

const showSummaryModal = ref(false);
const summarySearchCriteria = ref({ query: '', column: 'all' });
const summaryTableColumns = ref([]);

const isDownloading = ref(false);

const downloadSummaryFile = async () => {
  isDownloading.value = true;
  try {
    const token = await getAccessToken();

    const infoResponse = await axios.get(
      `/csv/calculus/${calculusId.value}/file-info/criterios/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fileId = infoResponse.data.file_id;
    if (!fileId) {
      throw new Error("ID do arquivo não foi encontrado.");
    }

    const downloadResponse = await axios.get(
        `/csv/api/data-files/${fileId}/download/`,
        {
            headers: { Authorization: `Bearer ${token}` },
            responseType: 'blob', 
        }
    );

    const url = window.URL.createObjectURL(new Blob([downloadResponse.data]));
    const link = document.createElement('a');
    link.href = url;
    
    const contentDisposition = downloadResponse.headers['content-disposition'];
    let filename = 'criterios_processados.csv'; // Nome padrão
    if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length === 2) {
            filename = filenameMatch[1];
        }
    }

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Erro ao baixar o arquivo:", err);
    alert("Não foi possível baixar o arquivo de resumo. Verifique o console para mais detalhes.");
  } finally {
    isDownloading.value = false;
  }
};

const hoverStyle = computed(() => ({
  position: 'fixed', 
  top: hoverPosition.value.top,
  left: hoverPosition.value.left,
  transform: 'translate(15px, 15px)',
  zIndex: 9999, 
}));

function handleFileReplaced() {
  showReplaceModal.value = false;
  alert('Arquivo substituído e dados reprocessados com sucesso! A tabela será atualizada.');
  tableKey.value++; 
}

function handleShowHover(appealData, event) {
  if (!appealData || Object.keys(appealData).length === 0) return;
  
  hoveredAppealData.value = appealData;
  hoverPosition.value = {
    top: `${event.clientY}px`,
    left: `${event.clientX}px`,
  };
}

function handleHideHover() {
  hoveredAppealData.value = null;
}

const handleSearch = (criteria) => {
  searchCriteria.value = criteria;
};

const handleColumnsLoaded = (columns) => {
  filterableColumns.value = columns;
}

const handleSummarySearch = (criteria) => {
  summarySearchCriteria.value = criteria;
};

const handleSummaryColumnsLoaded = (columns) => {
  summaryTableColumns.value = columns;
};

const pageTitle = computed(() => {
  return isViewOnlyMode.value ? "Visualizando Versão Arquivada" : "Editando Rascunho";
});

const selectedFileToEdit = ref('funcionarios'); 

const appealsModeFiles = [
  { name: 'Funcionários', key: 'funcionarios' },
  { name: 'Demissões', key: 'demissoes' },
  { name: 'Frequência', key: 'frequencia' },
  { name: 'Atividades', key: 'atividades' },
  { name: 'Formações', key: 'formacoes' },
];

const allEditableFiles  = ref([
  { name: 'Funcionários', key: 'funcionarios' },
  { name: 'Demissões', key: 'demissoes' },
  { name: 'Frequência', key: 'frequencia' },
  { name: 'Atividades', key: 'atividades' },
  { name: 'Formações', key: 'formacoes' },
  { name: 'Dias Não Contabilizados', key: 'dias_nao_contabilizados' },
  { name: 'Motivos de Infrequência', key: 'motivos_infrequencia' },
  { name: 'Metas por Etapa (UE)', key: 'etapas_metas_ue' },
  { name: 'Percentual de Gratificação (UE)', key: 'ues_perc_gr' },
  { name: 'Tipo de Local', key: 'tipo_local' },
  { name: 'Definição de Etapas (Professores)', key: 'definicao_etapas' },
  { name: 'Aprender Mais', key: 'aprender_mais' },
  { name: 'Dados Gerais (Nomes de Unidades)', key: 'dados_gerais' },
  { name: 'Função, Grupo e Etapas', key: 'funcao_grupo_etapas' },
]);


const editableFiles = computed(() => {
  return isAppealsModeActive.value ? appealsModeFiles : allEditableFiles.value;
});

const tableRoute = computed(() => {
  let baseRoute = `calculus/${calculusId.value}/cleaned-file/${selectedFileToEdit.value}`;
  if (isAppealsModeActive.value) {
    return `${baseRoute}?appeals_only=true`;
  }
  return baseRoute;
});


watch([selectedFileToEdit, isAppealsModeActive], () => {
  tableKey.value++;
});

const editableColumnsConfig = {
  funcionarios: [
    'codigo_local_alocacao', 'nome_local_alocacao', 'cargo',
    'vinculo', 'situacao', 'codigo_unidade',
    'nome_unidade', 'nome_disciplina','codigo_disciplina', 'carga_horaria_real',
    'carga_horaria_atividade', 'carga_horaria_termo'
  ],
  ues_perc_gr: [
    'gratificacao_bruto_etapa_1', 'gratificacao_final_etapa_1','gratificacao_bruto_etapa_2',
    'gratificacao_final_etapa_2','gratificacao_bruto_etapa_3', 'gratificacao_final_etapa_3'
  ],
  frequencia: ['motivo', 'local', 'descricao_local', 'inicio_afastamento', 'fim_afastamento', 'cargo'],
  etapas_metas_ue: ['tem_anos_iniciais_1', 'tem_anos_iniciais_2', 'tem_anos_finais', 'tipo'],
  demissoes: ['admissao', 'demissao', 'causa', 'cargo', 'situacao'],
  funcao_grupo_etapas: ['grupo', 'etapa_1', 'etapa_2', 'etapa_3'],
  aprender_mais: ['etapa_1', 'etapa_2', 'etapa_3'],
  atividades: ['sim', 'nao', 'observacao'],
  formacoes: ['recebe_gratificacao'],
  dias_nao_contabilizados: [],
  motivos_infrequencia: [],
  tipo_local: [],
  definicao_etapas: [],
  dados_gerais: [],
};

const currentEditableColumns = computed(() => {
  const fileKey = selectedFileToEdit.value;
  const columnKeys = editableColumnsConfig[fileKey];

  if (!columnKeys) {
    return null; 
  }
  return columnKeys.map(key => ({ key }));
});

async function handleRowUpdate(updatedData) {
  const identifierKey = ['matricula', 'cpf', 'motivo', 'nome_unidade_sgp', 'turma', 'descricao'].find(key => updatedData.hasOwnProperty(key));
  
  if (!identifierKey) {
    alert("Erro: A linha não possui uma coluna identificadora única (ex: matrícula, cpf). A edição não pode ser salva.");
    tableKey.value++;
    return;
  }
  
  const identifierValue = updatedData[identifierKey];
  const updatedFields = { ...updatedData };
  delete updatedFields[identifierKey];

  loadingMessage.value = 'Salvando alterações...';
  isLoading.value = true;
  try {
    const token = await getAccessToken();
    await axios.patch(
      `/csv/calculus/${calculusId.value}/update-cleaned-file/`,
      {
        file_key: selectedFileToEdit.value,
        row_identifier: { [identifierKey]: identifierValue },
        updated_data: updatedFields
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (err) {
    console.error("Erro ao atualizar a linha:", err);
    alert(`Falha ao atualizar dados: ${err.response?.data?.error || 'Erro desconhecido'}`);
    tableKey.value++;
  } finally {
    isLoading.value = false;
  }
}

async function reprocessVersion() {
  if (!confirm('Deseja reprocessar os dados desta versão? As edições salvas serão usadas para gerar novos resultados, mas a versão continuará como rascunho.')) {
    return;
  }
  
  loadingMessage.value = 'Reprocessando dados...';
  isLoading.value = true;
  try {
    const token = await getAccessToken();
    await axios.post(
      `/csv/calculus/${calculusId.value}/reprocess/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Dados reprocessados com sucesso! Você pode visualizar os novos resultados na aba "Resumo".');
  } catch (err) {
    console.error("Erro ao reprocessar:", err);
    alert(`Falha no reprocessamento: ${err.response?.data?.error || 'Erro desconhecido'}`);
  } finally {
    isLoading.value = false;
  }
}

async function publishVersion() {
  if (!confirm('Tem certeza que deseja finalizar a edição desta versão? Ela será marcada como "Publicada" e enviada para a tela de promoção, não podendo mais ser editada.')) {
    return;
  }
  
  loadingMessage.value = 'Finalizando e publicando...';
  isLoading.value = true;
  try {
    const token = await getAccessToken();
    await axios.post(
      `/csv/calculus/${calculusId.value}/publish/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Versão finalizada com sucesso! Redirecionando para a tela de promoção.');
    router.push({name: 'alloc'});
  } catch (err) {
    console.error("Erro ao publicar a versão:", err);
    alert(`Falha ao finalizar: ${err.response?.data?.error || 'Erro desconhecido'}`);
  } finally {
    isLoading.value = false;
  }
}

function toggleAppealsMode() {
  isAppealsModeActive.value = !isAppealsModeActive.value;
  const allowedKeys = ['funcionarios', 'demissoes', 'atividades', 'frequencia', 'formacoes'];
  if (isAppealsModeActive.value && !allowedKeys.includes(selectedFileToEdit.value)) {
    selectedFileToEdit.value = 'funcionarios';
  }
}

</script>