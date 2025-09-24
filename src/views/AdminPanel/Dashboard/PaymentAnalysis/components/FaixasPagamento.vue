<template>
  <div class="mb-8">
    <div class="font-bold mb-2">Faixas de Pagamento</div>
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
            <th>Matrícula</th>
            <th>Valor a pagar</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, idx) in info" :key="idx">
            <td>{{ item.faixa }}</td>
            <td>{{ item.matricula }}</td>
            <td>{{ item.porcentagemMatricula }}</td>
            <td>{{ item.valorPagar }}</td>
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

const labels = [
  'Não recebe nada', 'Até R$ 1.000', 'De R$ 1.000 a R$ 2.000',
  'De R$ 2.000 a R$ 4.000', 'De R$ 4.000 a R$ 6.000', 'Mais que R$ 6.000'
]
const data = [1200, 300, 400, 600, 300, 200]
const colors = ['#1976d2', '#2196f3', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd']

const info = [
  { faixa: 'Não recebe nada', matricula: 1200, valorPagar: 'R$ 0,00' },
  { faixa: 'Até R$ 1.000', matricula: 300, valorPagar: 'R$ 300.000,00' },
  { faixa: 'De R$ 1.000 a R$ 2.000', matricula: 400, valorPagar: 'R$ 600.000,00' },
  { faixa: 'De R$ 2.000 a R$ 4.000', matricula: 600, valorPagar: 'R$ 1.800.000,00' },
  { faixa: 'De R$ 4.000 a R$ 6.000', matricula: 300, valorPagar: 'R$ 1.500.000,00' },
  { faixa: 'Mais que R$ 6.000', matricula: 200, valorPagar: 'R$ 1.400.000,00' }
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