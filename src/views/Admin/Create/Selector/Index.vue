<template>
    <Whiteboard title="Novo Cálculo" >
      <div class="flex flex-col md:flex-row w-full items-center justify-center gap-6 px-4 sm:px-10 p-8">
        <PrimaryButton 
          value="Criar novo cálculo"
          customColor="bg-[#4168b5] shadow-md hover:shadow-lg"
          @click="navigateTo('create-newcal')"
        />
        <PrimaryButton 
          value="Criar a partir de Versão Publicada"
          customColor="bg-[#4168b5] shadow-md hover:shadow-lg"
          @click="navigateTo('create-from-template')"
        />
      </div>
    </Whiteboard>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
  import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
  
  export default {
    name: "Selector",
    components: { Whiteboard, PrimaryButton },
    setup() {
      const router = useRouter();
  
      const navigateTo = (route) => {
        router.push({name: route});
      };
  
      return {
        navigateTo
      };
    }
  };
  </script>