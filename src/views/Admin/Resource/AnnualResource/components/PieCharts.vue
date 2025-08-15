<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-10 mb-6">
    <!-- Status -->
    <div class="bg-white rounded-[10px] shadow-md">
      <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-[10px]">
        Status
      </div>
      <div class="p-6">
        <canvas ref="chartStatus" class="w-full max-h-80"></canvas>
      </div>
    </div>

    <!-- Conclusão -->
    <div class="bg-white rounded-[10px] shadow-md">
      <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-[10px]">
        Conclusão
      </div>
      <div class="p-6">
        <canvas ref="chartConclusao" class="w-full max-h-80"></canvas>
      </div>
    </div>

    <!-- Categoria -->
    <div class="bg-white rounded-[10px] shadow-md">
      <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-[10px]">
        Categorias
      </div>
      <div class="p-6">
        <canvas ref="chartCategoria" class="w-full max-h-80"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'

export default {
  name: 'PieCharts',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const chartStatus = ref(null)
    const chartConclusao = ref(null)
    const chartCategoria = ref(null)
    
    let chartsInstances = {}
    
    const destroyCharts = () => {
      Object.values(chartsInstances).forEach(chart => {
        if (chart) chart.destroy()
      })
      chartsInstances = {}
    }
    
    const createCharts = () => {
      // Simulação de gráficos - você pode implementar Chart.js aqui
      console.log('Criando gráficos com dados:', props.data)
    }
    
    const updateCharts = () => {
      createCharts()
    }
    
    watch(() => props.data, () => {
      createCharts()
    }, { deep: true })
    
    onMounted(() => {
      createCharts()
    })
    
    return {
      chartStatus,
      chartConclusao,
      chartCategoria,
      updateCharts
    }
  }
}
</script>