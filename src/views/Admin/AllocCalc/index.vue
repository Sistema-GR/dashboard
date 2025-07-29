<template>
    <Whiteboard title="Calcular Alocação" :isSidebarMinimized="isSidebarMinimized">

        <div class="flex flex-col w-full items-center justify-start p-3 gap-5">
            <p>Escolha um opção abaixo</p>

            <div>
                <PrimaryButton class="bg-blue-800" value="Criar nova alocação"/>
            </div>

        </div>

    </Whiteboard>
    
</template>

<script>
import { inject } from 'vue'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';

export default {
    name: "AllocCalc",
    components: {Whiteboard, PrimaryButton},


    setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')

    return {
      isSidebarMinimized,  
    }
  }
}
</script>