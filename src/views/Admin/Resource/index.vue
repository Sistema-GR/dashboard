<template>
  <Whiteboard title="Recurso" class="!overflow-visible overflow-y-auto z-40 relative">

    <!-- Header -->
    <div class="flex items-center justify-between flex-wrap gap-3 py-6 px-10">
      <div>
        <h1 class="text-xl font-semibold text-[#1a1a1a] leading-tight">Recursos</h1>
        <p class="text-xs text-gray-500 mt-0.5">Gestão de recursos e respostas</p>
      </div>
      <div class="flex items-center gap-2 flex-wrap">
        <button v-if="isAdmin" @click="navigateToTemplateBuilder" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80 bg-red-400/10 text-red-600 border-red-500/35">
          <PlusIcon class="w-3.5 h-3.5" />
          Criar template
        </button>
        <button @click="navigateToAnnualReports" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80 bg-blue-400/10 text-[#3459a2] border-blue-500/35">
          <ChartPieIcon class="w-3.5 h-3.5" />
          Relatórios anuais
        </button>
        <button v-if="isAdmin"@click="navigateToVersionManager" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80 bg-green-400/10 text-green-600 border-green-500/35">
          <DocumentDuplicateIcon class="w-3.5 h-3.5" />
          Gerenciar Versões
        </button>
        <button
          @click="openBatchModal"
          :disabled="!pendingLote || isLoadingLote"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80 bg-amber-400/10 text-amber-600 border-amber-500/35 disabled:opacity-40 disabled:cursor-not-allowed"
          :class="{ 'opacity-40 cursor-not-allowed': !pendingLote || isLoadingLote }"
        >
          <PaperAirplaneIcon class="w-3.5 h-3.5" />
          <span v-if="isLoadingLote">Verificando...</span>
          <span v-else-if="pendingLote">
            Lançar lote
            <span class="bg-amber-500 text-white text-[11px] font-semibold py-px px-1.5 rounded-full ml-0.5">{{ pendingLote.numero_recursos }}</span>
          </span>
          <span v-else>Sem lote pendente</span>
        </button>
        <button v-if="isAdmin" @click="openLimitConfig" class="inline-flex items-center gap-1.5 px-1.5 py-1.5 rounded-lg text-xs font-medium border transition-opacity hover:opacity-80 bg-gray-100 text-gray-600 border-gray-300" title="Configurações">
          <Cog6ToothIcon class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>

    <!-- Cards de status -->
    <div class="pt-2 pb-4 px-10">
      <div class="grid grid-cols-5 gap-2.5 max-[900px]:grid-cols-2">
        <!-- Todos -->
        <div
          class="bg-white border rounded-xl py-3.5 px-4 cursor-pointer transition-all hover:border-gray-300 hover:shadow-sm"
          :class="selectedStatus === '' ? 'border-gray-500' : 'border-gray-200'"
          @click="setStatusFilter('')"
        >
          <div class="text-[11px] font-medium uppercase tracking-wide mb-1.5" :class="selectedStatus === '' ? 'text-gray-500' : 'text-gray-400'">Todos</div>
          <div class="text-2xl font-semibold leading-none" :class="selectedStatus === '' ? 'text-gray-700' : 'text-gray-500'">{{ recursos.length }}</div>
        </div>

        <!-- Aguardando resposta (Azul) -->
        <div
          class="bg-white border rounded-xl py-3.5 px-4 cursor-pointer transition-all hover:border-blue-300 hover:shadow-sm"
          :class="selectedStatus === 'aguardando_resposta' ? 'border-blue-600' : 'border-blue-200'"
          @click="setStatusFilter('aguardando_resposta')"
        >
          <div class="text-[11px] font-medium uppercase tracking-wide mb-1.5" :class="selectedStatus === 'aguardando_resposta' ? 'text-blue-600' : 'text-blue-400'">Aguardando resposta</div>
          <div class="text-2xl font-semibold leading-none" :class="selectedStatus === 'aguardando_resposta' ? 'text-blue-700' : 'text-blue-500'">{{ countByStatus('aguardando_resposta') }}</div>
        </div>

        <!-- Análise pendente (Âmbar/Amarelo) -->
        <div
          class="bg-white border rounded-xl py-3.5 px-4 cursor-pointer transition-all hover:border-amber-300 hover:shadow-sm"
          :class="selectedStatus === 'analise_pendente' ? 'border-amber-600' : 'border-amber-200'"
          @click="setStatusFilter('analise_pendente')"
        >
          <div class="text-[11px] font-medium uppercase tracking-wide mb-1.5" :class="selectedStatus === 'analise_pendente' ? 'text-amber-600' : 'text-amber-400'">Análise pendente</div>
          <div class="text-2xl font-semibold leading-none" :class="selectedStatus === 'analise_pendente' ? 'text-amber-700' : 'text-amber-500'">{{ countByStatus('analise_pendente') }}</div>
        </div>

        <!-- Aguardando envio (Roxo) -->
        <div
          class="bg-white border rounded-xl py-3.5 px-4 cursor-pointer transition-all hover:border-purple-300 hover:shadow-sm"
          :class="selectedStatus === 'aguardando_envio' ? 'border-purple-600' : 'border-purple-200'"
          @click="setStatusFilter('aguardando_envio')"
        >
          <div class="text-[11px] font-medium uppercase tracking-wide mb-1.5" :class="selectedStatus === 'aguardando_envio' ? 'text-purple-600' : 'text-purple-400'">Aguardando envio</div>
          <div class="text-2xl font-semibold leading-none" :class="selectedStatus === 'aguardando_envio' ? 'text-purple-700' : 'text-purple-500'">{{ countByStatus('aguardando_envio') }}</div>
        </div>

        <!-- Respondido (Laranja) -->
        <div
          class="bg-white border rounded-xl py-3.5 px-4 cursor-pointer transition-all hover:border-orange-300 hover:shadow-sm"
          :class="selectedStatus === 'respondido' ? 'border-orange-600' : 'border-orange-200'"
          @click="setStatusFilter('respondido')"
        >
          <div class="text-[11px] font-medium uppercase tracking-wide mb-1.5" :class="selectedStatus === 'respondido' ? 'text-orange-600' : 'text-orange-400'">Respondido</div>
          <div class="text-2xl font-semibold leading-none" :class="selectedStatus === 'respondido' ? 'text-orange-700' : 'text-orange-500'">{{ countByStatus('respondido') }}</div>
        </div>
      </div>
    </div>

    <!-- Filtros -->
    <div class="grid grid-cols-2 gap-2.5 px-10 pb-4 max-[640px]:grid-cols-1">
      <div class="bg-white border border-gray-200 rounded-lg py-2 px-3.5 flex items-center gap-2">
        <FilterIcon class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <label class="text-xs text-gray-400 whitespace-nowrap">Motivo</label>
        <select v-model="filterMotivo" class="flex-1 border-none bg-transparent text-xs text-gray-700 outline-none cursor-pointer">
          <option value="">Todos os motivos</option>
          <option v-for="motivo in MOTIVOS_RECURSO" :key="motivo.text" :value="motivo.text">
            {{ motivo.text }}
          </option>
        </select>
      </div>
      <div class="bg-white border border-gray-200 rounded-lg py-2 px-3.5 flex items-center gap-2">
        <UserIcon class="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
        <label class="text-xs text-gray-400 whitespace-nowrap">Responsável</label>
        <select v-model="filterResponsavel" class="flex-1 border-none bg-transparent text-xs text-gray-700 outline-none cursor-pointer">
          <option value="">Todos os responsáveis</option>
          <option v-for="staff in staffList" :key="staff.id" :value="staff.id">
            {{ staff.full_name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Cabeçalho da lista -->
    <div v-if="activeStatusStyle.label" class="flex items-center gap-2.5 pt-0 pb-2.5 px-10">
      <span class="inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-medium border" :class="{
        'bg-blue-900/10 text-blue-800 border-blue-800/25': activeStatusStyle.colorKey === 'blue',
        'bg-orange-500/10 text-amber-800 border-amber-600/25': activeStatusStyle.colorKey === 'orange',
        'bg-purple-500/10 text-purple-700 border-purple-600/25': activeStatusStyle.colorKey === 'purple',
        'bg-pink-400/10 text-pink-800 border-pink-600/25': activeStatusStyle.colorKey === 'pink',
        'bg-teal-400/10 text-teal-700 border-teal-600/25': activeStatusStyle.colorKey === 'teal',
        'bg-gray-400/10 text-gray-700 border-gray-500/25': !activeStatusStyle.colorKey
      }">
        <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
        {{ activeStatusStyle.label }}
      </span>
      <span class="text-xs text-gray-400">{{ filteredRecursos.length }} recurso{{ filteredRecursos.length !== 1 ? 's' : '' }}</span>
    </div>

    <!-- Lista de recursos -->
    <div class="flex flex-col gap-2 pb-10 px-10 max-[640px]:px-4">
      <infoCard
        v-for="recurso in filteredRecursos"
        :key="recurso.id"
        :recurso="recurso"
        :staffList="staffList"
        @status-updated="handleStatusUpdate"
      />
      <div v-if="!filteredRecursos.length && !isLoading" class="text-center py-12 px-6 text-gray-400 text-sm">
        Nenhum recurso encontrado.
      </div>
      <div v-if="isLoading" class="text-center py-12 px-6 text-gray-400 text-sm">
        Carregando recursos...
      </div>
    </div>

    <!-- Modais -->
    <Teleport to="body">
      <!-- Modal: Lançar Lote -->
      <Transition name="modal-fade">
        <div
          v-if="showBatchModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm"
          @click.self="closeBatchModal"
        >
          <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div class="py-4.5 px-6 flex items-center gap-3 bg-amber-500">
              <div class="bg-white/20 rounded-full p-2 flex items-center justify-center">
                <ExclamationTriangleIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="text-base font-semibold text-white leading-tight">Lançar Lote de Respostas</p>
                <p class="text-xs text-white/70 mt-0.5">Esta ação não pode ser desfeita</p>
              </div>
            </div>
            <div class="p-6 flex flex-col gap-3.5">
              <div class="bg-amber-50 border border-amber-200 rounded-xl py-3.5 px-4 flex items-center justify-between">
                <div>
                  <p class="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-0.5">Respostas</p>
                  <p class="text-2xl font-bold text-amber-800">{{ pendingLote?.numero_recursos }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[11px] font-semibold text-amber-700 uppercase tracking-wide mb-0.5">Criado em</p>
                  <p class="text-sm font-semibold text-amber-800">{{ formatDate(pendingLote?.data_lancamento) }}</p>
                </div>
              </div>
              <p class="text-xs text-gray-600 leading-relaxed">
                Ao confirmar, as respostas deste lote serão
                <strong class="text-gray-800">liberadas simultaneamente</strong>
                para todos os
                <strong class="text-gray-800">{{ pendingLote?.numero_recursos }} usuário(s)</strong>
                vinculados. Eles poderão visualizar e baixar o PDF da resposta imediatamente.
              </p>
              <div class="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-2.5">
                <ExclamationCircleIcon class="w-4 h-4 text-red-500 flex-shrink-0 " />
                <p class="text-xs text-red-700 leading-relaxed">
                  Esta operação é <strong class="text-red-800">irreversível</strong>. Após o lançamento, não é possível revogar o acesso às respostas.
                </p>
              </div>
            </div>
            <div class="px-6 pb-5 flex gap-2 justify-end">
              <button @click="closeBatchModal" :disabled="isLaunching" class="py-2 px-4.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Cancelar
              </button>
              <button @click="confirmBatchRelease" :disabled="isLaunching" class="py-2 px-4.5 rounded-lg border-none bg-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition disabled:opacity-55 disabled:cursor-not-allowed">
                <svg v-if="isLaunching" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                <PaperAirplaneIcon v-else class="w-3.5 h-3.5" />
                {{ isLaunching ? 'Lançando...' : 'Confirmar lançamento' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Modal: Configurações -->
      <Transition name="modal-fade">
        <div
          v-if="showLimitConfig"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm"
          @click.self="closeLimitConfig"
        >
          <div class="relative bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 overflow-hidden">
            <div class="py-4.5 px-6 flex items-center gap-3 bg-gray-600">
              <div class="bg-white/20 rounded-full p-2 flex items-center justify-center">
                <Cog6ToothIcon class="w-5 h-5 text-white" />
              </div>
              <div>
                <p class="text-base font-semibold text-white leading-tight">Configurações do sistema</p>
                <p class="text-xs text-white/70 mt-0.5">Prazos de recurso</p>
              </div>
            </div>
            <div class="p-6 flex flex-col gap-3.5">
              <div v-if="isLoadingConfig" class="text-center py-12 px-6 text-gray-400 text-sm">
                Carregando configurações...
              </div>
              <template v-else>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-semibold text-gray-700">
                    Prazo para edição
                    <span class="text-xs font-normal text-gray-400 ml-0.5">dias</span>
                  </label>
                  <p class="text-[11px] text-gray-400 -mt-0.5">Tempo máximo que o usuário tem para editar um recurso após a criação.</p>
                  <input
                    v-model.number="configForm.RESOURCE_EDIT_TIMELIMIT_DAYS"
                    type="number" min="1"
                    class="mt-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
                <div class="flex flex-col gap-1">
                  <label class="text-sm font-semibold text-gray-700">
                    Prazo para resposta
                    <span class="text-xs font-normal text-gray-400 ml-0.5">dias</span>
                  </label>
                  <p class="text-[11px] text-gray-400 -mt-0.5">Após este prazo sem resposta, o recurso é marcado como atrasado.</p>
                  <input
                    v-model.number="configForm.RESOURCE_RESPONSE_DEADLINE_DAYS"
                    type="number" min="1"
                    class="mt-1.5 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                  />
                </div>
              </template>
            </div>
            <div class="px-6 pb-5 flex gap-2 justify-end">
              <button @click="closeLimitConfig" :disabled="isSavingConfig" class="py-2 px-4.5 rounded-lg border border-gray-300 bg-white text-gray-700 text-xs font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed">
                Cancelar
              </button>
              <button @click="saveConfig" :disabled="isSavingConfig || isLoadingConfig" class="py-2 px-4.5 rounded-lg border-none bg-gray-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:opacity-90 transition disabled:opacity-55 disabled:cursor-not-allowed">
                <svg v-if="isSavingConfig" class="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                {{ isSavingConfig ? 'Salvando...' : 'Salvar' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </Whiteboard>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import Block from '@/views/Admin/Resource/components/Block/index.vue'
import infoCard from '@/views/Admin/Resource/components/infoCard/index.vue'
import AnnualReportsDashboard from '@/views/Admin/Resource/AnnualResource/AnnualReportsDashboard.vue'
import { FunnelIcon, PlusIcon, ChartPieIcon, DocumentDuplicateIcon, UserIcon, Cog6ToothIcon, ExclamationTriangleIcon, ExclamationCircleIcon, PaperAirplaneIcon } from "@heroicons/vue/24/outline"
import { apiClient } from '@/service/apiService'
import { STATUS_DEFINITIONS, MOTIVOS_RECURSO } from '@/config/resourceConstants.js'
import { getUserType } from '@/service/userType'

export default {
  name: "Recurso",
  components: { Whiteboard, Block, infoCard, FunnelIcon, PlusIcon, 
                ChartPieIcon, DocumentDuplicateIcon, UserIcon, Cog6ToothIcon, ExclamationTriangleIcon, ExclamationCircleIcon, PaperAirplaneIcon, AnnualReportsDashboard },

  setup() {
    const router = useRouter()
    const recursos = ref([])
    const selectedStatus = ref('aguardando_resposta')
    const isLoading = ref(true)
    const filterMotivo = ref('')
    const filterResponsavel = ref('')
    const staffList = ref([])
    const isAdmin = ref(getUserType() === 'admin')

    const showLimitConfig = ref(false)
    const isSavingConfig = ref(false)
    const isLoadingConfig = ref(false)
    const configForm = ref({
      RESOURCE_EDIT_TIMELIMIT_DAYS: '',
      RESOURCE_RESPONSE_DEADLINE_DAYS: '',
    })

    async function openLimitConfig() {
      showLimitConfig.value = true
      isLoadingConfig.value = true
      try {
        const response = await apiClient.get('/recursos/config/', { headers: authHeader() })
        const configs = response.data
        const edit = configs.find(c => c.chave === 'RESOURCE_EDIT_TIMELIMIT_DAYS')
        const deadline = configs.find(c => c.chave === 'RESOURCE_RESPONSE_DEADLINE_DAYS')
        configForm.value.RESOURCE_EDIT_TIMELIMIT_DAYS = edit?.valor ?? ''
        configForm.value.RESOURCE_RESPONSE_DEADLINE_DAYS = deadline?.valor ?? ''
      } catch (err) {
        console.error('Erro ao carregar configurações:', err)
      } finally {
        isLoadingConfig.value = false
      }
    }

    async function saveConfig() {
      isSavingConfig.value = true
      try {
        await apiClient.patch(
          '/recursos/config/',
          {
            RESOURCE_EDIT_TIMELIMIT_DAYS: String(configForm.value.RESOURCE_EDIT_TIMELIMIT_DAYS),
            RESOURCE_RESPONSE_DEADLINE_DAYS: String(configForm.value.RESOURCE_RESPONSE_DEADLINE_DAYS),
          },
          { headers: authHeader() }
        )
        showLimitConfig.value = false
      } catch (err) {
        console.error('Erro ao salvar configurações:', err)
        alert('Erro ao salvar. Tente novamente.')
      } finally {
        isSavingConfig.value = false
      }
    }

    function closeLimitConfig() {
      if (isSavingConfig.value) return
      showLimitConfig.value = false
    }


    // --- Lote ---
    const pendingLote = ref(null)
    const isLoadingLote = ref(false)
    const showBatchModal = ref(false)
    const isLaunching = ref(false)

    const authHeader = () => ({
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    })

    async function fetchPendingLote() {
      isLoadingLote.value = true
      try {
        const response = await apiClient.get('/recursos/lotes/', { headers: authHeader() })
        pendingLote.value = response.data.find(l => l.status_lancamento === false) || null
      } catch (err) {
        console.error('Erro ao buscar lote pendente:', err)
        pendingLote.value = null
      } finally {
        isLoadingLote.value = false
      }
    }

    function openBatchModal() {
      if (!pendingLote.value) return
      showBatchModal.value = true
    }

    function closeBatchModal() {
      if (isLaunching.value) return
      showBatchModal.value = false
    }

    async function confirmBatchRelease() {
      if (!pendingLote.value || isLaunching.value) return
      isLaunching.value = true
      try {
        await apiClient.patch(
          `/recursos/lotes/${pendingLote.value.id}/`,
          { status_lancamento: true },
          { headers: authHeader() }
        )
        recursos.value = recursos.value.map(r => {
          const temResposta = r.respostas && r.respostas.some(
            resp => resp.lote_resposta === pendingLote.value.id
          )
          return temResposta ? { ...r, status: 'respondido' } : r
        })
        pendingLote.value = null
        showBatchModal.value = false
        await fetchRecursos()
      } catch (err) {
        console.error('Erro ao lançar lote:', err)
        alert('Ocorreu um erro ao lançar o lote. Tente novamente.')
      } finally {
        isLaunching.value = false
      }
    }

    // --- Recursos ---
    async function fetchRecursos() {
      isLoading.value = true
      try {
        const response = await apiClient.get('/recursos/admin/todos/', { headers: authHeader() })
        recursos.value = response.data
      } catch (error) {
        console.error('Erro ao buscar recursos:', error)
        if (error.response?.status === 403) {
          alert("Você não tem permissão para visualizar esta página.")
        }
      } finally {
        isLoading.value = false
      }
    }

    async function fetchStaffUsers() {
      try {
        const response = await apiClient.get('/auth/staff-users/', { headers: authHeader() })
        staffList.value = response.data
      } catch (err) {
        console.error("Erro ao buscar staff:", err)
      }
    }

    const filteredRecursos = computed(() => {
      if (!recursos.value) return []
      return recursos.value.filter(r => {
        const matchesStatus = selectedStatus.value === '' || r.status === selectedStatus.value
        const matchesMotivo = filterMotivo.value === '' ||
          (r.criterios_selecionados && r.criterios_selecionados.includes(filterMotivo.value))
        const matchesResponsavel = filterResponsavel.value === '' ||
          r.responsavel === Number(filterResponsavel.value)
        return matchesStatus && matchesMotivo && matchesResponsavel
      })
    })

    onMounted(() => {
      fetchRecursos()
      fetchStaffUsers()
      fetchPendingLote()
    })

    function navigateToVersionManager() { router.push({ name: 'versionmanager-home' }) }
    function navigateToTemplateBuilder() { router.push({ name: 'template-builder' }) }
    function navigateToAnnualReports() { router.push({ name: 'annual-reports' }) }

    const countByStatus = (status) => {
      if (!recursos.value) return 0
      return recursos.value.filter(r => r.status === status).length
    }

    function setStatusFilter(status) {
      selectedStatus.value = status
    }

    async function handleStatusUpdate({ recursoId, newStatus }) {
      try {
        const index = recursos.value.findIndex(r => r.id === recursoId)
        if (index === -1) return
        const response = await apiClient.patch(
          `/recursos/${recursoId}/`,
          { status: newStatus },
          { headers: { 'Content-Type': 'multipart/form-data', ...authHeader() } }
        )
        recursos.value[index] = response.data
      } catch (error) {
        console.error("Erro ao atualizar o status:", error)
      }
    }

    const formatDate = (dateString) => {
      if (!dateString) return '—'
      return new Date(dateString).toLocaleDateString('pt-BR')
    }

    const activeStatusStyle = computed(() => STATUS_DEFINITIONS[selectedStatus.value] || {})

    return {
      recursos, isLoading, selectedStatus, filteredRecursos,
      countByStatus, setStatusFilter, handleStatusUpdate,
      navigateToAnnualReports, navigateToVersionManager, navigateToTemplateBuilder,
      activeStatusStyle,
      STATUS_DEFINITIONS, MOTIVOS_RECURSO,
      filterMotivo, filterResponsavel, staffList,
      pendingLote, isLoadingLote, showBatchModal, isLaunching,
      openBatchModal, closeBatchModal, confirmBatchRelease, formatDate,
      showLimitConfig, isLoadingConfig, isSavingConfig, configForm,
      openLimitConfig, closeLimitConfig, saveConfig, isAdmin
    }
  }
}
</script>

<style>
/* Animações globais (não scoped) */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active .modal-panel {
  transition: transform 0.2s ease;
}
.modal-fade-enter-from .modal-panel {
  transform: scale(0.96) translateY(-6px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 0.8s linear infinite;
}
</style>