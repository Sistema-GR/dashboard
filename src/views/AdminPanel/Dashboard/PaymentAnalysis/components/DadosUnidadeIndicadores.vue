<template>
  <div class="flex flex-col w-full px-10 py-8">
    <div class="grid grid-cols-3 gap-6">
      <!-- Servidores -->
      <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full">
        <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
          Servidores
        </div>
        <div class="bg-blue-50 p-4 rounded-b-[10px]">
          <div class="flex flex-row items-center justify-center mb-1">
            <span class="text-20 font-bold text-black leading-none">{{ servidores?.toLocaleString() || '187' }}</span>
          </div>
        </div>
      </div>

      <!-- Não recebem -->
      <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full">
        <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
          Não recebem
        </div>
        <div class="bg-blue-50 p-4 rounded-b-[10px]">
          <div class="flex flex-row items-center justify-center mb-1">
            <span class="text-20 font-bold text-black leading-none">{{ naoRecebem?.toLocaleString() || '1646' }}</span>
          </div>
        </div>
      </div>

      <!-- % que não recebe -->
      <div class="bg-white rounded-[10px] shadow-md flex flex-col w-full">
        <div class="bg-[#3459A2] text-white text-center font-bold text-20 p-3 rounded-t-[10px]">
          % que não recebe
        </div>
        <div class="bg-blue-50 p-4 rounded-b-[10px]">
          <div class="flex flex-row items-center justify-center mb-1">
            <span class="text-20 font-bold text-black leading-none">{{ percentualNaoRecebe?.toFixed(1) || '85.46' }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DadosUnidadeIndicadores',
  props: {
    servidores: { type: Number, default: 187 },
    naoRecebem: { type: Number, default: 1646 },
    percentualNaoRecebe: { type: Number, default: 85.46 }
  }
}
</script>