<template>
  <Whiteboard :title="pageTitle" :isSidebarMinimized="isSidebarMinimized">
    
    <!-- Overlay de Carregamento Moderno -->
    <transition name="fade">
      <div v-if="isLoading" class="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col justify-center items-center z-[60]">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-xl font-bold text-blue-900">{{ loadingMessage }}</p>
        <p class="text-gray-500">Por favor, aguarde...</p>
      </div>
    </transition>

    <div class="w-full">
      <!-- MODO VISUALIZAÇÃO -->
      <div v-if="isViewOnlyMode" class="bg-blue-50 border-b border-blue-100 p-8 px-10">
        <div class="flex items-center gap-4 text-blue-800">
          <EyeIcon class="h-8 w-8" />
          <div>
            <h2 class="text-xl font-bold">Modo de Visualização</h2>
            <p class="text-sm opacity-80">Apenas leitura. Para editar, crie um novo rascunho a partir do gerenciador de versões.</p>
          </div>
        </div>
      </div>

      <!-- ÁREA DE CONTROLE (TOOLBAR) -->
      <div v-else class="px-6 py-3 lg:px-10 border-b border-gray-100 bg-white">
        <!-- 1ª Linha: Seleção e Contexto -->
        <div class="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-3">
          <div class="w-full max-w-xl">
            <label class="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Selecione o arquivo para editar</label>
            <div class="relative">
              <select 
                v-model="selectedFileToEdit" 
                class="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-semibold focus:ring-2 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option v-for="file in editableFiles" :key="file.key" :value="file.key">{{ file.name }}</option>
              </select>
              <ChevronDownIcon class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <button 
            @click="toggleAppealsMode"
            :class="isAppealsModeActive ? 'bg-orange-500 text-white border-orange-600' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'"
            class="flex items-center gap-2 px-6 py-3.5 rounded-xl border font-bold text-sm shadow-sm transition-all whitespace-nowrap"
          >
            <component :is="isAppealsModeActive ? XCircleIcon : AdjustmentsHorizontalIcon" class="h-5 w-5" />
            {{ isAppealsModeActive ? 'Sair do Modo Recurso' : 'Ativar Modo Recurso' }}
          </button>
        </div>

        <!-- 2ª Linha: Botões de Ação Agrupados -->
        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-gray-50 pt-6">
          
          <!-- Grupo: Ferramentas de Dados -->
          <div class="flex flex-wrap items-center gap-3">
            <button @click="showReplaceModal = true" class="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-xs uppercase tracking-tight transition-all shadow-sm">
              <ArrowUpTrayIcon class="h-4 w-4 text-amber-500" />
              Substituir Arquivo
            </button>
            <button @click="showSummaryModal = true" class="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-bold text-xs uppercase tracking-tight transition-all shadow-sm">
              <TableCellsIcon class="h-4 w-4 text-[#3459a2]" />
              Visualizar Critérios
            </button>
          </div>

          <!-- Grupo: Processamento e Entrega -->
          <div class="flex flex-wrap items-center gap-3">
            <button @click="reprocessVersion" class="flex items-center gap-2 px-6 py-3 bg-[#3459a2] text-white rounded-xl hover:bg-blue-700 font-bold text-xs uppercase tracking-tight transition-all shadow-lg shadow-blue-100">
              <ArrowPathIcon class="h-5 w-5" />
              Reprocessar Dados
            </button>
            <button @click="publishVersion" class="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-xs uppercase tracking-tight transition-all shadow-lg shadow-emerald-100">
              <CheckIcon class="h-5 w-5" />
              Finalizar Edição
            </button>
          </div>
        </div>
      </div>

      <!-- ÁREA DA TABELA -->
      <div class="p-6 lg:p-10 bg-gray-50/50 min-h-screen">
        <div class="max-w-[1600px] mx-auto">
          <!-- Busca -->
          <div class="mb-6 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
            <Search :columns="filterableColumns" @search="handleSearch" />
          </div>

          <!-- Tabela -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <PrimaryTable 
              v-if="selectedFileToEdit || isViewOnlyMode"
              :key="tableKey"
              :route="isViewOnlyMode ? `calculus/${calculusId}/processed-file/criterios` : tableRoute"
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
        </div>
      </div>
    </div>

    <!-- Modais (Mantidos conforme original) -->
    <FileReplaceModal
      :show="showReplaceModal"
      :calculus-id="calculusId"
      :editable-files="editableFiles"
      @close="showReplaceModal = false"
      @file-replaced="handleFileReplaced"
    />

    <!-- Modal de Resumo -->
    <transition name="fade">
      <div v-if="showSummaryModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="showSummaryModal = false"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden">
          <header class="px-8 py-3 border-b bg-gray-50 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">Resumo dos Critérios Processados</h2>
            <div class="flex items-center gap-3">
              <button @click="downloadSummaryFile" class="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-sm">
                <ArrowDownTrayIcon class="h-4 w-4" /> Exportar CSV
              </button>
              <button @click="showSummaryModal = false" class="p-2 hover:bg-gray-100 rounded-full"><XMarkIcon class="h-6 w-6 text-gray-400" /></button>
            </div>
          </header>
          <div class="p-4 bg-white border-b"><Search :columns="summaryTableColumns" @search="handleSummarySearch" /></div>
          <div class="flex-grow overflow-auto"><PrimaryTable :route="`calculus/${calculusId}/processed-file/criterios`" :isDynamicRoute="true" :is-view-only="true" :searchCriteria="summarySearchCriteria" @columns-loaded="handleSummaryColumnsLoaded" /></div>
        </div>
      </div>
    </transition>

    <Teleport to="body">
      <EditHover v-if="hoveredAppealData" :appeal-data="hoveredAppealData" :style="hoverStyle" />
    </Teleport>
  </Whiteboard>
</template>

<script setup>
import { ref, computed, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiClient } from '@/service/apiService';
import { getAccessToken } from '@/service/token';

import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryTable from '@/components/Table/PrimaryTable.vue';
import Search from '@/components/Search/Search.vue';
import EditHover from '@/components/EditHover/EditHover.vue';
import FileReplaceModal from '@/components/FileReplaceModal/FileReplaceModal.vue';

// Ícones
import { 
  ArrowUpTrayIcon, ArrowPathIcon, TableCellsIcon, CheckIcon, 
  ChevronDownIcon, EyeIcon, XCircleIcon, AdjustmentsHorizontalIcon,
  XMarkIcon, ArrowDownTrayIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const router = useRouter();

// Injeção e Estados (Mantido conforme original)
const isSidebarMinimized = inject('isSidebarMinimized', ref(false));
const tableKey = ref(0);
const isLoading = ref(false);
const loadingMessage = ref('Carregando...');
const showReplaceModal = ref(false);
const showSummaryModal = ref(false);
const isAppealsModeActive = ref(false);
const selectedFileToEdit = ref('funcionarios');
const calculusId = computed(() => route.params.id);
const isViewOnlyMode = computed(() => route.query.viewOnly === 'true');
const searchCriteria = ref({ query: '', column: 'all' });
const summarySearchCriteria = ref({ query: '', column: 'all' });
const hoveredAppealData = ref(null);
const hoverPosition = ref({ top: '0px', left: '0px' });
const filterableColumns = ref([]);
const summaryTableColumns = ref([]);
const isDownloading = ref(false);

const pageTitle = computed(() => isViewOnlyMode.value ? "Monitor de Dados Processados" : "Edição de Dados de Entrada");

// Funções de Busca e Download (Lógica Original Preservada)
const handleSearch = (c) => searchCriteria.value = c;
const handleSummarySearch = (c) => summarySearchCriteria.value = c;
const handleColumnsLoaded = (cols) => filterableColumns.value = cols;
const handleSummaryColumnsLoaded = (cols) => summaryTableColumns.value = cols;

const downloadSummaryFile = async () => {
  isDownloading.value = true;
  try {
    const token = await getAccessToken();

    const infoResponse = await apiClient.get(
      `/csv/calculus/${calculusId.value}/file-info/criterios/`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const fileId = infoResponse.data.file_id;
    if (!fileId) {
      throw new Error("ID do arquivo não foi encontrado.");
    }

    const downloadResponse = await apiClient.get(
        `/csv/data-files/${fileId}/download/`,
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

async function reprocessVersion() {
  if (!confirm('Deseja reprocessar os dados?')) return;
  loadingMessage.value = 'Reprocessando...';
  isLoading.value = true;
  try {
    const token = await getAccessToken();
    await apiClient.post(`/csv/calculus/${calculusId.value}/reprocess/`, {}, { headers: { Authorization: `Bearer ${token}` } });
    alert('Reprocessado!');
  } catch (err) { alert('Erro ao reprocessar'); }
  finally { isLoading.value = false; }
}

async function publishVersion() {
  if (!confirm('Finalizar edição?')) return;
  loadingMessage.value = 'Finalizando...';
  isLoading.value = true;
  try {
    const token = await getAccessToken();
    await apiClient.post(`/csv/calculus/${calculusId.value}/publish/`, {}, { headers: { Authorization: `Bearer ${token}` } });
    router.push({name: 'previousresults'});
  } catch (err) { alert('Erro ao finalizar'); }
  finally { isLoading.value = false; }
}

const tableRoute = computed(() => {
  let base = `calculus/${calculusId.value}/cleaned-file/${selectedFileToEdit.value}`;
  return isAppealsModeActive.value ? `${base}?appeals_only=true` : base;
});

// Outras funções e configurações omitidas para brevidade (Manter as originais do seu script)
// ... (Copiar o restante das constantes do script original: editableFiles, allEditableFiles, handleRowUpdate, etc)

function toggleAppealsMode() {
  isAppealsModeActive.value = !isAppealsModeActive.value;
}

watch([selectedFileToEdit, isAppealsModeActive], () => tableKey.value++);

const hoverStyle = computed(() => ({
  position: 'fixed', 
  top: hoverPosition.value.top,
  left: hoverPosition.value.left,
  transform: 'translate(15px, 15px)',
  zIndex: 9999, 
}));

function handleShowHover(data, ev) {
  hoveredAppealData.value = data;
  hoverPosition.value = { top: `${ev.clientY}px`, left: `${ev.clientX}px` };
}
function handleHideHover() { hoveredAppealData.value = null; }

// --- Colunas Editáveis e Files (Devem ser trazidos do código original) ---
const editableFiles = computed(() => isAppealsModeActive.value ? [
  { name: 'Funcionários', key: 'funcionarios' },
  { name: 'Demissões', key: 'demissoes' },
  { name: 'Frequência', key: 'frequencia' },
  { name: 'Atividades', key: 'atividades' },
  { name: 'Formações', key: 'formacoes' },
] : allEditableFiles.value);

const allEditableFiles = ref([
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

const currentEditableColumns = computed(() => {
  const config = {
    funcionarios: ['codigo_local_alocacao', 'nome_local_alocacao', 'cargo', 'vinculo', 'situacao', 'codigo_unidade', 'nome_unidade', 'nome_disciplina','codigo_disciplina', 'carga_horaria_real', 'carga_horaria_atividade', 'carga_horaria_termo'],
    ues_perc_gr: ['gratificacao_bruto_etapa_1', 'gratificacao_final_etapa_1','gratificacao_bruto_etapa_2', 'gratificacao_final_etapa_2','gratificacao_bruto_etapa_3', 'gratificacao_final_etapa_3'],
    frequencia: ['motivo', 'local', 'descricao_local', 'inicio_afastamento', 'fim_afastamento', 'cargo'],
    etapas_metas_ue: ['tem_anos_iniciais_1', 'tem_anos_iniciais_2', 'tem_anos_finais', 'tipo'],
    demissoes: ['admissao', 'demissao', 'causa', 'cargo', 'situacao'],
    funcao_grupo_etapas: ['grupo', 'etapa_1', 'etapa_2', 'etapa_3'],
    aprender_mais: ['etapa_1', 'etapa_2', 'etapa_3'],
    atividades: ['sim', 'nao', 'observacao'],
    formacoes: ['recebe_gratificacao'],
  };
  const keys = config[selectedFileToEdit.value];
  return keys ? keys.map(k => ({ key: k })) : null;
});

async function handleRowUpdate(updatedData) {
    const identifierKey = ['matricula', 'cpf', 'motivo', 'nome_unidade_sgp', 'turma', 'descricao'].find(key => updatedData.hasOwnProperty(key));
    if (!identifierKey) { tableKey.value++; return; }
    const identifierValue = updatedData[identifierKey];
    const updatedFields = { ...updatedData };
    delete updatedFields[identifierKey];
    loadingMessage.value = 'Salvando...';
    isLoading.value = true;
    try {
        const token = await getAccessToken();
        await apiClient.patch(`/csv/calculus/${calculusId.value}/update-cleaned-file/`, {
            file_key: selectedFileToEdit.value,
            row_identifier: { [identifierKey]: identifierValue },
            updated_data: updatedFields
        }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) { alert('Erro ao salvar'); tableKey.value++; }
    finally { isLoading.value = false; }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>