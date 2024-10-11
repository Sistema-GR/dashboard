<template>
    <Whiteboard title="" class="-translate-y-20" :isSidebarMinimized="isSidebarMinimized" :hideBreadcrumbs="true">

  
      <div class="flex flex-row w-full items-center justify-between border-b-2 py-2 rounded-t-md shadow-md" :class="resourceBgColor">
        <p class="text-white font-medium text-xl mx-2">Recurso</p>
        <select class="mx-2 text-white" :class="resourceBgColor" v-model="selectedStatus" @change="updateResourceColor">
          <option value="bg-blue-500">Novo</option>
          <option value="bg-orange-500">Em Progresso</option>
          <option value="bg-yellow-500">Pendente</option>
          <option value="bg-red-500">Reaberto</option>
          <option value="bg-gray-500">Cancelado</option>
        </select>
      </div>
  
      <div class="flex flex-row items-center justify-between w-full py-3 mt-1">
  
        <div class="flex flex-col w-full justify-between md:flex-row items-center border rounded-lg p-4 shadow-md bg-white hover:shadow-xl transition-shadow duration-300">

            <div class="flex flex-row">
                <div class="flex-shrink-0 mb-3 md:mb-0 mr-3">
                    <UserIcon class="w-16 h-16 text-gray-300" />
                </div>

                <div class="flex flex-col">
                    <p class="text-lg font-semibold text-gray-900">Matheus Gabriel Grawe</p>
                    <p class="text-sm text-gray-600">u4573</p>
                </div>
             </div>

            <div class="relative flex items-center">
                <button @click="toggleBadgeDropdown" class="flex items-center space-x-2">
                    <Badges :text="selectedBadge" />
                    <ChevronDownIcon class="w-5 h-auto"/>
                </button>
  
                <TransitionRoot :show="isBadgeDropdownOpen" as="div" class="absolute -left-40 top-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10">
                    <TransitionChild
                    as="div"
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                    class="max-h-96 overflow-y-auto"
                    >
                    <ul>
                        <li v-for="(badge, index) in badges" :key="index" @click="selectBadge(badge)" class="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center space-x-2 whitespace-nowrap">
                        <Badges :text="badge" />
                        </li>
                    </ul>

                    </TransitionChild>
                </TransitionRoot>
            </div>

        </div>
  
       
      </div>
  
      <div class="flex flex-col w-full py-4 mt-3 p-4 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
        <p class="text-lg font-bold mb-2">Dados do Servidor</p>
            <div class="space-y-2">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p class="font-medium">CPF:</p>
                    <p class="text-gray-600">123.456.789-00</p>
                </div>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p class="font-medium">Email:</p>
                    <p class="text-gray-600">example@domain.com</p>
                </div>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p class="font-medium">Cargo:</p>
                    <p class="text-gray-600">Desenvolvedor</p>
                </div>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                    <p class="font-medium">Unidade:</p>
                    <p class="text-gray-600">TI</p>
                </div>
            </div>
        </div>
    
        <div class="flex flex-col w-full mt-5 p-4 bg-white border rounded-lg shadow-lg pb-8 hover:shadow-xl transition-shadow duration-300">
            <p class="text-lg font-bold mb-2">Descrição</p>
            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
        </div>
  
    </Whiteboard>
  </template>
  
  <script>
  import Badges from '@/components/Badges/Badges.vue';
  import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
  import { UserIcon, ChevronDownIcon } from "@heroicons/vue/24/outline";
  import { TransitionRoot, TransitionChild } from '@headlessui/vue';
  import { inject } from 'vue'
  
  export default {
    name: "InfoDetails",
    components: { Whiteboard, UserIcon, Badges, TransitionRoot, TransitionChild, ChevronDownIcon },
    data() {
      return {
        selectedStatus: 'bg-blue-500', 
        selectedBadge: 'Grupo', 
        isBadgeDropdownOpen: false, 
        badges: [
          "Falta", "Formação", "Impostos", "Mudança de matrícula/Unidade",
          "Carga horária", "Grupo", "Tempo de atuação", "Esclarecimento",
          "Discordância", "Pagamento Indevido", "Local", 
          "Alega atuação em outra etapa", "Atividades", "Mais de um critério"
        ]
      };
    },
    setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')

    return {
      isSidebarMinimized
    }
  },
    computed: {
      resourceBgColor() {
        return this.selectedStatus;
      }
    },
    methods: {
      updateResourceColor() {
        // Método para atualizar a cor do recurso
        this.resourceBgColor = this.selectedStatus;
      },
      toggleBadgeDropdown() {
        this.isBadgeDropdownOpen = !this.isBadgeDropdownOpen;
      },
      selectBadge(badge) {
        this.selectedBadge = badge;
        this.isBadgeDropdownOpen = false; // Fecha o dropdown após selecionar um badge
      }
    }
  }
  </script>
  