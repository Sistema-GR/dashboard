<template>
  <div class="mb-8">
    <div class="font-bold mb-2">Motivo de não recebimento</div>
    <div class="flex gap-4">
      <div class="flex-1">
        <canvas ref="barCanvas"></canvas>
      </div>
      <div class="flex-1">
        <canvas ref="pieCanvas"></canvas>
      </div>
    </div>
    <div class="mt-4">
      <table>
        <thead>
          <tr>
            <th>Motivo de não recebimento</th>
            <th>Matrícula</th>
            <th>Matrícula</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in info" :key="idx">
            <td>{{ item.motivo }}</td>
            <td>{{ item.matricula }}</td>
            <td>{{ item.percentual }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

const barCanvas = ref(null)
const pieCanvas = ref(null)

const labels = ['Frequência', 'Tempo de atuação', 'Formação', 'Mais de 1 critério individual', 'Atividades']
const data = [1400, 400, 300, 200, 100]
const colors = ['#1976d2', '#2196f3', '#64b5f6', '#90caf9', '#bbdefb']

const info = [
  { motivo: 'Frequência', matricula: 1400, percentual: '46.4%' },
  { motivo: 'Tempo de atuação', matricula: 400, percentual: '13.3%' },
  { motivo: 'Formação', matricula: 300, percentual: '10.0%' },
  { motivo: 'Mais de 1 critério individual', matricula: 200, percentual: '6.6%' },
  { motivo: 'Atividades', matricula: 100, percentual: '3.3%' }
]

onMounted(() => {
  new Chart(barCanvas.value, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Matrícula',
        data,
        backgroundColor: '#1976d2'
      }]
    },
    options: { responsive: true }
  })
  new Chart(pieCanvas.value, {
    type: 'pie',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors
      }]
    },
    options: { responsive: true }
  })
})
</script>