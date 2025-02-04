<template>
  <div>
      <TransitionRoot as="template" :show="sidebarOpen">
          <Dialog class="relative z-50 lg:hidden" @close="sidebarOpen = false">
              <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100" leave-to="opacity-0">
                  <div class="fixed inset-0 bg-gray-900/80" />
              </TransitionChild>

              <div class="fixed inset-0 flex">
                  <TransitionChild as="template" enter="transition ease-in-out duration-300 transform" enter-from="-translate-x-full" enter-to="translate-x-0" leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0" leave-to="-translate-x-full">
                      <DialogPanel class="relative flex w-full max-w-xs flex-1 bg-[#003965]">
                          <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0" enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                              <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                                  <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                                      <span class="sr-only">Close sidebar</span>
                                      <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                                  </button>
                              </div>
                          </TransitionChild>

                          <div class="flex grow flex-col gap-y-5 overflow-y-auto px-6 pb-2 ring-1 ring-white/10">
                              <div class="flex h-16 shrink-0 mt-5 justify-center items-center border-b-2 border-white">
                                  <img class="h-12 w-auto" src="../../assets/images/logo-horinzontal.png" alt="Your Company" />
                              </div>

                              <nav class="flex flex-1 flex-col">
                                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                                      <li>
                                          <ul role="list" class="-mx-2 space-y-1">
                                              <li v-for="item in filteredNavigation" :key="item.name">
                                                  <router-link :to="item.route" :class="[item.current ? 'bg-gray-800 text-white' : 'text-white hover:bg-primary-900 hover:text-white', 'group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6']">
                                                      <component :is="item.icon" class="h-6 w-6 shrink-0" aria-hidden="true" />
                                                      {{ item.name }}
                                                  </router-link>
                                              </li>
                                          </ul>
                                      </li>
                                  </ul>
                              </nav>

                          </div>
                      </DialogPanel>
                  </TransitionChild>
              </div>
          </Dialog>
      </TransitionRoot>

      <div :class="['fixed inset-y-0 z-50 flex flex-col transition-all duration-300', isSidebarMinimized ? 'w-20 overflow-hidden' : 'w-60', 'lg:flex hidden']">
          <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-[#003965] px-6">
              <div class="flex py-5 shrink-0 items-center justify-center border-b border-white">
                  <img v-if="!isSidebarMinimized" class="h-14 w-auto" src="../../assets/images/logo-horinzontal.png" alt="Your Company" />
                  <img v-if="isSidebarMinimized" class="h-14 w-auto" src="../../assets/images/logo.png" alt="Your Company" />
              </div>

              <nav class="flex flex-1 flex-col">
                  <div :class="['flex w-full items-center justify-end', isSidebarMinimized ? '-translate-x-1' : '']">
                      <div @click="toggleSidebar" class="p-1 my-2 cursor-pointer hover:bg-white/30 rounded-lg transition-all duration-200">
                        <Bars3Icon :class="['w-5 h-auto stroke-white transition-transform', isSidebarMinimized ? 'rotate-180' : '']"/>
                      </div>
                  </div>

                  <ul role="list" class="flex flex-1 flex-col gap-y-7">
                      <li>
                          <ul role="list" class="-mx-2 space-y-1">
                              <li v-for="item in filteredNavigation" :key="item.name">
                                  <router-link
                                      :to="item.route"
                                      class="['group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 transition-all duration-200',]"
                                      :class="{ 'bg-white/30 text-white': $route.path === item.route, 'hover:bg-white/30 hover:text-white text-white': $route.path !== item.route }"
                                    >
                                    <component :is="item.icon" class="h-auto w-6 shrink-0 stroke-white" aria-hidden="true" />
                                    <span :class="isSidebarMinimized ? 'hidden' : ''">{{ item.name }}</span>
                                  </router-link>
                              </li>
                          </ul>
                      </li>

                      <li class="-mx-6 mt-auto" v-if="showConfigLink">
                        <div  class="flex items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-white cursor-pointer hover:bg-gray-800" @click="toggleProfileMenu">
                            <img 
                              class="h-8 w-8 rounded-full bg-gray-800" 
                              src="@/assets/images/profile-pattern.png" 
                              alt="" 
                            />
                            <span :class="isSidebarMinimized ? 'hidden' : ''">
                              {{ userName || 'Carregando...' }}
                            </span>
                            <ChevronUpIcon :class="isProfileMenuOpen ? 'rotate-180' : ''" class="w-4 h-auto transition-transform" />
                        </div>

                        <!-- Menu de opções do perfil -->
                        <TransitionRoot as="template" :show="isProfileMenuOpen">
                          <TransitionChild
                            as="div"
                            enter="transition ease-out duration-200"
                            enter-from="opacity-0 translate-y-4"
                            enter-to="opacity-100 translate-y-0"
                            leave="transition ease-in duration-150"
                            leave-from="opacity-100 translate-y-0"
                            leave-to="opacity-0 translate-y-4"
                          >
                            <div class="flex flex-col mt-2 space-y-2 bg-gray-800 rounded-md shadow-lg text-white py-2 px-4">
                              <router-link to="/home/config" class="flex flex-row items-center gap-2 text-sm hover:text-gray-300 transition">
                                <PencilIcon class="w-4 h-auto" /> 
                                Acessar Perfil
                              </router-link>
                              <button class="flex flex-row items-center gap-2 text-sm w-full text-left hover:text-gray-300 transition" @click="logout">
                              <PowerIcon class="w-4 h-auto"/> 
                                Deslogar
                              </button>
                            </div>
                          </TransitionChild>
                        </TransitionRoot>
                      </li>

                  </ul>
              </nav>
          </div>
      </div>

      <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-[#003965] px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button type="button" class="-m-2.5 p-2.5 text-gray-400 lg:hidden" @click="sidebarOpen = true">
          <span class="sr-only">Open sidebar</span>
          <Bars3Icon class="h-6 w-6" aria-hidden="true" />
        </button>

        <div class="flex-1 text-sm font-semibold leading-6 text-white"></div>
        
        <a href="#">
            <span class="sr-only">Your profile</span>
            <img class="h-8 w-8 rounded-full bg-gray-800" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
        </a>
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
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const routes = {
  'admin': [
    { name: 'Novo Cálculo', route: '/home/create/selector', icon: CalculatorIcon, current: false },
    { name: 'Cálculo Anteriores', route: '/home/previousresults', icon: ChartBarIcon, current: false },
    { name: 'Recurso', route: '/resource/new', icon: ExclamationCircleIcon, current: false },
    { name: 'Painel do Usuário', route: '/home/dataversions', icon: CircleStackIcon , current: false },
    { name: 'Selecionar Cálculo', route: '/admin/dashboard', icon: RectangleStackIcon  , current: false },
  ],
  'admin-panel': [
    { name: 'Dashboard', route: '/admin/dashboard', icon: Squares2X2Icon, current: false },
    { name: 'Resultados IDEM', route: '/admin/results', icon: CalculatorIcon, current: false },
    { name: 'Calendario Escolar', route: '/admin/calendar', icon: CalendarIcon  , current: false },
    { name: 'Profissionais', route: '/admin/professional', icon: UsersIcon , current: false },
    { name: 'Turmas', route: '/admin/groups', icon: UserGroupIcon, current: false },
    { name: 'Etapas Ues', route: '/admin/steps', icon: Square3Stack3DIcon , current: false },
    { name: 'Etapas Por Grupo', route: '/admin/stagegroup', icon: RectangleGroupIcon  , current: false },
    { name: 'Frequência', route: '/admin/frequency', icon: ChartBarSquareIcon , current: false },
    { name: 'Demissão', route: '/admin/resignation', icon: BriefcaseIcon , current: false },
    { name: 'Atividades', route: '/admin/activities', icon: DocumentCheckIcon , current: false },
    { name: 'Tempo de Atuação', route: '/admin/service', icon: CalendarDaysIcon , current: false },
    { name: 'Formação', route: '/admin/training', icon: AcademicCapIcon , current: false },
    { name: 'Relatórios Finais', route: '/admin/report', icon: DocumentTextIcon , current: false },
  ],
  'user': [
    { name: 'Resultados', route: '/user/rewards', icon: ChartBarIcon, current: true },
    { name: 'Status', route: '/user/status', icon: InboxIcon  , current: false },
    { name: 'FAq', route: '/user/faqs', icon: QuestionMarkCircleIcon , current: false },
  ],
}

const props = defineProps({
  route: {
    type: String,
    required: true
  }
})

const sidebarOpen = ref(false)
const isSidebarMinimized = ref(false)
const userName = ref('')  // Variável para armazenar o nome do usuário

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
    axios.get('http://127.0.0.1:8000/auth/user-info/', {
      headers: {
        'Authorization': `Bearer ${token}`  // Corrigir o nome do token para "accessToken"
      }
    })
    .then(response => {
      console.log(response.data);

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


const emit = defineEmits(['update:isSidebarMinimized'])

const filteredNavigation = computed(() => {
  return routes[props.route] || []
})

const route = useRoute(); 
const hiddenRoutes = [
      '/admin/dashboard',
      '/admin/results',
      '/admin/calendar',
      '/admin/professional',
      '/admin/groups',
      '/admin/steps',
      '/admin/stagegroup',
      '/admin/frequency',
      '/admin/resignation',
      '/admin/activities',
      '/admin/service',
      '/admin/training',
      '/admin/report/',
      '/admin/rewards/',
];

const showConfigLink = !hiddenRoutes.includes(route.path); 
const isProfileMenuOpen = ref(false)

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

function toggleSidebar() {
  isSidebarMinimized.value = !isSidebarMinimized.value
  emit('update:isSidebarMinimized', isSidebarMinimized.value)
}

function logout() {
    // Remove os itens do localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('isAuthenticated');

    window.location.href = '/';
}

</script>
