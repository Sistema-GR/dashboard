<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Quantidade de recursos</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">

        <!-- Gráfico principal - Por unidade -->
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
            Por unidade
          </div>
          <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
            <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartUnidades" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-10 flex-1 min-w-[340px] max-w-[850px] w-full justify-center">
          <div class="bg-white rounded-[10px] shadow-md flex flex-col h-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
              Por categoria
            </div>
            <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
              <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
                <canvas ref="chartCategorias" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-10 flex-1 min-w-[340px] max-w-[850px] w-full justify-center">
          <div class="bg-white rounded-[10px] shadow-md flex flex-col h-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
              Por equipe responsável
            </div>
            <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
              <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
                <canvas ref="chartEquipes" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import { Chart, registerables } from 'chart.js'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

Chart.register(...registerables)

export default {
  name: 'RecursosTotais',
  components: {
    ChevronDownIcon
  },
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
    const open = ref(true)
    const chartUnidades = ref(null)
    const chartCategorias = ref(null)
    const chartEquipes = ref(null)
    
    let chartsInstances = {}
    
    // Função para gerar paleta de cores do escuro para o claro
    const generateColorPalette = (count, baseColor = 'blue') => {
      const palettes = {
        blue: {
          darkest: '#3459a2',  // blue-900
          lightest: '#eaeef6'   // blue-100
        }
      }
      
      const palette = palettes[baseColor] || palettes.blue
      
      // Converter hex para RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null
      }
      
      const darkRgb = hexToRgb(palette.darkest)
      const lightRgb = hexToRgb(palette.lightest)
      
      const colors = []
      
      for (let i = 0; i < count; i++) {
        // Calcular a interpolação (0 = mais escuro, 1 = mais claro)
        const ratio = count === 1 ? 0 : i / (count - 1)
        
        const r = Math.round(darkRgb.r + (lightRgb.r - darkRgb.r) * ratio)
        const g = Math.round(darkRgb.g + (lightRgb.g - darkRgb.g) * ratio)
        const b = Math.round(darkRgb.b + (lightRgb.b - darkRgb.b) * ratio)
        
        colors.push(`rgb(${r}, ${g}, ${b})`)
      }
      
      return colors
    }
    
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
    
    const createCharts = async () => {
      await nextTick()
      destroyCharts()
      
      if (!open.value) return
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      const hasRealData = props.data && props.data.length > 0
      
      // Gráfico de Unidades
      if (chartUnidades.value) {
        let unitsData, unitsLabels
        
        if (hasRealData) {
          const unitsCount = {}
          props.data.forEach(resource => {
            const unitName = getUnitName(resource.unidade_atuacao_id)
            unitsCount[unitName] = (unitsCount[unitName] || 0) + 1
          })
          const sortedUnits = Object.entries(unitsCount).sort(([,a], [,b]) => b - a).slice(0, 10)
          unitsLabels = sortedUnits.map(([name]) => name)
          unitsData = sortedUnits.map(([,count]) => count)
        } else {
          unitsLabels = ['Unidade A', 'Unidade B', 'Unidade C', 'Unidade D', 'Unidade E', 'Unidade F', 'Unidade G', 'Unidade H', 'Unidade I', 'Unidade J']
          unitsData = [25, 20, 15, 12, 10, 8, 6, 5, 3, 2]
        }
        
        // Gerar cores azuis baseadas na quantidade de barras
        const unitsColors = generateColorPalette(unitsLabels.length, 'blue')
        
        chartsInstances.unidades = new Chart(chartUnidades.value, {
          type: 'bar',
          data: {
            labels: unitsLabels,
            datasets: [{
              label: 'Quantidade de recursos',
              data: unitsData,
              backgroundColor: unitsColors,
              borderColor: unitsColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)')),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false }
            },
            scales: {
              y: { 
                beginAtZero: true,
                grid: { display: true },
                ticks: { 
                  font: { size: 12 },
                  stepSize: 5
                }
              },
              x: { 
                grid: { display: false },
                ticks: { 
                  maxRotation: 45,
                  font: { size: 10 }
                }
              }
            }
          }
        })
      }
      
      // Gráfico de Categorias
      if (chartCategorias.value) {
        let categoriesData, categoriesLabels
        
        if (hasRealData) {
          const categories = {}
          props.data.forEach(resource => {
            const criterios = resource.criterios_selecionados || []
            criterios.forEach(criterio => {
              categories[criterio] = (categories[criterio] || 0) + 1
            })
          })
          const sortedCategories = Object.entries(categories).sort(([,a], [,b]) => a - b).slice(0, 8)
          categoriesLabels = sortedCategories.map(([cat]) => getCategoryLabel(cat))
          categoriesData = sortedCategories.map(([,count]) => count)
        } else {
          categoriesLabels = ['Formação', 'Faltas', 'Tempo de atuação', 'Esclarecimento', 'Atividades', 'Grupo', 'Pagamento indevido', 'Mais de um critério']
          categoriesData = [5, 8, 12, 15, 18, 22, 25, 30]
        }
        
        // Gerar cores azuis baseadas na quantidade de barras
        const categoriesColors = generateColorPalette(categoriesLabels.length, 'blue')
        
        chartsInstances.categorias = new Chart(chartCategorias.value, {
          type: 'bar',
          data: {
            labels: categoriesLabels,
            datasets: [{
              label: 'Categoria',
              data: categoriesData,
              backgroundColor: categoriesColors,
              borderColor: categoriesColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)')),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: { 
                beginAtZero: true,
                grid: { display: true },
                ticks: { font: { size: 10 } }
              },
              y: { 
                grid: { display: false },
                ticks: { font: { size: 10 } }
              }
            }
          }
        })
      }
      
      // Gráfico de Equipes
      if (chartEquipes.value) {
        let teamsData, teamsLabels
        
        if (hasRealData) {
          const teamsCount = {}
          props.data.forEach(resource => {
            const team = resource.equipe_responsavel || 'Não definido'
            teamsCount[team] = (teamsCount[team] || 0) + 1
          })
          const sortedTeams = Object.entries(teamsCount).sort(([,a], [,b]) => a - b)
          teamsLabels = sortedTeams.map(([team]) => team)
          teamsData = sortedTeams.map(([,count]) => count)
        } else {
          teamsLabels = ['Equipe Alpha', 'Equipe Beta', 'Equipe Gamma', 'Equipe Delta', 'Equipe Epsilon']
          teamsData = [10, 15, 25, 35, 40]
        }
        
        // Gerar cores azuis baseadas na quantidade de barras
        const teamsColors = generateColorPalette(teamsLabels.length, 'blue')
        
        chartsInstances.equipes = new Chart(chartEquipes.value, {
          type: 'bar',
          data: {
            labels: teamsLabels,
            datasets: [{
              label: 'Equipe responsável',
              data: teamsData,
              backgroundColor: teamsColors,
              borderColor: teamsColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)')),
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
              legend: { display: false }
            },
            scales: {
              x: { 
                beginAtZero: true,
                grid: { display: true },
                ticks: { font: { size: 10 } }
              },
              y: { 
                grid: { display: false },
                ticks: { font: { size: 10 } }
              }
            }
          }
        })
      }
    }
    
    const updateCharts = () => {
      createCharts()
    }
    
    // Watch para recriar gráficos quando o painel abrir
    watch(() => open.value, (newValue) => {
      if (newValue) {
        setTimeout(() => {
          createCharts()
        }, 200)
      }
    })
    
    watch(() => props.data, () => {
      createCharts()
    }, { deep: true })
    
    onMounted(() => {
      setTimeout(() => {
        createCharts()
      }, 300)
    })
    
    return {
      open,
      chartUnidades,
      chartCategorias,
      chartEquipes,
      updateCharts
    }
  }
}
</script>