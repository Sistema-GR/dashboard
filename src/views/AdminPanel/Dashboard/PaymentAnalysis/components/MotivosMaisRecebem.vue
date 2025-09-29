<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Motivos para não recebimento x UE - Unidades que mais recebem</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
          <div class="flex-1 flex items-center justify-center p-5 min-h-[400px] overflow-hidden">
            <div class="w-full h-[360px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartMaisRecebem" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
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
  name: 'MotivosMaisRecebem',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartMaisRecebem = ref(null)
    let chartInstance = null

    const unidades = [
      'Escola Alpha', 'Escola Beta', 'Escola Gamma', 'Escola Delta', 'Escola Epsilon',
      'Escola Zeta', 'Escola Eta', 'Escola Theta', 'Escola Iota', 'Escola Kappa'
    ]

    const motivosData = {
      'Atividades': [12, 11, 10, 9, 8, 7, 6, 5, 4, 3],
      'Formação': [3, 3, 2, 2, 2, 1, 1, 1, 1, 1],
      'Frequência': [2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
      'Mais de 1 critério individual': [2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
      'Não recebe valor total por mais de 1 critério individual': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      'Tempo de atuação': [2, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }

    const colors = {
      'Atividades': '#6cc69d',
      'Formação': '#6fa3ef',
      'Frequência': '#6668d4',
      'Mais de 1 critério individual': '#f16d91',
      'Não recebe valor total por mais de 1 critério individual': '#f48e2f',
      'Tempo de atuação': '#f4b72f'
    }

    const destroyChart = () => {
      if (chartInstance) { chartInstance.destroy(); chartInstance = null }
    }

    const createChart = async () => {
      await nextTick()
      destroyChart()
      
      if (!open.value || !chartMaisRecebem.value) return
      
      await new Promise(resolve => setTimeout(resolve, 100))

      const datasets = Object.keys(motivosData).map(motivo => ({
        label: motivo,
        data: motivosData[motivo],
        backgroundColor: colors[motivo],
        borderColor: colors[motivo],
        borderWidth: 0
      }))

      chartInstance = new Chart(chartMaisRecebem.value, {
        type: 'bar',
        data: { labels: unidades, datasets: datasets },
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
              ticks: { font: { size: 10 }, maxRotation: 45, minRotation: 45 } 
            },
            y: { 
              stacked: true, 
              beginAtZero: true, 
              grid: { color: '#e5e7eb' }, 
              ticks: { font: { size: 12 }, stepSize: 2 }, 
              max: 20 
            }
          }
        }
      })
    }

    watch(() => props.data, createChart, { deep: true })
    watch(() => open.value, (newValue) => { if (newValue) setTimeout(createChart, 200) })
    onMounted(() => setTimeout(createChart, 300))

    return { open, chartMaisRecebem }
  }
}
</script>