<template>
  <div class="mb-6 w-full">
    <button @click="open = !open" class="w-full text-left px-6 py-3 justify-between bg-blue-50 rounded-[10px] focus:outline-none flex items-center">
      <span class="text-25 font-bold text-black">Motivos para não recebimento x UE</span>
      <ChevronDownIcon class="w-4 h-4 sm:w-5 sm:h-5" :class="{ 'rotate-180': open }"/>
    </button>
    
    <div v-show="open" class="p-0">
      <div class="flex flex-wrap gap-10 px-10 py-8 justify-center items-stretch">
        <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full p-5">
          
          <!-- Gráfico de Barras Empilhadas -->
          <div class="flex-1 flex items-center justify-center min-h-[400px] overflow-hidden">
            <div class="w-full h-[380px] flex items-center justify-center overflow-hidden relative">
              <canvas ref="chartMotivos" class="w-full h-full !block relative z-10" style="max-width:100%;max-height:100%;display:block;"></canvas>
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
  name: 'MotivosParaNaoRecebimentoXUE',
  components: { ChevronDownIcon },
  props: { data: { type: Object, default: () => ({}) } },
  
  setup(props) {
    const open = ref(true)
    const chartMotivos = ref(null)
    let chartInstance = null

    // Categorias com cores da imagem
    const categorias = [
      { nome: 'Atividades', color: '#3459a2' },
      { nome: 'Formação', color: '#5d7ab5' },
      { nome: 'Frequência', color: '#859bc7' },
      { nome: 'Mais de 1 critério individual', color: '#99acd0' },
      { nome: 'Não recebe valor total por mais de 1 critério individual', color: '#c2cde3' },
      { nome: 'Tempo de atuação', color: '#eaeef6' }
    ]

    // Escolas/Unidades (mais de 50 como na imagem)
    const unidades = [
      'AMAURI DE SOUZA', 'Pedro Gomes', 'Paulo Pacheco', 'Silvano Pinto', 'Sebastião Souza',
      'Antonio Moreira', 'Valdecir José', 'Escola Municipal', 'Cacilda Paula', 'Victor Oliveira',
      'Nilson Santos', 'Wilson Goulart', 'Elizabete Silva', 'Edgar Miller', 'Thais Saboia',
      'Helena Mader', 'Marger Silva', 'Laura Danner', 'Pedro Castro', 'João Armando',
      'Pedro Soares', 'Adalbo Silva', 'Júlio Mader', 'Anna Marques', 'Anna Silva',
      'Luiz Carlos', 'José Maria', 'Pedro Rosa', 'Paulo Fleming', 'Emily Paula',
      'SED Ibirama', 'José Motta', 'SED Geral', 'Alzeli Silva', 'Isadora Silva',
      'SED Núcleo Maria', 'SED Núcleo', 'Fritz Dispert', 'SED Disperção', 'SOF Educação',
      'SED Alto', 'SED', 'CARTÓRIO'
    ]

    // Função para gerar dados aleatórios baseados na imagem
    const gerarDadosMotivos = () => {
      const dados = {}
      categorias.forEach(categoria => {
        dados[categoria.nome] = unidades.map((_, index) => {
          // Valores decrescentes como na imagem
          const baseValue = Math.max(1, 60 - index * 1.2)
          return Math.floor(Math.random() * baseValue * 0.3) + 1
        })
      })
      return dados
    }

    const motivosData = gerarDadosMotivos()

    const destroyChart = () => {
      if (chartInstance) {
        chartInstance.destroy()
        chartInstance = null
      }
    }

    const createChart = async () => {
      await nextTick()
      if (!chartMotivos.value || !open.value) return
      destroyChart()
      await nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Preparar datasets para Chart.js
      const datasets = categorias.map(categoria => ({
        label: categoria.nome,
        data: motivosData[categoria.nome],
        backgroundColor: categoria.color,
        borderWidth: 0,
        borderRadius: 0
      }))

      chartInstance = new Chart(chartMotivos.value, {
        type: 'bar',
        data: {
          labels: unidades,
          datasets: datasets
        },
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
              intersect: false,
              callbacks: {
                title: function(context) {
                  return `UE: ${context[0].label}`
                },
                label: function(context) {
                  return `${context.dataset.label}: ${context.parsed.y}`
                }
              }
            }
          },
          scales: {
            x: {
              stacked: true,
              grid: { display: false },
              ticks: {
                font: { size: 8 },
                maxRotation: 90,
                minRotation: 45,
                callback: function(value, index) {
                  const label = this.getLabelForValue(value)
                  return label.length > 12 ? label.substring(0, 12) + '...' : label
                }
              }
            },
            y: {
              stacked: true,
              beginAtZero: true,
              grid: { 
                color: '#e5e7eb',
                drawBorder: true
              },
              ticks: {
                font: { size: 10 },
                stepSize: 20,
                callback: function(value) {
                  return value
                }
              },
              max: 80
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          },
          elements: {
            bar: {
              borderWidth: 0
            }
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

    return { open, chartMotivos, categorias }
  }
}
</script>