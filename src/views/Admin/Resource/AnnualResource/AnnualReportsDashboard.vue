<template>
  <Whiteboard title="Relatórios Anuais" >
    
    <!-- Filtros -->
    <Filtro 
      v-model:filters="filters"
      :availableUnits="availableUnits"
      :availableAdmins="availableAdmins"
    />
    
    <!-- Tabs de Anos -->
    <div class="flex space-x-4 pt-3 border-b border-[#c2ddfd]">
      <button
        v-for="year in [2024, 2025, 2026]"
        :key="year"
        @click="filters.year = year"
        :class="[
          'px-4 py-2 text-25 font-semibold focus:outline-none transition',
          filters.year == year
            ? 'border-b-2 border-[#3459A2] text-[#3459A2]'
            : 'text-[#c2ddfd] hover:text-[#7597da]'
        ]"
        type="button"
      >
        {{ year }}
      </button>
    </div>

    <div v-if="loading" class="text-center py-10">Carregando dados...</div>
    <div v-else-if="error" class="text-center py-10 text-red-500">{{ error }}</div>

    <div v-else-if="dashboardData">
    <!-- RecursosRespondidos -->
      <RecursosRespondidos :stats="dashboardData.stats" />

      <!-- ValorPago -->
      <ValorPago 
        :distribuicao="valorPagoProps.distribuicao"
        :pessoas-afetadas="valorPagoProps.pessoasAfetadas"
        :valor-corrigido="valorPagoProps.valorCorrigido"
      />

      <!-- TipoRecurso  -->
      <TipoRecurso 
        :tipos-data="dashboardData.recursos_por_categoria"
        :status-data="dashboardData.status_counts"
        :conclusao-data="dashboardData.conclusao_counts"
      />

      <!-- RecursosTotais -->
      <RecursosTotais 
        :recursos-por-unidade="dashboardData.recursos_por_unidade"
        :recursos-por-categoria="dashboardData.recursos_por_categoria"
        :recursos-por-equipe="dashboardData.recursos_por_equipe"
      />

      <!-- Tabela de Responsáveis -->
      <StatusEquipe 
        :responsaveis="dashboardData.responsaveis_stats"
      />

      <!-- <RecursosUnidades :data="filteredResources" :availableUnits="availableUnits" /> -->

      <DadosCompletos :data="dashboardData.dados_completos" />
    </div>
  </Whiteboard>
</template>

<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import Filtro from '@/views/Admin/Resource/AnnualResource/components/Filtro.vue'
import RecursosRespondidos from '@/views/Admin/Resource/AnnualResource/components/RecursosRespondidos.vue'
import ValorPago from '@/views/Admin/Resource/AnnualResource/components/ValorPago.vue'
import StatusEquipe from '@/views/Admin/Resource/AnnualResource/components/StatusEquipe.vue'
import RecursosTotais from '@/views/Admin/Resource/AnnualResource/components/RecursosTotais.vue'
import TipoRecurso from '@/views/Admin/Resource/AnnualResource/components/TipoRecurso.vue'
import DadosCompletos from './components/DadosCompletos.vue'
import { ref, watch, computed } from 'vue'
import axios from 'axios'
import { getAccessToken } from '@/service/token'

export default {
  name: 'AnnualReportsDashboard',
  components: { 
    Whiteboard,
    Filtro, 
    RecursosRespondidos, 
    ValorPago, 
    StatusEquipe, 
    RecursosTotais, 
    TipoRecurso,
    DadosCompletos
  },
  
  setup() {
    const loading = ref(true)
    const error = ref(null)
    
    const filters = ref({
      year: new Date().getFullYear(),
      unidade_atuacao: '',
      categoria: '',
      equipe_responsavel: '',
      responsavel_id: '', 
      conclusao: '',
    })
    
    const dashboardData = ref(null)
    const availableUnits = ref([])
    const availableAdmins = ref([])
    const comparisonData = ref(null);

    const fetchDashboardData = async () => {
      loading.value = true
      error.value = null
      try {
        const token = await getAccessToken()
        if (!token) {
          error.value = "Autenticação necessária."
          loading.value = false
          return
        }
        
        const queryParams = new URLSearchParams()
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value) {
            const queryKey = key === 'responsavel' ? 'responsavel_id' : key;
            queryParams.append(queryKey, value)
          }
        })
        
        const response = await axios.get(`/recursos/dashboard/?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        dashboardData.value = response.data
        
        if (availableUnits.value.length === 0) {
            availableUnits.value = response.data.available_units
        }
        if (availableAdmins.value.length === 0) {
            availableAdmins.value = response.data.available_admins
        }

      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err)
        error.value = 'Não foi possível carregar os dados do dashboard.'
      } finally {
        loading.value = false
      }
    }
    
    const fetchComparisonData = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get(`/recursos/dashboard/comparison/?year=${filters.value.year}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        comparisonData.value = response.data; 
      } catch (err) {
        console.error('Erro ao buscar dados de comparação:', err);
        comparisonData.value = null;
      }
    };

    const fetchAllData = async () => {
      loading.value = true;
      error.value = null;
      await Promise.all([
        fetchDashboardData(),
        fetchComparisonData()
      ]);
      loading.value = false;
    };

    watch(filters, fetchAllData, { deep: true, immediate: true });
    
    const valorPagoProps = computed(() => {
      if (!comparisonData.value || !comparisonData.value.initial_data) {
        const finalData = comparisonData.value?.final_data;
        return {
          distribuicao: finalData?.distribuicao || [],
          pessoasAfetadas: finalData?.pessoas_pagas || 0,
          valorCorrigido: '0,00'
        };
      }
      const initial = comparisonData.value.initial_data;
      const final = comparisonData.value.final_data;
      console.log('Initial Data:', initial);
      console.log('Final Data:', final);

      const diffPessoas = final.pessoas_pagas - initial.pessoas_pagas;
      const diffValor = final.valor_pago - initial.valor_pago;
      
      const deltaDistribuicao = final.distribuicao.map(finalBracket => {
        const initialBracket = initial.distribuicao.find(
          initialB => initialB.label === finalBracket.label
        );
        const initialValue = initialBracket ? initialBracket.value : 0;
        return {
          label: finalBracket.label,
          value: finalBracket.value - initialValue,
        };
      });

      return {
        distribuicao: deltaDistribuicao,
        pessoasAfetadas: diffPessoas,
        valorCorrigido: diffValor.toLocaleString('pt-BR', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        })
      };
    });
    
    return {
      filters,
      availableUnits,
      availableAdmins,
      dashboardData,
      loading,
      error,
      valorPagoProps,
    }
  }
}
</script>