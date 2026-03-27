<template>
  <div id="Sidebar">
    <div id="Sidebar Desktop"
      :class="['fixed inset-y-0 z-50 flex flex-col transition-all duration-300', sidebarStore.isSidebarMinimized ? 'w-20 overflow-hidden' : 'w-60', 'lg:flex hidden']">
      <div class="flex grow flex-col gap-y-4 overflow-y-auto bg-[#003965] px-5 custom-scrollbar">
        <div class="flex py-4 shrink-0 items-center justify-center">
          <img v-if="!sidebarStore.isSidebarMinimized" @click="goBack" class="h-14 w-auto cursor-pointer"
            src="../../assets/images/logo-horinzontal.png" alt="Your Company" />
          <img v-if="sidebarStore.isSidebarMinimized" @click="goBack" class="h-16 w-auto cursor-pointer"
            src="../../assets/images/logo.png" alt="Your Company" />
        </div>

        <nav class="flex flex-1 flex-col">
          <div
            :class="['flex w-full items-center justify-end', sidebarStore.isSidebarMinimized ? '-translate-x-1' : '']">
            <div @click="sidebarStore.toggleSidebar"
              class="p-1 my-1 cursor-pointer hover:bg-white/30 rounded-[10px] transition-all duration-200">
              <Bars3Icon
                :class="['w-5 h-auto stroke-white transition-transform', sidebarStore.isSidebarMinimized ? 'rotate-180' : '']" />
            </div>
          </div>

          <ul role="list" class="flex flex-1 flex-col gap-y-5">
            <li id="lista-desktop">
              <ul role="list" class="-mx-3 grid gap-1">
                <li v-for="item in filteredNavigation" :title="hoverTxt(item.name)" :key="item.name"
                  class="cursor-pointer">
                  <!-- If item has children, render as expandable -->
                  <div v-if="item.children" class="relative">
                    <div
                      class="group flex gap-x-3 rounded-[10px] p-1.5 text-15 font-semibold leading-6 text-white hover:bg-white/30 cursor-pointer select-none"
                      :class="{ 'justify-center': sidebarStore.isSidebarMinimized }" @click="toggleCalcMenu">
                      <component :is="item.icon" class="h-auto w-6 shrink-0 stroke-white" aria-hidden="true" />
                      <span :class="sidebarStore.isSidebarMinimized ? 'hidden' : 'whitespace-nowrap'">{{ item.name
                        }}</span>
                      <ChevronDownIcon
                        :class="['w-4 h-auto ml-auto transition-transform', isCalcMenuOpen ? 'rotate-180' : '', sidebarStore.isSidebarMinimized ? 'hidden' : '']" />
                    </div>
                    <TransitionRoot as="template" :show="isCalcMenuOpen && !sidebarStore.isSidebarMinimized">
                      <ul class="ml-5 mt-1 space-y-0.5 relative z-40">
                        <li v-for="child in item.children" :title="hoverTxt(child.name)" :key="child.name">
                          <div @click="selectRoute(child)"
                            class="group flex gap-x-2 rounded-[10px] p-1 text-13 font-medium leading-5 transition-all duration-200"
                            :class="{ 'bg-white/30 text-white': $route.path === child.route, 'hover:bg-white/30 hover:text-white text-white': $route.path !== child.route }">
                            <component :is="child.icon" class="h-auto w-4 shrink-0 stroke-white" aria-hidden="true" />
                            <span class="text-13">{{ child.name }}</span>
                          </div>
                        </li>
                      </ul>
                    </TransitionRoot>
                  </div>
                  <!-- Otherwise, render as normal link -->
                  <router-link v-else :to="item.route"
                    class="group flex gap-x-3 rounded-[10px] p-1.5 text-15 font-semibold leading-6 transition-all duration-200"
                    :class="{
                      'bg-white/30 text-white': $route.path === item.route,
                      'hover:bg-white/30 hover:text-white text-white': $route.path !== item.route,
                      'justify-center': sidebarStore.isSidebarMinimized
                    }">
                    <component :is="item.icon" class="h-auto w-6 shrink-0 stroke-white" aria-hidden="true" />
                    <span :class="sidebarStore.isSidebarMinimized ? 'hidden' : ''">{{ item.name }}</span>
                  </router-link>
                </li>
              </ul>
            </li>
            
            <!-- Barra inferior da sidebar -->
            <li class="-mx-6 mt-auto" v-if="showConfigLink">
              <!-- Menu de opções do perfil -->
              <TransitionRoot as="template" :show="isProfileMenuOpen && !sidebarStore.isSidebarMinimized">
                <TransitionChild as="div" enter="transition ease-out duration-200" enter-from="opacity-0 translate-y-4"
                  enter-to="opacity-100 translate-y-0" leave="transition ease-in duration-150"
                  leave-from="opacity-100 translate-y-0" leave-to="opacity-0 translate-y-4">
                  <div
                    class="flex flex-col mt-2 space-y-2 bg-gray-800 rounded-[10px] shadow-lg text-white py-2 px-4 relative z-50">
                    <router-link to="/user/config"
                      class="flex flex-row items-center gap-2 text-15 hover:text-gray-300 transition">
                      <PencilIcon class="w-4 h-auto" />
                      Acessar Perfil
                    </router-link>
                    <button
                      class="flex flex-row items-center gap-2 text-15 w-full text-left hover:text-gray-300 transition"
                      @click="logout">
                      <PowerIcon class="w-4 h-auto" />
                      Deslogar
                    </button>
                  </div>
                </TransitionChild>
              </TransitionRoot>
              <div
                class="flex items-center gap-2 px-4 py-2.5 text-15 font-semibold leading-6 text-white cursor-pointer hover:bg-gray-800 relative z-50"
                :class="{ 'justify-center px-2': sidebarStore.isSidebarMinimized, 'bg-gray-800' : isProfileMenuOpen }" @click="toggleProfileMenu">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                  :class="sidebarStore.isSidebarMinimized ? 'w-6 h-auto' : 'w-10 h-auto'" class="text-white">
                  <path fill-rule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    clip-rule="evenodd" />
                </svg>
                <span :class="sidebarStore.isSidebarMinimized ? 'hidden' : ''">
                  {{ userName || 'Carregando...' }}
                </span>
                <ChevronUpIcon
                  :class="[isProfileMenuOpen ? 'rotate-180' : '', sidebarStore.isSidebarMinimized ? 'hidden' : '']"
                  class="w-5 h-auto transition-transform" />
              </div>

              
            </li>

          </ul>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionChild, TransitionRoot } from '@headlessui/vue'
import {
  AcademicCapIcon,
  Bars3Icon,
  BriefcaseIcon,
  CalculatorIcon,
  CalendarDaysIcon, CalendarIcon,
  ChartBarIcon,
  ChartBarSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleStackIcon,
  DocumentCheckIcon,
  DocumentTextIcon,
  ExclamationCircleIcon, InboxIcon,
  PencilIcon,
  PowerIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
  RectangleStackIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { apiClient } from '@/service/apiService'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserType, clearUserType } from '@/service/userType'
import { useSidebarStore } from '@/stores/sidebarStore'
import MobileSidebar from './MobileSidebar.vue'

const hoverTxt = (hoveredText) => {
  const nameDict = {
    "Dashboard" : "Painel com informações sobre a última gratificação",
    "Novo Cálculo" : "Criar novo cálculo",
    "Listar Cálculos" : "Lista todos os cálculos existentes",
    "Publicar Cálculo" : "Promover um cálculo finalizado para versão ativa",
    "Versões Publicadas" : "Versões ativas disponíveis",
    "Recursos" : "Painel de recursos",
    "Permissões de Acesso" : "Painel de controle de usuários",
    "Detalhes do Cálculo" : "Expandir para ver o detalhamento do cálculo ativo"
    
  };
  return nameDict[hoveredText] || hoveredText;
}
const sidebarStore = useSidebarStore()
const routes = {
  'admin': [
    { name: 'Dashboard', route: '/calculus/dashboard', icon: Squares2X2Icon, current: false },
    { name: 'Novo Cálculo', route: '/calculus/create', icon: CalculatorIcon, current: false },
    { name: 'Listar Cálculos', route: '/calculus/previousresults', icon: ChartBarIcon, current: false },
    { name: 'Publicar Cálculo', route: '/calculus/alloc', icon: RectangleStackIcon, current: false },
    { name: 'Versões Publicadas', route: '/calculus/dataversions', icon: CircleStackIcon, current: false },
    { name: 'Recursos', route: '/resource', icon: ExclamationCircleIcon, current: false },
    { name: 'Permissões de Acesso', route: '/user/permissionsaccess', icon: UsersIcon , current: false },
    { name: 'Detalhes do Cálculo', icon: RectangleStackIcon,
      children: [        
        { name: 'Resultados IDEM', id: 'Results', icon: CalculatorIcon, current: false },
        { name: 'Calendario Escolar', id: 'Calendar', icon: CalendarIcon, current: false },
        { name: 'Profissionais', id: 'Profissional', icon: UsersIcon, current: false },
        { name: 'Turmas', id: 'Groups', icon: UserGroupIcon, current: false },
        { name: 'Etapas Ues', id: 'Steps', icon: Square3Stack3DIcon, current: false },
        { name: 'Etapas Por Grupo', id: 'StageGroup', icon: RectangleGroupIcon, current: false },
        { name: 'Frequência', id: 'Frequency', icon: ChartBarSquareIcon, current: false },
        { name: 'Demissão', id: 'Resignation', icon: BriefcaseIcon, current: false },
        { name: 'Atividades', id: 'Activities', icon: DocumentCheckIcon, current: false },
        { name: 'Tempo de Atuação', id: 'Service', icon: CalendarDaysIcon, current: false },
        { name: 'Formação', id: 'Training', icon: AcademicCapIcon, current: false },
        { name: 'Relatórios Finais', id: 'Report', icon: DocumentTextIcon, current: false },
      ]
    }
  ],
  'user': [
    { name: 'Resultados', route: '/user/rewards', icon: ChartBarIcon, current: true },
    { name: 'Recurso', route: '/resource/form/status', icon: InboxIcon, current: false },
    { name: 'FAQ', route: '/user/faqs', icon: QuestionMarkCircleIcon, current: false },
  ],
}

const props = defineProps({
  route: {
      type: String,
      default: ''
  },
})
const mobileSidebarOpen = ref(false)
const userName = ref('')  // Variável para armazenar o nome do usuário

// Função para emitir ou redirecionar a rota dos componentes filhos
function selectRoute(route) {
  if (route.id) {
    sidebarStore.setReportPage(route.id)
  } 
  if(router.currentRoute.value.name != 'report'){
    router.push({name: 'report'})
  }
}

// Função para capitalizar palavras
function capitalizeWords(str) {
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

// Função para buscar o nome do usuário
async function fetchUserName() {
  try {
    const token = localStorage.getItem('accessToken'); // Recupere o token armazenado no localStorage

    if (!token) {
      console.error('Token de acesso não encontrado. O usuário pode não estar autenticado.');
      userName.value = 'Usuário não autenticado';
      return;
    }

    // Requisição com token no header
    apiClient.get('/auth/user-info/', {
      headers: {
        'Authorization': `Bearer ${token}`  // Corrigir o nome do token para "accessToken"
      }
    })
    .then(response => {

      // Verifica se os dados foram retornados corretamente
      if (response.data && response.data.first_name && response.data.last_name) {
        const firstName = response.data.first_name.charAt(0).toUpperCase() + response.data.first_name.slice(1).toLowerCase();
        const lastName = capitalizeWords(response.data.last_name);
        userName.value = `${firstName} ${lastName}`;
      } else {
        console.warn('Resposta inesperada:', response.data);
        userName.value = 'Usuário não encontrado';
      }
    })
    .catch(error => {
      console.error('Erro ao buscar os dados do usuário:', error);
      userName.value = 'Erro ao carregar';
    });

  } catch (error) {
    console.error('Erro ao buscar os dados do usuário:', error);
    userName.value = 'Erro ao carregar';
  }
}


// Executa a função ao montar o componente
onMounted(() => {
  fetchUserName()
})

const filteredNavigation = computed(() => {
  const userType = getUserType();
  
  // If no user type is stored, default to user navigation
  if (!userType) {
    return routes['user'] || [];
  }
  
  // Return appropriate navigation based on user type
  if (userType === 'admin') {
    // For admin users, show both admin and admin-panel routes
    const adminRoutes = [...(routes['admin'] || []), ...(routes['admin-panel'] || [])];
    return adminRoutes;
  } else {
    // For regular users, show only user routes
    return routes['user'] || [];
  }
})

const route = useRoute(); 
const hiddenRoutes = [];

const showConfigLink = computed(() => !hiddenRoutes.includes(route.path));
const isProfileMenuOpen = ref(false)
const isCalcMenuOpen = ref(false)

const toggleProfileMenu = () => {
    isProfileMenuOpen.value = !isProfileMenuOpen.value
}

// Nova função específica para o menu de cálculo
const toggleCalcMenu = () => {
    isCalcMenuOpen.value = !isCalcMenuOpen.value
}

function logout() {
    // Remove os itens do localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');
    clearUserType(); // Clear the user type from the service

    window.location.href = '/';
}

const router = useRouter();
function goBack() {
  router.push({name: 'home'});
}

watch(() => sidebarStore.isSidebarMinimized, (minimized) => {
  if (minimized) {
    isProfileMenuOpen.value = false
    isCalcMenuOpen.value = false
  }
})

</script>

<style scoped>
/* Scrollbar minimalista para a sidebar principal */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
  overflow-x: hidden; /* Remove scroll horizontal */
}

.custom-scrollbar::-webkit-scrollbar {
  width: 2px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 1px;
  transition: background-color 0.3s ease;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.25);
}

/* Oculta especificamente a scrollbar horizontal */
.custom-scrollbar::-webkit-scrollbar:horizontal {
  display: none;
}

/* Para navegadores Firefox */
@supports (scrollbar-width: thin) {
  .custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
    overflow-x: hidden; /* Remove scroll horizontal */
  }
}
</style>