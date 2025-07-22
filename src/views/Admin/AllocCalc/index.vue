<template>
    <Whiteboard title="Cáclcular Alocação" :isSidebarMinimized="isSidebarMinimized">

        <div class="flex flex-col w-full items-center justify-start p-3">
            <p>Escolha um opção abaixo</p>

            <div>
                <PrimaryButton value="Criar nova alocação"/>
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