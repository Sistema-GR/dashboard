<template>
  <Sidebar :route="'admin'" @update:isSidebarMinimized="handleSidebarMinimized" class="z-50"/>
  <Whiteboard title="Relatórios Anuais" class="!overflow-visible overflow-y-auto z-40 relative" :isSidebarMinimized="isSidebarMinimized">
    <!-- Filtros -->
    <Filtro 
      v-model:filters="filters"
      :availableUnits="availableUnits"
      :availableAdmins="availableAdmins"
      @filter-change="onFilterChange"
      @clear-filters="clearFilters"
      @export-data="exportData"
    />

    <!-- Resumo Geral -->
    <RecursosRespondidos :stats="filteredStats" />

    <!-- Cards de Estatísticas -->
    <ValorPago :stats="filteredStats" />

    <!-- Gráficos de Pizza -->
    <StatusEquipe 
      ref="StatusEquipeRef"
      :data="filteredResources"
    />

    <!-- Gráficos de Barras -->
    <RecursosTotais 
      ref="RecursosTotaisRef"
      :data="filteredResources"
      :availableUnits="availableUnits"
    />

    <!-- Tabela de Responsáveis -->
    <TipoRecurso :stats="responsibleStats" />

    <RecursosUnidades :data="filteredResources" :availableUnits="availableUnits" />

    <DadosCompletos :data="filteredResources" />

  </Whiteboard>
</template>

<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue';
import Filtro from '@/views/Admin/Resource/AnnualResource/components/Filtro.vue'
import RecursosRespondidos from '@/views/Admin/Resource/AnnualResource/components/RecursosRespondidos.vue'
import ValorPago from '@/views/Admin/Resource/AnnualResource/components/ValorPago.vue'
import StatusEquipe from '@/views/Admin/Resource/AnnualResource/components/StatusEquipe.vue'
import RecursosTotais from '@/views/Admin/Resource/AnnualResource/components/RecursosTotais.vue'
import TipoRecurso from '@/views/Admin/Resource/AnnualResource/components/TipoRecurso.vue'
import RecursosUnidades from '@/views/Admin/Resource/AnnualResource/components/RecursosUnidades.vue'
import { ref, inject, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import { getAccessToken } from '@/service/token'
import DadosCompletos from './components/DadosCompletos.vue'

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
    RecursosUnidades,
    DadosCompletos
  },
  
  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized', ref(false)) // Valor padrão se inject falhar
    
    // Refs
    const StatusEquipeRef = ref(null)
    const RecursosTotaisRef = ref(null)
    
    const filters = ref({
      year: new Date().getFullYear(),
      unidade_atuacao: '',
      categoria: '',
      equipe_responsavel: '',
      responsavel: '',
      status: '',
      conclusao: '',
      periodo: ''
    })
    
    const resourcesData = ref([])
    const availableUnits = ref([])
    const availableAdmins = ref([])
    
    // Computed
    const filteredResources = computed(() => {
      let filtered = resourcesData.value
      
      if (filters.value.year) {
        filtered = filtered.filter(item => 
          new Date(item.created_at).getFullYear() === parseInt(filters.value.year)
        )
      }
      
      if (filters.value.unidade_atuacao) {
        filtered = filtered.filter(item => 
          item.unidade_atuacao_id === parseInt(filters.value.unidade_atuacao)
        )
      }
      
      if (filters.value.categoria) {
        filtered = filtered.filter(item => 
          item.criterios_selecionados?.includes(filters.value.categoria)
        )
      }
      
      if (filters.value.equipe_responsavel) {
        filtered = filtered.filter(item => 
          item.equipe_responsavel === filters.value.equipe_responsavel
        )
      }
      
      if (filters.value.responsavel) {
        filtered = filtered.filter(item => 
          item.responsavel_id === parseInt(filters.value.responsavel)
        )
      }
      
      if (filters.value.status) {
        filtered = filtered.filter(item => 
          item.status === filters.value.status
        )
      }
      
      if (filters.value.conclusao) {
        filtered = filtered.filter(item => 
          item.conclusao === filters.value.conclusao
        )
      }
      
      if (filters.value.periodo) {
        const now = new Date()
        let startDate = new Date()
        
        switch (filters.value.periodo) {
          case 'ultimo_mes':
            startDate.setMonth(now.getMonth() - 1)
            break
          case 'ultimo_trimestre':
            startDate.setMonth(now.getMonth() - 3)
            break
          case 'ultimo_semestre':
            startDate.setMonth(now.getMonth() - 6)
            break
          case 'ultimo_ano':
            startDate.setFullYear(now.getFullYear() - 1)
            break
        }
        
        filtered = filtered.filter(item => 
          new Date(item.created_at) >= startDate
        )
      }
      
      return filtered
    })
    
    const filteredStats = computed(() => {
      const resources = filteredResources.value
      return {
        total: resources.length,
        respondidos: resources.filter(r => r.status === 'respondido').length,
        deferidos: resources.filter(r => r.conclusao === 'deferido').length,
        indeferidos: resources.filter(r => r.conclusao === 'indeferido').length,
        parcialmente_deferidos: resources.filter(r => r.conclusao === 'parcialmente_deferido').length
      }
    })
    
    const responsibleStats = computed(() => {
      const stats = {}
      const total = filteredResources.value.length
      
      filteredResources.value.forEach(resource => {
        const responsibleId = resource.responsavel_id
        const responsibleName = getResponsibleName(responsibleId)
        
        if (!stats[responsibleId]) {
          stats[responsibleId] = {
            id: responsibleId,
            name: responsibleName,
            total: 0,
            deferidos: 0,
            indeferidos: 0,
            parcialmente_deferidos: 0,
            percentage: 0
          }
        }
        
        stats[responsibleId].total++
        
        if (resource.conclusao) {
          stats[responsibleId][resource.conclusao]++
        }
      })
      
      Object.values(stats).forEach(stat => {
        stat.percentage = total > 0 ? ((stat.total / total) * 100).toFixed(1) : 0
      })
      
      return Object.values(stats).sort((a, b) => b.total - a.total)
    })
    
    // Methods
    const onFilterChange = () => {
      updateCharts()
    }
    
    const clearFilters = () => {
      filters.value = {
        year: new Date().getFullYear(),
        unidade_atuacao: '',
        categoria: '',
        equipe_responsavel: '',
        responsavel: '',
        status: '',
        conclusao: '',
        periodo: ''
      }
      updateCharts()
    }
    
    const exportData = async () => {
      try {
        const token = await getAccessToken()
        const queryParams = new URLSearchParams()
        
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value) queryParams.append(key, value)
        })
        
        const response = await axios.get(`/recursos/export/?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        })
        
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `relatorio_recursos_${filters.value.year}.xlsx`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Erro ao exportar dados:', error)
      }
    }
    
    const getResponsibleName = (responsibleId) => {
      const admin = availableAdmins.value.find(admin => admin.id === responsibleId)
      return admin ? `${admin.first_name} ${admin.last_name}` : 'N/A'
    }
    
    const updateCharts = () => {
      if (StatusEquipeRef.value) {
        StatusEquipeRef.value.updateCharts()
      }
      if (RecursosTotaisRef.value) {
        RecursosTotaisRef.value.updateCharts()
      }
    }
    
    const fetchData = async () => {
      try {
        const token = await getAccessToken()
        if (!token) return
        
        const queryParams = new URLSearchParams()
        Object.entries(filters.value).forEach(([key, value]) => {
          if (value) queryParams.append(key, value)
        })
        
        const resourcesResponse = await axios.get(`/recursos/?${queryParams.toString()}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        resourcesData.value = resourcesResponse.data
        
        const unitsResponse = await axios.get('/unidades/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        availableUnits.value = unitsResponse.data
        
        const adminsResponse = await axios.get('/users/admin/', {
          headers: { Authorization: `Bearer ${token}` }
        })
        availableAdmins.value = adminsResponse.data
        
        updateCharts()
      } catch (error) {
        console.error('Erro ao buscar dados:', error)
      }
    }
    
    watch(filters, () => {
      fetchData()
    }, { deep: true })
    
    onMounted(() => {
      fetchData()
    })
    
    // ADICIONAR este método:
    const handleSidebarMinimized = (value) => {
      if (isSidebarMinimized && isSidebarMinimized.value !== undefined) {
        isSidebarMinimized.value = value
      }
    }
    
    return {
      isSidebarMinimized,
      handleSidebarMinimized, // ADICIONAR no return
      StatusEquipeRef,
      RecursosTotaisRef,
      filters,
      availableUnits,
      availableAdmins,
      filteredResources,
      filteredStats,
      responsibleStats,
      onFilterChange,
      clearFilters,
      exportData
    }
  }
}
</script>