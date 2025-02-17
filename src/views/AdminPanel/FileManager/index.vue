<template>
    <Whiteboard title="Arquivos Importados" :isSidebarMinimized="isSidebarMinimized">
      <div class="flex w-full flex-col gap-5 my-3">
        <div v-for="file in files" :key="file.id" class="bg-white border border-gray-200 rounded-lg shadow-md p-4">
          <div class="flex flex-col">
            <!-- Título do Arquivo com ícone e seta -->
            <div class="flex items-center justify-between cursor-pointer" @click="toggleFile(file)">
              <div class="flex items-center space-x-3">
                <DocumentIcon  class="h-6 w-6 text-gray-500" />
                <h3 class="text-lg font-semibold text-gray-800">{{ file.name }}</h3>
              </div>
              <ChevronDownIcon
                class="h-5 w-5 text-gray-500 transition-transform"
                :class="{ 'rotate-180': file.isOpen }"
              />
            </div>
            <!-- Detalhes do Arquivo -->
            <transition
              name="fade"
              @before-enter="beforeEnter"
              @enter="enter"
              @leave="leave"
            >
              <div v-show="file.isOpen" class="ml-6 mt-2 space-y-2">
                <p class="text-gray-500">{{ file.filename }}</p>
                <div class="flex justify-end space-x-3">
                  <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                    <CloudArrowDownIcon  class="h-5 w-5 inline mr-1" /> Download
                  </button>
                  <button class="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition">
                    <PencilIcon class="h-5 w-5 inline mr-1" /> Editar
                  </button>
                  <button class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition">
                    <TrashIcon class="h-5 w-5 inline mr-1" /> Deletar
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
        <div class="flex justify-end gap-4">
          <button onclick="window.location.href='/admin/dashboard'" class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Voltar
          </button>
          <button class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
            Salvar
          </button>
        </div>

      </div>
    </Whiteboard>
  </template>
  
  <script>
  import { ref, inject } from 'vue'
  import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
  import { ChevronDownIcon, CloudArrowDownIcon , PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
  import { DocumentIcon  } from '@heroicons/vue/24/solid';  // Ícone de arquivo
  
  export default {
    components: { Whiteboard, ChevronDownIcon, CloudArrowDownIcon , PencilIcon, TrashIcon, DocumentIcon  },
  
    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized')
  
      const files = ref([
        { name: 'Frequência', filename: 'frequencia.csv', isOpen: false },
        { name: 'Atividades', filename: 'atividades.csv', isOpen: false },
        { name: 'Dados Gerais', filename: 'dados_gerais.csv', isOpen: false },
        { name: 'Definição Etapas', filename: 'definicao_etapa.csv', isOpen: false },
        { name: 'Demissões', filename: 'demissoes.csv', isOpen: false },
        { name: 'Dias Não Contabilizados', filename: 'dias_nao_contabilizados.csv', isOpen: false },
        { name: 'Etapas Metas', filename: 'etapas_metas.csv', isOpen: false },
        { name: 'Formações', filename: 'formacoes.csv', isOpen: false },
        { name: 'Funcionario', filename: 'funcionarios.csv', isOpen: false },
        { name: 'Funções Grupos Etapas', filename: 'funcao_grupo_etapas.csv', isOpen: false },
        { name: 'Motivos Infrequência', filename: 'motivos_infrequencia.csv', isOpen: false },
        { name: 'Tipo Local', filename: 'tipo_local.csv', isOpen: false },
        { name: 'Ues Perc Gr', filename: 'ues_perc_gr.csv', isOpen: false },
        { name: 'Aprender Mais', filename: 'aprender_mais.csv', isOpen: false }
      ])
  
      const toggleFile = (file) => {
        file.isOpen = !file.isOpen;
      }
  
      return {
        isSidebarMinimized,
        files,
        toggleFile
      }
    }
  }
  </script>
  
