<template>
  <div class="w-full">
    <div v-if="!data || data.length === 0" class="w-full text-center text-red-600 font-bold py-10">
      Nenhum dado recebido para exibir os gráficos. Verifique a prop <code>data</code>.
    </div>
    <div v-else>
    <!-- Título principal -->
    <div class="bg-blue-100 px-6 py-4 rounded-t-lg mb-4">
      <h2 class="text-2xl font-bold text-black">Quantidade de recursos</h2>
    </div>
    <!-- Card superior: Por unidade -->
    <div class="bg-white border border-black rounded-lg mb-6 mx-2 md:mx-0">
      <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-lg">
        Por unidade
      </div>
      <div class="p-6">
        <canvas ref="chartUnidades" class="w-full max-h-80 min-h-[300px]"></canvas>
      </div>
    </div>
    <!-- Cards inferiores: Por categoria e Por equipe responsável -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mx-2 md:mx-0">
      <div class="bg-white border border-black rounded-lg">
        <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-lg">
          Por categoria
        </div>
        <div class="p-6">
          <canvas ref="chartCategorias" class="w-full max-h-80 min-h-[300px]"></canvas>
        </div>
      </div>
      <div class="bg-white border border-black rounded-lg">
        <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-lg">
          Por equipe responsável
        </div>
        <div class="p-6">
          <canvas ref="chartEquipes" class="w-full max-h-80 min-h-[300px]"></canvas>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

export default {
  name: 'BarCharts',
  props: {
    data: {
      type: Array,
      required: true
    },
    availableUnits: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const chartUnidades = ref(null)
    const chartCategorias = ref(null)
    const chartEquipes = ref(null)

    // Dados fictícios para visualização
    const mockUnits = [
      { id: 1, nome: 'Secretaria' },
      { id: 2, nome: 'Rubem Berta' },
      { id: 3, nome: 'Luiz Gonzaga' },
      { id: 4, nome: 'Horta Diniz' },
      { id: 5, nome: 'Osmarildo C.' },
      { id: 6, nome: 'Pedro IV C.' },
      { id: 7, nome: 'Marilene G.C.' },
      { id: 8, nome: 'Adão Santi' },
      { id: 9, nome: 'Laura A.' },
      { id: 10, nome: 'Específico' }
    ]
    const mockData = [
      { unidade_atuacao_id: 1, criterios_selecionados: ['formacao'], equipe_responsavel: 'UPL' },
      { unidade_atuacao_id: 2, criterios_selecionados: ['faltas'], equipe_responsavel: 'UGP' },
      { unidade_atuacao_id: 3, criterios_selecionados: ['formacao', 'faltas'], equipe_responsavel: 'Formação Juliano' },
      { unidade_atuacao_id: 1, criterios_selecionados: ['formacao'], equipe_responsavel: 'UPL' },
      { unidade_atuacao_id: 4, criterios_selecionados: ['tempo_atuacao'], equipe_responsavel: 'UGP' },
      { unidade_atuacao_id: 5, criterios_selecionados: ['mais_criterios'], equipe_responsavel: 'Formação' },
      { unidade_atuacao_id: 6, criterios_selecionados: ['esclarecimento'], equipe_responsavel: 'Formação' },
      { unidade_atuacao_id: 7, criterios_selecionados: ['pagamento_indevido'], equipe_responsavel: 'Formação Juliano' },
      { unidade_atuacao_id: 8, criterios_selecionados: ['grupo'], equipe_responsavel: 'Formação Juliano' },
      { unidade_atuacao_id: 9, criterios_selecionados: ['atividades'], equipe_responsavel: 'Formação Aurea' },
      { unidade_atuacao_id: 10, criterios_selecionados: ['alega_atuacao_outra_etapa'], equipe_responsavel: 'Formação Aurea' },
      { unidade_atuacao_id: 1, criterios_selecionados: ['formacao'], equipe_responsavel: 'UPL' },
      { unidade_atuacao_id: 2, criterios_selecionados: ['faltas'], equipe_responsavel: 'UGP' },
      { unidade_atuacao_id: 3, criterios_selecionados: ['formacao', 'faltas'], equipe_responsavel: 'Formação Juliano' },
      { unidade_atuacao_id: 1, criterios_selecionados: ['formacao'], equipe_responsavel: 'UPL' },
      { unidade_atuacao_id: 4, criterios_selecionados: ['tempo_atuacao'], equipe_responsavel: 'UGP' },
      { unidade_atuacao_id: 5, criterios_selecionados: ['mais_criterios'], equipe_responsavel: 'Formação' },
      { unidade_atuacao_id: 6, criterios_selecionados: ['esclarecimento'], equipe_responsavel: 'Formação' },
      { unidade_atuacao_id: 7, criterios_selecionados: ['pagamento_indevido'], equipe_responsavel: 'Formação Juliano' },
      { unidade_atuacao_id: 8, criterios_selecionados: ['grupo'], equipe_responsavel: 'Formação Juliano' },
      { unidade_atuacao_id: 9, criterios_selecionados: ['atividades'], equipe_responsavel: 'Formação Aurea' },
      { unidade_atuacao_id: 10, criterios_selecionados: ['alega_atuacao_outra_etapa'], equipe_responsavel: 'Formação Aurea' }
    ]

    let chartsInstances = {}

    const destroyCharts = () => {
      Object.values(chartsInstances).forEach(chart => {
        if (chart) chart.destroy()
      })
      chartsInstances = {}
    }

    const getCategoryLabel = (category) => {
      const labels = {
        'formacao': 'Formação',
        'discordancia_regras': 'Discordância das regras',
        'faltas': 'Faltas',
        'tempo_atuacao': 'Tempo de atuação',
        'mais_criterios': 'Mais de um critério',
        'esclarecimento': 'Esclarecimento',
        'pagamento_indevido': 'Pagamento indevido',
        'grupo': 'Grupo',
        'atividades': 'Atividades',
        'alega_atuacao_outra_etapa': 'Alega atuação em outra etapa'
      }
      return labels[category] || category
    }

    // Se não vier units, usa mockUnits
    const getUnitName = (unitId) => {
      const unit = (props.availableUnits && props.availableUnits.length > 0 ? props.availableUnits : mockUnits).find(u => u.id === unitId)
      return unit ? unit.nome : 'N/A'
    }

    const getDataToUse = () => {
      return (props.data && props.data.length > 0) ? props.data : mockData
    }

    const createCharts = () => {
      const dataToUse = getDataToUse()
      console.log('Dados recebidos para os gráficos:', dataToUse)
      destroyCharts()
      const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y', // barras horizontais
        scales: {
          x: { beginAtZero: true },
          y: { ticks: { font: { size: 12 } } }
        },
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: { font: { size: 13 } }
          }
        }
      }
      // Unidades
      if (chartUnidades.value && dataToUse.length > 0) {
        const unitsCount = {}
        dataToUse.forEach(resource => {
          const unitName = getUnitName(resource.unidade_atuacao_id)
          unitsCount[unitName] = (unitsCount[unitName] || 0) + 1
        })
        const sortedUnits = Object.entries(unitsCount)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
        if (sortedUnits.length > 0) {
          chartsInstances.unidades = new Chart(chartUnidades.value, {
            type: 'bar',
            data: {
              labels: sortedUnits.map(([name]) => name),
              datasets: [{
                label: 'Unidade de atuação',
                data: sortedUnits.map(([,count]) => count),
                backgroundColor: '#3b82f6'
              }]
            },
            options: barOptions
          })
        }
      }
      // Categorias
      if (chartCategorias.value && dataToUse.length > 0) {
        const categories = {}
        dataToUse.forEach(resource => {
          const criterios = resource.criterios_selecionados || []
          criterios.forEach(criterio => {
            categories[criterio] = (categories[criterio] || 0) + 1
          })
        })
        const sortedCategories = Object.entries(categories)
          .sort(([,a], [,b]) => b - a)
        if (sortedCategories.length > 0) {
          chartsInstances.categorias = new Chart(chartCategorias.value, {
            type: 'bar',
            data: {
              labels: sortedCategories.map(([cat]) => getCategoryLabel(cat)),
              datasets: [{
                label: 'Categoria',
                data: sortedCategories.map(([,count]) => count),
                backgroundColor: '#06b6d4'
              }]
            },
            options: barOptions
          })
        }
      }
      // Equipes
      if (chartEquipes.value && dataToUse.length > 0) {
        const teamsCount = {}
        dataToUse.forEach(resource => {
          const team = resource.equipe_responsavel || 'Não definido'
          teamsCount[team] = (teamsCount[team] || 0) + 1
        })
        if (Object.keys(teamsCount).length > 0) {
          chartsInstances.equipes = new Chart(chartEquipes.value, {
            type: 'bar',
            data: {
              labels: Object.keys(teamsCount),
              datasets: [{
                label: 'EquipeResponsável',
                data: Object.values(teamsCount),
                backgroundColor: '#ec4899'
              }]
            },
            options: barOptions
          })
        }
      }
    }
    
    const updateCharts = () => {
      createCharts()
    }
    
    watch(() => props.data, () => {
  console.log('Dados recebidos para os gráficos (watch):', props.data)
  createCharts()
    }, { deep: true })
    
    onMounted(() => {
  console.log('Dados recebidos para os gráficos (onMounted):', props.data)
  createCharts()
    })
    
    return {
      chartUnidades,
      chartCategorias,
      chartEquipes,
      updateCharts
    }
  }
}
</script>