<template>
  <Whiteboard title="Gerenciamento de Arquivos" >
    
    <div v-if="calculusInfo.name" class="px-4 sm:px-10 mt-4 mb-2 border-b pb-4">
      <h3 class="text-xl font-bold text-gray-800">
        Cálculo Ativo (OpenCalc): <span class="text-blue-600">{{ calculusInfo.name }}</span>
      </h3>
      <p class="text-sm text-gray-500">
        Arquivos referentes ao cálculo oficial do ano de {{ calculusInfo.year }}
      </p>
    </div>

    <div class="flex w-full flex-col gap-5 my-3 px-4 sm:px-10">
      <!-- Seção de Arquivos Processados -->
      <div>
        <div class="flex items-center justify-between cursor-pointer bg-gray-100 p-3 rounded-[10px]" @click="toggleProcessed">
          <h2 class="text-20 font-semibold text-gray-800">Arquivos Processados</h2>
          <ChevronDownIcon class="h-5 w-5 text-gray-500 transition-transform" :class="{ 'rotate-180': isProcessedOpen }" />
        </div>
        <transition name="fade">
          <!-- MODIFICADO v-for para usar processedFiles -->
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
                      <!-- MODIFICADO @click para passar o objeto file -->
                      <button class="bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-blue-700 transition" @click="baixarArquivo(file)">
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
          <h2 class="text-20 font-semibold text-gray-800">Arquivos Importados (Raw)</h2>
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
                      <button class="bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-blue-700 transition" @click="baixarArquivo(file)">
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
        <!-- Botões de ação -->
        <div class="flex justify-end gap-4">
          <button @click="$router.push('/admin/dashboard')" class="bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-blue-700 transition">
            Voltar
          </button>
        </div>
    </div>
  </Whiteboard>
</template>

<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { getActiveOpenCalcFiles, downloadFileById } from '@/service/apiService';
import { ChevronDownIcon, CloudArrowDownIcon, PencilIcon } from "@heroicons/vue/24/outline";
import { DocumentIcon } from '@heroicons/vue/24/solid';
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  components: { Whiteboard, ChevronDownIcon, CloudArrowDownIcon, PencilIcon, DocumentIcon },

  setup() {
    const router = useRouter();
    const isProcessedOpen = ref(true);
    const isImportedOpen = ref(true);

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
          isOpen: false
        }));
      } catch (error) {
        console.error("Erro ao buscar a lista de arquivos:", error);
      }
    };

    onMounted(() => {
      fetchFiles();
    });

    const toggleProcessed = () => {
      isProcessedOpen.value = !isProcessedOpen.value;
    };

    const toggleImported = () => {
      isImportedOpen.value = !isImportedOpen.value;
    };
    

    const baixarArquivo = (file) => {
      if (file && file.id) {
        downloadFileById(file.id);
      } else {
        console.error('ID do arquivo inválido para download:', file);
      }
    };

    const toggleFile = (file) => {
      file.isOpen = !file.isOpen;
    };

    return {
      importedFiles,
      processedFiles,
      isProcessedOpen,
      isImportedOpen,
      toggleProcessed,
      toggleImported,
      toggleFile,
      baixarArquivo,
      calculusInfo,
    };
  }
};
</script>
