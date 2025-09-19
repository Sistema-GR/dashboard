<template>
  <div class="px-0 sm:px-6 lg:px-8 w-full">
    <div class="mt-6 flow-root">
      <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="inline-block min-w-full py-2 align-middle px-8 sm:px-10">
          <table class="min-w-full divide-y divide-gray-300 bg-primary-900 rounded-t-md shadow-md">

            <thead>
              <tr>
                <th v-for="column in filteredColumns" :key="column.key" scope="col" class="py-3.5 pl-4 pr-3 text-left text-15 font-semibold text-white sm:pl-3 whitespace-nowrap break-words">
                  {{ column.label }}
                  <button @click="toggleFilterMenu(column)" class="ml-2 text-white hover:text-gray-700 translate-y-0.5">
                    <svg v-if="sortDirection === 'asc'" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M6 9L12 15L18 9" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M6 15L12 9L18 15" />
                    </svg>
                  </button>
                </th>
                <th v-if="showEdit" scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-3"></th>
              </tr>
            </thead>

            <tbody class="bg-white">
              <tr 
                v-for="person in visiblePeople" 
                :key="person.matricula" 
                class="even:bg-gray-50 hover:bg-indigo-50"
                @mouseenter="isAppealsMode && $emit('show-hover', person.appeal_details, $event)"
                @mouseleave="isAppealsMode && $emit('hide-hover')"
              >
                <td v-for="column in filteredColumns" :key="column.key" class="whitespace-nowrap py-4 pl-4 pr-3 text-15 font-medium text-gray-900 sm:pl-3">
                  {{ column.format ? column.format(person[column.key]) : person[column.key] }}
                </td>

                <td v-if="showEdit" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-15 font-medium sm:pr-3">
                  <a href="#" @click.prevent="openDrawer(person)" class="text-indigo-600 hover:text-indigo-900">
                    Edit<span class="sr-only">, {{ person }}</span>
                  </a>
                </td>

                <td v-if="showGr" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-15 font-medium sm:pr-3">
                  <div class="text-indigo-600 hover:text-indigo-900" @click.prevent="saveRowData(person)">
                    <EyeIcon class="w-5 h-5" />
                    <span class="sr-only">Visualização da Gratificação</span>
                  </div>
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

  <Drawer 
  ref="drawerRef" 
  :title="drawerTitle" 
  v-model:rowData="selectedRowData"
  :columns="columnsForDrawer" 
  @update:rowData="updateRowData" 
  @drawer-closed="handleDrawerClosed" 
  :fileKey="props.fileKey"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { EyeIcon } from "@heroicons/vue/24/outline";
import { debounce } from 'lodash';
import { renameColumns } from '@/service/columnRenaming';
import { useRouter } from 'vue-router';
import { getAccessToken } from '@/service/token';
import axios from 'axios';

import Drawer from '../Drawer/Drawer.vue';
import Pagination from '../Pagination/Pagination.vue';
import Loading from '../Loading/Loading.vue';
import usePersonService from '@/service/personService.js';

const props = defineProps({
  route: {
    type: String,
    required: true
  },
  searchCriteria: {
    type: Object,
    default: () => ({ query: '', column: 'all' })
  },
  isDynamicRoute: {
    type: Boolean,
    default: false
  },
  isViewOnly: {
    type: Boolean,
    default: false
  },
  editableColumns: {
    type: Array,
    default: null
  },
  fileKey: {
    type: String,
    default: ''
  },
  isAppealsMode: {
    type: Boolean,
    default: false,
  },
});



const emit = defineEmits(['row-updated', 'columns-loaded', 'show-hover', 'hide-hover']);

const router = useRouter();
const itemsPerPage = 10;
const currentPage = ref(1);
const filteredColumns = ref([]);
const filteredPeople = ref([]);
const visiblePeople = ref([]);
const selectedRowData = ref({});
const isLoading = ref(false);  
const drawerRef = ref(null); 
const { loadPeopleData } = usePersonService(); 
const sortDirection = ref('asc'); 

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

const showEdit = computed(() => {
  if (props.isViewOnly) {
    return false;
  }
  const editableRoutes = ['Results', 'Profissional', 'Calendar', 'Steps', 'Frequency', 'Activities', 'Service', 'Training', 'StageGroup'];
  return editableRoutes.includes(props.route) || props.isDynamicRoute;
});
const showGr = computed(() => props.route === 'Report');

const filteredPeopleByQuery = computed(() => {
  const { query, column } = props.searchCriteria;

  if (!query) return filteredPeople.value;

  const lowerCaseQuery = query.toLowerCase();

  return filteredPeople.value.filter(person => {
    if (column === 'all') {
      return Object.values(person).some(value => 
        String(value).toLowerCase().includes(lowerCaseQuery)
      );
    } else {
      const cellValue = person[column];
      return cellValue && String(cellValue).toLowerCase().includes(lowerCaseQuery);
    }
  });
});

const totalPages = computed(() => Math.ceil(filteredPeopleByQuery.value.length / itemsPerPage));


onMounted(async () => {
  await fetchPeople();

});

watch(() => props.route, (newRoute) => {
  if (newRoute) {
    fetchPeople();
  }
}, { immediate: true });

watch(() => props.searchCriteria, debounce(() => {
  currentPage.value = 1; 
  loadMore();
}, 300), { deep: true });

watch(currentPage, loadMore);

function toggleFilterMenu(column) {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';

  filteredPeople.value = [...filteredPeople.value].sort((a, b) => {
    const aValue = a[column.key];
    const bValue = b[column.key];

    if (aValue < bValue) return sortDirection.value === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection.value === 'asc' ? 1 : -1;
    return 0;
  });

  loadMore();
}

async function fetchPeople() {
  currentPage.value = 1;
  isLoading.value = true; 
  try {
    let peopleData, columnsData;

    if (props.isDynamicRoute) {
      const token = await getAccessToken();
      const response = await axios.get(`http://127.0.0.1:8000/csv/${props.route}`, {
          headers: { Authorization: `Bearer ${token}` }
      });
      peopleData = response.data;
      if (peopleData && peopleData.length > 0) {
        columnsData = Object.keys(peopleData[0]).filter(key => key !== 'appeal_details');
      } else {
        columnsData = [];
      }
    } else {
      const { people, columns } = await loadPeopleData(props.route);
      peopleData = people;
      columnsData = columns;
    }
    
    if (props.isDynamicRoute) {
      filteredColumns.value = columnsData.map(key => ({
        key: key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ') 
      }));
    } else {
      filteredColumns.value = renameColumns(columnsData, props.route);
    }
    
    emit('columns-loaded', filteredColumns.value);
    filteredPeople.value = peopleData;

    loadMore(); 
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
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

    emit('row-updated', updatedRowData);
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
  const cpfDoUsuario = person.cpf;

  if (!cpfDoUsuario) {
    console.error("CPF não encontrado para a linha selecionada.");
    alert("Não foi possível visualizar os detalhes: CPF ausente.");
    return;
  }

  localStorage.setItem('tempTargetCpf', cpfDoUsuario);

  router.push({
    name: 'admin-view-rewards',
  });
}

const columnsForDrawer = computed(() => {
  if (props.editableColumns) {
    const editableKeys = props.editableColumns.map(c => c.key);
    return filteredColumns.value.filter(c => editableKeys.includes(c.key));
  }
  return filteredColumns.value;
});

</script>