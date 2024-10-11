<template>
  <div class="px-4 sm:px-2 lg:px-4 w-full">
    <div class="mt-6 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <table class="min-w-full divide-y divide-gray-300 bg-primary-900 rounded-t-md shadow-md">

            <thead>
              <tr>
                <th v-for="column in filteredColumns" :key="column.key" scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-3 whitespace-nowrap break-words">
                  {{ column.label }}
                </th>

                <th v-if="showEdit" scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr v-for="person in visiblePeople" :key="person.matricula" class="even:bg-gray-50">
                <td v-for="column in filteredColumns" :key="column.key" class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-3">
                  {{ person[column.key] }}
                </td>

                <td v-if="showEdit" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                  <a href="#" @click.prevent="openDrawer(person)" class="text-indigo-600 hover:text-indigo-900">
                    Edit<span class="sr-only">, {{ person }}</span>
                  </a>
                </td>

                <td v-if="showGr" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                  <RouterLink to="/admin/rewards" class="text-indigo-600 hover:text-indigo-900" @click.prevent="saveRowData(person)">
                    <EyeIcon class="w-5 h-5" />
                    <span class="sr-only">Visualização da Gratificação</span>
                  </RouterLink>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="isLoading" class="flex justify-center mt-4">
            <Loading />
          </div>

        </div>
      </div>
    </div>

    <Pagination
      :currentPage="currentPage"
      :totalPages="totalPages"
      @update:currentPage="currentPage = $event"
    />

  </div>

  <Drawer ref="drawerRef" :title="drawerTitle" v-model:rowData="selectedRowData" :columns="filteredColumns" @update:rowData="updateRowData" @drawer-closed="handleDrawerClosed" />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { EyeIcon } from "@heroicons/vue/24/outline";
import { debounce } from 'lodash';
import Drawer from '../Drawer/Drawer.vue';
import Pagination from '../Pagination/Pagination.vue';
import Loading from '../Loading/Loading.vue';
import usePersonService from '@/service/personService.js';


const props = defineProps({
  route: {
    type: String,
    required: true
  },
  searchQuery: {
    type: String,
    default: ''
  }
});

const itemsPerPage = 10;
const currentPage = ref(1);
const filteredColumns = ref([]);
const filteredPeople = ref([]);
const visiblePeople = ref([]);
const selectedRowData = ref({});
const isLoading = ref(false); 
const savedRowData = ref({}); 

const drawerRef = ref(null); 

const { loadPeopleData, saveRowDataToStorage } = usePersonService(); 

const drawerTitle = computed(() => {
  const titles = {
    'Results': 'Resultados',
    'Profissional': 'Profissional',
    'Groups': 'Grupos',
    'Steps': 'Etapas',
    'Frequency': 'Frequência',
    'Resignation': 'Demissão',
    'Activities': 'Atividades',
    'Service': 'Serviço',
    'Training': 'Formação',
    'Report': 'Relatório',
  };
  return titles[props.route] || '';
});

const showEdit = computed(() => ['Results', 'Profissional', 'Calendar', 'Groups', 'Steps', 'Frequency', 'Activities', 'Service', 'Training', 'Report'].includes(props.route));
const showGr = computed(() => props.route === 'Report');

const filteredPeopleByQuery = computed(() => {
  if (!props.searchQuery) return filteredPeople.value;

  const query = props.searchQuery.toLowerCase();
  return filteredPeople.value.filter(person =>
    Object.values(person).some(value => String(value).toLowerCase().includes(query))
  );
});

const totalPages = computed(() => Math.ceil(filteredPeopleByQuery.value.length / itemsPerPage));

onMounted(async () => {
  await fetchPeople();
  loadSavedData(); 
});

watch(() => props.searchQuery, debounce(() => {
  currentPage.value = 1; 
  loadMore();
}, 300)); 

watch(currentPage, loadMore);

async function fetchPeople() {
  isLoading.value = true; 
  try {
    const { people, columns } = await loadPeopleData(props.route);
    filteredPeople.value = people;
    filteredColumns.value = columns;
    loadMore(); 
  } catch (error) {
    alert('Erro ao carregar dados. Tente novamente mais tarde.');
  } finally {
    isLoading.value = false;
  }
}

function loadMore() {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  visiblePeople.value = filteredPeopleByQuery.value.slice(start, end);
}

function updateRowData(updatedRowData) {
  const index = filteredPeople.value.findIndex(person => person.matricula === updatedRowData.matricula);
  if (index !== -1) {
    filteredPeople.value[index] = { ...filteredPeople.value[index], ...updatedRowData };
    loadMore(); 
  } else {
    alert("Erro ao atualizar dados: matrícula não encontrada.");
  }
}

function openDrawer(person) {
  selectedRowData.value = { ...person };
  if (drawerRef.value) {
    drawerRef.value.openDrawer(); 
  }
}

function handleDrawerClosed() {
  selectedRowData.value = {}; 
}

async function saveRowData(person) {
  try {
    const matricula = person.matricula;
    const nome = person.Nome;

    let dadosProfissional = [];
    let dadosFrequencia = [];
    let dadosCriterios = [];
    const dadosUser = {}; 

    const responseProfissional = await fetch(routeJsonMapping['Profissional']);
    dadosProfissional = (await responseProfissional.json()).filter(prof => prof.matricula === matricula && prof.Nome === nome);

    const responseFrequencia = await fetch(routeJsonMapping['Frequency']);
    dadosFrequencia = (await responseFrequencia.json()).filter(frequencia => frequencia.Nome === nome);

    const responseCriterios = await fetch(routeJsonMapping['Report']);
    dadosCriterios = (await responseCriterios.json()).filter(criterio => criterio.matricula === matricula && criterio.Nome === nome);

    for (let i = 0; i < dadosCriterios.length; i++) {
      const criterio = dadosCriterios[i];
      const id = `id${i + 1}`;

      const frequenciasFiltradas = dadosFrequencia.filter(frequencia => frequencia.matricula === criterio.matricula);

      dadosUser[id] = {
        dados: criterio,
        frequencia: frequenciasFiltradas,
        profissionais: dadosProfissional,
      };
    }

    const savedRowData = JSON.parse(localStorage.getItem('rowSave')) || {};
    
    if (savedRowData[matricula]) {
      savedRowData[matricula] = { ...savedRowData[matricula], ...dadosUser };
    } else {
      savedRowData[matricula] = dadosUser;
    }

    localStorage.setItem('rowSave', JSON.stringify(savedRowData));
    console.log('Dados salvos:', savedRowData[matricula]);

    alert('Dados salvos com sucesso!');
  } catch (error) {
    alert('Erro ao salvar dados. Tente novamente mais tarde.');
  }
}

function loadSavedData() {
  const savedData = localStorage.getItem('rowSave');
  if (savedData) {
    savedRowData.value = JSON.parse(savedData);
    console.log('Dados salvos carregados:', savedRowData.value);
  }
}
</script>
