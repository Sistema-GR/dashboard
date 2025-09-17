<template>
  <Whiteboard :title="pageTitle" :isSidebarMinimized="isSidebarMinimized">
    <!-- Overlay de Carregamento para Ações em Tela Cheia -->
    <div v-if="isLoading" class="absolute inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center z-50">
      <p class="text-xl font-semibold text-gray-700">{{ loadingMessage }}</p>
      <p class="text-gray-500 mt-2">Isso pode levar alguns instantes. Por favor, aguarde.</p>
    </div>

    <div class="p-4 sm:p-6 lg:p-8 w-full">
      <div v-if="isViewOnlyMode">
        <div class="mb-4">
          <p class="text-lg font-semibold text-gray-800">Visualizando Dados Processados</p>
          <p class="text-sm text-gray-500">Estes são os resultados finais que foram publicados para esta versão. A edição não está disponível para versões arquivadas.</p>
        </div>
        <PrimaryTable 
          :key="tableKey"
          :route="`calculus/${calculusId}/processed-file/criterios`"
          :isDynamicRoute="true" 
          :is-view-only="true"
        />
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mb-8">
          <div class="max-w-md">
            <label for="file-selector" class="block text-sm font-medium text-gray-700">Selecione o arquivo de entrada para editar:</label>
            <select id="file-selector" v-model="selectedFileToEdit" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm">
              <option v-for="file in editableFiles" :key="file.key" :value="file.key">{{ file.name }}</option>
            </select>
          </div>
          <div class="md:text-right">
            <PrimaryButton 
              value="Reprocessar e Publicar Versão"
              @click="publishVersion"
              customColor="bg-green-600 hover:bg-green-700"
            />
          </div>
        </div>
        <div class="mt-6">
          <div class="mb-4">
            <Search 
              :columns="filterableColumns"
              @search="handleSearch" 
            />
          </div>
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
          />
        </div>
      </div>
    </div>
  </Whiteboard>
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

const route = useRoute();
const router = useRouter();
const isSidebarMinimized = inject('isSidebarMinimized', ref(false));
const tableKey = ref(0);
const isLoading = ref(false);
const loadingMessage = ref('Carregando...');

const calculusId = computed(() => route.params.id);
const isViewOnlyMode = computed(() => route.query.viewOnly === 'true');

const searchCriteria = ref({ query: '', column: 'all' });
const filterableColumns = ref([]);

const handleSearch = (criteria) => {
  searchCriteria.value = criteria;
};

const handleColumnsLoaded = (columns) => {
  filterableColumns.value = columns;
}

const pageTitle = computed(() => {
  return isViewOnlyMode.value ? "Visualizando Versão Arquivada" : "Editando Rascunho";
});

const selectedFileToEdit = ref('funcionarios'); 

const editableFiles = ref([
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

const tableRoute = computed(() => `calculus/${calculusId.value}/cleaned-file/${selectedFileToEdit.value}`);

watch(selectedFileToEdit, () => {
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
      `http://127.0.0.1:8000/csv/calculus/${calculusId.value}/update-cleaned-file/`,
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

async function publishVersion() {
  if (!confirm('Tem certeza que deseja publicar esta versão? Todos os dados serão reprocessados com base nas suas edições e esta versão se tornará a oficial.')) {
    return;
  }
  
  loadingMessage.value = 'Reprocessando e publicando...';
  isLoading.value = true;
  try {
    const token = await getAccessToken();
    await axios.post(
      `http://127.0.0.1:8000/csv/calculus/${calculusId.value}/publish/`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    alert('Versão publicada com sucesso!');
    router.push('/dashboard');
  } catch (err) {
    console.error("Erro ao publicar a versão:", err);
    alert(`Falha ao publicar: ${err.response?.data?.error || 'Erro desconhecido'}`);
  } finally {
    isLoading.value = false;
  }
}
</script>