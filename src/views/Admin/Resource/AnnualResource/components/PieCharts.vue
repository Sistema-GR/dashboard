<template>
  <div class="w-full px-2 sm:px-6 mb-6">
    <div class="flex flex-col lg:flex-row gap-6 w-full">
      <!-- Card Gráfico -->
      <div class="bg-white rounded-t-lg shadow-md flex flex-col flex-1 min-w-[340px] max-w-[600px] mx-auto lg:mx-0 overflow-hidden" style="height:370px;">
        <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-[10px]">
          Grafico
        </div>
        <div class="flex-1 flex items-center justify-center p-6 overflow-hidden">
          <div class="w-full h-full flex items-center justify-center">
            <canvas ref="chartStatus" style="width:100%!important;height:220px!important;max-width:100%;max-height:100%;display:block;position:static;"></canvas>
          </div>
        </div>
      </div>
      <!-- Card Tabela -->
      <div class="bg-white shadow-md rounded-t-lg flex-1 min-w-[340px] max-w-[800px]">
        <div class="bg-[#3459A2] text-white text-center font-bold text-lg p-3 rounded-t-[10px]">
          Tabela
        </div>
        <div class="p-6 overflow-x-auto">
          <table class="min-w-full text-sm text-left border-separate border-spacing-y-1">
            <thead>
              <tr class="bg-[#2360a5] text-white">
                <th class="px-3 py-2 font-bold">Responsavel</th>
                <th class="px-3 py-2 font-bold">Qtd. de Recursos</th>
                <th class="px-3 py-2 font-bold">% Matrículas</th>
                <th class="px-3 py-2 font-bold">06/06</th>
                <th class="px-3 py-2 font-bold">07/06</th>
                <th class="px-3 py-2 font-bold">12/06</th>
                <th class="px-3 py-2 font-bold">13/06</th>
                <th class="px-3 py-2 font-bold">14/06</th>
              </tr>
            </thead>
            <tbody class="bg-white text-black">
              <tr>
                <td class="px-3 py-1">Tamires</td>
                <td class="px-3 py-1">11</td>
                <td class="px-3 py-1">1,75%</td>
                <td class="px-3 py-1">3</td>
                <td class="px-3 py-1">3</td>
                <td class="px-3 py-1">3</td>
                <td class="px-3 py-1">3</td>
                <td class="px-3 py-1">0</td>
              </tr>
              <tr>
                <td class="px-3 py-1">Kamila Nunes</td>
                <td class="px-3 py-1">35</td>
                <td class="px-3 py-1">5,56%</td>
                <td class="px-3 py-1">5</td>
                <td class="px-3 py-1">5</td>
                <td class="px-3 py-1">7</td>
                <td class="px-3 py-1">7</td>
                <td class="px-3 py-1">11</td>
              </tr>
              <tr>
                <td class="px-3 py-1">José Gonçalves</td>
                <td class="px-3 py-1">102</td>
                <td class="px-3 py-1">16,22%</td>
                <td class="px-3 py-1">21</td>
                <td class="px-3 py-1">21</td>
                <td class="px-3 py-1">21</td>
                <td class="px-3 py-1">21</td>
                <td class="px-3 py-1">18</td>
              </tr>
              <tr>
                <td class="px-3 py-1">Janis Ellye</td>
                <td class="px-3 py-1">73</td>
                <td class="px-3 py-1">11,61%</td>
                <td class="px-3 py-1">12</td>
                <td class="px-3 py-1">12</td>
                <td class="px-3 py-1">15</td>
                <td class="px-3 py-1">15</td>
                <td class="px-3 py-1">19</td>
              </tr>
              <tr>
                <td class="px-3 py-1">Geovani</td>
                <td class="px-3 py-1">107</td>
                <td class="px-3 py-1">17,01%</td>
                <td class="px-3 py-1">35</td>
                <td class="px-3 py-1">35</td>
                <td class="px-3 py-1">22</td>
                <td class="px-3 py-1">22</td>
                <td class="px-3 py-1">-8</td>
              </tr>
              <tr>
                <td class="px-3 py-1">Carlos Daniel</td>
                <td class="px-3 py-1">121</td>
                <td class="px-3 py-1">19,24%</td>
                <td class="px-3 py-1">13</td>
                <td class="px-3 py-1">13</td>
                <td class="px-3 py-1">26</td>
                <td class="px-3 py-1">26</td>
                <td class="px-3 py-1">50</td>
              </tr>
              <tr>
                <td class="px-3 py-1">Aurea Vieira</td>
                <td class="px-3 py-1">182</td>
                <td class="px-3 py-1">28,93%</td>
                <td class="px-3 py-1">25</td>
                <td class="px-3 py-1">25</td>
                <td class="px-3 py-1">35</td>
                <td class="px-3 py-1">35</td>
                <td class="px-3 py-1">55</td>
              </tr>
              <tr class="font-bold">
                <td class="px-3 py-1">Total geral</td>
                <td class="px-3 py-1">632</td>
                <td class="px-3 py-1">100,48%</td>
                <td class="px-3 py-1">114</td>
                <td class="px-3 py-1">114</td>
                <td class="px-3 py-1">129</td>
                <td class="px-3 py-1">129</td>
                <td class="px-3 py-1">145</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import Chart from 'chart.js/auto'

export default {
  name: 'PieCharts',
  props: {
    data: {
      type: Array,
      required: false,
      default: () => [
        { label: 'UPL', value: 120 },
        { label: 'UDP', value: 90 },
        { label: 'Formação Jovem', value: 55 },
        { label: 'Formação', value: 28 },
        { label: 'Formação Avan.', value: 15 }
      ]
    }
  },
  setup(props) {
    const chartStatus = ref(null)
    let chartInstance = null

    const destroyChart = () => {
      if (chartInstance) chartInstance.destroy()
      chartInstance = null
    }

    const createChart = () => {
      destroyChart()
      if (chartStatus.value) {
        chartInstance = new Chart(chartStatus.value, {
          type: 'bar',
          data: {
            labels: props.data.map(d => d.label),
            datasets: [{
              label: 'Respondido',
              data: props.data.map(d => d.value),
              backgroundColor: '#1976D2',
              borderRadius: 6,
              barPercentage: 0.7,
              categoryPercentage: 0.7
            }]
          },
          options: {
            plugins: {
              legend: { display: true, position: 'top' }
            },
            scales: {
              x: {
                grid: { display: false },
                ticks: { font: { size: 12 } }
              },
              y: {
                beginAtZero: true,
                grid: { color: '#e5e7eb' },
                ticks: { font: { size: 12 }, stepSize: 20 }
              }
            }
          }
        })
      }
    }

    watch(() => props.data, () => {
      createChart()
    }, { deep: true })

    onMounted(() => {
      createChart()
    })

    return {
      chartStatus
    }
  }
}
</script>