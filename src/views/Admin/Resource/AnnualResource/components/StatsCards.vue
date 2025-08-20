<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-t-[8px] focus:outline-none flex items-center">
      <span class="text-2xl font-bold text-black">Valores pagos</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    <div v-show="open" class="p-0">
      <div class="flex flex-col lg:flex-row gap-6 p-6 justify-center items-stretch">
        <!-- Gráfico -->
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-[500px] min-w-[320px]">
          <div class="bg-[#3459A2] text-white font-bold text-[16px] px-3 py-2 rounded-t-[8px]">
            Distribuição de pessoas pagas conforme valor
          </div>
          <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
            <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartDistribuicao" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
            </div>
          </div>
        </div>
        <!-- Cards -->
        <div class="flex flex-col gap-4 flex-1 min-w-[220px] max-w-[320px] justify-center">
          <div class="bg-white rounded-[8px] shadow-md flex flex-col h-full">
            <div class="bg-[#3459A2] text-white font-bold text-[15px] px-3 py-2 rounded-t-[8px]">
              Nº de pessoas pagas pós recursos
            </div>
            <div class="flex items-center justify-center py-8 text-3xl font-bold">{{ pessoasPagas }}</div>
          </div>
          <div class="bg-white rounded-[8px] shadow-md flex flex-col h-full">
            <div class="bg-[#3459A2] text-white font-bold text-[15px] px-3 py-2 rounded-t-[8px]">
              Valor pago em recursos
            </div>
            <div class="flex items-center justify-center py-8 text-2xl font-bold">R$ {{ valorPago }}</div>
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
  name: 'StatsCards',
  components: {
    ChevronDownIcon
  },
  props: {
    distribuicao: {
      type: Array,
      default: () => [
        { label: 'Até R$ 1500', value: 28 },
        { label: 'De R$ 1500 até R$ 3000', value: 35 },
        { label: 'De R$ 3000 até R$ 4500', value: 44 },
        { label: 'De R$ 4500 até R$ 6000', value: 22 },
        { label: 'Mais que R$ 6000', value: 58 }
      ]
    },
    pessoasPagas: {
      type: [Number, String],
      default: 187
    },
    valorPago: {
      type: [Number, String],
      default: '851.253,25'
    }
  },
  setup(props) {
    const open = ref(true)
    const chartDistribuicao = ref(null)
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
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (chartDistribuicao.value) {
        chartInstance = new Chart(chartDistribuicao.value, {
          type: 'bar',
          data: {
            labels: props.distribuicao.map(d => d.label),
            datasets: [{
              label: 'Nº de pessoas',
              data: props.distribuicao.map(d => d.value),
              backgroundColor: '#1976D2',
              borderRadius: 6,
              barPercentage: 0.7,
              categoryPercentage: 0.7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true, position: 'top' }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 12 } }
              },
              y: {
                beginAtZero: true,
                grid: { color: '#e5e7eb' },
                ticks: { font: { size: 12 }, stepSize: 10 }
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
        }, 200)
      }
    })

    onMounted(() => {
      setTimeout(() => {
        createChart()
      }, 300)
    })

    return {
      open,
      chartDistribuicao
    }
  }
}
</script>