<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-10 mb-6">
    <!-- Tipos de Recurso -->
    <div class="bg-white rounded-[10px] shadow-md">
      <div class="bg-[#3459A2] text-white text-center font-bold text-15 p-3 rounded-t-[10px]">
        Tipos de recurso
      </div>
      <div class="p-6">
        <canvas ref="chartTipos" class="w-full max-h-80"></canvas>
      </div>
    </div>

    <!-- Status -->
    <div class="bg-white rounded-[10px] shadow-md">
      <div class="bg-[#3459A2] text-white text-center font-bold text-15 p-3 rounded-t-[10px]">
        Status
      </div>
      <div class="p-6">
        <canvas ref="chartStatus" class="w-full max-h-80"></canvas>
      </div>
    </div>

    <!-- Conclusão -->
    <div class="bg-white rounded-[10px] shadow-md">
      <div class="bg-[#3459A2] text-white text-center font-bold text-15 p-3 rounded-t-[10px]">
        Conclusão
      </div>
      <div class="p-6">
        <canvas ref="chartConclusao" class="w-full max-h-80"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'PieCharts',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartTipos = ref(null)
    const chartStatus = ref(null)
    const chartConclusao = ref(null)
    
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
    
    const generateColors = (count) => {
      const colors = ['#3b82f6', '#ef4444', '#f97316', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#84cc16', '#ec4899', '#6b7280']
      return Array.from({ length: count }, (_, i) => colors[i % colors.length])
    }
    
    const createCharts = () => {
      destroyCharts()
      
      // Tipos de Recurso
      if (chartTipos.value && props.data.length > 0) {
        const categories = {}
        props.data.forEach(resource => {
          const criterios = resource.criterios_selecionados || []
          criterios.forEach(criterio => {
            categories[criterio] = (categories[criterio] || 0) + 1
          })
        })
        
        const labels = Object.keys(categories)
        const data = Object.values(categories)
        
        if (labels.length > 0) {
          chartsInstances.tipos = new Chart(chartTipos.value, {
            type: 'pie',
            data: {
              labels: labels.map(getCategoryLabel),
              datasets: [{
                data: data,
                backgroundColor: generateColors(labels.length)
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: { boxWidth: 12, padding: 8, font: { size: 10 } }
                }
              }
            }
          })
        }
      }
      
      // Status
      if (chartStatus.value && props.data.length > 0) {
        const statusCount = {
          'pendente': 0,
          'em_analise': 0,
          'respondido': 0
        }
        
        props.data.forEach(resource => {
          statusCount[resource.status] = (statusCount[resource.status] || 0) + 1
        })
        
        chartsInstances.status = new Chart(chartStatus.value, {
          type: 'pie',
          data: {
            labels: ['Pendente', 'Em Análise', 'Respondido'],
            datasets: [{
              data: [statusCount.pendente, statusCount.em_analise, statusCount.respondido],
              backgroundColor: ['#f59e0b', '#3b82f6', '#10b981']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 12, padding: 8 }
              }
            }
          }
        })
      }
      
      // Conclusão
      if (chartConclusao.value && props.data.length > 0) {
        const conclusionCount = {
          'deferido': 0,
          'indeferido': 0,
          'parcialmente_deferido': 0
        }
        
        props.data.forEach(resource => {
          if (resource.conclusao) {
            conclusionCount[resource.conclusao] = (conclusionCount[resource.conclusao] || 0) + 1
          }
        })
        
        chartsInstances.conclusao = new Chart(chartConclusao.value, {
          type: 'pie',
          data: {
            labels: ['Deferido', 'Indeferido', 'Parcialmente Deferido'],
            datasets: [{
              data: [conclusionCount.deferido, conclusionCount.indeferido, conclusionCount.parcialmente_deferido],
              backgroundColor: ['#10b981', '#ef4444', '#f59e0b']
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: { boxWidth: 12, padding: 8 }
              }
            }
          }
        })
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
      chartTipos,
      chartStatus,
      chartConclusao,
      updateCharts
    }
  }
}
</script>