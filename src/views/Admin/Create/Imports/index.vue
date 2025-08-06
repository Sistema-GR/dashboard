<template>
  <Whiteboard title="Importações" :isSidebarMinimized="isSidebarMinimized">     
    <div class="w-full space-y-10">      
      <!-- FileInput para upload dos arquivos em .csv -->
      <FileInput Label="Importar Arquivos em .CSV"
      :baseUrl="BASE_URL"
      endpoint="/csv/process/unified-upload/"
      :expectedFiles="expectedFiles"
      @uploaded="onUnifiedUploaded"/>      
    </div>
  </Whiteboard>
</template>

<script>
import { inject } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import FileInput from '@/components/Inputs/FileInput.vue';

export default {
  components: { FileInput, Whiteboard },

  data() {
    return {
      BASE_URL: window.__VUE__API_BASE_URL || 'http://127.0.0.1:8000',
      expectedFiles: [
        { key: 'funcionarios', label: '1. Funcionários', patterns: ['funcionario', 'funcionarios', 'employees'] },
        { key: 'demissoes', label: '2. Demissões', patterns: ['demissao', 'demissoes'] },
        { key: 'frequencia', label: '3. Frequência', patterns: ['frequenciaXD'] },
        { key: 'atividades', label: '4. Atividades', patterns: ['atividade', 'atividades'] },
        { key: 'formacoes', label: '5. Formações', patterns: ['formacoes', 'formacao'] },
        { key: 'dias_nao_contabilizados', label: '6. Dias Não Contabilizados', patterns: ['dias_nao', 'nao_contabilizados'] },
        { key: 'motivos_infrequencia', label: '7. Motivos de Infrequência', patterns: ['motivos_infrequencia'] },
        { key: 'etapas_metas_ue', label: '8. Metas por Unidade Escolar', patterns: ['etapas_metas'] },
        { key: 'ues_perc_gr', label: '9. Percentual de Gratificação por UE', patterns: ['ues_perc_gr'] },
        { key: 'tipo_local', label: '10. Tipo de Local', patterns: ['local', 'tipo_local'] },
        { key: 'definicao_etapas', label: '11. Definição de Etapas (Professores)', patterns: ['definicao_etapas'] },
        { key: 'aprender_mais', label: '12. Aprender Mais (Reforço)', patterns: ['aprender'] },
        { key: 'dados_gerais', label: '13. Dados Gerais (Unidades)', patterns: ['gerais', 'dados'] },
        { key: 'funcao_grupo_etapas', label: '14. Função, Grupo e Etapas', patterns: ['funcao_grupo_etapas'] },
      ],
      isSidebarMinimized: null,
    };
  },

  created() {
    this.isSidebarMinimized = inject('isSidebarMinimized');
  },

  methods: {
    onUnifiedUploaded({ manifest }) {
      console.log('Unified upload manifest', manifest);
      // Optionally call the final "process" endpoint or redirect when backend finishes processing
      // e.g. axios.get(`${this.BASE_URL}/process/all-files/`)
    },
  },
};
</script>