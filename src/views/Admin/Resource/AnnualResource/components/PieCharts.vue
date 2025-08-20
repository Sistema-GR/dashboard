<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-t-[8px] focus:outline-none flex items-center">
      <span class="text-2xl font-bold text-black">Status por Equipe | Pessoa</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-6 p-6 justify-center items-stretch">
        <!-- Card Gráfico -->
        <div class="flex flex-col gap-4 flex-1 min-w-[340px] max-w-[600px] justify-center">
          <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-[10px]">
              Grafico
            </div>
            <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
              <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
                <canvas ref="chartStatus" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Tabela -->
        <div class="flex flex-col gap-4 flex-1 min-w-[340px] max-w-[600px] justify-center">
          <div class="bg-white shadow-md rounded-t-lg flex-1 min-w-[340px] max-w-[800px]">
            <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-[10px]">
              Tabela
            </div>
            <div class="p-6 overflow-x-auto">
              <table class="min-w-full text-sm text-left border-separate border-spacing-y-1">
                <thead>
                  <tr class="bg-[#2360a5] text-white">
                    <th class="px-3 py-2 font-bold">Responsavel</th>
                    <th class="px-3 py-2 font-bold">Qtd. de Recursos</th>
                    <th class="px-3 py-2 font-bold">% Matrículas</th>
                    <th class="px-3 py-2 font-bold">06/06</th>
                    <th class="px-3 py-2 font-bold">07/06</th>
                    <th class="px-3 py-2 font-bold">12/06</th>
                    <th class="px-3 py-2 font-bold">13/06</th>
                    <th class="px-3 py-2 font-bold">14/06</th>
                  </tr>
                </thead>
                <tbody class="bg-white text-black">
                  <tr>
                    <td class="px-3 py-1">Tamires</td>
                    <td class="px-3 py-1">11</td>
                    <td class="px-3 py-1">1,75%</td>
                    <td class="px-3 py-1">3</td>
                    <td class="px-3 py-1">3</td>
                    <td class="px-3 py-1">3</td>
                    <td class="px-3 py-1">3</td>
                    <td class="px-3 py-1">0</td>
                  </tr>
                  <tr>
                    <td class="px-3 py-1">Kamila Nunes</td>
                    <td class="px-3 py-1">35</td>
                    <td class="px-3 py-1">5,56%</td>
                    <td class="px-3 py-1">5</td>
                    <td class="px-3 py-1">5</td>
                    <td class="px-3 py-1">7</td>
                    <td class="px-3 py-1">7</td>
                    <td class="px-3 py-1">11</td>
                  </tr>
                  <tr>
                    <td class="px-3 py-1">José Gonçalves</td>
                    <td class="px-3 py-1">102</td>
                    <td class="px-3 py-1">16,22%</td>
                    <td class="px-3 py-1">21</td>
                    <td class="px-3 py-1">21</td>
                    <td class="px-3 py-1">21</td>
                    <td class="px-3 py-1">21</td>
                    <td class="px-3 py-1">18</td>
                  </tr>
                  <tr>
                    <td class="px-3 py-1">Janis Ellye</td>
                    <td class="px-3 py-1">73</td>
                    <td class="px-3 py-1">11,61%</td>
                    <td class="px-3 py-1">12</td>
                    <td class="px-3 py-1">12</td>
                    <td class="px-3 py-1">15</td>
                    <td class="px-3 py-1">15</td>
                    <td class="px-3 py-1">19</td>
                  </tr>
                  <tr>
                    <td class="px-3 py-1">Geovani</td>
                    <td class="px-3 py-1">107</td>
                    <td class="px-3 py-1">17,01%</td>
                    <td class="px-3 py-1">35</td>
                    <td class="px-3 py-1">35</td>
                    <td class="px-3 py-1">22</td>
                    <td class="px-3 py-1">22</td>
                    <td class="px-3 py-1">-8</td>
                  </tr>
                  <tr>
                    <td class="px-3 py-1">Carlos Daniel</td>
                    <td class="px-3 py-1">121</td>
                    <td class="px-3 py-1">19,24%</td>
                    <td class="px-3 py-1">13</td>
                    <td class="px-3 py-1">13</td>
                    <td class="px-3 py-1">26</td>
                    <td class="px-3 py-1">26</td>
                    <td class="px-3 py-1">50</td>
                  </tr>
                  <tr>
                    <td class="px-3 py-1">Aurea Vieira</td>
                    <td class="px-3 py-1">182</td>
                    <td class="px-3 py-1">28,93%</td>
                    <td class="px-3 py-1">25</td>
                    <td class="px-3 py-1">25</td>
                    <td class="px-3 py-1">35</td>
                    <td class="px-3 py-1">35</td>
                    <td class="px-3 py-1">55</td>
                  </tr>
                  <tr class="font-bold">
                    <td class="px-3 py-1">Total geral</td>
                    <td class="px-3 py-1">632</td>
                    <td class="px-3 py-1">100,48%</td>
                    <td class="px-3 py-1">114</td>
                    <td class="px-3 py-1">114</td>
                    <td class="px-3 py-1">129</td>
                    <td class="px-3 py-1">129</td>
                    <td class="px-3 py-1">145</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick } from 'vue'
import Chart from 'chart.js/auto'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'PieCharts',
  components: {
    ChevronDownIcon
  },
  props: {
    data: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  setup(props) {
    const open = ref(true)
    const chartStatus = ref(null)
    let chartInstance = null

    const destroyChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
      }
    }

    const createChart = async () => {
      await nextTick()
      destroyChart()
      
      // Só criar se o painel estiver aberto
      if (!open.value) return
      
      // Aguardar para garantir que o elemento esteja no DOM
      await new Promise(resolve => setTimeout(resolve, 200))
      
      if (chartStatus.value) {
        // Dados de exemplo se não houver dados reais
        const hasRealData = props.data && props.data.length > 0
        let chartData, chartLabels
        
        if (hasRealData) {
          chartLabels = props.data.map(d => d.label || d.name || 'N/A')
          chartData = props.data.map(d => d.value || d.count || 0)
        } else {
          // Dados de exemplo baseados na tabela
          chartLabels = ['Tamires', 'Kamila Nunes', 'José Gonçalves', 'Janis Ellye', 'Geovani', 'Carlos Daniel', 'Aurea Vieira']
          chartData = [11, 35, 102, 73, 107, 121, 182]
        }

        chartInstance = new Chart(chartStatus.value, {
          type: 'bar',
          data: {
            labels: chartLabels,
            datasets: [{
              label: 'Quantidade de Recursos',
              data: chartData,
              backgroundColor: [
                '#3b82f6',
                '#06b6d4', 
                '#10b981',
                '#f59e0b',
                '#ef4444',
                '#8b5cf6',
                '#ec4899'
              ],
              borderColor: '#1d4ed8',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { 
                display: false 
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.label}: ${context.parsed.y} recursos`
                  }
                }
              }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { 
                  font: { size: 10 },
                  maxRotation: 45
                }
              },
              y: {
                beginAtZero: true,
                grid: { color: '#e5e7eb' },
                ticks: { 
                  font: { size: 12 },
                  stepSize: 20
                }
              }
            }
          }
        })
      }
    }

    // Watch para recriar gráfico quando o painel abrir
    watch(() => open.value, (newValue) => {
      if (newValue) {
        setTimeout(() => {
          createChart()
        }, 300)
      }
    })

    watch(() => props.data, () => {
      createChart()
    }, { deep: true })

    onMounted(() => {
      setTimeout(() => {
        createChart()
      }, 500)
    })

    return {
      open,
      chartStatus
    }
  }
}
</script>