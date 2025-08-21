<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Status por Equipe | Pessoa</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="px-10">
      <div class="flex flex-col gap-10 px-10 py-8 justify-center items-stretch">
        <!-- Card Gráfico -->
        <div class="flex flex-col gap-4 flex-1 w-full justify-center">
          <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
              Grafico
            </div>
            <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
              <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
                <canvas ref="chartStatus" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
              </div>
            </div>
          </div>
        </div>
        
              <!-- Tabela de responsáveis -->
        <div class="flex flex-col gap-4 flex-1 w-full">
          <div class="bg-white shadow-md rounded-t-lg flex-1 min-w-[340px] max-w-[1200px]">
            <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
              Responsáveis por Recurso
            </div>
            <div class="p-6 overflow-x-auto">
              <table class="min-w-full text-15 text-center border-separate border-spacing-y-1">
                <thead>
                  <tr class="bg-[#2360a5] text-white">
                    <th class="px-3 py-2 font-bold">Responsável</th>
                    <th class="px-3 py-2 font-bold">Total</th>
                    <th class="px-3 py-2 font-bold">Deferidos</th>
                    <th class="px-3 py-2 font-bold">Indeferidos</th>
                    <th class="px-3 py-2 font-bold">Parcialmente Deferidos</th>
                    <th class="px-3 py-2 font-bold">% do Total</th>
                  </tr>
                </thead>
                <tbody class="bg-white text-black">
                  <tr v-for="responsible in responsaveis" :key="responsible.id">
                    <td class="px-3 py-1">{{ responsible.name }}</td>
                    <td class="px-3 py-1">{{ responsible.total }}</td>
                    <td class="px-3 py-1">{{ responsible.deferidos }}</td>
                    <td class="px-3 py-1">{{ responsible.indeferidos }}</td>
                    <td class="px-3 py-1">{{ responsible.parcialmente_deferidos }}</td>
                    <td class="px-3 py-1">{{ responsible.percentage }}%</td>
                  </tr>
                  <tr v-if="responsaveis.length === 0">
                    <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                      Nenhum dado encontrado
                    </td>
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
  name: 'StatusEquipe',
  components: {
    ChevronDownIcon
  },
  props: {
    data: {
      type: Array,
      required: false,
      default: () => []
    },
    responsaveis: {
      type: Array,
      required: false,
      default: () => ([
        { id: 1, name: 'Tamires', total: 11, deferidos: 3, indeferidos: 5, parcialmente_deferidos: 3, percentage: 1.75 },
        { id: 2, name: 'Kamila Nunes', total: 35, deferidos: 5, indeferidos: 7, parcialmente_deferidos: 23, percentage: 5.56 },
        { id: 3, name: 'José Gonçalves', total: 102, deferidos: 21, indeferidos: 60, parcialmente_deferidos: 21, percentage: 16.22 },
        { id: 4, name: 'Janis Ellye', total: 73, deferidos: 12, indeferidos: 46, parcialmente_deferidos: 15, percentage: 11.61 },
        { id: 5, name: 'Geovani', total: 107, deferidos: 35, indeferidos: 40, parcialmente_deferidos: 32, percentage: 17.01 },
        { id: 6, name: 'Carlos Daniel', total: 121, deferidos: 13, indeferidos: 58, parcialmente_deferidos: 50, percentage: 19.24 },
        { id: 7, name: 'Aurea Vieira', total: 182, deferidos: 25, indeferidos: 102, parcialmente_deferidos: 55, percentage: 28.93 },
      ])
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