<template>
    <div class="flex flex-col w-full bg-[#e3f0ff] rounded-[10px] overflow-hidden border transition-all shadow-sm hover:shadow-md duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
        
        <!-- Header colorido -->
        <div :class="`flex items-center justify-center px-4 py-3 rounded-[10px] text-white ${getColorClass()}`">
            <span class="font-bold text-15">{{ title }}</span>
        </div>
        
        <!-- Conteúdo inferior branco -->
        <div class="bg-[#e3f0ff] px-10 py-4 flex items-center justify-center">
            <span class="text-black text-15 font-medium">{{ number }}</span>
        </div>

    </div>
</template>

<script>
import { UserIcon } from "@heroicons/vue/24/outline";

export default {
    name: "Block",
    components: { UserIcon },

    props: {
      title: {
        type: String,
        required: true,
        default: 'Default Title'
      },
      number: {
        type: String,
        required: true,
        default: '0'
      },
      customClass: {
        type: String,
        default: ''
      }
    },

    methods: {
        getColorClass() {
            // Extrai a cor do customClass e retorna a cor personalizada correta
            if (this.customClass.includes('bg-blue-500')) return 'bg-[#6fa3ef]'     // Novo
            if (this.customClass.includes('bg-orange-500')) return 'bg-[#6668d4]'   // Em Progresso
            if (this.customClass.includes('bg-yellow-500')) return 'bg-[#f16d91]'   // Pendente
            if (this.customClass.includes('bg-red-500')) return 'bg-[#6cc69d]'      // Reaberto
            if (this.customClass.includes('bg-green-500')) return 'bg-[#ff8051]'    // Finalizado
            if (this.customClass.includes('bg-gray-500')) return 'bg-[#f4b72f]'     // Cancelado
            return 'bg-gray-500'
        }
    }
}
</script>

