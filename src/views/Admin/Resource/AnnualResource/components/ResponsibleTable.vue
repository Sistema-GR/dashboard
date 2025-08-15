<template>
  <div class="px-4 sm:px-10 mb-6">
    <div class="bg-white rounded-[10px] shadow-md overflow-hidden">
      <div class="bg-[#3459A2] text-white text-center font-bold text-15 p-3">
        Responsáveis por Recurso
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left font-semibold text-gray-700">Responsável</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Total</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Deferidos</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Indeferidos</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">Parcialmente Deferidos</th>
              <th class="px-4 py-3 text-center font-semibold text-gray-700">% do Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr 
              v-for="responsible in stats" 
              :key="responsible.id" 
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-4 py-3 font-medium text-gray-900">{{ responsible.name }}</td>
              <td class="px-4 py-3 text-center text-gray-700">{{ responsible.total }}</td>
              <td class="px-4 py-3 text-center text-green-600 font-medium">{{ responsible.deferidos }}</td>
              <td class="px-4 py-3 text-center text-red-600 font-medium">{{ responsible.indeferidos }}</td>
              <td class="px-4 py-3 text-center text-yellow-600 font-medium">{{ responsible.parcialmente_deferidos }}</td>
              <td class="px-4 py-3 text-center text-gray-700 font-medium">{{ responsible.percentage }}%</td>
            </tr>
            <tr v-if="stats.length === 0">
              <td colspan="6" class="px-4 py-8 text-center text-gray-500">
                Nenhum dado encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResponsibleTable',
  props: {
    stats: {
      type: Array,
      required: true
    }
  }
}
</script>