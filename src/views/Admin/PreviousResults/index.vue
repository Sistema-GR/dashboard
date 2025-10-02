<template>
  <Whiteboard title="Biblioteca de Cálculos">
    <div v-if="errorMessage" class="p-4 text-15 text-white bg-red-600 rounded-[10px] mx-4 sm:mx-10 mt-4">
      {{ errorMessage }}
    </div>

    <!-- Seção para cada Ano -->
    <div v-for="(yearData, year) in calculusGroupsByYear" :key="year" class="w-full">
      <div class="px-4 sm:px-10 pt-8 pb-4">
        <h2 class="text-25 font-bold text-[#003965] border-b border-[#e3f0ff] pb-2">Ano de Referência: {{ year }}</h2>
      </div>

      <!-- Lista de "Famílias" de Cálculo -->
      <div v-if="yearData.length" class="px-4 sm:px-10 pb-8 space-y-8">
        <div v-for="parent in yearData" :key="parent.id" class="bg-white rounded-[10px] border border-[#e3f0ff] shadow">
          <!-- Cabeçalho da Família de Versões -->
          <div class="p-6 bg-[#c2ddfd] rounded-t-[10px] flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h3 class="text-20 font-semibold text-black">{{ parent.description }}</h3>
              <p class="text-15 text-black">Iniciado em: {{ parent.createdAt }}</p>
            </div>
            <SecondaryButton label="Gerenciar Versões" @click="goToVersionManager(parent.id)" class="mt-4 sm:mt-0 w-44 h-10 text-15 font-semibold bg-[#003965] text-black rounded-[10px]" />
          </div>

          <!-- Lista de Versões (incluindo o pai) -->
          <ul class="divide-y divide-[#e3f0ff]">
            <li v-for="item in parent.all_versions" :key="item.id" class="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div class="flex items-center gap-4">
                <span :class="getStatusClass(item.status) + ' text-15 font-semibold px-3 py-1 rounded-full'" style="min-width: 80px; text-align: center;">
                  {{ item.status }}
                </span>
                <div>
                  <p class="font-medium text-[#003965]">Versão {{ item.version_number }}</p>
                  <p v-if="item.created_from_version_number" class="text-xs text-gray-500 italic">
                    (Criado a partir da V{{ item.created_from_version_number }})
                  </p>
                </div>
              </div>
              <div class="mt-3 sm:mt-0 flex items-center gap-2 flex-wrap">
                <SecondaryButton 
                  label="Visualizar Relatório" 
                  @click="openPreviewModal(item.id)" 
                />
                <SecondaryButton 
                  label="Excluir" 
                  @click="excluirCalculo(item.id)" 
                  custom-class="!bg-red-600 hover:!bg-red-700 text-white w-32 h-10 text-15 font-semibold rounded-[10px]"
                />
              </div>
            </li>
          </ul>

        </div>
      </div>
      <div v-else class="px-4 sm:px-10 pb-8 text-15 text-[#3459a2]">Nenhum cálculo encontrado para este ano.</div>
    </div>
    <CalculusPreviewModal 
        :visible="isModalVisible" 
        :calculus-id="selectedCalculusId" 
        @close="isModalVisible = false"
    />
  </Whiteboard>
</template>

<script>
import { getAccessToken } from '@/service/token.js';
import axios from 'axios';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import SecondaryButton from '@/components/Buttons/SecondaryButton.vue';
import CalculusPreviewModal from '@/components/Modal/CalculusPreviewModal.vue';

export default {
  name: 'PreviousResults',
  components: { Whiteboard, SecondaryButton, CalculusPreviewModal },
  data() {
    return {
      calculusGroupsByYear: {},
      errorMessage: null,
      isModalVisible: false,
      selectedCalculusId: null,
    };
  },
  methods: {
    async fetchCalculus() {
      try {
        const token = await getAccessToken();
        if (!token) {
          this.errorMessage = 'Usuário não autenticado ou token expirado.';
          return;
        }
        const response = await axios.get("http://127.0.0.1:8000/csv/get-list-calculus/", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (Object.keys(response.data).length === 0) {
            this.calculusGroupsByYear = {};
            return;
        }
        this.processCalculusData(response.data);
      } catch (error) {
        console.error('Erro ao buscar cálculos:', error);
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar cálculos.';
      }
    },

    processCalculusData(apiData) {
      const allCalculus = {};
      const calculusFamilies = {};

      for (const year in apiData) {
        const yearCalculationsObject = apiData[year];
        
        const calculationsArray = Object.values(yearCalculationsObject);

        for (const calc of calculationsArray) {
          allCalculus[calc.calculus_id] = {
            id: calc.calculus_id,
            description: calc.description,
            createdAt: new Date(calc.created_at).toLocaleDateString('pt-BR'),
            status: calc.status,
            version_number: calc.version_number,
            parent_calculus_id: calc.parent_calculus_id,
            year: year,
            created_from_version_number: calc.created_from_version_number
          };
        }
      }

      for (const calc of Object.values(allCalculus)) {
        const familyId = calc.parent_calculus_id || calc.id;
        if (!calculusFamilies[familyId]) {
          calculusFamilies[familyId] = {
            ...allCalculus[familyId],
            all_versions: []
          };
        }
        calculusFamilies[familyId].all_versions.push(calc);
      }

      const groupsByYear = {};
      for (const family of Object.values(calculusFamilies)) {
        const year = family.year;
        if (!groupsByYear[year]) {
          groupsByYear[year] = [];
        }
        family.all_versions.sort((a, b) => a.version_number - b.version_number);
        groupsByYear[year].push(family);
      }

      for (const year in groupsByYear) {
          groupsByYear[year].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      this.calculusGroupsByYear = groupsByYear;
    },

    goToVersionManager(parentId) {
      this.$router.push({ name: 'versionmanager', params: { id: parentId } });
    },
    async copiarCalculo(item) {
      try {
        const token = await getAccessToken();
        const response = await axios.post("http://127.0.0.1:8000/csv/copy-calculus/", { calc_id: item.id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`Cálculo copiado com sucesso! Novo ID: ${response.data.new_calculus_id}`);
        
        window.location.reload();
      } catch (error) {
        console.error('Erro ao copiar cálculo:', error);
      }
    },

    async handleVisualizarClick(calculusId) {
      try {
        const token = await getAccessToken();
        if (!token) {
          this.errorMessage = 'Usuário não autenticado ou token expirado.';
          return;
        }

        const response = await axios.post(
          "http://127.0.0.1:8000/csv/api/set-active-calculus/",
          { calc_id: calculusId },

          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        this.$router.push({ path: '/admin/dashboard' });
      } catch (error) {
        console.error('Erro ao ativar o cálculo:', error);
        this.errorMessage = 'Erro ao ativar o cálculo para visualização.';
      }
    },

    async excluirCalculo(calculusId) {

      if (!confirm('Tem certeza que deseja excluir esta versão? Esta ação não pode ser desfeita.')) {

        return;
      }
      try {
        const token = await getAccessToken();
        await axios.post(

          `http://127.0.0.1:8000/csv/calculus/${calculusId}/delete/`, 
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        alert('Versão excluída com sucesso!');
        
        await this.fetchCalculus();


      } catch (error) {
        console.error('Erro ao excluir cálculo:', error);
        this.errorMessage = error.response?.data?.error || 'Erro ao excluir o cálculo.';
      }
    },

    getStatusClass(status) {
      const classes = {
        PUBLISHED: 'bg-green-100 text-green-800',
        DRAFT: 'bg-yellow-100 text-yellow-800',
        ARCHIVED: 'bg-gray-100 text-gray-800',
      };
      return classes[status] || 'bg-gray-100';
    },

    openPreviewModal(calculusId) {
      this.selectedCalculusId = calculusId;
      this.isModalVisible = true;
    },

  },
  async mounted() {
    await this.fetchCalculus();
  },
};
</script>