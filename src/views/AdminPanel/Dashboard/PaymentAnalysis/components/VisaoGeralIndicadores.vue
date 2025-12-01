<template>
  <div class="flex flex-col w-full px-10 py-8">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Total que recebe -->
      <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
        <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
          Total que recebe
        </div>
        <div class="bg-blue-50 p-4 rounded-b-[10px]">
          <div class="flex flex-row items-center justify-center mb-1">
            <span class="text-20 font-bold text-gray-800 leading-none">{{ totalRecebe?.toLocaleString() || '514.4' }}</span>
          </div>
        </div>
      </div>

      <!-- Total que não recebe -->
      <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
        <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
          Total que não recebe
        </div>
        <div class="bg-blue-50 p-4 rounded-b-[10px]">
          <div class="flex flex-row items-center justify-center mb-1">
            <span class="text-20 font-bold text-gray-800 leading-none">{{ totalNaoRecebe?.toLocaleString() || '3545' }}</span>
          </div>
        </div>
      </div>

      <!-- Valor a pagar -->
      <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full max-w-full">
        <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
          Valor a pagar
        </div>
        <div class="bg-blue-50 p-4 rounded-b-[10px]">
          <div class="flex flex-row items-center justify-center mb-1">
            <span class="text-20 font-bold text-gray-800 leading-none">R$ {{ valorPagar?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '12.854,60' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VisaoGeralIndicadores',
  props: {
    totalRecebe: { type: Number, default: 514.4 },
    totalNaoRecebe: { type: Number, default: 3545 },
    valorPagar: { type: Number, default: 12854.60 }
  }
}
</script>