<template>
  <div class="mb-8">
    <div class="font-bold mb-2">% de frequência</div>
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
            <th>Faixa</th>
            <th>Matrícula</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in info" :key="idx">
            <td>{{ item.faixa }}</td>
            <td>{{ item.matricula }}</td>
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

const labels = ['0%-29%', '30%-49%', '50%-69%', '70%-79%', '80%-89%', '90%-100%']
const data = [211, 191, 325, 993, 727, 3970]
const colors = ['#1976d2', '#2196f3', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd']

const info = labels.map((faixa, i) => ({
  faixa,
  matricula: data[i]
}))

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