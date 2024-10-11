<template>
    <Whiteboard title="Cálculo Anteriores" :isSidebarMinimized="isSidebarMinimized">

        <div class="absolute right-0 top-0 px-8 pt-5">
            <PrimaryButton value="Incluir" @click="openModal" class="bg-blue-500 px-3" />
        </div>

        <div class="flex flex-row w-full items-center justify-between p-4 rounded-md cursor-pointer" @click="toggleDropdown">
            <p class="text-3xl font-semibold">{{ year }}</p>
            <ChevronDownIcon class="w-6 h-6 text-gray-500 cursor-pointer" />
        </div>

        <div v-show="dropdownOpen" class="w-full px-5 border-gray-300 pt-4">
            <div class="border-b-2 w-full"></div>
            <p class="text-normal font-medium text-gray-500">Selecione a Categoria</p>

            <div class="mt-4 flex flex-col w-full">

                <div v-for="category in categories" :key="category.name" class="flex flex-col p-3 border-b border-gray-200">
                  
                    <div class="flex flex-row items-center justify-between cursor-pointer" @click="toggleCategory(category)">

                        <div class="flex flex-row items-center gap-1">
                          <FolderIcon class="w-5 h-auto" />
                          <p class="text-gray-900">{{ category.name }}</p>
                        </div>

                        <ChevronDownIcon class="w-5 h-5 text-gray-500" />

                    </div>

                    <div v-show="selectedCategory === category.name" class="mt-2 pl-4">

                        <div v-for="item in category.versions" :key="item.version" class="flex flex-col p-3 border-b border-gray-200">

                            <div class="flex items-center justify-between cursor-pointer" @click="toggleDetails(item)">
                                <p class="italic text-gray-700">{{ item.version }}</p>
                                <ChevronDownIcon class="w-5 h-5 text-gray-500" />
                            </div>

                            <div v-show="selectedVersion === item" class="mt-2">

                                  <div class="flex flex-row gap-1">
                                      <p class="font-medium">Criado por:</p>
                                      <p class="text-gray-600">{{ item.createdBy }}</p>
                                  </div>

                                  <div class="flex flex-row gap-1">
                                      <p class="font-medium">Data:</p>
                                      <p class="text-gray-600">{{ item.date }}</p>
                                  </div>

                                  <div class="flex flex-row gap-1">
                                      <p class="font-medium">Descrição:</p>
                                      <p class="text-gray-600">{{ item.description }}</p>
                                  </div>

                                  <div class="flex flex-row w-full items-center justify-end gap-3 mt-2">
                                    <SecondaryButton label="Excluir" />
                                    <SecondaryButton label="Criar Cópia" />
                                  </div>

                            </div>

                        </div>

                    </div>

                </div>
                
            </div>

        </div>

        <Modal :open="open" @close="closeModal" :categories="categories" />

    </Whiteboard>

</template>

<script>
import { inject } from 'vue'
import { ChevronDownIcon, FolderIcon } from '@heroicons/vue/24/outline'
import SecondaryButton from '@/components/Buttons/SecondaryButton.vue'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import Modal from '@/views/Admin/PreviousResults/Modal/Modal.vue'
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue'

export default {
  name: 'PreviousResults',
  components: { Whiteboard, ChevronDownIcon, SecondaryButton, FolderIcon, Modal, PrimaryButton },
  data() {
    return {
      year: '2024',
      categories: [
        {
          name: 'Versão Principal',
          icon: 'folder', 
          versions: [
            { id: '1', version: '2024_Primeira_versão_v1.0', createdBy: 'Alice', date: '2024-01-01', description: 'Primeira versão do projeto.' },
          ]
        },
        {
          name: 'Testes',
          icon: 'folder',
          versions: [
            { id: '2', version: '2024_Teste_versão_v1.1', createdBy: 'Bob', date: '2024-02-15', description: 'Testes iniciais realizados.' },
            { id: '3', version: '2024_Teste_versão_v1.1', createdBy: 'Bob', date: '2024-02-15', description: 'Testes iniciais realizados.' }
          ]
        },
        {
          name: 'Editados',
          icon: 'folder',
          versions: [
            { id: '4', version: '2024_Edição_versão_v1.2', createdBy: 'Charlie', date: '2024-03-20', description: 'Versão editada com correções.' },
            { id: '5', version: '2024_Edição_versão_v1.2', createdBy: 'Charlie', date: '2024-03-20', description: 'Versão editada com correções.' },
          ]
        },
      ],
      dropdownOpen: false,
      selectedCategory: null,
      selectedVersion: null,
      open: false
    }
  },
  methods: {
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    toggleCategory(category) {
      this.selectedCategory = this.selectedCategory === category.name ? null : category.name
    },
    toggleDetails(selectedItem) {
      this.selectedVersion = this.selectedVersion === selectedItem ? null : selectedItem
    },
    openModal() {
      this.open = true
    },
    closeModal() {
      this.open = false
    }
  },

  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')

    return {
      isSidebarMinimized
    }
  }
}
</script>
