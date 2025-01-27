<template>
  <Whiteboard title="Cálculo Anteriores" :isSidebarMinimized="isSidebarMinimized">
    <div class="w-full">
      <!-- Exibição dos cálculos agrupados por ano -->
      <div v-for="(items, year) in groupedByYear" :key="year" class="mb-6">
        <div @click="toggleDropdown" class="flex items-center justify-between p-4 rounded-md cursor-pointer">
          <p class="text-3xl font-semibold">{{ year }}</p>
          <ChevronDownIcon class="w-6 h-6 text-gray-500 cursor-pointer" />
        </div>

       
        <div v-if="dropdownVisible" class="ml-4 mt-2">
          <div v-for="item in items" :key="item.id" class="p-4 rounded-md mb-4">
            <div class="flex items-center justify-between">
              <div>
                <h4 class="text-xl font-semibold">{{ item.name }}</h4> <!-- Exibindo o nome do cálculo -->
                <p class="text-sm text-gray-600 "> Criado por {{ item.created_by }} em {{ item.created }}</p>

              </div>
               <div @click="toggleDropdownVersion('version', item.id)" class="cursor-pointer">
                <ChevronDownIcon class="w-6 h-6 text-gray-500" />
              </div>
            </div>
              <div class="flex flex-row w-full items-center justify-end gap-3 mt-2">
                <SecondaryButton label="Ver" @click="goToDashboard"/>
                <SecondaryButton label="Criar Cópia" />
                <SecondaryButton label="Excluir" />
              </div>
          </div>
        </div>
      </div>

      <!-- Botão de Inclusão -->
      <div class="flex w-full items-center justify-end py-3 border-t-2">
        <div class="flex items-center mt-2">
          <PrimaryButton value="Incluir" @click="openModal" class="bg-blue-500 px-5 py-3" />
        </div>
      </div>

      <!-- Modal para abrir/fechar -->
      <Modal :open="open" @close="closeModal" :categories="categories" />
    </div>
  </Whiteboard>
</template>

<script>
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
import SecondaryButton from '@/components/Buttons/SecondaryButton.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Modal from '@/views/Admin/PreviousResults/Modal/Modal.vue';
import { ChevronDownIcon, FolderIcon } from '@heroicons/vue/24/outline';
import { inject, onMounted, ref } from 'vue';

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
      ],
      dropdownOpen: false,
      selectedCategory: null,
      selectedVersion: null,
      open: false
    }
  },
  methods: {
    goToDashboard() {
  window.location.assign('http://10.203.2.98:8739/admin/dashboard');
},
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    toggleDropdownVersion() {
      this.dropdownOpen = !this.dropdownOpen;
    },
    toggleCategory(category) {
      this.selectedCategory = this.selectedCategory === category.name ? null : category.name;
    },
    toggleDetails(selectedItem) {
      this.selectedVersion = this.selectedVersion === selectedItem ? null : selectedItem;
    },
    openModal() {
      this.open = true;
    },
    closeModal() {
      this.open = false;
    }
  },
  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized');

    // Declarar as variáveis reativas dentro de setup
    const dropdownVisible = ref(false);
    const groupedByYear = ref({});
    const calculusFiles = ref({}); // Declarar aqui a variável reativa

    const toggleDropdown = () => {
      dropdownVisible.value = !dropdownVisible.value;
    };
    const toggleDropdownVersion = () => {
      dropdownVisible.value = !dropdownVisible.value;
    };

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, '0'); // Garantir que o dia tenha 2 dígitos
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam do 0, então somamos 1
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    };

    // Função para buscar dados da URL
    const fetchData = async () => {
      try {
        const response = await fetch('http://10.203.2.98:8000/csv/get-list-calculus/');
        const result = await response.json();
        console.log(result);  // Verifique a estrutura dos dados aqui

        // Atribuindo os dados de "Calculus Files"
        calculusFiles.value = result['Calculus Files'] || {};

        groupedByYear.value = Object.keys(calculusFiles.value).reduce((acc, year) => {
          const yearData = calculusFiles.value[year];
          acc[year] = [];
          Object.keys(yearData).forEach(key => {
            const calculus = yearData[key];
            const generalData = calculus.general_data;
            acc[year].push({
              name: generalData.description,
              created: formatDate(generalData.created_at), // Formatar a data
              created_by: generalData.user,
              id: key, // Garantir um id único
            });
          });
          return acc;
        }, {});
        
      } catch (error) {
        console.error("Erro ao buscar os dados:", error); // Logar o erro
      }
    };

    // Chamar a função para buscar os dados assim que o componente for montado
    onMounted(() => {
      fetchData();
    });

    return {
      isSidebarMinimized,
      dropdownVisible,
      groupedByYear,
      toggleDropdown
    };
  }
};
</script>
