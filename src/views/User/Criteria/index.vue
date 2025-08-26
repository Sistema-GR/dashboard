<template>
    <Whiteboard title="Critérios" >
      <div class="flex flex-col w-full p-4 sm:px-10">
        <p class="font-semibold text-20 mb-10 text-center">
          Abaixo estão os dados dos critérios a serem verificados para o recebimento da gratificação.
        </p>
        
        <div class="flex flex-col space-y-6">
          <div class="bg-white shadow-xl rounded-[10px] border border-gray-200 overflow-hidden">
            <div v-for="(criterio, index) in criterios" :key="index" class="flex flex-col border-b last:border-b-0">
              <div class="flex items-center justify-between p-4 relative">
                <div class="flex-1">
                  <span class="font-semibold text-15">{{ criterio.label }}</span>
                </div>
  
                <div class="flex-1">
                  <span :class="{'text-red-500': !criterio.isApto, 'text-gray-700': criterio.isApto}" class="text-15">{{ criterio.value }}</span>
                </div>
                
                <div class="flex-1">
                  <span :class="{'text-red-500': !criterio.isApto, 'text-gray-700': criterio.isApto}" class="text-15">{{ criterio.status }}</span>
                </div>
  
                <div class="flex-shrink-0 ml-4 relative cursor-pointer" @mouseenter="showTooltip(index)" @mouseleave="hideTooltip">
                  <QuestionMarkCircleIcon class="h-6 w-6 text-gray-500 cursor-pointer"/>
                  <div v-if="activeTooltip === index" class="absolute top-1/2 left-[-12rem] transform -translate-y-1/2 bg-gray-700 text-white text-15 rounded-[10px] p-2 z-10">
                    {{ criterio.tooltip }}
                  </div>
                </div>
  
              </div>
            </div>
          </div>
        </div>
  
      </div>
    </Whiteboard>
  </template>
  
  <script>
  import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
  import { QuestionMarkCircleIcon } from "@heroicons/vue/24/outline";
  
  export default {
    name: "CritériosDoUsuario",
    components: { Whiteboard, QuestionMarkCircleIcon },
    data() {
      return {
        criterios: [
          { label: 'Frequência', value: '92%', status: '', isApto: false, tooltip: 'A frequência mínima necessária é 96%.' },
          { label: 'Tempo de Atuação', value: 'Atuou há mais de 6 meses', status: '', isApto: false, tooltip: 'Deve ter atuado por mais de 6 meses.' },
          { label: 'Formação', value: '100%', status: '', isApto: false, tooltip: 'A formação deve ser 100%.' },
          { label: 'Atividades', value: '100%', status: '', isApto: false, tooltip: 'Atividades devem estar 100% completas.' },
        ],
        activeTooltip: null
      }
    },
    created() {
      this.updateAptitude(); 
    },
    methods: {
      updateAptitude() {
        if (!Array.isArray(this.criterios)) {
          console.error("criterios não é um array.");
          return;
        }
  
        this.criterios.forEach(criterio => {
          switch (criterio.label) {
            case 'Frequência':
              criterio.isApto = parseFloat(criterio.value) >= 96;
              break;
            case 'Tempo de Atuação':
              criterio.isApto = criterio.value.includes('mais de 6 meses');
              break;
            case 'Formação':
            case 'Atividades':
              criterio.isApto = parseFloat(criterio.value) >= 100;
              break;
            default:
              criterio.isApto = true;
          }
          criterio.status = criterio.isApto ? 'Apto a Receber Gratificação' : 'Não Apto';
        });
      },
      showTooltip(index) {
        this.activeTooltip = index;
      },
      hideTooltip() {
        this.activeTooltip = null;
      }
    }
  }
  </script>
  