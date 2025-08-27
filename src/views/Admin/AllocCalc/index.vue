<template>
    <Whiteboard title="Calcular Alocação" >
        <div class="flex flex-col w-full items-center justify-center">

            <div class="flex w-full p-5 pt-8">
                <p class="text-center w-full font-semibold text-15 text-gray-800">Escolha um opção abaixo</p>
            </div>

            <div>
                <PrimaryButton customColor="bg-[#4168b5] px-8 py-4 shadow-md hover:shadow-lg" value="Criar nova alocação"/>
            </div>

        </div>

    </Whiteboard>
    
</template>

<script>
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';

export default {
    name: "AllocCalc",
    components: {Whiteboard, PrimaryButton},
}
</script>