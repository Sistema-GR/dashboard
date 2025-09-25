<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Valores a receber x UE - Unidades que mais recebem</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
          <div class="flex-1 flex items-center justify-center p-5 min-h-[400px] overflow-hidden">
            <div class="w-full h-[360px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartValoresMais" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
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
  name: 'ValoresMaisRecebem',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartValoresMais = ref(null)
    let chartInstance = null

    const unidades = [
      'UE Top 01', 'UE Top 02', 'UE Top 03', 'UE Top 04', 'UE Top 05',
      'UE Top 06', 'UE Top 07', 'UE Top 08', 'UE Top 09', 'UE Top 10'
    ]

    const faixasValores = {
      'R$ 0,00 - R$ 1.000': '#eaeef6',     // Azul muito claro
      'R$ 1.000 - R$ 2.000': '#c2cde3',    // Azul claro  
      'R$ 2.000 - R$ 3.000': '#aebdda',    // Azul médio claro
      'R$ 3.000 - R$ 4.000': '#859bc7',    // Azul médio
      'R$ 4.000 - R$ 5.000': '#718abe',    // Azul
      'R$ 5.000 - R$ 6.000': '#4869ab',    // Azul escuro
      'Mais de R$ 6.000': '#3459a2'        // Azul muito escuro
    }

    // Dados simulados para unidades que mais recebem (valores maiores)
    const valoresData = {
      'R$ 0,00 - R$ 1.000': [2, 3, 4, 5, 6, 7, 8, 9, 10, 12],
      'R$ 1.000 - R$ 2.000': [5, 6, 8, 10, 12, 14, 16, 18, 20, 22],
      'R$ 2.000 - R$ 3.000': [8, 10, 12, 15, 18, 20, 22, 25, 27, 30],
      'R$ 3.000 - R$ 4.000': [12, 15, 18, 20, 22, 25, 28, 30, 32, 35],
      'R$ 4.000 - R$ 5.000': [15, 18, 20, 22, 25, 28, 30, 32, 35, 38],
      'R$ 5.000 - R$ 6.000': [10, 12, 15, 18, 20, 22, 25, 27, 30, 32],
      'Mais de R$ 6.000': [8, 10, 12, 15, 18, 20, 22, 25, 28, 30]
    }

    const destroyChart = () => {
      if (chartInstance) { chartInstance.destroy(); chartInstance = null }
    }

    const createChart = async () => {
      await nextTick()
      destroyChart()
      
      if (!open.value || !chartValoresMais.value) return
      
      await new Promise(resolve => setTimeout(resolve, 100))

      const datasets = Object.keys(faixasValores).map(faixa => ({
        label: faixa,
        data: valoresData[faixa],
        backgroundColor: faixasValores[faixa],
        borderColor: faixasValores[faixa],
        borderWidth: 0
      }))

      chartInstance = new Chart(chartValoresMais.value, {
        type: 'bar',
        data: { labels: unidades, datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { usePointStyle: true, pointStyle: 'rect', font: { size: 11 }, padding: 12 }
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
              ticks: { font: { size: 12 }, stepSize: 20 },
              max: 200
            }
          }
        }
      })
    }

    watch(() => props.data, createChart, { deep: true })
    watch(() => open.value, (newValue) => { if (newValue) setTimeout(createChart, 200) })
    onMounted(() => setTimeout(createChart, 300))

    return { open, chartValoresMais }
  }
}
</script>