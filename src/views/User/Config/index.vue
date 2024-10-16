<template>
    <Whiteboard title="Configurações" :isSidebarMinimized="isSidebarMinimized">

        <div class="flex w-full gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm">

            <div class=" flex p-1 bg-gray-100 rounded-lg shadow-md">
                <img
                    class="w-24 object-cover h-auto rounded-lg"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                />
            </div>
  
            <div class="flex flex-row justify-between w-full items-center">

                <div class="flex flex-col gap-1">
                    <p class="text-lg font-semibold text-gray-800">Tom Cook Harris</p>
                    <p class="text-sm text-gray-600">Coordenador de Projetos</p>
                </div>
    
                <SecondaryButton label="Editar" class="mt-2 w-full lg:w-1/12"/>

            </div>

        </div>
  
        <div class="flex flex-col w-full gap-6 border-t-2 pt-6">
            <p class="text-xl font-semibold text-gray-800">Dados Cadastrais</p>
  
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5">
                <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">Nome</p>
                    <TextInput :modelValue="'Matheus Gabriel Grawe'" disabled class="w-full" />
                </div>
    
                <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">CPF</p>
                    <TextInput :modelValue="'123.456.789-00'" disabled class="w-full" />
                </div>
    
                <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">E-mail</p>
                    <TextInput :modelValue="'tom.cook@edu.joinville.sc.gov.br'" disabled class="w-full" />
                </div>
    
                <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">Senha</p>
                    <TextInput type="password" :modelValue="'*****'" disabled class="w-full" />
                </div>
            </div>
    
        </div>

    </Whiteboard>
  </template>
  
  <script>
  import { inject } from 'vue';
  import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
  import SecondaryButton from '@/components/Buttons/SecondaryButton.vue';
  import TextInput from '@/components/Inputs/TextInput.vue';
  
  export default {
    name: "Config",
    components: { Whiteboard, SecondaryButton, TextInput },
  
    setup() {
      const isSidebarMinimized = inject('isSidebarMinimized');
  
      return {
        isSidebarMinimized
      };
    }
  }
  </script>