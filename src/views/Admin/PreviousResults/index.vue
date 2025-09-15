<template>
  <Whiteboard title="Cálculos Anteriores" >
    <!-- Seção para exibir os anos -->
    <div v-for="category in categories" :key="category.name" class="mb-4 w-full">
      <!-- Exibindo o ano -->
      <div class="flex flex-row items-center justify-between px-4 sm:px-10 p-8 shadow-ms cursor-pointer bg-[#e3f0ff]" @click="toggleDropdown(category)">
        <p class="text-25 font-semibold text-black">
          {{ category.name }}  <!-- Exibindo o ano -->
        </p>
        <ChevronDownIcon class="w-6 h-6 text-black cursor-pointer" />
      </div>

      <!-- Exibindo a categoria 'teste' para o ano -->
      <div v-show="category.isOpen" class="w-full px-4 sm:px-10 border-gray-300 pt-6">
        <p class="text-normal font-medium text-black mb-6">Selecione a categoria</p>

        <!-- Pasta 'teste' única para cada ano -->
        <div class="flex flex-col p-6 border border-gray-200 rounded-[10px] bg-white shadow-md w-full">
          <div class="flex flex-row items-start gap-3 mb-6 w-full">
            <FolderIcon class="w-6 h-auto text-black" />
            <p class="text-gray-900 font-medium">teste</p>  <!-- Exibindo categoria 'teste' -->
          </div>

          <!-- Exibindo todos os cálculos dentro da pasta 'teste' -->
          <div class="mt-6 flex flex-col space-y-6 w-full">
            <div v-for="item in category.versions" :key="item.id" class="flex flex-col p-6 border border-gray-200 rounded-[10px] bg-white shadow-md w-full">
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
      this.verCalculo(item.id);
    },
    
    async fetchCalculus() {
      try {
        const token = await getAccessToken();
        if (!token) {
          this.errorMessage = 'Usuário não autenticado ou token expirado.';
          return;
        }

        const response = await axios.get("http://10.203.3.46:8000/csv/get-list-calculus/", {
          headers: { Authorization: `Bearer ${token}` }
        });

        
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

      this.categories = formattedCategories;
    },

    toggleDropdown(category) {
      // Alterna o estado de expansão para a categoria específica
      category.isOpen = !category.isOpen;
    },

    toggleDetails(selectedItem) {
      this.selectedVersion = this.selectedVersion === selectedItem ? null : selectedItem;
    },

    async copiarCalculo(item) {
      try {
        const token = await getAccessToken();
        const response = await axios.post("http://10.203.3.46:8000/csv/copy-calculus/", { calc_id: item.id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`Cálculo copiado com sucesso! Novo ID: ${response.data.new_calculus_id}`);
        
        // Recarregar a página
        window.location.reload();
      } catch (error) {
        console.error('Erro ao copiar cálculo:', error);
      }
    },


    async verCalculo(id) {
      try {
        const token = await getAccessToken();
        if (!token) {
          this.errorMessage = 'Usuário não autenticado ou token expirado.';
          return;
        }

        const response = await axios.post(
          "http://10.203.3.46:8000/csv/api/set-active-calculus/",
          { calc_id: id },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

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

        // Confirmação do usuário antes de excluir
        const confirmacao = confirm('Tem certeza que deseja excluir este cálculo?');
        if (!confirmacao) {
          return; // Se o usuário cancelar, não faz nada
        }

        // Faz a requisição POST para excluir o cálculo
        const response = await axios.post(
              "http://10.203.3.46:8000/csv/delete-calculus/",
              { calc_id: id }, // Envia o ID do cálculo no corpo da requisição
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );

            // Atualiza a lista de cálculos após a exclusão
            await this.fetchCalculus();
      } catch (error) {
        console.error('❌ Erro ao excluir cálculo:', error);
        if (error.response) {
          this.errorMessage = error.response.data.error || 'Erro ao excluir cálculo. Tente novamente mais tarde.';
        } else {
          this.errorMessage = 'Erro de rede ou servidor inacessível.';
        }
      }
    }
  },

  async mounted() {
    await this.fetchCalculus();
  },

};
</script>
