<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-10 mb-6">
    <!-- Quantidade por Unidade -->
    <div class="bg-white rounded-[10px] shadow-md">
      <div class="bg-[#3459A2] text-white text-center font-bold text-15 p-3 rounded-t-[10px]">
        Quantidade de recursos por Unidade
      </div>
      <div class="p-6">
        <canvas ref="chartUnidades" class="w-full max-h-96"></canvas>
      </div>
    </div>

    <!-- Categorias -->
    <div class="bg-white rounded-[10px] shadow-md">
      <div class="bg-[#3459A2] text-white text-center font-bold text-15 p-3 rounded-t-[10px]">
        Categorias
      </div>
      <div class="p-6">
        <canvas ref="chartCategorias" class="w-full max-h-96"></canvas>
      </div>
    </div>

    <!-- Equipe Responsável -->
    <div class="bg-white rounded-[10px] shadow-md">
      <div class="bg-[#3459A2] text-white text-center font-bold text-15 p-3 rounded-t-[10px]">
        Equipe Responsável
      </div>
      <div class="p-6">
        <canvas ref="chartEquipes" class="w-full max-h-96"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'BarCharts',
  props: {
    data: {
      type: Array,
      required: true
    },
    availableUnits: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const chartUnidades = ref(null)
    const chartCategorias = ref(null)
    const chartEquipes = ref(null)
    
    let chartsInstances = {}
    
    const destroyCharts = () => {
      Object.values(chartsInstances).forEach(chart => {
        if (chart) chart.destroy()
      })
      chartsInstances = {}
    }
    
    const getCategoryLabel = (category) => {
      const labels = {
        'formacao': 'Formação',
        'discordancia_regras': 'Discordância das regras',
        'faltas': 'Faltas',
        'tempo_atuacao': 'Tempo de atuação',
        'mais_criterios': 'Mais de um critério',
        'esclarecimento': 'Esclarecimento',
        'pagamento_indevido': 'Pagamento indevido',
        'grupo': 'Grupo',
        'atividades': 'Atividades',
        'alega_atuacao_outra_etapa': 'Alega atuação em outra etapa'
      }
      return labels[category] || category
    }
    
    const getUnitName = (unitId) => {
      const unit = props.availableUnits.find(u => u.id === unitId)
      return unit ? unit.nome : 'N/A'
    }
    
    const createCharts = () => {
      destroyCharts()
      
      const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true },
          x: { ticks: { maxRotation: 45, font: { size: 10 } } }
        },
        plugins: { legend: { display: false } }
      }
      
      // Unidades
      if (chartUnidades.value && props.data.length > 0) {
        const unitsCount = {}
        props.data.forEach(resource => {
          const unitName = getUnitName(resource.unidade_atuacao_id)
          unitsCount[unitName] = (unitsCount[unitName] || 0) + 1
        })
        
        const sortedUnits = Object.entries(unitsCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
        
        if (sortedUnits.length > 0) {
          chartsInstances.unidades = new Chart(chartUnidades.value, {
            type: 'bar',
            data: {
              labels: sortedUnits.map(([name]) => name),
              datasets: [{
                data: sortedUnits.map(([,count]) => count),
                backgroundColor: '#3b82f6'
              }]
            },
            options: barOptions
          })
        }
      }
      
      // Categorias
      if (chartCategorias.value && props.data.length > 0) {
        const categories = {}
        props.data.forEach(resource => {
          const criterios = resource.criterios_selecionados || []
          criterios.forEach(criterio => {
            categories[criterio] = (categories[criterio] || 0) + 1
          })
        })
        
        const sortedCategories = Object.entries(categories)
          .sort(([,a], [,b]) => b - a)
        
        if (sortedCategories.length > 0) {
          chartsInstances.categorias = new Chart(chartCategorias.value, {
            type: 'bar',
            data: {
              labels: sortedCategories.map(([cat]) => getCategoryLabel(cat)),
              datasets: [{
                data: sortedCategories.map(([,count]) => count),
                backgroundColor: '#06b6d4'
              }]
            },
            options: barOptions
          })
        }
      }
      
      // Equipes
      if (chartEquipes.value && props.data.length > 0) {
        const teamsCount = {}
        props.data.forEach(resource => {
          const team = resource.equipe_responsavel || 'Não definido'
          teamsCount[team] = (teamsCount[team] || 0) + 1
        })
        
        if (Object.keys(teamsCount).length > 0) {
          chartsInstances.equipes = new Chart(chartEquipes.value, {
            type: 'bar',
            data: {
              labels: Object.keys(teamsCount),
              datasets: [{
                data: Object.values(teamsCount),
                backgroundColor: '#ec4899'
              }]
            },
            options: {
              ...barOptions,
              scales: { y: { beginAtZero: true } }
            }
          })
        }
      }
    }
    
    const updateCharts = () => {
      createCharts()
    }
    
    watch(() => props.data, () => {
      createCharts()
    }, { deep: true })
    
    onMounted(() => {
      createCharts()
    })
    
    return {
      chartUnidades,
      chartCategorias,
      chartEquipes,
      updateCharts
    }
  }
}
</script>