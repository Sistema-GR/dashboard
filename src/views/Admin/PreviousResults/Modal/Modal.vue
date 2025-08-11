<template>

    <TransitionRoot as="template" :show="open">

        <Dialog class="relative z-10" @close="close">

            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
              <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </TransitionChild>
      
            <div class="fixed inset-0 w-screen overflow-y-auto sm:px-10">

                <div class="flex min-h-full items-center justify-center p-4 text-center sm:p-0">

                    <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200" leave-from="opacity-100 translate-y-0 sm:scale-100" leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel class="relative transform overflow-hidden flex flex-col w-full rounded-[10px] bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-5xl sm:p-6">

                            <div class="sm:flex sm:items-start">

                                <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                                  <ExclamationTriangleIcon class="h-6 w-6 text-blue-600" aria-hidden="true" />
                                </div>

                                <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                  
                                    <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">Criar Nova Versão</DialogTitle>
                                    <div class="mt-2">
                                       <p class="text-15 text-gray-500">Selecione uma versão existente e forneça detalhes para criar uma nova versão.</p>
                                    </div>

                                </div>

                            </div>

                            <div class="mt-4">
                              
                                <div class="mb-4">
                                    <label for="category" class="block text-15 font-medium text-gray-700">Categoria</label>
                                    <select id="category" v-model="selectedCategory" class="mt-1 block w-full rounded-[10px] border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-15">
                                        <option v-for="category in categories" :key="category.name" :value="category.name">{{ category.name }}</option>
                                    </select>
                                </div>
              
                                <div class="mb-4">
                                    <label for="existing-version" class="block text-15 font-medium text-gray-700">Versão Existente</label>
                                    <select id="existing-version" v-model="selectedVersion" class="mt-1 block w-full rounded-[10px] border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-15">
                                        <option v-for="version in filteredVersions" :key="version.version" :value="version.version">{{ version.version }}</option>
                                    </select>
                                </div>
              
                                <div class="mb-4">
                                    <label for="save-category" class="block text-15 font-medium text-gray-700">Salvar em</label>
                                    <select id="save-category" v-model="saveCategory" class="mt-1 block w-full rounded-[10px] border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-15">
                                        <option v-for="category in categories" :key="category.name" :value="category.name">{{ category.name }}</option>
                                    </select>
                                </div>
              
                                <div class="mb-4">
                                    <label for="new-version-name" class="block text-15 font-medium text-gray-700">Nome da Nova Versão</label>
                                    <input id="new-version-name" v-model="newVersionName" type="text" class="mt-1 block w-full rounded-[10px] border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-15" />
                                </div>
              
                                <div class="mb-4">
                                    <label for="new-version-description" class="block text-15 font-medium text-gray-700">Descrição</label>
                                    <textarea id="new-version-description" v-model="newVersionDescription" rows="3" class="mt-1 block w-full rounded-[10px] border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 sm:text-15"></textarea>
                                </div>

                            </div>

                            <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                              
                                <button type="button" class="inline-flex w-full justify-center rounded-[10px] bg-blue-600 px-3 py-2 text-15 font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto" @click="createVersion">Criar Versão</button>
                                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-[10px] bg-white px-3 py-2 text-15 font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="close">Cancelar</button>
                            
                            </div>

                        </DialogPanel>
                    </TransitionChild>

                </div>

            </div>

        </Dialog>

    </TransitionRoot>

</template>

<script setup>
import { ref, computed } from 'vue';
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ExclamationTriangleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
open: Boolean,
versions: Array,
categories: Array
});


const emit = defineEmits(['close']);
const selectedCategory = ref(null);
const selectedVersion = ref(null);
const saveCategory = ref(null);
const newVersionName = ref('');
const newVersionDescription = ref('');

const filteredVersions = computed(() => {
if (selectedCategory.value) {
  const category = props.categories.find(cat => cat.name === selectedCategory.value);
  return category ? category.versions : [];
}
return [];
});


const createVersion = () => {
  console.log('Criar nova versão:', {
  category: selectedCategory.value,
  selectedVersion: selectedVersion.value,
  saveCategory: saveCategory.value,
  name: newVersionName.value,
  description: newVersionDescription.value
});
  close();
};

const close = () => {
emit('close');
};
</script>
