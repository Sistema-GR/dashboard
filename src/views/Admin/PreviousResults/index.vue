<template>
  <Whiteboard title="Biblioteca de Cálculos">
    <div v-if="errorMessage" class="bg-red-600 text-white p-3 rounded-lg mx-10 my-4">
      {{ errorMessage }}
    </div>

    <div class="p-7 md:px-10">
      <div
        v-for="(yearData, year) in calculusGroupsByYear"
        :key="year"
        class="mb-10"
      >
        <!-- Cabeçalho do Ano -->
        <div class="flex items-center gap-3.5 mb-5">
          <span class="bg-[#003965] text-white text-xs font-semibold py-1.5 px-3.5 rounded-full whitespace-nowrap tracking-wide">
            Ano de referência: {{ year }}
          </span>
          <div class="flex-1 h-px bg-[#e3f0ff]"></div>
        </div>

        <!-- Famílias de Cálculo -->
        <div v-if="yearData.length" class="flex flex-col gap-4">
          <div
            v-for="parent in yearData"
            :key="parent.id"
            class="bg-white border border-[#e3f0ff] rounded-xl overflow-hidden shadow-sm"
          >
            <!-- Cabeçalho da Família -->
            <div class="bg-[#e8f2ff] p-4 flex justify-between items-center gap-3 flex-wrap">
              <div>
                <h3 class="text-base font-semibold text-[#003965] m-0">{{ parent.name }}</h3>
                <p class="text-xs text-[#4a7aa8] mt-0.5 mb-0">Iniciado em: {{ parent.createdAt }}</p>
              </div>
              <button
                class="bg-[#003965] text-white border-none rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer transition-all hover:bg-[#00294a] whitespace-nowrap"
                @click="goToVersionManager(parent.id)"
              >
                Gerenciar versões
              </button>
            </div>

            <!-- Lista de Versões -->
            <div class="px-4 pt-2 pb-3">
              <div
                v-for="item in parent.all_versions"
                :key="item.id"
                class="flex justify-between items-center p-3 gap-3 flex-wrap border-b border-[#e3f0ff] rounded-lg cursor-pointer transition-colors hover:bg-[#f5f9ff] last:border-b-0"
                :class="{ 'bg-[#eef5ff]': selectedIds.includes(item.id) }"
                @click="toggleSelection(item.id)"
              >
                <div class="flex items-center gap-3 flex-wrap">
                  <!-- Checkbox customizado -->
                  <div
                    class="w-4 h-4 border border-[#003965] rounded flex items-center justify-center shrink-0"
                    :class="{ 'bg-[#003965]': selectedIds.includes(item.id) }"
                  >
                    <span v-if="selectedIds.includes(item.id)" class="text-white text-xs">✓</span>
                  </div>

                  <!-- Status Pill -->
                  <span
                    class="text-xs font-semibold py-0.5 px-2.5 rounded-full whitespace-nowrap"
                    :class="item.is_finalized ? 'bg-[#dcf3e5] text-[#1a6636]' : 'bg-[#fff4d6] text-[#8a5e00]'"
                  >
                    {{ item.status_label }}
                  </span>

                  <div>
                    <p class="text-sm font-semibold text-[#003965] m-0">Versão {{ item.version_number }}</p>
                    <p v-if="item.created_from_version_number" class="text-xs text-gray-400 italic mt-0.5 mb-0">
                      (Criado a partir da V{{ item.created_from_version_number }})
                    </p>
                  </div>
                </div>

                <div class="flex items-center gap-1.5 flex-wrap" @click.stop>
                  <button
                    v-if="isEligibleForPromotion(item.id)"
                    class="bg-[#1e7e3c] text-white border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer hover:opacity-80 whitespace-nowrap"
                    @click="promoteToOpenCalc(item.id)"
                  >
                    Publicar
                  </button>
                  <button
                    class="bg-transparent text-[#003965] border border-[#003965] rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer hover:opacity-80 whitespace-nowrap"
                    @click="openPreviewModal(item.id)"
                  >
                    Visualizar relatório
                  </button>
                  <button
                    class="bg-red-600 text-white border-none rounded-lg px-3 py-1.5 text-xs font-semibold cursor-pointer hover:bg-red-700 whitespace-nowrap"
                    @click="excluirCalculo(item.id)"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="p-6 text-[#3459a2] text-sm">
          Nenhum cálculo encontrado para este ano.
        </div>
      </div>

      <!-- Barra de ação em massa -->
      <div v-if="selectedIds.length > 0" class="flex justify-end items-center gap-4 pt-3 pb-1">
        <span class="text-sm text-[#3459a2]">{{ selectedIds.length }} versão(ões) selecionada(s)</span>
        <button
          class="bg-red-600 text-white border-none rounded-lg px-5 py-2.5 text-xs font-semibold cursor-pointer transition-colors hover:bg-red-700"
          @click="excluirSelecionados(selectedIds)"
        >
          Excluir selecionados
        </button>
      </div>
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
import { apiClient } from '@/service/apiService';
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
      successMessage: null,
      isLoading: false,
      isModalVisible: false,
      selectedCalculusId: null,
      selectedIds: [],
      eligibleCalcs: [],
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
        const response = await apiClient.get('/csv/get-list-calculus/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Object.keys(response.data).length === 0) {
          alert('Nenhum cálculo encontrado para o usuário. Redirecionando para a página de criação de cálculos.');
          this.calculusGroupsByYear = {};
          return;
        }
        this.processCalculusData(response.data);
      } catch (error) {
        console.error('Erro ao buscar cálculos:', error);
        this.errorMessage = error.response?.data?.message || 'Erro ao buscar cálculos.';
      }
    },

    async listEligibleCalculations() {
      try {
        const token = await getAccessToken();
        const response = await apiClient.get('/csv/calculus/list-eligible-for-promotion/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const eligible = Array.isArray(response.data) ? response.data : [];
        this.eligibleCalcs = eligible.map((calc) => calc.calc_id);
      } catch (error) {
        console.error('Erro ao buscar cálculos elegíveis:', error);
        this.eligibleCalcs = [];
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
            name: calc.name,
            id: calc.calculus_id,
            description: calc.description,
            createdAt: new Date(calc.created_at).toLocaleDateString('pt-BR'),
            is_finalized: calc.is_finalized,
            status_label: calc.is_finalized ? 'Finalizado' : 'Em Edição',
            version_number: calc.version_number,
            parent_calculus_id: calc.parent_calculus_id,
            year: year,
            created_from_version_number: calc.created_from_version_number,
          };
        }
      }

      for (const calc of Object.values(allCalculus)) {
        const familyId = calc.parent_calculus_id || calc.id;
        if (!calculusFamilies[familyId]) {
          calculusFamilies[familyId] = {
            ...allCalculus[familyId],
            all_versions: [],
          };
        }
        calculusFamilies[familyId].all_versions.push(calc);
      }

      const groupsByYear = {};
      for (const family of Object.values(calculusFamilies)) {
        const year = family.year;
        if (!groupsByYear[year]) groupsByYear[year] = [];
        family.all_versions.sort((a, b) => a.version_number - b.version_number);
        groupsByYear[year].push(family);
      }

      for (const year in groupsByYear) {
        groupsByYear[year].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      this.calculusGroupsByYear = groupsByYear;
    },

    toggleSelection(id) {
      const idx = this.selectedIds.indexOf(id);
      if (idx === -1) {
        this.selectedIds.push(id);
      } else {
        this.selectedIds.splice(idx, 1);
      }
    },

    goToVersionManager(parentId) {
      this.$router.push({ name: 'versionmanager-home', params: { id: parentId } });
    },

    isEligibleForPromotion(calculusId) {
      return this.eligibleCalcs.includes(calculusId);
    },

    async promoteToOpenCalc(calculusId) {
      if (!confirm(`Tem certeza que deseja promover o cálculo ID ${calculusId}? Ele se tornará um OpenCalc e poderá ser ativado para visualização.`)) {
        return;
      }
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const token = await getAccessToken();
        const response = await apiClient.post(
          '/csv/opencalc/create-opencalc/',
          { calc_id: calculusId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 201) {
          alert('Cálculo promovido com sucesso!');
          this.successMessage = 'Cálculo promovido com sucesso!';
          await this.listEligibleCalculations();
          await this.fetchCalculus();
        }
      } catch (error) {
        console.error('Erro ao promover o cálculo:', error.response?.data || error);
        const errorMsg = error.response?.data?.error || 'Ocorreu um erro desconhecido.';
        this.errorMessage = `Falha ao promover o cálculo: ${errorMsg}`;
      }
    },

    async excluirCalculo(calculusId) {
      if (!confirm('Tem certeza que deseja excluir esta versão? Esta ação não pode ser desfeita.')) {
        return;
      }
      try {
        const token = await getAccessToken();
        await apiClient.post(
          `/csv/calculus/${calculusId}/delete/`,
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

    async excluirSelecionados(selectedIds) {
      if (selectedIds.length === 0) {
        alert('Nenhuma versão selecionada para exclusão.');
        return;
      }
      if (!confirm('Tem certeza que deseja excluir múltiplas versões? Esta ação não pode ser desfeita.')) {
        return;
      }
      for (const id of selectedIds) {
        try {
          const token = await getAccessToken();
          await apiClient.post(
            `/csv/calculus/${id}/delete/`,
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          console.error('Erro ao excluir cálculo:', error);
          this.errorMessage = error.response?.data?.error || 'Erro ao excluir o cálculo.';
        }
      }
      alert('Cálculos excluídos com sucesso!');
      this.selectedIds = [];
      await this.fetchCalculus();
    },

    openPreviewModal(calculusId) {
      this.selectedCalculusId = calculusId;
      this.isModalVisible = true;
    },
  },
  async mounted() {
    await this.fetchCalculus();
    await this.listEligibleCalculations();
  },
};
</script>
