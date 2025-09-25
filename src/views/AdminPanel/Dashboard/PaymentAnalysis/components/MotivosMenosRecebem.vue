<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Motivos para não recebimento x UE - Unidades que menos recebem</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
          <div class="flex-1 flex items-center justify-center p-5 min-h-[400px] overflow-hidden">
            <div class="w-full h-[360px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartMenosRecebem" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
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
  name: 'MotivosMenosRecebem',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartMenosRecebem = ref(null)
    let chartInstance = null

    const unidades = [
      'Escola 1', 'Escola 2', 'Escola 3', 'Escola 4', 'Escola 5',
      'Escola 6', 'Escola 7', 'Escola 8', 'Escola 9', 'Escola 10'
    ]

    const motivosData = {
      'Atividades': [8, 7, 6, 6, 5, 5, 4, 4, 3, 3],
      'Formação': [2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
      'Frequência': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      'Mais de 1 critério individual': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      'Não recebe valor total por mais de 1 critério individual': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      'Tempo de atuação': [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }

    const colors = {
      'Atividades': '#3459a2',
      'Formação': '#5d7ab5',
      'Frequência': '#859bc7',
      'Mais de 1 critério individual': '#99acd0',
      'Não recebe valor total por mais de 1 critério individual': '#c2cde3',
      'Tempo de atuação': '#eaeef6'
    }


    const destroyChart = () => {
      if (chartInstance) { chartInstance.destroy(); chartInstance = null }
    }

    const createChart = async () => {
      await nextTick()
      destroyChart()
      
      if (!open.value || !chartMenosRecebem.value) return
      
      await new Promise(resolve => setTimeout(resolve, 100))

      const datasets = Object.keys(motivosData).map(motivo => ({
        label: motivo,
        data: motivosData[motivo],
        backgroundColor: colors[motivo],
        borderColor: colors[motivo],
        borderWidth: 0
      }))

      chartInstance = new Chart(chartMenosRecebem.value, {
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
            x: { stacked: true, grid: { display: false }, ticks: { font: { size: 10 } } },
            y: { stacked: true, beginAtZero: true, grid: { color: '#e5e7eb' }, ticks: { font: { size: 12 }, stepSize: 2 }, max: 15 }
          }
        }
      })
    }

    watch(() => props.data, createChart, { deep: true })
    watch(() => open.value, (newValue) => { if (newValue) setTimeout(createChart, 200) })
    onMounted(() => setTimeout(createChart, 300))

    return { open, chartMenosRecebem }
  }
}
</script>