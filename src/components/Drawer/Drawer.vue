<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-50" @close="open = false"> 
      <TransitionChild
        as="template"
        enter="ease-in-out duration-500"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in-out duration-500"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>
      <div class="fixed inset-0 overflow-hidden z-50"> 
        <div class="absolute inset-0 overflow-hidden">
          <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <TransitionChild
              as="template"
              enter="transform transition ease-in-out duration-500 sm:duration-700"
              enter-from="translate-x-full"
              enter-to="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-700"
              leave-from="translate-x-0"
              leave-to="translate-x-full"
            >
              <DialogPanel class="pointer-events-auto w-screen max-w-md">
                <div class="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                  <div class="px-4 sm:px-6">
                    <div class="flex items-start justify-between">
                      <DialogTitle class="text-base font-semibold leading-6 text-gray-900">{{ title }}</DialogTitle>
                      <div class="ml-3 flex h-7 items-center">
                        <button
                          type="button"
                          class="relative rounded-[10px] bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          @click="closeDrawer"
                        >
                          <span class="absolute -inset-2.5" />
                          <span class="sr-only">Close panel</span>
                          <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="relative mt-6 flex-1 px-4 sm:px-6">
                    <div v-for="column in columns" :key="column.key" class="mb-4">
                      <p class="leading-auto font-normal">{{ getLabelByKey(column.key) }}</p>
                      <TextInput
                        v-model="editableData[column.key]"
                        :type="column.type"
                      />
                    </div>
                  </div>

                  <div class="flex items-end justify-end mx-5 gap-4">
                    <SecondaryButton label="Cancelar" @click="closeDrawer" />
                    <SecondaryButton label="Salvar" @click="saveChanges" />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>


<script setup>
import { ref, watch } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';
import TextInput from '../Inputs/TextInput.vue';
import SecondaryButton from '../Buttons/SecondaryButton.vue';

const props = defineProps({
  title: String,
  rowData: Object,
  columns: Array,
  fileKey: String
});

const emit = defineEmits(["update:rowData"]);

const open = ref(false);
const editableData = ref({}); 

const TIMEDELTA_COLUMNS = ['carga_horaria_real', 'carga_horaria_atividade', 'carga_horaria_termo'];

function timedeltaStringToHours(tdString) {
  if (typeof tdString !== 'string' || !tdString) return 0;
  let totalHours = 0;
  const daysMatch = tdString.match(/(-?\d+)\s*days?/);
  if (daysMatch) {
    totalHours += parseInt(daysMatch[1], 10) * 24;
  }

  const timeMatch = tdString.match(/(\d{2}):(\d{2}):(\d{2})/);
  if (timeMatch) {
    totalHours += parseInt(timeMatch[1], 10);
    totalHours += parseInt(timeMatch[2], 10) / 60;
    totalHours += parseInt(timeMatch[3], 10) / 3600;
  }
  return parseFloat(totalHours.toFixed(2));
}

function hoursToTimedeltaString(hours) {
    if (isNaN(hours) || hours === null) return "0 days 00:00:00";
    
    const totalSeconds = Math.round(hours * 3600);
    const days = Math.floor(totalSeconds / (24 * 3600));
    let remainingSeconds = totalSeconds % (24 * 3600);
    
    const hrs = Math.floor(remainingSeconds / 3600);
    remainingSeconds %= 3600;
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    
    const formattedTime = [hrs, mins, secs]
        .map(val => val.toString().padStart(2, '0'))
        .join(':');
        
    return `${days} days ${formattedTime}`;
}


watch(() => props.rowData, (newRowData) => {
  if (newRowData && Object.keys(newRowData).length > 0) {
    const dataCopy = JSON.parse(JSON.stringify(newRowData));
    
    if (props.fileKey === 'funcionarios') {
      for (const key of TIMEDELTA_COLUMNS) {
        if (dataCopy.hasOwnProperty(key)) {
          dataCopy[key] = timedeltaStringToHours(dataCopy[key]);
        }
      }
    }
    editableData.value = dataCopy;
  }
}, { deep: true });

function openDrawer() {
  open.value = true;
}

function closeDrawer() {
  open.value = false;
  editableData.value = {};
}

function getLabelByKey(key) {
  const column = props.columns.find(col => col.key === key);
  return column ? column.label : key;
}

function saveChanges() {
  const dataToEmit = JSON.parse(JSON.stringify(editableData.value));

  if (props.fileKey === 'funcionarios') {
    for (const key of TIMEDELTA_COLUMNS) {
      if (dataToEmit.hasOwnProperty(key)) {
        dataToEmit[key] = hoursToTimedeltaString(parseFloat(dataToEmit[key]));
      }
    }
  }

  emit('update:rowData', dataToEmit);
  closeDrawer();
}

defineExpose({ openDrawer, closeDrawer });
</script>