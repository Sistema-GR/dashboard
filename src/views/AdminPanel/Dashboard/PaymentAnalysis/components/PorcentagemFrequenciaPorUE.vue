<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">% de frequência por UE</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full p-5">
          <div class="flex-1 flex items-center justify-center min-h-[300px] overflow-hidden">
            <div class="w-full h-[260px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartFrequencia" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
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
  name: 'PorcentagemFrequenciaPorUE',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartFrequencia = ref(null)
    let chartInstance = null

    const generateUnidades = () => {
      const unidades = []
      for (let i = 1; i <= 60; i++) {
        unidades.push(`UE ${i.toString().padStart(2, '0')}`)
      }
      return unidades
    }

    const faixasFrequencia = {
      '0%-29%': '#eaeef6',      // Vermelho
      '30%-49%': '#aebdda',     // Laranja
      '50%-69%': '#859bc7',     // Amarelo
      '70%-79%': '#718abe',     // Verde claro
      '80%-89%': '#4869ab',     // Verde
      '90%-100%': '#3459a2'     // Azul
    }

    const generateFrequencyData = () => {
      return Object.keys(faixasFrequencia).map(faixa => ({
        label: faixa,
        data: Array(60).fill().map(() => Math.floor(Math.random() * 25) + 5),
        backgroundColor: faixasFrequencia[faixa],
        borderColor: faixasFrequencia[faixa],
        borderWidth: 0
      }))
    }

    const destroyChart = () => {
      if (chartInstance) { chartInstance.destroy(); chartInstance = null }
    }

    const createChart = async () => {
      await nextTick()
      destroyChart()
      
      if (!open.value || !chartFrequencia.value) return
      
      await new Promise(resolve => setTimeout(resolve, 100))

      chartInstance = new Chart(chartFrequencia.value, {
        type: 'bar',
        data: {
          labels: generateUnidades(),
          datasets: generateFrequencyData()
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

    return { open, chartFrequencia }
  }
}
</script>