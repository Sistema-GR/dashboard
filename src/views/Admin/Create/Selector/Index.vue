<template>
    <Whiteboard title="Escolha a opção abaixo" :isSidebarMinimized="isSidebarMinimized">
      <div class="flex flex-col md:flex-row w-full items-center justify-center gap-6 p-8">
        <PrimaryButton 
          value="Criar Novo Cálculo"
          customColor="bg-blue-500 hover:bg-blue-600"
          @click="navigateTo('/home/create/newcal')"
        />
        <PrimaryButton 
          value="Criar a partir de Dados Existentes"
          customColor="bg-blue-500 hover:bg-blue-600"
          @click="navigateTo('/home/create/versionmanager')"
        />
      </div>
    </Whiteboard>
  </template>
  
  <script>
  import { inject } from 'vue';
  import { useRouter } from 'vue-router';
  import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
  import PrimaryButton from '@/components/Buttons/PrimaryButton.vue';
  
  export default {
    name: "Selector",
    components: { Whiteboard, PrimaryButton },
    setup() {
      const isSidebarMinimized = inject('isSidebarMinimized');
      const router = useRouter();
  
      const navigateTo = (route) => {
        router.push(route);
      };
  
      return {
        isSidebarMinimized,
        navigateTo
      };
    }
  };
  </script>