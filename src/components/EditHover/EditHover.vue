<template>
  <div v-if="appealData" class="absolute bg-white border border-gray-300 rounded-lg shadow-xl p-4 w-72 z-50 pointer-events-none">
    <h4 class="text-md font-bold text-gray-800 border-b pb-2 mb-2">Detalhes do Recurso</h4>
    <div class="space-y-2 text-sm">
      <div>
        <strong class="text-gray-600">Requerente:</strong>
        <p class="text-gray-800">{{ appealData.nome_completo }}</p>
      </div>
      <div>
        <strong class="text-gray-600">Matrículas no Recurso:</strong>
        <p class="text-gray-800">{{ appealData.matriculas_recurso.join(', ') }}</p>
      </div>
      <div>
        <strong class="text-gray-600">Motivo/Descrição:</strong>
        <p class="text-gray-700 bg-gray-50 p-2 rounded-md max-h-32 overflow-y-auto">{{ appealData.descricao }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  appealData: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
p::-webkit-scrollbar {
  width: 5px;
}
p::-webkit-scrollbar-track {
  background: #f1f1f1;
}
p::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 5px;
}
p::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>