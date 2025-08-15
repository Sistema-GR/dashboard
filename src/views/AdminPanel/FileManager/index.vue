<template>
  <Whiteboard title="Gerenciamento de Arquivos" :isSidebarMinimized="isSidebarMinimized">
    <div class="flex w-full flex-col gap-5 my-3 px-4 sm:px-10">
      <!-- Seção de Arquivos Processados -->
      <div>
        <div class="flex items-center justify-between cursor-pointer bg-gray-100 p-3 rounded-[10px]" @click="toggleProcessed">
          <h2 class="text-20 font-semibold text-gray-800">Arquivos Processados</h2>
          <ChevronDownIcon class="h-5 w-5 text-gray-500 transition-transform" :class="{ 'rotate-180': isProcessedOpen }" />
        </div>
        <transition name="fade">
          <div v-show="isProcessedOpen">
            <div v-for="file in processedFiles" :key="file.id" class="bg-white border border-gray-200 rounded-[10px] shadow-md p-4 mt-2">
              <div class="flex flex-col">
                <div class="flex items-center justify-between cursor-pointer" @click="toggleFile(file)">
                  <div class="flex items-center space-x-3">
                    <DocumentIcon class="h-6 w-6 text-gray-500" />
                    <h3 class="text-15 font-semibold text-gray-700">{{ file.name }}</h3>
                  </div>
                  <ChevronDownIcon class="h-5 w-5 text-gray-500 transition-transform" :class="{ 'rotate-180': file.isOpen }" />
                </div>
                <transition name="fade">
                  <div v-show="file.isOpen" class="ml-6 mt-2 space-y-2">
                    <p class="text-gray-500 text-md">{{ file.filename }}</p>
                    <div class="flex justify-end">
                      <button class="bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-blue-700 transition" @click="baixarArquivo(file.filename)">
                        <CloudArrowDownIcon class="h-5 w-5 inline mr-1" /> Download
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Seção de Arquivos Importados -->
      <div>
        <div class="flex items-center justify-between cursor-pointer bg-gray-100 p-3 rounded-[10px]" @click="toggleImported">
          <h2 class="text-20 font-semibold text-gray-800">Arquivos Importados</h2>
          <ChevronDownIcon class="h-5 w-5 text-gray-500 transition-transform" :class="{ 'rotate-180': isImportedOpen }" />
        </div>
        <transition name="fade">
          <div v-show="isImportedOpen">
            <div v-for="file in importedFiles" :key="file.id" class="bg-white border border-gray-200 rounded-[10px] shadow-md p-4 mt-2">
              <div class="flex flex-col">
                <div class="flex items-center justify-between cursor-pointer" @click="toggleFile(file)">
                  <div class="flex items-center space-x-3">
                    <DocumentIcon class="h-6 w-6 text-gray-500" />
                    <h3 class="text-15 font-semibold text-gray-700">{{ file.name }}</h3>
                  </div>
                  <ChevronDownIcon class="h-5 w-5 text-gray-500 transition-transform" :class="{ 'rotate-180': file.isOpen }" />
                </div>
                <transition name="fade">
                  <div v-show="file.isOpen" class="ml-6 mt-2 space-y-2">
                    <p class="text-gray-500 text-md">{{ file.filename }}</p>
                    <div class="flex justify-end space-x-3">
                      <button class="bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-blue-700 transition" @click="fazerEdicao">
                        <CloudArrowDownIcon class="h-5 w-5 inline mr-1" /> Download
                      </button>
                      <button 
                        class="bg-yellow-600 text-white px-4 py-2 rounded-[10px] hover:bg-yellow-700 transition"
                        @click="fazerEdicao"
                      >
                        <PencilIcon class="h-5 w-5 inline mr-1" /> Editar
                      </button>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
          </div>
        </transition>
      </div>
        <!-- Botões de ação -->
        <div class="flex justify-end gap-4">
          <button @click="$router.push('/admin/dashboard')" class="bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-blue-700 transition">
            Voltar
          </button>
          <button class="bg-red-600 text-white px-4 py-2 rounded-[10px] hover:bg-red-700 transition" @click="fazerRecalculo">
            Recalcular
          </button>
        </div>
    </div>
  </Whiteboard>
</template>

<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import {
  downloadAprenderMaisCSV,
  downloadAtividadesCSV,
  downloadCriteriosCSV,
  downloadDadosGeraisCSV,
  downloadDefinicaoEtapasCSV,
  downloadDemissoesCSV,
  downloadDiasNaoContabilizadosCSV,
  downloadErrosGruposCSV,
  downloadEtapasMetasCSV,
  downloadFormacoesCSV,
  downloadFrequenciaCSV,
  downloadMotivosInfrequenciaCSV,
  downloadPercentualGratificacaoCSV,
  downloadTipoLocalCSV,
  downloadFilteredFuncionariosCSV,
  downloadGruposAtualizadoCSV,
  downloadTempoAtuacaoCSV

} from '@/service/download';
import { ChevronDownIcon, CloudArrowDownIcon, PencilIcon } from "@heroicons/vue/24/outline";
import { DocumentIcon } from '@heroicons/vue/24/solid';
import { computed, inject, ref } from 'vue';

export default {
  components: { Whiteboard, ChevronDownIcon, CloudArrowDownIcon, PencilIcon, DocumentIcon },

  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized');
    const isProcessedOpen = ref(true);
    const isImportedOpen = ref(true);

    const files = ref([
      { id: 1, name: 'Aprender Mais', filename: 'aprender_mais.csv', type: 'imported', isOpen: false },
      { id: 2, name: 'Atividades', filename: 'atividades.csv', type: 'imported', isOpen: false },
      { id: 3, name: 'Dados Gerais', filename: 'dados_gerais.csv', type: 'imported', isOpen: false },
      { id: 4, name: 'Definição Etapas', filename: 'definicao_etapa.csv', type: 'imported', isOpen: false },
      { id: 5, name: 'Demissões', filename: 'demissoes.csv', type: 'imported', isOpen: false },
      { id: 6, name: 'Dias Não Contabilizados', filename: 'dias_nao_contabilizados.csv', type: 'imported', isOpen: false },
      { id: 7, name: 'Etapas Metas', filename: 'etapas_metas.csv', type: 'imported', isOpen: false },
      { id: 8, name: 'Formações', filename: 'formacoes.csv', type: 'imported', isOpen: false },
      { id: 9, name: 'Frequência', filename: 'frequencia.csv', type: 'imported', isOpen: false },
      { id: 10, name: 'Funcionário', filename: 'funcionarios.csv', type: 'imported', isOpen: false },
      { id: 11, name: 'Funções Grupos Etapas', filename: 'funcao_grupo_etapas.csv', type: 'imported', isOpen: false },
      { id: 12, name: 'Motivos Infrequência', filename: 'motivos_infrequencia.csv', type: 'imported', isOpen: false },
      { id: 13, name: 'Tipo Local', filename: 'tipo_local.csv', type: 'imported', isOpen: false },
      { id: 14, name: 'Ues Perc Gr', filename: 'ues_perc_gr.csv', type: 'imported', isOpen: false },

      { id: 15, name: 'Aprender Mais', filename: 'aprender_mais_processado.csv', type: 'processed', isOpen: false },
      { id: 16, name: 'Atividades', filename: 'atividades_processado.csv', type: 'processed', isOpen: false },
      { id: 17, name: 'Dados Gerais', filename: 'dados_gerais_processado.csv', type: 'processed', isOpen: false },
      { id: 18, name: 'Definição Etapas', filename: 'definicao_etapa_processado.csv', type: 'processed', isOpen: false },
      { id: 19, name: 'Demissões', filename: 'demissoes_processado.csv', type: 'processed', isOpen: false },
      { id: 20, name: 'Dias Não Contabilizados', filename: 'dias_nao_contabilizados_processado.csv', type: 'processed', isOpen: false },
      { id: 21, name: 'Etapas Metas', filename: 'etapas_metas_processado.csv', type: 'processed', isOpen: false },
      { id: 22, name: 'Formações', filename: 'formacoes_processado.csv', type: 'processed', isOpen: false },
      { id: 23, name: 'Frequência', filename: 'frequencia_processado.csv', type: 'processed', isOpen: false },
      { id: 24, name: 'Funcionário', filename: 'funcionarios_processado.csv', type: 'processed', isOpen: false },
      { id: 25, name: 'Funções Grupos Etapas', filename: 'funcao_grupo_etapas_processado.csv', type: 'processed', isOpen: false },
      { id: 26, name: 'Motivos Infrequência', filename: 'motivos_infrequencia_processado.csv', type: 'processed', isOpen: false },
      { id: 27, name: 'Tipo Local', filename: 'tipo_local_processado.csv', type: 'processed', isOpen: false },
      { id: 28, name: 'Ues Perc Gr', filename: 'ues_perc_gr_processado.csv', type: 'processed', isOpen: false },
      { id: 29, name: 'Tempo de Atuação', filename: 'tempo_atuacao_processado.csv', type: 'processed', isOpen: false },
      { id: 30, name: 'Critérios', filename: 'criterios_processado.csv', type: 'processed', isOpen: false },
      { id: 31, name: 'Erros Função Grupo Etapa', filename: 'erros_funcao_grupo_etapa.csv', type: 'processed', isOpen: false },
    ]);

    const importedFiles = computed(() => files.value.filter(file => file.type === 'imported'));
    const processedFiles = computed(() => files.value.filter(file => file.type === 'processed'));

    const toggleProcessed = () => {
      isProcessedOpen.value = !isProcessedOpen.value;
    };

    const toggleImported = () => {
      isImportedOpen.value = !isImportedOpen.value;
    };

    const downloadMapping = {
      // processados (processed)
      'aprender_mais_processado.csv': downloadAprenderMaisCSV,
      'atividades_processado.csv': downloadAtividadesCSV,
      'dados_gerais_processado.csv': downloadDadosGeraisCSV,
      'definicao_etapas_processado.csv': downloadDefinicaoEtapasCSV,
      'demissoes_processado.csv': downloadDemissoesCSV,
      'dias_nao_contabilizados_processado.csv': downloadDiasNaoContabilizadosCSV,
      'etapas_metas_processado.csv': downloadEtapasMetasCSV,
      'formacoes_processado.csv': downloadFormacoesCSV,
      'frequencia_processado.csv': downloadFrequenciaCSV,
      'funcionarios_processado.csv': downloadFilteredFuncionariosCSV,
      'funcao_grupo_etapas_processado.csv': downloadGruposAtualizadoCSV,
      'motivos_infrequencia_processado.csv': downloadMotivosInfrequenciaCSV,
      'tipo_local_processado.csv': downloadTipoLocalCSV,
      'ues_perc_gr_processado.csv': downloadPercentualGratificacaoCSV,

      'tempo_atuacao_processado_processado.csv': downloadTempoAtuacaoCSV,
      'criterios_processado.csv': downloadCriteriosCSV,
      'erros-grupos_processado.csv': downloadErrosGruposCSV

      // importados (raw)
     
      
    };
    
    const fazerRecalculo = () => {
      alert('Esta função ainda não foi implementada!');
    };

    const fazerEdicao = () => {
      alert('Esta função ainda não foi implementada!');
    };

    const baixarArquivo = (filename) => {
      const downloadFunction = downloadMapping[filename];
      if (downloadFunction) {
        downloadFunction();
      } else {
        console.error('Nenhuma função de download encontrada para:', filename);
      }
    };

    const toggleFile = (file) => {
      file.isOpen = !file.isOpen;
    };

    return { 
      isSidebarMinimized,
      importedFiles,
      processedFiles,
      isProcessedOpen,
      isImportedOpen,
      toggleProcessed,
      toggleImported,
      toggleFile,
      baixarArquivo,
      fazerEdicao,
      fazerRecalculo
    };
  }
};
</script>
