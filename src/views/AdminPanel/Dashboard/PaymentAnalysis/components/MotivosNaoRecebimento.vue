<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Motivos de não recebimento</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }" />
    </button>
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] p-5 shadow-md flex flex-col w-full max-w-full">
          
          <!-- Tabela -->
          <div class="p-4">
            <table class="w-full text-15">
              <thead class="bg-[#1e3a8a] text-white rounded-[10px]">
                <tr>
                  <th class="px-4 py-2 text-left">Motivos de não recebimento</th>
                  <th class="px-4 py-2 text-center">Matrícula</th>
                  <th class="px-4 py-2 text-center">% matrícula</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(motivo, i) in motivosData" :key="i" class="border-b">
                  <td class="px-4 py-2 flex items-center">{{ motivo.nome }}</td>
                  <td class="px-4 py-2 text-center">{{ motivo.quantidade }}</td>
                  <td class="px-4 py-2 text-center">{{ motivo.percentual }}%</td>
                </tr>
                <tr class="bg-gray-50 font-bold">
                  <td class="px-4 py-2">Total geral</td>
                  <td class="px-4 py-2 text-center">{{ totalGeral.quantidade }}</td>
                  <td class="px-4 py-2 text-center">{{ totalGeral.percentual }}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Gráfico de Pizza com Legenda - Centralizado -->
          <div class="flex-1 flex items-center justify-center min-h-[260px] overflow-hidden">
            <div class="flex flex-row items-center justify-center gap-8 w-full h-[220px]">
              <!-- Pizza - Centralizada -->
              <div class="flex items-center justify-center overflow-hidden relative" style="width: 250px; height: 250px;">
                <canvas ref="chartMotivos" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
              </div>
              <!-- Legenda -->
              <div class="flex flex-col justify-center min-w-[200px]">
                <ul class="text-12 space-y-2">
                  <li v-for="(motivo, i) in motivosData" :key="i" class="flex items-center">
                    <span :style="{background: motivo.color, display:'inline-block', width:'12px', height:'12px', borderRadius:'2px', marginRight:'8px'}"></span>
                    <div class="flex flex-col">
                      <span class="text-11 leading-tight font-medium">{{ motivo.nome }}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import Chart from 'chart.js/auto'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'MotivosNaoRecebimento',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartMotivos = ref(null)
    let chartInstance = null

    const motivosData = [
      { nome: 'Frequência', quantidade: 1400, percentual: 56.0, color: '#6cc69d' },
      { nome: 'Tempo de atuação', quantidade: 400, percentual: 16.0, color: '#6fa3ef' },
      { nome: 'Formação', quantidade: 300, percentual: 12.0, color: '#6668d4' },
      { nome: 'Mais de 1 critério individual', quantidade: 200, percentual: 8.0, color: '#f16d91' },
      { nome: 'Atividades', quantidade: 174, percentual: 7.0, color: '#f48e2f' },
      { nome: 'Tempo de atuação permanente', quantidade: 26, percentual: 1.0, color: '#f4b72f' }
    ]

    const totalGeral = {
      quantidade: 2500,
      percentual: 100.0
    }

    const destroyChart = () => {
      if (chartInstance) { chartInstance.destroy(); chartInstance = null }
    }

    const createChart = async () => {
      await nextTick()
      if (!chartMotivos.value || !open.value) return
      destroyChart()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      chartInstance = new Chart(chartMotivos.value, {
        type: "pie",
        data: {
          labels: motivosData.map(d => d.nome),
          datasets: [{
            data: motivosData.map(d => d.quantidade),
            backgroundColor: motivosData.map(d => d.color),
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverBorderWidth: 3,
            hoverBackgroundColor: motivosData.map(motivo => {
              // Escurece a cor no hover
              const hex = motivo.color.replace('#', '')
              const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 20)
              const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 20)
              const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 20)
              return `rgb(${r}, ${g}, ${b})`
            })
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1, // Mantém proporção 1:1 (circular)
          plugins: { 
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `${context.label}: ${context.parsed.toLocaleString()} (${motivosData[context.dataIndex].percentual}%)`
                }
              }
            }
          },
          layout: {
            padding: 10 // Adiciona um pequeno padding interno
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

    return { open, chartMotivos, motivosData, totalGeral }
  }
}
</script>

<style scoped>
</style>