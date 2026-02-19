<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Valores a receber x UE - Unidades que menos recebem</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full p-5">
          <div class="flex-1 flex items-center justify-center p-4 min-h-[400px] overflow-hidden">
            <div class="w-full h-[360px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartValoresMenos" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
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
  name: 'ValoresMenosRecebem',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartValoresMenos = ref(null)
    let chartInstance = null

    const unidades = [
      'UE Menor 01', 'UE Menor 02', 'UE Menor 03', 'UE Menor 04', 'UE Menor 05',
      'UE Menor 06', 'UE Menor 07', 'UE Menor 08', 'UE Menor 09', 'UE Menor 10'
    ]

    const faixasValores = {
      'R$ 0,00 - R$ 1.000': '#418b6a',     // Azul muito claro
      'R$ 1.000 - R$ 2.000': '#6cc69d',    // Azul claro  
      'R$ 2.000 - R$ 3.000': '#6fa3ef',    // Azul médio claro
      'R$ 3.000 - R$ 4.000': '#6668d4',    // Azul médio
      'R$ 4.000 - R$ 5.000': '#f16d91',    // Azul
      'R$ 5.000 - R$ 6.000': '#f48e2f',    // Azul escuro
      'Mais de R$ 6.000': '#f4b72f'        // Azul muito escuro
    }

    // Dados simulados para unidades que menos recebem (valores menores)
    const valoresData = {
      'R$ 0,00 - R$ 1.000': [15, 12, 10, 8, 6, 5, 4, 3, 2, 1],
      'R$ 1.000 - R$ 2.000': [10, 8, 7, 6, 5, 4, 3, 2, 2, 1],
      'R$ 2.000 - R$ 3.000': [5, 4, 3, 3, 2, 2, 1, 1, 1, 1],
      'R$ 3.000 - R$ 4.000': [3, 2, 2, 1, 1, 1, 1, 0, 0, 0],
      'R$ 4.000 - R$ 5.000': [1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      'R$ 5.000 - R$ 6.000': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      'Mais de R$ 6.000': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    }

    const destroyChart = () => {
      if (chartInstance) { chartInstance.destroy(); chartInstance = null }
    }

    const createChart = async () => {
      await nextTick()
      destroyChart()
      
      if (!open.value || !chartValoresMenos.value) return
      
      await new Promise(resolve => setTimeout(resolve, 100))

      const datasets = Object.keys(faixasValores).map(faixa => ({
        label: faixa,
        data: valoresData[faixa],
        backgroundColor: faixasValores[faixa],
        borderColor: faixasValores[faixa],
        borderWidth: 0
      }))

      chartInstance = new Chart(chartValoresMenos.value, {
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
              ticks: { font: { size: 12 }, stepSize: 5 },
              max: 40
            }
          }
        }
      })
    }

    watch(() => props.data, createChart, { deep: true })
    watch(() => open.value, (newValue) => { if (newValue) setTimeout(createChart, 200) })
    onMounted(() => setTimeout(createChart, 300))

    return { open, chartValoresMenos }
  }
}
</script>