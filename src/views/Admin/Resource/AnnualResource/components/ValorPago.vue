<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Valores pagos</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    <div v-show="open" class="p-0">
      <div class="flex flex-col lg:flex-row gap-10 px-10 py-8 justify-center items-stretch">
        <!-- Gráfico -->
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
            Distribuição de pessoas pagas conforme valor
          </div>
          <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
            <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartDistribuicao" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
            </div>
          </div>
        </div>
        <!-- Cards -->
        <div class="flex flex-col gap-10 flex-1 min-w-[300px] max-w-[320px] justify-center">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-15 p-3 rounded-t-[10px]">
              Nº de pessoas pagas pós recursos
            </div>
            <div class="flex items-center justify-center py-8 text-3xl font-bold">{{ pessoasPagas }}</div>
          </div>
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-15 p-3 rounded-t-[10px]">
              Valor pago em recursos
            </div>
            <div class="flex items-center justify-center py-8 text-25 font-bold">R$ {{ valorPago }}</div>
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
  name: 'ValorPago',
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

    // Função para gerar paleta de cores azul
    const generateBlueColorPalette = (count) => {
      const darkest = '#1e3a8a'  // blue-900
      const lightest = '#dbeafe' // blue-100
      
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null
      }
      
      const darkRgb = hexToRgb(darkest)
      const lightRgb = hexToRgb(lightest)
      
      const colors = []
      
      for (let i = 0; i < count; i++) {
        const ratio = count === 1 ? 0 : i / (count - 1)
        
        const r = Math.round(darkRgb.r + (lightRgb.r - darkRgb.r) * ratio)
        const g = Math.round(darkRgb.g + (lightRgb.g - darkRgb.g) * ratio)
        const b = Math.round(darkRgb.b + (lightRgb.b - darkRgb.b) * ratio)
        
        colors.push(`rgb(${r}, ${g}, ${b})`)
      }
      
      return colors
    }

    const destroyChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
      }
    }

    const createChart = async () => {
      await nextTick()
      destroyChart()
      
      if (!open.value) return
      
      await new Promise(resolve => setTimeout(resolve, 100))
      
      if (chartDistribuicao.value) {
        // Gerar cores azuis baseadas na quantidade de barras
        const blueColors = generateBlueColorPalette(props.distribuicao.length)

        chartInstance = new Chart(chartDistribuicao.value, {
          type: 'bar',
          data: {
            labels: props.distribuicao.map(d => d.label),
            datasets: [{
              label: 'Nº de pessoas',
              data: props.distribuicao.map(d => d.value),
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