<template>
  <Whiteboard title="ANÁLISE DE PAGAMENTO">
    <!-- Sistema de Abas -->
    <div class="flex space-x-4 pt-3 border-b border-gray-300 mb-6">
      <button
        @click="activeTab = 'visao-geral'"
        :class="[
          'px-4 py-2 font-semibold focus:outline-none transition',
          activeTab === 'visao-geral'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-blue-400'
        ]"
      >
        Visão Geral
      </button>
      <button
        @click="activeTab = 'dados-unidade'"
        :class="[
          'px-4 py-2 font-semibold focus:outline-none transition',
          activeTab === 'dados-unidade'
            ? 'border-b-2 border-blue-600 text-blue-600'
            : 'text-gray-500 hover:text-blue-400'
        ]"
      >
        Dados por Unidade
      </button>
    </div>

    <div class="w-full">
      <!-- Conteúdo das Abas -->
      <div v-if="activeTab === 'visao-geral'">
        <PaymentAnalysisVisaoGeral />
      </div>
      <div v-if="activeTab === 'dados-unidade'">
        <PaymentAnalysisDadosUnidade />
      </div>
    </div>
  </Whiteboard>
</template>

<script setup>
import { ref } from 'vue'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import PaymentAnalysisDadosUnidade from './PaymentAnalysisDadosUnidade.vue'
import PaymentAnalysisVisaoGeral from './PaymentAnalysisVisaoGeral.vue'

const activeTab = ref('visao-geral')
</script>