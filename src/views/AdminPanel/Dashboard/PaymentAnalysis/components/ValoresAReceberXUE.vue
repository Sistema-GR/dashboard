<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Valores a receber x UE</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
          <div class="flex-1 flex items-center justify-center p-5 min-h-[300px] overflow-hidden">
            <div class="w-full h-[260px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartValores" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
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
  name: 'ValoresAReceberXUE',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartValores = ref(null)
    let chartInstance = null

    // Simular muitas unidades escolares
    const generateUnidades = () => {
      const unidades = []
      for (let i = 1; i <= 50; i++) {
        unidades.push(`UE ${i.toString().padStart(2, '0')}`)
      }
      return unidades
    }

    const generateValues = () => {
      const faixas = {
      'Não recebe nada': '#6cc69d',     // Azul muito claro
      'Até R$ 1.500': '#6fa3ef',    // Azul médio claro
      'De R$ 1.500 a R$ 3.000': '#6668d4',    // Azul médio
      'De R$ 3.000 a R$ 4.500': '#f16d91',    // Azul
      'De R$ 4.500 a R$ 6.000': '#f48e2f',    // Azul escuro
      'Mais de R$ 6.000': '#f4b72f'        // Azul muito escuro
    }

      const datasets = Object.keys(faixas).map(faixa => ({
        label: faixa,
        data: Array(50).fill().map(() => Math.floor(Math.random() * 20) + 5),
        backgroundColor: faixas[faixa],
        borderColor: faixas[faixa],
        borderWidth: 0
      }))
      
      return datasets
    }

    const destroyChart = () => {
      if (chartInstance) { chartInstance.destroy(); chartInstance = null }
    }

    const createChart = async () => {
      await nextTick()
      destroyChart()
      
      if (!open.value || !chartValores.value) return
      
      await new Promise(resolve => setTimeout(resolve, 100))

      chartInstance = new Chart(chartValores.value, {
        type: 'bar',
        data: {
          labels: generateUnidades(),
          datasets: generateValues()
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { usePointStyle: true, pointStyle: 'rect', font: { size: 10 }, padding: 10 }
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
              ticks: { font: { size: 10 } }
            }
          }
        }
      })
    }

    watch(() => props.data, createChart, { deep: true })
    watch(() => open.value, (newValue) => { if (newValue) setTimeout(createChart, 200) })
    onMounted(() => setTimeout(createChart, 300))

    return { open, chartValores }
  }
}
</script>