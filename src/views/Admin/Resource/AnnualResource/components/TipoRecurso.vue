<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Tipos de recurso</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }" />
    </button>
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <!-- Card Gráfico Tipos -->
          <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
              Tipos de recurso
            </div>
            <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
              <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
                <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
                  <canvas ref="chartTipos" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
                </div>
              </div>
              <ul class="text-15 px-6 pb-4">
                <li v-for="(label, i) in tiposLabels" :key="label" class="flex items-center mb-1">
                  <span :style="{background: tiposColors[i], display:'inline-block', width:'14px', height:'14px', borderRadius:'3px', marginRight:'8px'}"></span>
                  <span class="mr-2">{{ label }}</span>
                  <span class="ml-auto font-bold">{{ tiposData[i] }}%</span>
                </li>
              </ul>
            </div>
          </div>
        <!-- Card Gráfico Status -->
        <div class="flex flex-col gap-4 flex-1 min-w-[340px] max-w-[600px] justify-center">
          <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full h-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
              Status
            </div>
            <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
              <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
                <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
                  <canvas ref="chartStatus" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
                </div>
              </div>
              <ul class="text-15 px-6 pb-4">
                <li v-for="(label, i) in statusLabels" :key="label" class="flex items-center mb-1">
                  <span :style="{background: statusColors[i], display:'inline-block', width:'14px', height:'14px', borderRadius:'3px', marginRight:'8px'}"></span>
                  <span class="mr-2">{{ label }}</span>
                  <span class="ml-auto font-bold">{{ statusData[i] }}%</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <!-- Card Gráfico Conclusão -->
        <div class="flex flex-col gap-4 flex-1 min-w-[340px] max-w-[600px] justify-center">
          <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full h-full">
            <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
              Conclusão
            </div>
            <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
              <div class="flex-1 flex items-center justify-center p-4 min-h-[260px] overflow-hidden">
                <div class="w-full h-[220px] flex items-center justify-center overflow-hidden relative">
                  <canvas ref="chartConclusao" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
                </div>
              </div>
              <ul class="text-15 px-6 pb-4">
                <li v-for="(label, i) in conclusaoLabels" :key="label" class="flex items-center mb-1">
                  <span :style="{background: conclusaoColors[i], display:'inline-block', width:'14px', height:'14px', borderRadius:'3px', marginRight:'8px'}"></span>
                  <span class="mr-2">{{ label }}</span>
                  <span class="ml-auto font-bold">{{ conclusaoData[i] }}%</span>
                </li>
              </ul>
            </div>
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
  name: 'TipoRecurso',
  components: {
    ChevronDownIcon
  },
  props: {
    responsaveis: {
      type: Array,
      required: false,
      default: () => ([
        { id: 1, name: 'Tamires', total: 11, deferidos: 3, indeferidos: 5, parcialmente_deferidos: 3, percentage: 1.75 },
        { id: 2, name: 'Kamila Nunes', total: 35, deferidos: 5, indeferidos: 7, parcialmente_deferidos: 23, percentage: 5.56 },
        { id: 3, name: 'José Gonçalves', total: 102, deferidos: 21, indeferidos: 60, parcialmente_deferidos: 21, percentage: 16.22 },
        { id: 4, name: 'Janis Ellye', total: 73, deferidos: 12, indeferidos: 46, parcialmente_deferidos: 15, percentage: 11.61 },
        { id: 5, name: 'Geovani', total: 107, deferidos: 35, indeferidos: 40, parcialmente_deferidos: 32, percentage: 17.01 },
        { id: 6, name: 'Carlos Daniel', total: 121, deferidos: 13, indeferidos: 58, parcialmente_deferidos: 50, percentage: 19.24 },
        { id: 7, name: 'Aurea Vieira', total: 182, deferidos: 25, indeferidos: 102, parcialmente_deferidos: 55, percentage: 28.93 },
      ])
    }
  },
  setup(props) {
    const open = ref(true)
    const chartTipos = ref(null)
    const chartStatus = ref(null)
    const chartConclusao = ref(null)
    let chartTiposInstance = null
    let chartStatusInstance = null
    let chartConclusaoInstance = null

    const tiposLabels = [
      "Formação",
      "Discordância das regras estabelecidas",
      "Faltas",
      "Tempo de atuação",
      "Mais de um critério",
      "Esclarecimento",
      "Pagamento indevido",
      "Grupo",
      "Atividades",
      "Alega atuação em outra etapa",
    ]
    const tiposData = [34.6, 19.1, 14.2, 12.5, 5.3, 4.8, 3.0, 2.5, 2.0, 2.0]
    const tiposColors = [
      "#2E75B6",
      "#E91E63",
      "#F7B500",
      "#5DADE2",
      "#EC7063",
      "#48C9B0",
      "#7D3C98",
      "#95A5A6",
      "#27AE60",
      "#D35400",
    ]

    const statusLabels = ["Respondido"]
    const statusData = [100]
    const statusColors = ["#2E75B6"]

    const conclusaoLabels = ["Indeferido", "Deferido", "Parcialmente deferido"]
    const conclusaoData = [49.6, 44.5, 5.9]
    const conclusaoColors = ["#2E75B6", "#1ABC9C", "#E91E63"]

    const destroyCharts = () => {
      if (chartTiposInstance) { chartTiposInstance.destroy(); chartTiposInstance = null }
      if (chartStatusInstance) { chartStatusInstance.destroy(); chartStatusInstance = null }
      if (chartConclusaoInstance) { chartConclusaoInstance.destroy(); chartConclusaoInstance = null }
    }

    const createCharts = async () => {
      await nextTick()
      destroyCharts()
      if (!open.value) return
      await new Promise(resolve => setTimeout(resolve, 200))
      if (chartTipos.value) {
        chartTiposInstance = new Chart(chartTipos.value, {
          type: "pie",
          data: {
            labels: tiposLabels,
            datasets: [
              {
                data: tiposData,
                backgroundColor: tiposColors,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
          },
        })
      }
      if (chartStatus.value) {
        chartStatusInstance = new Chart(chartStatus.value, {
          type: "pie",
          data: {
            labels: statusLabels,
            datasets: [
              {
                data: statusData,
                backgroundColor: statusColors,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
          },
        })
      }
      if (chartConclusao.value) {
        chartConclusaoInstance = new Chart(chartConclusao.value, {
          type: "pie",
          data: {
            labels: conclusaoLabels,
            datasets: [
              {
                data: conclusaoData,
                backgroundColor: conclusaoColors,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
          },
        })
      }
    }

    watch(() => open.value, (newValue) => {
      if (newValue) setTimeout(() => { createCharts() }, 300)
      else destroyCharts()
    })

    onMounted(() => {
      console.log('Canvas elements:', {
        tipos: chartTipos.value,
        status: chartStatus.value,
        conclusao: chartConclusao.value
      })
      setTimeout(() => { createCharts() }, 500)
    })

    return {
      open,
      chartTipos,
      chartStatus,
      chartConclusao,
      tiposLabels,
      tiposData,
      tiposColors,
      statusLabels,
      statusData,
      statusColors,
      conclusaoLabels,
      conclusaoData,
      conclusaoColors,
      responsaveis: props.responsaveis
    }
  }
}
</script>

<style scoped>
.shadow-md {
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
}
</style>