<template>
  <Whiteboard title="Gerenciamento de Arquivos">
    <!-- Cabeçalho do Cálculo Ativo -->
    <div v-if="calculusInfo.name" class="px-6 py-6 border-b border-gray-100 bg-gray-50/50">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-blue-100 rounded-lg">
          <DocumentIcon class="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wider">Cálculo Ativo (OpenCalc)</h3>
          <p class="text-xl font-bold text-[#3459a2] ">
            {{ calculusInfo.name }} <span class="text-[#3459a2]">({{ calculusInfo.year }})</span>
          </p>
        </div>
      </div>
    </div>

    <div class="p-6">
      <!-- Filtro/Tabs para Alternar entre tipos (Opcional, mas limpa o visual) -->
      <div class="flex space-x-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit">
        <button 
          @click="activeTab = 'processed'"
          :class="activeTab === 'processed' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
        >
          Processados ({{ processedFiles.length }})
        </button>
        <button 
          @click="activeTab = 'imported'"
          :class="activeTab === 'imported' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'"
          class="px-4 py-2 text-sm font-medium rounded-lg transition-all"
        >
          Importados/Raw ({{ importedFiles.length }})
        </button>
      </div>

      <!-- Listagem de Arquivos -->
      <div class="grid grid-cols-1 gap-4">
        <div 
          v-for="file in (activeTab === 'processed' ? processedFiles : importedFiles)" 
          :key="file.id"
          class="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div class="flex items-center space-x-4">
            <div class="p-2 bg-gray-50 group-hover:bg-blue-50 rounded-lg transition-colors">
              <DocumentIcon class="h-8 w-8 text-gray-400 group-hover:text-blue-500" />
            </div>
            <div>
              <h4 class="text-sm font-semibold text-gray-800">{{ file.name }}</h4>
              <p class="text-xs text-gray-500 font-mono">{{ file.filename }}</p>
            </div>
          </div>

          <div class="mt-4 sm:mt-0 flex items-center gap-3">
            <span 
              :class="activeTab === 'processed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
              class="text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wide"
            >
              {{ activeTab === 'processed' ? 'Processado' : 'Original' }}
            </span>
            
            <button 
              @click="baixarArquivo(file)"
              class="flex items-center justify-center gap-2 bg-[#3459a2]  hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <CloudArrowDownIcon class="h-4 w-4" />
              Download
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="(activeTab === 'processed' ? processedFiles : importedFiles).length === 0" class="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <p class="text-gray-400">Nenhum arquivo encontrado nesta categoria.</p>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { getActiveOpenCalcFiles, downloadFileById } from '@/service/apiService';
import { CloudArrowDownIcon, DocumentIcon } from "@heroicons/vue/24/outline";
import { computed, ref, onMounted } from 'vue';

export default {
  components: { Whiteboard, CloudArrowDownIcon, DocumentIcon },

  setup() {
    const activeTab = ref('processed');
    const calculusInfo = ref({ name: 'Carregando...', year: '' });
    const files = ref([]);

    const importedFiles = computed(() => files.value.filter(file => file.type === 'imported'));
    const processedFiles = computed(() => files.value.filter(file => file.type === 'processed'));

    const fetchFiles = async () => {
      try {
        const data = await getActiveOpenCalcFiles();
        calculusInfo.value = data.calculus_info;
        files.value = data.files.map(file => ({
          id: file.id,
          name: file.name,
          filename: file.filename,
          type: file.state === 'raw' ? 'imported' : 'processed',
        }));
      } catch (error) {
        console.error("Erro ao buscar a lista de arquivos:", error);
      }
    };

    onMounted(() => {
      fetchFiles();
    });

    const baixarArquivo = (file) => {
      if (file && file.id) {
        downloadFileById(file.id);
      } else {
        console.error('ID do arquivo inválido para download:', file);
      }
    };

    return {
      activeTab,
      importedFiles,
      processedFiles,
      baixarArquivo,
      calculusInfo,
    };
  }
};
</script>

<style scoped>
/* Transições suaves para troca de abas */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>