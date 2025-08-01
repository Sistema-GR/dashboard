<template>
    <Whiteboard title="" class="px-10 pb-20 lg:ml-10" :isSidebarMinimized="isSidebarMinimized" :hideBreadcrumbs="true">

        <div class="flex flex-row items-center justify-between w-full py-3 mt-1">
          <div class="flex flex-col w-full justify-between md:flex-row items-center border rounded-[10px] p-4 shadow-md bg-white hover:shadow-xl transition-shadow duration-300">
            <div class="flex w-full flex-row items-center">
              <div class="flex mb-3 md:mb-0 mr-3">
                <UserIcon class="w-14 h-14 text-[#003965]" />
              </div>
              <div class="flex flex-col items-start">
                <p class="text-15 font-semibold text-gray-900">Matheus Gabriel Grawe</p>
                <p class="text-15 text-gray-600">u4573</p>
              </div>
            </div>

            <div class="relative flex items-center border-t justify-center w-full lg:border-hidden lg:w-fit">
              <button @click="toggleBadgeDropdown" class="flex items-center space-x-2  mt-5 lg:mt-0">
                <Badges :text="selectedBadge" />
                <ChevronDownIcon class="w-5 h-auto" />
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

        <div class="flex flex-col w-full py-4 mt-3 p-4 bg-white border rounded-[10px] shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p class="text-15 font-bold mb-2">Dados do Servidor</p>
            <div class="space-y-2">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <p class="text-15">CPF:</p>
                  <p class="text-15 text-gray-600">123.456.789-00</p>
                </div>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <p class="text-15">Email:</p>
                  <p class="text-15 text-gray-600">example@domain.com</p>
                </div>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <p class="text-15">Cargo:</p>
                  <p class="text-15 text-gray-600">Desenvolvedor</p>
                </div>
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <p class="text-15">Unidade:</p>
                  <p class="text-15 text-gray-600">TI</p>
                </div>
            </div>
        </div>

        <div class="flex flex-col w-full mt-5 p-4 bg-white border rounded-[10px] shadow-lg pb-8 hover:shadow-xl transition-shadow duration-300">
            <p class="text-15 font-bold mb-2">Descrição</p>
            <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry...</p>
        </div>

        <div class="flex flex-col w-full mt-8 p-4 bg-white border rounded-[10px] shadow-lg hover:shadow-xl transition-shadow duration-300">
            <p class="text-15 font-bold mb-2">Escolher Versão para Abrir</p>
            <select v-model="selectedVersion" class="border rounded-md py-2 px-4">
                <option value="primeira-versao">Primeira Versão</option>
                <option value="segunda-versao">Segunda Versão</option>
            </select>
        </div>

        <div class="flex flex-col items-center justify-between w-full mt-5 p-4 bg-white border rounded-[10px] shadow-lg hover:shadow-xl transition-shadow duration-300">

            <div class="flex flex-row w-full justify-between">
                <p class="text-15 font-bold">Responder Recurso</p>
                <button @click="toggleReportResponse" class="bg-blue-500 text-white py-2 px-4 rounded-md">
                  Responder
                </button>
            </div>

            <div class="flex flex-col w-full py-2 mt-2" v-if="isReportResponseOpen">
                <textarea v-model="reportResponse" rows="5" class="w-full border rounded-md p-2 mb-4" placeholder="Escreva sua resposta aqui..."></textarea>
                <button @click="submitReportResponse" class="bg-green-500 text-white py-2 px-4 rounded-md w-3/12 lg:w-2/12">
                  Enviar
                </button>
            </div>

        </div>
        
        <div class="flex flex-col w-full mt-5 p-4 bg-white border rounded-[10px] shadow-lg hover:shadow-xl transition-shadow duration-300" v-if="previousResponses.length">
          <p class="text-15 font-bold mb-2">Respostas Anteriores</p>
          <ul class="space-y-2">
            <li v-for="(response, index) in previousResponses" :key="index" class="text-gray-600 border-b pb-2">
              <div v-if="!isEditing[index]" class="flex justify-between items-center">
                <div>
                  <p class="font-semibold">Resposta {{ index + 1 }}:</p>
                  <p>{{ response }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <button @click="editResponse(index)" class="text-blue-500">
                    <PencilIcon class="w-5 h-5" />
                  </button>
                  <button @click="deleteResponse(index)" class="text-red-500">
                    <TrashIcon class="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div v-else>
                <textarea v-model="editedResponse" rows="3" class="w-full border rounded-md p-2 mb-4" />
                <div class="flex justify-end space-x-2">
                  <button @click="updateResponse(index)" class="bg-green-500 text-white py-1 px-3 rounded-md">
                    Atualizar
                  </button>
                  <button @click="cancelEdit(index)" class="bg-gray-500 text-white py-1 px-3 rounded-md">
                    Cancelar
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>

    </Whiteboard>
</template>

<script>
import Badges from '@/components/Badges/Badges.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { UserIcon, ChevronDownIcon, PencilIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { TransitionRoot, TransitionChild } from '@headlessui/vue';
import { inject } from 'vue';

export default {
  name: "InfoDetails",
  components: { Whiteboard, UserIcon, Badges, TransitionRoot, TransitionChild, ChevronDownIcon, PencilIcon, TrashIcon },
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
      ],
      selectedVersion: 'primeira-versao',
      isReportResponseOpen: false,
      reportResponse: '',
      previousResponses: [], // List of previous responses
      isEditing: {}, // Track which response is being edited
      editedResponse: '', // For storing the response being edited
    };
  },
  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized');
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
      this.resourceBgColor = this.selectedStatus;
    },
    toggleBadgeDropdown() {
      this.isBadgeDropdownOpen = !this.isBadgeDropdownOpen;
    },
    selectBadge(badge) {
      this.selectedBadge = badge;
      this.isBadgeDropdownOpen = false;
    },
    toggleReportResponse() {
      this.isReportResponseOpen = !this.isReportResponseOpen;
    },
    submitReportResponse() {
      console.log("Resposta do relatório enviada:", this.reportResponse);
      this.previousResponses.push(this.reportResponse); // Add response to previousResponses
      this.reportResponse = ''; // Clear the textarea after submitting
      this.isReportResponseOpen = false; // Close the form after submission
    },
    editResponse(index) {
      this.isEditing = { ...this.isEditing, [index]: true };
      this.editedResponse = this.previousResponses[index]; // Set the current response to be edited
    },
    updateResponse(index) {
      this.previousResponses.splice(index, 1, this.editedResponse); // Update the response in the list
      this.isEditing = { ...this.isEditing, [index]: false }; // Exit editing mode
      this.editedResponse = ''; // Clear edited response
    },
    cancelEdit(index) {
      this.isEditing = { ...this.isEditing, [index]: false }; // Exit editing mode
    },
    deleteResponse(index) {
      this.previousResponses.splice(index, 1); // Remove the response from the list
    }
  }
};
</script>