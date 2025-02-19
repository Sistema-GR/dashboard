<template>
  <Whiteboard title="Cálculo Anteriores" :isSidebarMinimized="isSidebarMinimized">
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
            <div v-for="item in category.versions" :key="item.id" class="flex flex-col p-3 border-b border-gray-200">
              <div class="flex items-center justify-between cursor-pointer" @click="toggleDetails(item)">
                <p class="italic text-gray-700">{{ item.name }}</p>
                <ChevronDownIcon class="w-5 h-5 text-gray-500" />
              </div>
              <div v-show="selectedVersion === item" class="mt-2">
                <p><strong>Criado em:</strong> {{ item.createdAt }}</p>
                <p><strong>Descrição:</strong> {{ item.description }}</p>
                <p><strong>Pasta:</strong> {{ item.pasta }}</p>
                <div class="flex flex-row w-full items-center justify-end gap-3 mt-2">
                  <SecondaryButton label="Visualizar" @click="handleVisualizarClick(item)" />

                  <SecondaryButton label="Criar cópia" @click="copiarCalculo(item)" />
                  <SecondaryButton label="Excluir" @click="excluirCalculo(item.id)" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import axios from 'axios';
import { inject } from 'vue';
import { ChevronDownIcon, FolderIcon } from '@heroicons/vue/24/outline';
import SecondaryButton from '@/components/Buttons/SecondaryButton.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { getAccessToken } from '@/service/token.js';

export default {
  name: 'PreviousResults',
  components: { Whiteboard, ChevronDownIcon, SecondaryButton, FolderIcon },
  data() {
    return {
      year: '2024',
      categories: [],
      dropdownOpen: false,
      selectedCategory: null,
      selectedVersion: null,
      errorMessage: null
    };
  },
  methods: {
    handleVisualizarClick(item) {
      console.log('Item clicado:', item); 
      this.verCalculo(item.id);
    },
    
    async fetchCalculus() {
      try {
        const token = await getAccessToken();
        if (!token) {
          this.errorMessage = 'Usuário não autenticado ou token expirado.';
          return;
        }

        const response = await axios.get("http://10.203.3.22:8000/csv/get-list-calculus/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('🔹 Dados recebidos da API:', response.data);
        
        if (!response.data) {
          console.error('❌ Estrutura inesperada na resposta da API:', response.data);
          return;
        }
        
        this.processCalculusData(response.data);
      } catch (error) {
        console.error('❌ Erro ao buscar cálculos:', error);
        this.errorMessage = 'Erro ao buscar cálculos. Tente novamente mais tarde.';
      }
    },

    processCalculusData(calculusData) {
      const formattedCategories = [];
      console.log('📌 Processando dados:', calculusData);

      for (const year in calculusData) {
        const category = {
          name: year,
          versions: []
        };

        for (const key in calculusData[year]) {
          const calc = calculusData[year][key];

          category.versions.push({
            id: calc.calculus_id || 'ID desconhecido',
            name: key || 'Sem nome',
            description: calc.description || 'Sem descrição',
            createdAt: calc.created_at ? calc.created_at.split('T')[0] : 'Data desconhecida',
            pasta: calc.folder_uuid || 'Sem pasta'
          });
        }

        formattedCategories.push(category);
      }

      console.log('✅ Categorias formatadas:', formattedCategories);
      this.categories = formattedCategories;
    },

    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen;
    },

    toggleCategory(category) {
      this.selectedCategory = this.selectedCategory === category.name ? null : category.name;
    },

    toggleDetails(selectedItem) {
      this.selectedVersion = this.selectedVersion === selectedItem ? null : selectedItem;
    },

    copiarCalculo(item) {
      console.log('📋 Copiar cálculo:', item);
    },

    async verCalculo(id) {
      console.log('ID do cálculo:', id);  // Verificar se o ID é correto
      try {
        const token = await getAccessToken();
        if (!token) {
          this.errorMessage = 'Usuário não autenticado ou token expirado.';
          return;
        }

        const response = await axios.post(
          "http://10.203.3.22:8000/csv/api/set-active-calculus/",
          { calc_id: id },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        console.log('Resposta da API:', response.data);  // Verificar a resposta da API
        this.$router.push({ path: '/admin/dashboard' });

      } catch (error) {
        console.error('Erro ao ativar o cálculo:', error);
        if (error.response) {
          // A resposta de erro do servidor
          this.errorMessage = error.response.data.error || 'Erro ao ativar o cálculo. Tente novamente mais tarde.';
        } else {
          // Caso o erro seja de rede ou outro problema
          this.errorMessage = 'Erro de rede ou servidor inacessível.';
        }
      }
    },

    async excluirCalculo(id) {
      try {
        const token = await getAccessToken();
        if (!token) {
          this.errorMessage = 'Usuário não autenticado ou token expirado.';
          return;
        }

        await axios.delete(`http://10.203.3.22:8000/csv/delete-calculus/${id}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log(`🗑️ Cálculo ${id} excluído com sucesso`);
        this.fetchCalculus();
      } catch (error) {
        console.error('❌ Erro ao excluir cálculo:', error);
        this.errorMessage = 'Erro ao excluir cálculo. Tente novamente mais tarde.';
      }
    }
  },

  async mounted() {
    await this.fetchCalculus();
  },

  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized');
    return { isSidebarMinimized };
  }
};
</script>
