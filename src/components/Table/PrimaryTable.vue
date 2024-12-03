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
                  {{ column.format ? column.format(person[column.key]) : person[column.key] }}
                </td>

                <td v-if="showEdit" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
                  <a href="#" @click.prevent="openDrawer(person)" class="text-indigo-600 hover:text-indigo-900">
                    Edit<span class="sr-only">, {{ person }}</span>
                  </a>
                </td>

                <td v-if="showGr" class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3">
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

  <Drawer ref="drawerRef" :title="drawerTitle" v-model:rowData="selectedRowData" :columns="filteredColumns" @update:rowData="updateRowData" @drawer-closed="handleDrawerClosed" />
</template>

<script setup>
import { getAccessToken } from '../../service/token';
import { ref, computed, watch, onMounted } from 'vue';
import { EyeIcon } from "@heroicons/vue/24/outline";
import { debounce } from 'lodash';
import { renameColumns } from '@/service/columnRenaming';
import { useRouter, onBeforeRouteLeave  } from 'vue-router';
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

const router = useRouter();
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

const showEdit = computed(() => ['Results', 'Profissional', 'Calendar', 'Steps', 'Frequency', 'Activities', 'Service', 'Training',].includes(props.route));
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
    filteredColumns.value = renameColumns(columns, props.route);
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
    isLoading.value = true;  // Exibe o loading

    const { routeJsonMapping } = usePersonService();  
    const cpf = person.cpf; // Usando CPF como identificador único

    // Obtém o token de acesso (garante que o token é válido ou renovado)
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Não foi possível obter um token válido.');
    }

    let dadosProfissional = [];
    let dadosFrequencia = [];
    let dadosCriterios = [];
    const dadosUser = {}; 

    // Cabeçalho com autenticação
    const headers = {
      'Authorization': `Bearer ${token}`, // Adiciona o token no cabeçalho
      'Content-Type': 'application/json',
    };

    // Carrega os dados de Profissionais filtrados pelo CPF
    const responseProfissional = await fetch(routeJsonMapping['Profissional'], { headers });
    const responseProfissionalData = await responseProfissional.json();
    dadosProfissional = Array.isArray(responseProfissionalData) ? responseProfissionalData.filter(prof => prof.cpf === cpf) : [];

    // Carrega os dados de Frequência filtrados pelo CPF
    const responseFrequencia = await fetch(routeJsonMapping['Frequency'], { headers });
    const responseFrequenciaData = await responseFrequencia.json();
    dadosFrequencia = Array.isArray(responseFrequenciaData) ? responseFrequenciaData.filter(frequencia => frequencia.cpf === cpf) : [];

    // Carrega os dados de Critérios filtrados pelo CPF
    const responseCriterios = await fetch(routeJsonMapping['Report'], { headers });
    const responseCriteriosData = await responseCriterios.json();
    dadosCriterios = Array.isArray(responseCriteriosData) ? responseCriteriosData.filter(criterio => criterio.cpf === cpf) : [];

    // Processa os critérios e organiza os dados para salvar
    for (let i = 0; i < dadosCriterios.length; i++) {
      const criterio = dadosCriterios[i];
      const id = `id${i + 1}`;

      // Filtra as frequências associadas ao CPF
      const frequenciasFiltradas = dadosFrequencia.filter(frequencia => frequencia.cpf === criterio.cpf);

      // Monta o objeto com as informações de critérios, frequências e profissionais
      dadosUser[id] = {
        dados: criterio,
        frequencia: frequenciasFiltradas,
        profissionais: dadosProfissional,
      };
    }

    // Carrega dados já salvos no localStorage ou inicia um objeto vazio
    const savedRowData = JSON.parse(localStorage.getItem('rowSave')) || {};

    // Se já existir uma entrada para o CPF, faz um merge dos dados
    if (savedRowData[cpf]) {
      savedRowData[cpf] = { ...savedRowData[cpf], ...dadosUser };
    } else {
      savedRowData[cpf] = dadosUser;
    }

    // Salva os dados no localStorage usando o CPF como chave
    localStorage.setItem('rowSave', JSON.stringify(savedRowData));
    console.log('Dados salvos:', savedRowData[cpf]);

    // Esconde o loading após salvar os dados
    isLoading.value = false;

    // Redireciona para a página de "Rewards" após o carregamento dos dados
    router.push({ path: '/admin/rewards' });

  } catch (error) {
    // Esconde o loading em caso de erro
    isLoading.value = false;
    console.error('Erro ao salvar os dados:', error);
    alert(`Erro ao salvar dados: ${error.message}`);
  }
}



onBeforeRouteLeave((to, from, next) => {
  // Verifica se a rota atual é a de Rewards
  if (from.path === '/admin/rewards') {
    // Limpa os dados salvos no localStorage ao sair da rota
    localStorage.removeItem('rowSave');
    console.log('Dados salvos descartados ao sair da página de Rewards.');
  }
  next(); // Continue a navegação
});

function loadSavedData() {
  const savedData = localStorage.getItem('rowSave');
  if (savedData) {
    savedRowData.value = JSON.parse(savedData);
    console.log('Dados salvos carregados:', savedRowData.value);
  }
}
</script>
