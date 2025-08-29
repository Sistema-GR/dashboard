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
        <div class="flex flex-col gap-4 flex-1 min-w-[340px] max-w-[850px] w-full justify-center">
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
        <div class="flex flex-col gap-4 flex-1 min-w-[340px] max-w-[850px] w-full justify-center">
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
import { ref, onMounted, watch, nextTick, computed } from 'vue'
import Chart from 'chart.js/auto'
import { ChevronDownIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'TipoRecurso',
  components: {
    ChevronDownIcon
  },
  props: {
    tiposData: { type: Array, default: () => [] },
    statusData: { type: Array, default: () => [] },
    conclusaoData: { type: Array, default: () => [] }
  },
  setup(props) {
    const open = ref(true)
    const chartTipos = ref(null)
    const chartStatus = ref(null)
    const chartConclusao = ref(null)
    let chartTiposInstance = null
    let chartStatusInstance = null
    let chartConclusaoInstance = null
    // Paleta de cores personalizada
    const customColors = [
      '#3459a2',
      '#6668d4', 
      '#6fa3ef',
      '#00b6cb',
      '#418b6a',
      '#6cc69d',
      '#e44949',
      '#f16d91',
      '#f48e2f',
      '#f4b72f'
    ]
    const destroyCharts = () => {
      if (chartTiposInstance) { chartTiposInstance.destroy(); chartTiposInstance = null }
      if (chartStatusInstance) { chartStatusInstance.destroy(); chartStatusInstance = null }
      if (chartConclusaoInstance) { chartConclusaoInstance.destroy(); chartConclusaoInstance = null }
    }
    
    const processChartData = (data) => {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      if (total === 0) {
        return { labels: [], data: [], percentages: [], colors: [] };
      }
      const labels = data.map(item => item.name);
      const values = data.map(item => item.value);
      const percentages = values.map(val => ((val / total) * 100).toFixed(1));
      const colors = customColors.slice(0, data.length);
      return { labels, data: values, percentages, colors };
    };

    const tiposChart = computed(() => processChartData(props.tiposData));
    const statusChart = computed(() => processChartData(props.statusData));
    const conclusaoChart = computed(() => processChartData(props.conclusaoData));


    const createCharts = async () => {
      await nextTick()
      destroyCharts()
      if (!open.value) return
      await new Promise(resolve => setTimeout(resolve, 200))
     
      // Configuração simplificada de tooltip que funciona
      const tooltipConfig = {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#ffffff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 10,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}%`;
          }
        }
      }
      
      if (chartTipos.value && tiposChart.value.labels.length > 0) {
        chartTiposInstance = new Chart(chartTipos.value, {
          type: "pie",
          data: {
            labels:  tiposChart.value.labels,
            datasets: [{
              data: tiposChart.value.percentages,
              backgroundColor: tiposChart.value.colors,
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverBorderWidth: 3,
              hoverBorderColor: '#ffffff'
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false },
              tooltip: tooltipConfig
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            animation: {
              animateRotate: true,
              duration: 1000
            }
          },
        })
      }
      
      if (chartStatus.value && statusChart.value.labels.length > 0) {
        chartStatusInstance = new Chart(chartStatus.value, {
          type: "pie",
          data: {
            labels: statusChart.value.labels,
            datasets: [{
              data: statusChart.value.percentages,
              backgroundColor: statusChart.value.colors,
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverBorderWidth: 3,
              hoverBorderColor: '#ffffff'
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false },
              tooltip: tooltipConfig
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            animation: {
              animateRotate: true,
              duration: 1000
            }
          },
        })
      }
      
      if (chartConclusao.value && conclusaoChart.value.labels.length > 0) {
        chartConclusaoInstance = new Chart(chartConclusao.value, {
          type: "pie",
          data: {
            labels: conclusaoChart.value.labels,
            datasets: [{
              data: conclusaoChart.value.percentages,
              backgroundColor: conclusaoChart.value.colors,
              borderWidth: 2,
              borderColor: '#ffffff',
              hoverBorderWidth: 3,
              hoverBorderColor: '#ffffff'
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false },
              tooltip: tooltipConfig
            },
            hover: {
              mode: 'nearest',
              intersect: true
            },
            animation: {
              animateRotate: true,
              duration: 1000
            }
          },
        })
      }
    }
    
    watch(() => [props.tiposData, props.statusData, props.conclusaoData], () => {
      if(open.value) createCharts();
    }, { deep: true });

    watch(() => open.value, (newValue) => {
      if (newValue) setTimeout(() => { createCharts() }, 300)
      else destroyCharts()
    })

    onMounted(() => {
      setTimeout(() => { createCharts() }, 500)
    })

    return {
      open,
      chartTipos,
      chartStatus,
      chartConclusao,
      tiposLabels: computed(() => tiposChart.value.labels),
      tiposData: computed(() => tiposChart.value.percentages),
      tiposColors: computed(() => tiposChart.value.colors),
      statusLabels: computed(() => statusChart.value.labels),
      statusData: computed(() => statusChart.value.percentages),
      statusColors: computed(() => statusChart.value.colors),
      conclusaoLabels: computed(() => conclusaoChart.value.labels),
      conclusaoData: computed(() => conclusaoChart.value.percentages),
      conclusaoColors: computed(() => conclusaoChart.value.colors),
    }
  }
}
</script>

<style scoped>
.shadow-md {
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.08);
}
</style>