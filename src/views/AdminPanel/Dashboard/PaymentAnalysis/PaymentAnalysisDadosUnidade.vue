<template>
  <!-- Filtros -->
  <DadosUnidadeFiltro 
    :filters="filters"
    :availableUnits="availableUnits"
    @update:filters="filters = $event"
    @filter-change="fetchDashboardData"
  />

  <div v-if="loading" class="text-center py-10">Carregando dados...</div>
  <div v-else-if="error" class="text-center py-10 text-red-500">{{ error }}</div>

  <div v-else-if="dashboardData">
    <!-- Indicadores -->
    <DadosUnidadeIndicadores 
      :servidores="dashboardData.servidores"
      :naoRecebem="dashboardData.naoRecebem"
      :percentualNaoRecebe="dashboardData.percentualNaoRecebe"
    />

    <!-- Motivos para não recebimento x UE -->
    <MotivosParaNaoRecebimentoXUE 
      :data="dashboardData.motivosParaNaoRecebimentoXUE"
    />

    <!-- Motivos - Unidades que menos recebem -->
    <MotivosMenosRecebem 
      :data="dashboardData.motivosMenosRecebem"
    />

    <!-- Motivos - Unidades que mais recebem -->
    <MotivosMaisRecebem 
      :data="dashboardData.motivosMaisRecebem"
    />

    <!-- Valores a receber x UE -->
    <ValoresAReceberXUE 
      :data="dashboardData.valoresAReceberXUE"
    />

    <!-- Valores - Unidades que menos recebem -->
    <ValoresMenosRecebem 
      :data="dashboardData.valoresMenosRecebem"
    />

    <!-- Valores - Unidades que mais recebem -->
    <ValoresMaisRecebem 
      :data="dashboardData.valoresMaisRecebem"
    />

    <!-- % de frequência por UE -->
    <PorcentagemFrequenciaPorUE 
      :data="dashboardData.porcentagemFrequenciaPorUE"
    />

    <!-- Proporção de recebimento por UE -->
    <ProporcaoRecebimentoPorUE 
      :data="dashboardData.proporcaoRecebimentoPorUE"
    />
  </div>
</template>

<script>
import DadosUnidadeFiltro from './components/DadosUnidadeFiltro.vue'
import DadosUnidadeIndicadores from './components/DadosUnidadeIndicadores.vue'
import MotivosParaNaoRecebimentoXUE from './components/MotivosParaNaoRecebimentoXUE.vue'
import MotivosMenosRecebem from './components/MotivosMenosRecebem.vue'
import MotivosMaisRecebem from './components/MotivosMaisRecebem.vue'
import ValoresAReceberXUE from './components/ValoresAReceberXUE.vue'
import ValoresMenosRecebem from './components/ValoresMenosRecebem.vue'
import ValoresMaisRecebem from './components/ValoresMaisRecebem.vue'
import PorcentagemFrequenciaPorUE from './components/PorcentagemFrequenciaPorUE.vue'
import ProporcaoRecebimentoPorUE from './components/ProporcaoRecebimentoPorUE.vue'
import { ref, watch } from 'vue'
import axios from 'axios'
import { getAccessToken } from '@/service/token'

export default {
  name: 'PaymentAnalysisDadosUnidade',
  components: {
    DadosUnidadeFiltro,
    DadosUnidadeIndicadores,
    MotivosParaNaoRecebimentoXUE,
    MotivosMenosRecebem,
    MotivosMaisRecebem,
    ValoresAReceberXUE,
    ValoresMenosRecebem,
    ValoresMaisRecebem,
    PorcentagemFrequenciaPorUE,
    ProporcaoRecebimentoPorUE
  },

  setup() {
    const loading = ref(true)
    const error = ref(null)
    
    const filters = ref({
      motivo: '',
      unidade: '',
      situacao: '',
      grupoGR: '',
      grupoRefATP: ''
    })
    
    const dashboardData = ref({
      servidores: 7494,
      naoRecebem: 3474,
      percentualNaoRecebe: 46.29,
      motivosParaNaoRecebimentoXUE: {},
      motivosMenosRecebem: {},
      motivosMaisRecebem: {},
      valoresAReceberXUE: {},
      valoresMenosRecebem: {},
      valoresMaisRecebem: {},
      porcentagemFrequenciaPorUE: {},
      proporcaoRecebimentoPorUE: {}
    })
    
    const availableUnits = ref([])

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
          if (value) queryParams.append(key, value)
        })
        
        const response = await axios.get(`/pagamentos/dashboard/dados-unidade/?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })

        dashboardData.value = response.data
        
        if (availableUnits.value.length === 0) {
          availableUnits.value = response.data.available_units || []
        }

      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err)
        error.value = 'Não foi possível carregar os dados do dashboard.'
      } finally {
        loading.value = false
      }
    }

    // Para desenvolvimento, use dados mockados
    loading.value = false

    // Para produção, descomente a linha abaixo:
    // watch(filters, fetchDashboardData, { deep: true, immediate: true })
    
    return {
      filters,
      availableUnits,
      dashboardData,
      loading,
      error
    }
  }
}
</script>