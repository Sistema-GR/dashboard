<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Proporção de recebimento por UE</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
          <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
            Proporção de recebimento por UE
          </div>
          <div class="flex-1 flex items-center justify-center p-4 min-h-[300px] overflow-hidden">
            <div class="w-full h-[260px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartProporcao" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
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
  name: 'ProporcaoRecebimentoPorUE',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartProporcao = ref(null)
    let chartInstance = null

    const generateUnidades = () => {
      const unidades = []
      for (let i = 1; i <= 50; i++) {
        unidades.push(`UE ${i.toString().padStart(2, '0')}`)
      }
      return unidades
    }

    const proporcoes = {
      'Não recebe': '#ff4757',      // Vermelho
      'Recebe parcial': '#ffa502',   // Laranja  
      'Recebe total': '#2ed573'      // Verde
    }

    const generateProporcaoData = () => {
      return Object.keys(proporcoes).map(proporcao => ({
        label: proporcao,
        data: Array(50).fill().map(() => Math.floor(Math.random() * 40) + 10),
        backgroundColor: proporcoes[proporcao],
        borderColor: proporcoes[proporcao],
        borderWidth: 0
      }))
    }

    const destroyChart = () => {
      if (chartInstance) { chartInstance.destroy(); chartInstance = null }
    }

    const createChart = async () => {
      await nextTick()
      destroyChart()
      
      if (!open.value || !chartProporcao.value) return
      
      await new Promise(resolve => setTimeout(resolve, 100))

      chartInstance = new Chart(chartProporcao.value, {
        type: 'bar',
        data: {
          labels: generateUnidades(),
          datasets: generateProporcaoData()
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { usePointStyle: true, pointStyle: 'rect', font: { size: 12 }, padding: 15 }
            }
          },
          scales: {
            x: { 
              stacked: true, 
              grid: { display: false }, 
              ticks: { font: { size: 8 }, maxRotation: 90 }
            },
            y: { 
              stacked: true, 
              beginAtZero: true, 
              grid: { color: '#e5e7eb' }, 
              ticks: { font: { size: 10 } },
              max: 100
            }
          }
        }
      })
    }

    watch(() => props.data, createChart, { deep: true })
    watch(() => open.value, (newValue) => { if (newValue) setTimeout(createChart, 200) })
    onMounted(() => setTimeout(createChart, 300))

    return { open, chartProporcao }
  }
}
</script>