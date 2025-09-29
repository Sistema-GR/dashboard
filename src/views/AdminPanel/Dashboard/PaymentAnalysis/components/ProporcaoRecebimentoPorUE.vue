<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Proporção de recebimento por UE</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full p-6">
          
          <!-- Primeiro Gráfico - Visão Geral -->
          <div class="mb-8">
            <h3 class="text-16 font-bold mb-4 text-gray-700">Visão Geral por UE</h3>
            <div class="flex-1 flex items-center justify-center min-h-[300px] overflow-hidden">
              <div class="w-full h-[280px] flex items-center justify-center overflow-hidden relative">
                <canvas ref="chartGeral" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
              </div>
            </div>
          </div>

          <!-- Segundo Gráfico - Detalhamento -->
          <div>
            <h3 class="text-16 font-bold mb-4 text-gray-700">Detalhamento Específico</h3>
            <div class="flex-1 flex items-center justify-center min-h-[300px] overflow-hidden">
              <div class="w-full h-[280px] flex items-center justify-center overflow-hidden relative">
                <canvas ref="chartDetalhado" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
              </div>
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
  name: 'ProporcaoRecebimentoPorUE',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartGeral = ref(null)
    const chartDetalhado = ref(null)
    let chartGeralInstance = null
    let chartDetalhadoInstance = null

    // Categorias de proporção com cores da imagem
    const categoriasProporcao = [
      { nome: '0,00%', color: '#418b6a' },
      { nome: '0,00%', color: '#6cc69d' },
      { nome: '40,00%', color: '#6fa3ef' },
      { nome: '55,00%', color: '#6668d4' },
      { nome: '70,00%', color: '#f16d91' },
      { nome: '85,00%', color: '#f48e2f' },
      { nome: '100,00%', color: '#f4b72f' }
    ]

    // UEs para gráfico geral (mais de 100)
    const unidadesGeral = [
      'AMAURI SOUZA', 'Pedro Gomes', 'Paulo Pacheco', 'Silvano Pinto', 'Sebastião Souza',
      'Antonio Moreira', 'Valdecir José', 'Escola Municipal', 'Cacilda Paula', 'Victor Oliveira',
      'Nilson Santos', 'Wilson Goulart', 'Elizabete Silva', 'Edgar Miller', 'Thais Saboia',
      'Helena Mader', 'Marger Silva', 'Laura Danner', 'Pedro Castro', 'João Armando',
      'Pedro Soares', 'Adalbo Silva', 'Júlio Mader', 'Anna Marques', 'Anna Silva',
      'Luiz Carlos', 'José Maria', 'Pedro Rosa', 'Paulo Fleming', 'Emily Paula',
      'SED Ibirama', 'José Motta', 'SED Geral', 'Alzeli Silva', 'Isadora Silva',
      'SED Núcleo Maria', 'SED Núcleo', 'Fritz Dispert', 'SED Disperção', 'SOF Educação',
      'SED Alto', 'SED', 'Escola Central', 'Centro Educacional', 'Unidade Norte',
      'Escola Sul', 'UE Leste', 'Centro Oeste', 'Polo Educacional', 'Campus Principal',
      // ... mais 50 escolas
      ...Array(50).fill().map((_, i) => `UE ${String(i + 51).padStart(3, '0')}`)
    ]

    // UEs específicas para detalhamento
    const unidadesDetalhadas = [
      'SED - Educação Profissional CEDUP',
      'SED - CARTÓRIO',
      'SED - AUDEAM',
      'SED - A Disposição - Secretaria da Saúde',
      'SED - A Disposição - Fundação Cultural',
      'SED - A Disposição - Sindicato dos Servidores',
      'SED - A Disposição - Associação Servidores',
      'SOM - MS - Unidade Saúde Servidor',
      'Mário Aubrech',
      'Valdeci May Engmann'
    ]

    // Gerar dados para gráfico geral
    const gerarDadosGeral = () => {
      const dados = {}
      categoriasProporcao.forEach(categoria => {
        dados[categoria.nome] = unidadesGeral.map((_, index) => {
          // Principalmente 0% e 100% como na imagem
          if (categoria.nome === '0,00%') return Math.random() > 0.7 ? Math.floor(Math.random() * 20) + 80 : 0
          if (categoria.nome === '100,00%') return Math.random() > 0.3 ? Math.floor(Math.random() * 10) + 5 : 0
          return Math.random() > 0.8 ? Math.floor(Math.random() * 15) + 2 : 0
        })
      })
      return dados
    }

    // Gerar dados para gráfico detalhado
    const gerarDadosDetalhados = () => {
      const dados = {}
      categoriasProporcao.forEach((categoria, index) => {
        dados[categoria.nome] = unidadesDetalhadas.map((_, ueIndex) => {
          // Últimas duas UEs têm distribuição mista
          if (ueIndex >= 8) {
            if (categoria.nome === '100,00%') return 10.53 + Math.random() * 6
            if (categoria.nome === '85,00%') return 7.89 + Math.random() * 8
            if (categoria.nome === '70,00%') return 16.67 + Math.random() * 10
            if (categoria.nome === '0,00%') return 68.42 + Math.random() * 20
            return Math.random() * 5
          }
          // Primeiras UEs são principalmente 100%
          return categoria.nome === '100,00%' ? 100 : 0
        })
      })
      return dados
    }

    const dadosGeral = gerarDadosGeral()
    const dadosDetalhados = gerarDadosDetalhados()

    const destroyCharts = () => {
      if (chartGeralInstance) { chartGeralInstance.destroy(); chartGeralInstance = null }
      if (chartDetalhadoInstance) { chartDetalhadoInstance.destroy(); chartDetalhadoInstance = null }
    }

    const createCharts = async () => {
      await nextTick()
      if (!open.value || !chartGeral.value || !chartDetalhado.value) return
      destroyCharts()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Datasets para ambos gráficos
      const datasetsGeral = categoriasProporcao.map(categoria => ({
        label: categoria.nome,
        data: dadosGeral[categoria.nome],
        backgroundColor: categoria.color,
        borderWidth: 0
      }))

      const datasetsDetalhados = categoriasProporcao.map(categoria => ({
        label: categoria.nome,
        data: dadosDetalhados[categoria.nome],
        backgroundColor: categoria.color,
        borderWidth: 0
      }))

      // Gráfico Geral
      chartGeralInstance = new Chart(chartGeral.value, {
        type: 'bar',
        data: { labels: unidadesGeral, datasets: datasetsGeral },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { 
                usePointStyle: true, 
                pointStyle: 'rect', 
                font: { size: 12 }, 
                padding: 15 
              }
            },
            tooltip: {
              mode: 'index',
              callbacks: {
                title: (context) => `UE: ${context[0].label}`,
                label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(1)}%`
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: { font: { size: 6 }, maxRotation: 90 }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: { color: '#e5e7eb' },
              ticks: { 
                font: { size: 10 },
                callback: (value) => `${value}%`
              },
              max: 100
            }
          }
        }
      })

      // Gráfico Detalhado
      chartDetalhadoInstance = new Chart(chartDetalhado.value, {
        type: 'bar',
        data: { labels: unidadesDetalhadas, datasets: datasetsDetalhados },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top',
              labels: { 
                usePointStyle: true, 
                pointStyle: 'rect', 
                font: { size: 12 }, 
                padding: 15 
              }
            },
            tooltip: {
              mode: 'index',
              callbacks: {
                title: (context) => `UE: ${context[0].label}`,
                label: (context) => `${context.dataset.label}: ${context.parsed.y.toFixed(2)}%`
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: { font: { size: 8 }, maxRotation: 45 }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: { color: '#e5e7eb' },
              ticks: { 
                font: { size: 10 },
                callback: (value) => `${value}%`
              },
              max: 100
            }
          }
        }
      })
    }

    watch(() => props.data, () => {
      if (open.value) setTimeout(() => createCharts(), 100)
    }, { deep: true })

    watch(open, (isOpen) => {
      if (isOpen) setTimeout(() => createCharts(), 300)
      else destroyCharts()
    })

    onMounted(() => setTimeout(() => createCharts(), 500))

    return { open, chartGeral, chartDetalhado, categoriasProporcao }
  }
}
</script>