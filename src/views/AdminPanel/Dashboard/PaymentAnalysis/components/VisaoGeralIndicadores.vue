<template>
  <div class="bg-white rounded-lg shadow-sm border p-6 mb-6">
    <h4 class="text-sm font-medium text-gray-700 mb-4">Indicadores Gerais</h4>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="text-center p-4 bg-gray-50 rounded-lg">
        <div class="text-2xl font-bold text-green-600 mb-1">{{ totalRecebe?.toLocaleString() || '0' }}</div>
        <div class="text-sm text-gray-600">Total que recebe</div>
      </div>
      <div class="text-center p-4 bg-gray-50 rounded-lg">
        <div class="text-2xl font-bold text-red-600 mb-1">{{ totalNaoRecebe?.toLocaleString() || '0' }}</div>
        <div class="text-sm text-gray-600">Total que não recebe</div>
      </div>
      <div class="text-center p-4 bg-gray-50 rounded-lg">
        <div class="text-2xl font-bold text-blue-600 mb-1">R$ {{ valorPagar?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00' }}</div>
        <div class="text-sm text-gray-600">Valor a pagar</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisaoGeralIndicadores',
  props: {
    totalRecebe: {
      type: Number,
      default: 0
    },
    totalNaoRecebe: {
      type: Number,
      default: 0
    },
    valorPagar: {
      type: Number,
      default: 0
    }
  }
}
</script>