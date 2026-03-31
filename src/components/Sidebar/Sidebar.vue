<template>
  <div id="Sidebar">
    <!-- ───────────────────────── DESKTOP ───────────────────────── -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 hidden lg:flex flex-col transition-all duration-300 ease-in-out',
        sidebarStore.isSidebarMinimized ? 'w-[72px]' : 'w-[240px]'
      ]"
    >
      <div class="relative flex flex-col h-full bg-[#003965] overflow-hidden custom-scrollbar overflow-y-auto">

        <!-- Faixa decorativa topo -->
        <div class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        <!-- Logo -->
        <div class="flex items-center justify-center px-4 py-5 shrink-0">
          <Transition name="logo-fade" mode="out-in">
            <img
              v-if="!sidebarStore.isSidebarMinimized"
              key="logo-full"
              @click="goBack"
              class="h-12 w-auto cursor-pointer transition-opacity"
              src="../../assets/images/logo-horinzontal.png"
              alt="Logo"
            />
            <img
              v-else
              key="logo-icon"
              @click="goBack"
              class="h-12 w-auto cursor-pointer"
              src="../../assets/images/logo.png"
              alt="Logo"
            />
          </Transition>
        </div>

        <!-- Divider -->
        <div class="mx-4 mb-3 h-px bg-white/10" />

        <!-- Toggle button -->
        <div :class="['flex mb-2 px-3', sidebarStore.isSidebarMinimized ? 'justify-center' : 'justify-end']">
          <button
            @click="sidebarStore.toggleSidebar"
            class="group flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/25 transition-all duration-200"
            :title="sidebarStore.isSidebarMinimized ? 'Expandir menu' : 'Recolher menu'"
          >
            <ChevronLeftIcon
              :class="['w-3.5 h-3.5 stroke-white/70 group-hover:stroke-white transition-all duration-300', sidebarStore.isSidebarMinimized ? 'rotate-180' : '']"
            />
          </button>
        </div>

        <!-- Nav items -->
        <nav class="flex-1 px-3">
          <ul class="space-y-0.5">
            <li v-for="item in filteredNavigation" :key="item.name">
              <!-- Item com sub-menu -->
              <div v-if="item.children">
                <button
                  @click="toggleCalcMenu"
                  :title="hoverTxt(item.name)"
                  :class="[
                    'w-full group flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200',
                    sidebarStore.isSidebarMinimized ? 'justify-start' : ''
                  ]"
                >
                  <component :is="item.icon" class="w-5 h-5 shrink-0 stroke-white/70 group-hover:stroke-white transition-colors" />
                  <span v-if="!sidebarStore.isSidebarMinimized" class="flex-1 text-left text-[13px] whitespace-nowrap overflow-hidden">{{ item.name }}</span>
                  <ChevronDownIcon
                    v-if="!sidebarStore.isSidebarMinimized"
                    :class="['w-3.5 h-3.5 stroke-white/50 transition-transform duration-200', isCalcMenuOpen ? 'rotate-180' : '']"
                  />
                </button>

                <!-- Sub-itens -->
                <Transition name="submenu">
                  <ul v-if="isCalcMenuOpen && !sidebarStore.isSidebarMinimized" class="mt-0.5 ml-3 pl-3 border-l border-white/10 space-y-0.5">
                    <li v-for="child in item.children" :key="child.name">
                      <button
                        @click="selectRoute(child)"
                        :title="hoverTxt(child.name)"
                        :class="[
                          'w-full group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-all duration-150',
                          sidebarStore.reportPage === child.id
                            ? 'bg-white/15 text-white'
                            : 'text-white/60 hover:text-white hover:bg-white/8'
                        ]"
                      >
                        <component :is="child.icon" class="w-3.5 h-3.5 shrink-0 stroke-current" />
                        <span class="truncate">{{ child.name }}</span>
                      </button>
                    </li>
                  </ul>
                </Transition>
              </div>

              <!-- Item simples (router-link) -->
              <router-link
                v-else
                :to="item.route"
                :title="hoverTxt(item.name)"
                :class="[
                  'relative group flex items-center gap-3 rounded-xl px-2.5 py-2 text-[13px] font-semibold transition-all duration-200',
                  $route.path === item.route
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-white/75 hover:text-white hover:bg-white/10',
                  sidebarStore.isSidebarMinimized ? 'justify-start' : ''
                ]"
              >
                <!-- Indicador ativo -->
                <span
                  v-if="$route.path === item.route && !sidebarStore.isSidebarMinimized"
                  class="absolute left-0 w-[3px] h-5 rounded-r-full bg-white/80"
                />
                <component
                  :is="item.icon"
                  :class="[
                    'w-5 h-5 shrink-0 transition-colors duration-200',
                    $route.path === item.route ? 'stroke-white' : 'stroke-white/65 group-hover:stroke-white'
                  ]"
                />
                <span v-if="!sidebarStore.isSidebarMinimized" class="whitespace-nowrap overflow-hidden">{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Spacer -->
        <div class="flex-1" />

        <!-- Divider -->
        <div class="mx-4 mt-2 h-px bg-white/10" />

        <!-- Perfil -->
        <div v-if="showConfigLink" class="px-3 py-3">
          <!-- Popup menu perfil -->
          <Transition name="profile-menu">
            <div
              v-if="isProfileMenuOpen && !sidebarStore.isSidebarMinimized"
              class="mb-2 rounded-xl bg-[#002a4d] border border-white/10 shadow-xl overflow-hidden"
            >
              <router-link
                to="/user/config"
                class="flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/75 hover:text-white hover:bg-white/8 transition-all"
              >
                <PencilIcon class="w-4 h-4 shrink-0" />
                Acessar Perfil
              </router-link>
              <div class="mx-3 h-px bg-white/10" />
              <button
                @click="logout"
                class="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] text-white/75 hover:text-white hover:bg-white/8 transition-all"
              >
                <PowerIcon class="w-4 h-4 shrink-0" />
                Deslogar
              </button>
            </div>
          </Transition>

          <!-- Botão perfil -->
          <button
            @click="toggleProfileMenu"
            :class="[
              'w-full group flex items-center gap-2.5 rounded-xl p-2 transition-all duration-200',
              isProfileMenuOpen ? 'bg-white/15' : 'hover:bg-white/10',
              sidebarStore.isSidebarMinimized ? 'justify-center' : ''
            ]"
          >
            <div class="relative shrink-0">
              <div class="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-white/80">
                  <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                </svg>
              </div>
              <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#003965]" />
            </div>
            <div v-if="!sidebarStore.isSidebarMinimized" class="flex-1 text-left overflow-hidden">
              <p class="text-[13px] font-semibold text-white truncate leading-tight">{{ userName || 'Carregando...' }}</p>
              <p class="text-[11px] text-white/40 leading-tight">Online</p>
            </div>
            <ChevronUpIcon
              v-if="!sidebarStore.isSidebarMinimized"
              :class="['w-3.5 h-3.5 stroke-white/40 transition-transform duration-200', isProfileMenuOpen ? 'rotate-180' : '']"
            />
          </button>
        </div>
      </div>
    </aside>

    <!-- ───────────────────────── MOBILE ───────────────────────── -->
    <!-- Topbar mobile -->
    <div class="lg:hidden sticky top-0 z-40 flex items-center justify-between bg-[#003965] px-4 py-3 shadow-md border-b border-white/10">
      <button @click="mobileSidebarOpen = true" class="p-1.5 rounded-lg hover:bg-white/10 transition">
        <Bars3Icon class="w-5 h-5 text-white" />
      </button>
      <img src="../../assets/images/logo-horinzontal.png" class="h-8 w-auto" alt="Logo" />
      <button @click="mobileSidebarOpen = true" class="flex items-center gap-1.5 text-white/70 hover:text-white transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
          <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
        </svg>
      </button>
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
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-white/80">
                          <path fill-rule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clip-rule="evenodd" />
                        </svg>
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
  ChevronLeftIcon,
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

const sidebarStore = useSidebarStore()

const routes = {
  'admin': [
    { name: 'Dashboard', route: '/calculus/dashboard', icon: Squares2X2Icon, current: false },
    { name: 'Novo Cálculo', route: '/calculus/create', icon: CalculatorIcon, current: false },
    { name: 'Listar Cálculos', route: '/calculus/previousresults', icon: ChartBarIcon, current: false },
    { name: 'Publicar Cálculo', route: '/calculus/alloc', icon: RectangleStackIcon, current: false },
    { name: 'Versões Publicadas', route: '/calculus/dataversions', icon: CircleStackIcon, current: false },
    { name: 'Recursos', route: '/resource', icon: ExclamationCircleIcon, current: false },
    { name: 'Permissões de Acesso', route: '/user/permissionsaccess', icon: UsersIcon, current: false },
    {
      name: 'Detalhes do Cálculo', icon: RectangleStackIcon,
      children: [
        { name: 'Resultados IDEM', id: 'Results', icon: CalculatorIcon },
        { name: 'Calendário Escolar', id: 'Calendar', icon: CalendarIcon },
        { name: 'Profissionais', id: 'Profissional', icon: UsersIcon },
        { name: 'Turmas', id: 'Groups', icon: UserGroupIcon },
        { name: 'Etapas Ues', id: 'Steps', icon: Square3Stack3DIcon },
        { name: 'Etapas Por Grupo', id: 'StageGroup', icon: RectangleGroupIcon },
        { name: 'Frequência', id: 'Frequency', icon: ChartBarSquareIcon },
        { name: 'Demissão', id: 'Resignation', icon: BriefcaseIcon },
        { name: 'Atividades', id: 'Activities', icon: DocumentCheckIcon },
        { name: 'Tempo de Atuação', id: 'Service', icon: CalendarDaysIcon },
        { name: 'Formação', id: 'Training', icon: AcademicCapIcon },
        { name: 'Relatórios Finais', id: 'Report', icon: DocumentTextIcon },
      ]
    }
  ],
  'user': [
    { name: 'Resultados', route: '/user/rewards', icon: ChartBarIcon, current: true },
    { name: 'Recurso', route: '/resource/form/status', icon: InboxIcon, current: false },
    { name: 'FAQ', route: '/user/faqs', icon: QuestionMarkCircleIcon, current: false },
  ],
}

const hoverTxt = (name) => {
  const dict = {
    'Dashboard': 'Painel com informações sobre a última gratificação',
    'Novo Cálculo': 'Criar novo cálculo',
    'Listar Cálculos': 'Lista todos os cálculos existentes',
    'Publicar Cálculo': 'Promover um cálculo finalizado para versão ativa',
    'Versões Publicadas': 'Versões ativas disponíveis',
    'Recursos': 'Painel de recursos',
    'Permissões de Acesso': 'Painel de controle de usuários',
    'Detalhes do Cálculo': 'Expandir para ver o detalhamento do cálculo ativo',
  }
  return dict[name] || name
}

const props = defineProps({ route: { type: String, default: '' } })

const mobileSidebarOpen = ref(false)
const userName = ref('')
const isProfileMenuOpen = ref(false)
const isCalcMenuOpen = ref(false)

function selectRoute(child) {
  if (child.id) sidebarStore.setReportPage(child.id)
  if (router.currentRoute.value.name !== 'report') router.push({ name: 'report' })
}

function capitalizeWords(str) {
  return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
}

async function fetchUserName() {
  try {
    const token = localStorage.getItem('accessToken')
    if (!token) { userName.value = 'Usuário não autenticado'; return }
    apiClient.get('/auth/user-info/', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data?.first_name && res.data?.last_name) {
          const first = res.data.first_name.charAt(0).toUpperCase() + res.data.first_name.slice(1).toLowerCase()
          userName.value = `${first} ${capitalizeWords(res.data.last_name)}`
        } else {
          userName.value = 'Usuário não encontrado'
        }
      })
      .catch(() => { userName.value = 'Erro ao carregar' })
  } catch {
    userName.value = 'Erro ao carregar'
  }
}

onMounted(fetchUserName)

const filteredNavigation = computed(() => {
  const userType = getUserType()
  if (!userType) return routes['user'] || []
  if (userType === 'admin') return [...(routes['admin'] || []), ...(routes['admin-panel'] || [])]
  return routes['user'] || []
})

const route = useRoute()
const router = useRouter()
const showConfigLink = computed(() => ![].includes(route.path))

const toggleProfileMenu = () => { isProfileMenuOpen.value = !isProfileMenuOpen.value }
const toggleCalcMenu = () => { isCalcMenuOpen.value = !isCalcMenuOpen.value }

function logout() {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('isAuthenticated')
  clearUserType()
  window.location.href = '/'
}

function goBack() { router.push({ name: 'home' }) }

watch(() => sidebarStore.isSidebarMinimized, (minimized) => {
  if (minimized) { isProfileMenuOpen.value = false; isCalcMenuOpen.value = false }
})
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.08) transparent;
  overflow-x: hidden;
}
.custom-scrollbar::-webkit-scrollbar { width: 2px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(255,255,255,0.12); border-radius: 2px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(255,255,255,0.22); }
.custom-scrollbar::-webkit-scrollbar:horizontal { display: none; }

.logo-fade-enter-active, .logo-fade-leave-active { transition: opacity 0.15s ease; }
.logo-fade-enter-from, .logo-fade-leave-to { opacity: 0; }

.submenu-enter-active { transition: all 0.2s ease-out; }
.submenu-leave-active { transition: all 0.15s ease-in; }
.submenu-enter-from, .submenu-leave-to { opacity: 0; transform: translateY(-6px); }

.profile-menu-enter-active { transition: all 0.2s ease-out; }
.profile-menu-leave-active { transition: all 0.15s ease-in; }
.profile-menu-enter-from, .profile-menu-leave-to { opacity: 0; transform: translateY(6px); }
</style>