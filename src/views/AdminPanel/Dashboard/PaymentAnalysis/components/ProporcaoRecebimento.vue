<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Proporção de recebimento</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] p-5 shadow-md flex flex-col w-full">
          <div class="flex flex-row gap-10 items-center justify-around w-full">
            <!-- Gráfico de Barras -->
            <div class="flex items-center justify-center min-h-[260px] overflow-hidden">
              <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
                <canvas ref="chartBarras" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
              </div>
            </div>
            <!-- Gráfico de Pizza com Legenda -->
            <div class="flex items-center justify-center min-h-[260px] overflow-hidden">
              <div class="flex flex-row items-center gap-8 w-full h-[220px]">
                <!-- Pizza - Tamanho reduzido -->
                <div class="flex items-center justify-center overflow-hidden relative" style="max-width:250px;max-height:250px">
                  <canvas ref="chartPizza" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
                </div>
                <!-- Legenda -->
                <div class="flex flex-col justify-center min-w-[120px]">
                  <ul class="text-10 space-y-2">
                    <li v-for="(item, i) in legendaData" :key="i" class="flex items-center">
                      <span :style="{background: item.color, display:'inline-block', width:'12px', height:'12px', borderRadius:'2px', marginRight:'8px'}"></span>
                        <span class="text-15 leading-tight font-medium">{{ item.label }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick, onMounted, computed } from 'vue'
import Chart from 'chart.js/auto'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'ProporcaoRecebimento',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartBarras = ref(null)
    const chartPizza = ref(null)
    let chartBarrasInstance = null
    let chartPizzaInstance = null

    const labels = ['0%', '40%', '55%', '70%', '85%', '100%']
    const data = [1200, 300, 400, 600, 300, 200]
    
    // Paleta de cores azuis (mesma do PorcentagemFrequencia)
    const colors = [
      '#eaeef6', // Azul muito claro (0%-29%)
      '#c2cde3',
      '#99acd0',
      '#859bc7',
      '#5d7ab5',
      '#3459a2'  
    ]

    const legendaData = computed(() => {
      return labels.map((label, i) => ({
        label,
        value: data[i],
        color: colors[i]
      }))
    })

    const destroyCharts = () => {
      if (chartBarrasInstance) { chartBarrasInstance.destroy(); chartBarrasInstance = null }
      if (chartPizzaInstance) { chartPizzaInstance.destroy(); chartPizzaInstance = null }
    }

    const createCharts = async () => {
      await nextTick()
      if (!chartBarras.value || !chartPizza.value || !open.value) return
      destroyCharts()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Gráfico de Barras
      chartBarrasInstance = new Chart(chartBarras.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Matrícula',
            data,
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { 
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.parsed.y.toLocaleString()}`
                }
              }
            }
          },
          scales: {
            x: { 
              grid: { display: false }, 
              ticks: { font: { size: 10 } } 
            },
            y: { 
              beginAtZero: true, 
              grid: { color: '#e5e7eb' }, 
              ticks: { 
                font: { size: 10 },
                callback: function(value) {
                  return value.toLocaleString()
                }
              }
            }
          }
        }
      })

      // Gráfico de Pizza - com tamanho fixo menor
      chartPizzaInstance = new Chart(chartPizza.value, {
        type: 'pie',
        data: {
          labels,
          datasets: [{
            data,
            backgroundColor: colors,
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3,
            hoverBackgroundColor: colors.map(color => {
              // Escurece a cor no hover
              const hex = color.replace('#', '')
              const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 20)
              const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 20)
              const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 20)
              return `rgb(${r}, ${g}, ${b})`
            })
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1, // Mantém proporção 1:1 (circular)
          plugins: { 
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const total = context.dataset.data.reduce((a, b) => a + b, 0)
                  const percentage = ((context.parsed / total) * 100).toFixed(1)
                  return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`
                }
              }
            }
          },
          layout: {
            padding: 10 // Adiciona um pequeno padding interno
          }
        }
      })
    }

    watch(() => props.data, () => {
      if (open.value) setTimeout(() => createCharts(), 100)
    }, { deep: true })

    watch(open, (isOpen) => {
      if (isOpen) setTimeout(() => createCharts(), 300)
      else destroyCharts()
    })

    onMounted(() => setTimeout(() => createCharts(), 500))

    return { open, chartBarras, chartPizza, legendaData }
  }
}
</script>