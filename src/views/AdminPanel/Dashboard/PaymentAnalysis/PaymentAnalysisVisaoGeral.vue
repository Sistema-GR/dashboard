<template>
  <!-- Filtros -->
  <VisaoGeralFiltro 
    :filters="filters"
    :availableUnits="availableUnits"
    @update:filters="filters = $event"
    @filter-change="fetchDashboardData"
  />

  <div v-if="loading" class="text-center py-10">Carregando dados...</div>
  <div v-else-if="error" class="text-center py-10 text-red-500">{{ error }}</div>

  <div v-else-if="dashboardData">
    <!-- Indicadores -->
    <VisaoGeralIndicadores 
      :totalRecebe="dashboardData.totalRecebe"
      :totalNaoRecebe="dashboardData.totalNaoRecebe"
      :valorPagar="dashboardData.valorPagar"
    />

    <!-- Faixas de Pagamento -->
    <FaixasPagamento 
      :data="dashboardData.faixasPagamento"
    />

    <!-- Motivo de não recebimento -->
    <MotivosNaoRecebimento 
      :data="dashboardData.motivosNaoRecebimento"
    />

    <!-- Proporção de recebimento -->
    <ProporcaoRecebimento 
      :data="dashboardData.proporcaoRecebimento"
    />

    <!-- % de frequência -->
    <PorcentagemFrequencia 
      :data="dashboardData.porcentagemFrequencia"
    />
  </div>
</template>

<script>
import VisaoGeralFiltro from './components/VisaoGeralFiltro.vue'
import VisaoGeralIndicadores from './components/VisaoGeralIndicadores.vue'
import FaixasPagamento from './components/FaixasPagamento.vue'
import MotivosNaoRecebimento from './components/MotivosNaoRecebimento.vue'
import ProporcaoRecebimento from './components/ProporcaoRecebimento.vue'
import PorcentagemFrequencia from './components/PorcentagemFrequencia.vue'
import { ref, watch } from 'vue'
import axios from 'axios'
import { getAccessToken } from '@/service/token'

export default {
  name: 'PaymentAnalysisVisaoGeral',
  components: {
    VisaoGeralFiltro,
    VisaoGeralIndicadores,
    FaixasPagamento,
    MotivosNaoRecebimento,
    ProporcaoRecebimento,
    PorcentagemFrequencia
  },

  setup() {
    const loading = ref(true)
    const error = ref(null)
    
    const filters = ref({
      situacao: '',
      faixaPagamento: '',
      grupos: ''
    })
    
    const dashboardData = ref({
      totalRecebe: 4019,
      totalNaoRecebe: 3474,
      valorPagar: 17327762.52,
      faixasPagamento: {},
      motivosNaoRecebimento: {},
      proporcaoRecebimento: {},
      porcentagemFrequencia: {}
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
        
        const response = await axios.get(`/pagamentos/dashboard/visao-geral/?${queryParams.toString()}`, {
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