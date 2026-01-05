<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Faixas de Pagamento</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <!-- Card único com gráfico e tabela -->
        <div class="bg-white rounded-[10px] shadow-md p-5 flex flex-col w-full max-w-full">
                    
          <!-- Tabela -->
          <div class="p-4">
            <table class="w-full text-15">
              <thead class="bg-[#1e3a8a] text-white rounded-[10px]">
                <tr>
                  <th class="px-4 py-2 text-left">Faixas de Pagamento</th>
                  <th class="px-4 py-2 text-center">Matrícula</th>
                  <th class="px-4 py-2 text-center">% matrícula</th>
                  <th class="px-4 py-2 text-right">Valor a pagar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(faixa, i) in faixasData" :key="i" class="border-b">
                  <td class="px-4 py-2">{{ faixa.nome }}</td>
                  <td class="px-4 py-2 text-center">{{ faixa.quantidade }}</td>
                  <td class="px-4 py-2 text-center">{{ faixa.percentual }}%</td>
                  <td class="px-4 py-2 text-right">{{ faixa.valorMedio }}</td>
                </tr>
                <tr class="bg-gray-50 font-bold">
                  <td class="px-4 py-2">Total geral</td>
                  <td class="px-4 py-2 text-center">{{ totalGeral.quantidade }}</td>
                  <td class="px-4 py-2 text-center">{{ totalGeral.percentual }}%</td>
                  <td class="px-4 py-2 text-right">{{ totalGeral.valorMedio }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Gráfico de barras -->
          <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
            <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartDistribuicao" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import Chart from 'chart.js/auto'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'FaixasPagamento',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartDistribuicao = ref(null)
    let chartInstance = null

    const faixasData = [
      { nome: 'Não recebe nada', quantidade: 3474, percentual: 85.4, valorMedio: 'R$ 0,00' },
      { nome: 'Até R$ 1.000', quantidade: 300, percentual: 7.4, valorMedio: 'R$ 500,00' },
      { nome: 'De R$ 1.000 a R$ 2.000', quantidade: 150, percentual: 3.7, valorMedio: 'R$ 1.500,00' },
      { nome: 'De R$ 2.000 a R$ 4.000', quantidade: 100, percentual: 2.5, valorMedio: 'R$ 3.000,00' },
      { nome: 'De R$ 4.000 a R$ 6.000', quantidade: 30, percentual: 0.7, valorMedio: 'R$ 5.000,00' },
      { nome: 'Mais que R$ 6.000', quantidade: 15, percentual: 0.4, valorMedio: 'R$ 8.000,00' }
    ]

    const totalGeral = {
      quantidade: 4069,
      percentual: 100.0,
      valorMedio: 'R$ 1.254,32'
    }

    const labels = faixasData.map(f => f.nome)
    const data = faixasData.map(f => f.quantidade)
    
    const generateBlueColorPalette = (count) => {
      // Cores fixas conforme solicitado
      const fixedColors = [
        '#6cc69d',
        '#6fa3ef',
        '#6668d4',
        '#f16d91',
        '#f48e2f',
        '#f4b72f'
      ]
      return fixedColors.slice(0, count)
    }

    const destroyChart = () => {
      if (chartInstance) { 
        chartInstance.destroy()
        chartInstance = null 
      }
    }

    const createChart = async () => {
      await nextTick()
      if (!chartDistribuicao.value || !open.value) return
      destroyChart()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      const blueColors = generateBlueColorPalette(data.length)

      chartInstance = new Chart(chartDistribuicao.value, {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Quantidade',
            data,
            backgroundColor: blueColors,
            borderColor: blueColors.map(color => color.replace('rgb', 'rgba').replace(')', ', 0.8)')),
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.7,
            categoryPercentage: 0.7
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
              ticks: { 
                font: { size: 10 }, 
                maxRotation: 45, 
                minRotation: 0 
              } 
            },
            y: { 
              beginAtZero: true, 
              grid: { color: '#e5e7eb' }, 
              ticks: { 
                font: { size: 12 }, 
                stepSize: 500,
                callback: function(value) {
                  return value.toLocaleString()
                }
              },
              max: 4000
            }
          }
        }
      })
    }

    watch(() => props.data, () => {
      if (open.value) setTimeout(() => createChart(), 100)
    }, { deep: true })

    watch(open, (isOpen) => {
      if (isOpen) setTimeout(() => createChart(), 300)
      else destroyChart()
    })

    onMounted(() => setTimeout(() => createChart(), 500))

    return { open, chartDistribuicao, faixasData, totalGeral }
  }
}
</script>

<style scoped>
</style>