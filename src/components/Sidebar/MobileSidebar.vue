<template>
    <!-- ───────────────────────── MOBILE ───────────────────────── -->
    <!-- Topbar mobile -->
    <div class="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-[#003965] px-4 py-3 shadow-md border-b border-white/10">
      <button @click="mobileSidebarOpen = true" class="p-1.5 rounded-lg hover:bg-white/10 transition">
        <Bars3Icon class="w-5 h-5 text-white" />
      </button>
      <img src="../../assets/images/logo-horinzontal.png" class="h-8 w-auto" alt="Logo" />
      <div></div>
    </div>

    <!-- Drawer mobile -->
    <TransitionRoot as="template" :show="mobileSidebarOpen">
      <Dialog class="relative z-50 lg:hidden" @close="mobileSidebarOpen = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
          leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" />
        </TransitionChild>

        <div class="fixed inset-0 flex">
          <TransitionChild
            as="template"
            enter="ease-out duration-300" enter-from="-translate-x-full" enter-to="translate-x-0"
            leave="ease-in duration-200" leave-from="translate-x-0" leave-to="-translate-x-full"
          >
            <DialogPanel class="relative flex w-72 flex-col bg-[#003965] shadow-2xl">

              <!-- Fechar -->
              <div class="absolute right-0 top-0 translate-x-full pt-4 pl-2">
                <button @click="mobileSidebarOpen = false" class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition">
                  <XMarkIcon class="w-4 h-4 text-white" />
                </button>
              </div>

              <div class="flex flex-col h-full overflow-y-auto custom-scrollbar">
                <!-- Logo mobile -->
                <div class="flex items-center justify-center px-5 py-5">
                  <img src="../../assets/images/logo-horinzontal.png" class="h-11 w-auto" alt="Logo" />
                </div>
                <div class="mx-4 h-px bg-white/10 mb-3" />

                <!-- Nav mobile -->
                <nav class="flex-1 px-3">
                  <ul class="space-y-0.5">
                    <li v-for="item in filteredNavigation" :key="item.name">
                      <div v-if="item.children">
                        <button
                          @click="isCalcMenuOpen = !isCalcMenuOpen"
                          class="w-full group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all"
                        >
                          <component :is="item.icon" class="w-5 h-5 shrink-0 stroke-white/70 group-hover:stroke-white" />
                          <span class="flex-1 text-left">{{ item.name }}</span>
                          <ChevronDownIcon :class="['w-4 h-4 stroke-white/40 transition-transform', isCalcMenuOpen ? 'rotate-180' : '']" />
                        </button>
                        <Transition name="submenu">
                          <ul v-if="isCalcMenuOpen" class="mt-0.5 ml-3 pl-3 border-l border-white/10 space-y-0.5">
                            <li v-for="child in item.children" :key="child.name">
                              <button
                                @click="selectRoute(child); mobileSidebarOpen = false"
                                :class="[
                                  'w-full flex items-center gap-2 rounded-lg px-2.5 py-2 text-[12px] font-medium transition-all',
                                  sidebarStore.reportPage === child.id ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/8'
                                ]"
                              >
                                <component :is="child.icon" class="w-3.5 h-3.5 shrink-0" />
                                {{ child.name }}
                              </button>
                            </li>
                          </ul>
                        </Transition>
                      </div>

                      <router-link
                        v-else
                        :to="item.route"
                        @click="mobileSidebarOpen = false"
                        :class="[
                          'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all',
                          $route.path === item.route
                            ? 'bg-white/15 text-white'
                            : 'text-white/75 hover:text-white hover:bg-white/10'
                        ]"
                      >
                        <component :is="item.icon" class="w-5 h-5 shrink-0 stroke-current" />
                        {{ item.name }}
                      </router-link>
                    </li>
                  </ul>
                </nav>

                <div class="flex-1" />
                <div class="mx-4 h-px bg-white/10" />

                <!-- Perfil mobile -->
                <div v-if="showConfigLink" class="px-3 py-3">
                  <Transition name="profile-menu">
                    <div v-if="isProfileMenuOpen" class="mb-2 rounded-xl bg-[#002a4d] border border-white/10 overflow-hidden">
                      <router-link
                        to="/user/rewards"
                        class="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/75 hover:text-white hover:bg-white/8 transition-all"
                      >
                      <DocumentTextIcon class="w-4 h-4 shrink-0" />
                        Painel de gratificação
                      </router-link>
                      <router-link
                        to="/resource/form/status"
                        class="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/75 hover:text-white hover:bg-white/8 transition-all"
                      >
                      <CheckBadgeIcon class="w-4 h-4 shrink-0" />
                        Status do recurso
                      </router-link>
                      <router-link to="/user/config" @click="mobileSidebarOpen = false" class="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/75 hover:text-white hover:bg-white/8 transition-all">
                        <PencilIcon class="w-4 h-4" /> Acessar Perfil
                      </router-link>
                      <div class="mx-3 h-px bg-white/10" />
                      <button @click="logout" class="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/75 hover:text-white hover:bg-white/8 transition-all">
                        <PowerIcon class="w-4 h-4" /> Deslogar
                      </button>
                    </div>
                  </Transition>

                  <button
                    @click="toggleProfileMenu"
                    :class="['w-full flex items-center gap-2.5 rounded-xl p-2 transition-all', isProfileMenuOpen ? 'bg-white/15' : 'hover:bg-white/10']"
                  >
                    <div class="relative shrink-0">
                      <div class="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                        <UserCircleIcon class="w-6 h-6"/>
                      </div>
                      <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#003965]" />
                    </div>
                    <div class="flex-1 text-left overflow-hidden">
                      <p class="text-[13px] font-semibold text-white truncate">{{ userName || 'Carregando...' }}</p>
                      <p class="text-[11px] text-white/40">Online</p>
                    </div>
                    <ChevronUpIcon :class="['w-3.5 h-3.5 stroke-white/40 transition-transform', isProfileMenuOpen ? 'rotate-180' : '']" />
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
  </TransitionRoot>
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
  CheckBadgeIcon,
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
  UserCircleIcon,
  UserGroupIcon,
  UsersIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import { apiClient } from '@/service/apiService'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUserType, clearUserType } from '@/service/userType'
import { useSidebarStore } from '@/stores/sidebarStore'

const sidebarStore = useSidebarStore()
const routes = {
  'admin': [
    { name: 'Dashboard', route: '/calculus/dashboard', icon: Squares2X2Icon, current: false },
    { name: 'Novo Cálculo', route: '/calculus/create', icon: CalculatorIcon, current: false },
    { name: 'Listar Cálculos', route: '/calculus/previousresults', icon: ChartBarIcon, current: false },
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


function logout() {
    // Remove os itens do localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');
    clearUserType(); // Clear the user type from the service

    window.location.href = '/';
}

const router = useRouter();

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