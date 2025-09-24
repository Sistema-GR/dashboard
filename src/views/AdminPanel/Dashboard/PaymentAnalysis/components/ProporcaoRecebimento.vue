<template>
  <div class="flex gap-4">
    <div class="flex-1">
      <canvas ref="barCanvas"></canvas>
    </div>
    <div class="flex-1">
      <canvas ref="pieCanvas"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

// Adicione as props:
const props = defineProps({
  barData: Object,
  pieData: Object,
  info: Array
})

const barCanvas = ref(null)
const pieCanvas = ref(null)

// Use dados mockados se as props não existirem:
const labels = props.barData?.labels || ['0%', '50%', '70%', '80%', '90%', '100%']
const data = props.barData?.data || [1200, 300, 400, 600, 300, 200]
const colors = ['#1976d2', '#2196f3', '#64b5f6', '#90caf9', '#bbdefb', '#e3f2fd']

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