<template>
  <Whiteboard title="Cálculo Anteriores" :isSidebarMinimized="isSidebarMinimized">
    <!-- Seção para exibir os anos -->
    <div v-for="category in categories" :key="category.name" class="mb-8 w-full">
      <!-- Exibindo o ano -->
      <div class="flex flex-row items-start justify-between p-5 rounded-md cursor-pointer bg-gray-50" @click="toggleDropdown(category)">
        <p class="text-3xl font-semibold text-gray-800">
          {{ category.name }}  <!-- Exibindo o ano -->
        </p>
        <ChevronDownIcon class="w-6 h-6 text-gray-500 cursor-pointer" />
      </div>

      <!-- Exibindo a categoria 'teste' para o ano -->
      <div v-show="category.isOpen" class="w-full px-6 border-gray-300 pt-6">
        <div class="border-b-2 w-full mb-6"></div>
        <p class="text-normal font-medium text-gray-500 mb-6">Selecione a Categoria</p>

        <!-- Pasta 'teste' única para cada ano -->
        <div class="flex flex-col p-6 border border-gray-200 rounded-lg bg-white shadow-md w-full">
          <div class="flex flex-row items-start gap-3 mb-6 w-full">
            <FolderIcon class="w-6 h-auto text-gray-500" />
            <p class="text-gray-900 font-medium">teste</p>  <!-- Exibindo categoria 'teste' -->
          </div>

          <!-- Exibindo todos os cálculos dentro da pasta 'teste' -->
          <div class="mt-6 flex flex-col space-y-6 w-full">
            <div v-for="item in category.versions" :key="item.id" class="flex flex-col p-6 border border-gray-200 rounded-lg bg-white shadow-md w-full">
              <div class="flex items-center justify-between cursor-pointer w-full" @click="toggleDetails(item)">
                <p class="italic text-gray-700">{{ item.description }}</p>
                <ChevronDownIcon class="w-5 h-5 text-gray-500" />
              </div>

              <div v-show="selectedVersion === item" class="mt-6 space-y-3 w-full">
                <p><strong>Criado em:</strong> {{ item.createdAt }}</p>
                <p><strong>Pasta:</strong> {{ item.pasta }}</p>
                <div class="flex flex-row items-start justify-start gap-4 mt-6 w-full">
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
      year: '2024', // Ano inicial, mas substituído pela categoria na visualização
      categories: [],
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
          name: year,  // Agora, o nome da categoria é o ano
          versions: [],
          isOpen: false // Estado de cada categoria (expandida ou não)
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

    toggleDropdown(category) {
      // Alterna o estado de expansão para a categoria específica
      category.isOpen = !category.isOpen;
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

