<template>
    <div :class="`flex flex-col w-full bg-[#e3f0ff] rounded-[10px] overflow-hidden border transition-all shadow-sm hover:shadow-md duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${isActive ? 'drop-shadow-lg scale-105' : ''}`">
        
        
        <div :class="`flex items-center justify-center px-4 py-3 text-white ${colorClass}`">
            <span class="font-bold whitespace-nowrap text-15">{{ title }}</span>
        </div>
        
        
        <div class="bg-[#e3f0ff] px-10 py-4 flex items-center justify-center">
            <span class="text-black text-15 font-medium">{{ number }}</span>
        </div>

    </div>
</template>

<script>
import { computed } from 'vue';
export default {
    name: "Block",
    props: {
      title: { type: String, required: true },
      number: { type: [String, Number], required: true },
      
      colorKey: { type: String, default: 'gray' },
      
      isActive: { type: Boolean, default: false }
    },
    setup(props) {
        
        const colorClass = computed(() => {
            const colorMap = {
                blue: 'bg-[#6fa3ef]',
                purple: 'bg-[#6668d4]',
                pink: 'bg-[#f16d91]',
                orange: 'bg-[#ff8051]',
                teal: 'bg-[#6cc69d]',
                yellow: 'bg-[#f4b72f]',
                gray: 'bg-gray-500' 
            };
            
            return colorMap[props.colorKey] || colorMap['gray'];
        });

        return {
            colorClass // Exponha para o template
        };
    }
}
</script>