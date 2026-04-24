<template>
    <Whiteboard title="Recurso" class="!overflow-visible overflow-y-auto z-40 relative">

      <!-- Header com botão de relatórios -->
      <div class="flex justify-end items-center px-4 sm:px-10 py-4 margin-between-sections gap-3 flex-wrap">
        <button
          @click="navigateToTemplateBuilder"
          class="bg-[#ff0000] hover:bg-[#800000] text-white px-4 py-2 rounded-[10px] transition-colors duration-200 flex items-center gap-2 font-medium shadow-md"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Criar template resposta
        </button>
        <button
          @click="navigateToAnnualReports"
          class="bg-[#3459A2] hover:bg-[#2a4a8a] text-white px-4 py-2 rounded-[10px] transition-colors duration-200 flex items-center gap-2 font-medium shadow-md"
        >
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
            <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
          </svg>
          Relatórios Anuais
        </button>
        <button
          @click="navigateToVersionManager"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-[10px] transition-colors duration-200 flex items-center gap-2 font-medium shadow-md"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"/>
          </svg>
          Gerenciar Versões do Cálculo
        </button>

        <!-- Botão Lançar Lote -->
        <button
          @click="openBatchModal"
          :disabled="!pendingLote || isLoadingLote"
          class="relative text-white px-4 py-2 rounded-[10px] transition-all duration-200 flex items-center gap-2 font-medium shadow-md"
          :class="pendingLote && !isLoadingLote
            ? 'bg-amber-500 hover:bg-amber-600 cursor-pointer'
            : 'bg-gray-300 cursor-not-allowed'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
          </svg>
          <span v-if="isLoadingLote">Verificando...</span>
          <span v-else-if="pendingLote">
            Lançar Lote
            <span class="ml-1 bg-white text-amber-600 text-xs font-bold px-1.5 py-0.5 rounded-full">
              {{ pendingLote.numero_recursos }}
            </span>
          </span>
          <span v-else>Sem lote pendente</span>
        </button>
        <button
            @click="openLimitConfig"
            class="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-[10px] transition-colors duration-200 flex items-center justify-center shadow-md"
            title="Configurações"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
      </div>

      <!-- Blocos de status -->
      <div class="w-full py-8 pt-2 px-6 sm:px-10">
        <div class="grid grid-cols-1 gap-5 xl:gap-10 lg:grid-cols-2 xl:grid-cols-5">
          <Block 
            title="Todos os Recursos"
            :number="recursos.length"
            :isActive="selectedStatus === ''"
            colorKey="gray"
            @click="setStatusFilter('')"
          />
          <Block
            title="Aguardando Resposta"
            :number="countByStatus('aguardando_resposta')"
            :isActive="selectedStatus === 'aguardando_resposta'"
            :colorKey="STATUS_DEFINITIONS['aguardando_resposta'].colorKey"
            @click="setStatusFilter('aguardando_resposta')"
          />
          <Block
            title="Análise Pendente"
            :number="countByStatus('analise_pendente')"
            :isActive="selectedStatus === 'analise_pendente'"
            :colorKey="STATUS_DEFINITIONS['analise_pendente'].colorKey"
            @click="setStatusFilter('analise_pendente')"
          />
          <Block
            title="Aguardando Envio"
            :number="countByStatus('aguardando_envio')"
            :isActive="selectedStatus === 'aguardando_envio'"
            :colorKey="STATUS_DEFINITIONS['aguardando_envio'].colorKey"
            @click="setStatusFilter('aguardando_envio')"
          />
          <Block
            title="Respondido"
            :number="countByStatus('respondido')"
            :isActive="selectedStatus === 'respondido'"
            :colorKey="STATUS_DEFINITIONS['respondido'].colorKey"
            @click="setStatusFilter('respondido')"
          />
        </div>
      </div>

      <div v-if="activeStatusStyle.label" class="w-full">
        <div class="flex items-center justify-center p-4 rounded-t-lg" :class="activeStatusColorClass">
          <p class="text-20 font-bold text-white" :class="activeStatusStyle.textColor">
            {{ activeStatusStyle.label }}
          </p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="px-4 sm:px-10 mb-5 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="flex flex-col">
          <label class="text-sm font-bold text-gray-700 mb-1">Filtrar por Motivo</label>
          <select
            v-model="filterMotivo"
            class="border border-gray-300 rounded-[10px] px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">Todos os Motivos</option>
            <option v-for="motivo in MOTIVOS_RECURSO" :key="motivo.text" :value="motivo.text">
              {{ motivo.text }}
            </option>
          </select>
        </div>
        <div class="relative">
          <label class="text-sm font-bold text-gray-700 mb-1">Filtrar por Responsável</label>
          <select
            v-model="filterResponsavel"
            class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos os Responsáveis</option>
            <option v-for="staff in staffList" :key="staff.id" :value="staff.id">
              {{ staff.full_name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Lista de recursos -->
      <div class="py-5 w-full space-y-4 px-4 sm:px-10">
        <infoCard
          v-for="recurso in filteredRecursos"
          :key="recurso.id"
          :recurso="recurso"
          :staffList="staffList"
          @status-updated="handleStatusUpdate"
        />
        <div v-if="!filteredRecursos.length && !isLoading" class="text-center text-gray-500 py-10">
          Nenhum recurso encontrado.
        </div>
        <div v-if="isLoading" class="text-center text-gray-500 py-10">
          Carregando recursos...
        </div>
      </div>

      <!-- ===== MODAL DE CONFIRMAÇÃO DO LOTE ===== -->
      <Teleport to="body">
        <Transition name="modal-fade">
          <div
            v-if="showBatchModal"
            class="fixed inset-0 z-50 flex items-center justify-center"
            @click.self="closeBatchModal"
          >
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <!-- Painel do modal -->
            <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

              <!-- Faixa de alerta no topo -->
              <div class="bg-amber-500 px-6 py-4 flex items-center gap-3">
                <div class="bg-white/20 rounded-full p-2">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-bold text-lg leading-tight">Lançar Lote de Respostas</p>
                  <p class="text-amber-100 text-sm">Esta ação não pode ser desfeita</p>
                </div>
              </div>

              <!-- Corpo -->
              <div class="px-6 py-6 space-y-4">

                <!-- Card de resumo do lote -->
                <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between">
                  <div class="text-center">
                    <p class="text-xs text-amber-600 font-semibold uppercase tracking-wide">Respostas</p>
                    <p class="text-2xl font-bold text-amber-700">{{ pendingLote?.numero_recursos }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-xs text-amber-600 font-semibold uppercase tracking-wide">Criado em</p>
                    <p class="text-sm font-semibold text-amber-700">{{ formatDate(pendingLote?.data_lancamento) }}</p>
                  </div>
                </div>

                <p class="text-gray-600 text-sm leading-relaxed">
                  Ao confirmar, as respostas deste lote serão
                  <strong class="text-gray-800">liberadas simultaneamente</strong>
                  para todos os
                  <strong class="text-gray-800">{{ pendingLote?.numero_recursos }} usuário(s)</strong>
                  vinculados. Eles poderão visualizar e baixar o PDF da resposta imediatamente.
                </p>

                <!-- Aviso de irreversibilidade -->
                <div class="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <svg class="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                  </svg>
                  <p class="text-xs text-red-700">
                    Esta operação é <strong>irreversível</strong>. Após o lançamento, não é possível revogar o acesso às respostas.
                  </p>
                </div>
              </div>

              <!-- Rodapé com ações -->
              <div class="px-6 pb-6 flex gap-3 justify-end">
                <button
                  @click="closeBatchModal"
                  :disabled="isLaunching"
                  class="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  @click="confirmBatchRelease"
                  :disabled="isLaunching"
                  class="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg v-if="isLaunching" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                  </svg>
                  {{ isLaunching ? 'Lançando...' : 'Confirmar Lançamento' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
        <Transition name="modal-fade">
          <div
            v-if="showLimitConfig"
            class="fixed inset-0 z-50 flex items-center justify-center"
            @click.self="closeLimitConfig"
          >
            <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

              <!-- Header -->
              <div class="bg-gray-700 px-6 py-4 flex items-center gap-3">
                <div class="bg-white/20 rounded-full p-2">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-white font-bold text-lg leading-tight">Configurações do Sistema</p>
                  <p class="text-gray-300 text-sm">Prazos de recurso</p>
                </div>
              </div>

              <!-- Corpo -->
              <div class="px-6 py-6 space-y-5">
                <div v-if="isLoadingConfig" class="text-center py-4 text-gray-500 text-sm">
                  Carregando configurações...
                </div>

                <template v-else>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">
                      Prazo para edição <span class="font-normal text-gray-400">(dias)</span>
                    </label>
                    <p class="text-xs text-gray-400 mb-2">Tempo máximo que o usuário tem para editar um recurso após a criação.</p>
                    <input
                      v-model.number="configForm.RESOURCE_EDIT_TIMELIMIT_DAYS"
                      type="number" min="1"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 outline-none"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">
                      Prazo para resposta <span class="font-normal text-gray-400">(dias)</span>
                    </label>
                    <p class="text-xs text-gray-400 mb-2">Após este prazo sem resposta, o recurso é marcado como atrasado.</p>
                    <input
                      v-model.number="configForm.RESOURCE_RESPONSE_DEADLINE_DAYS"
                      type="number" min="1"
                      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 outline-none"
                    />
                  </div>
                </template>
              </div>

              <!-- Rodapé -->
              <div class="px-6 pb-6 flex gap-3 justify-end">
                <button
                  @click="closeLimitConfig"
                  :disabled="isSavingConfig"
                  class="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  @click="saveConfig"
                  :disabled="isSavingConfig || isLoadingConfig"
                  class="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 text-white font-semibold text-sm transition-colors flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <svg v-if="isSavingConfig" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
import { FunnelIcon } from "@heroicons/vue/24/outline"
import { apiClient } from '@/service/apiService'
import { STATUS_DEFINITIONS, MOTIVOS_RECURSO } from '@/config/resourceConstants.js'

export default {
  name: "Recurso",
  components: { Whiteboard, Block, infoCard, FunnelIcon, AnnualReportsDashboard },

  setup() {
    const router = useRouter()
    const recursos = ref([])
    const selectedStatus = ref('aguardando_resposta')
    const isLoading = ref(true)
    const filterMotivo = ref('')
    const filterResponsavel = ref('')
    const staffList = ref([])

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
      // A API retorna lista de objetos [{chave, valor}, ...]
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

    // Busca o lote pendente (status_lancamento=false) do cálculo ativo
    async function fetchPendingLote() {
      isLoadingLote.value = true
      try {
        const response = await apiClient.get('/recursos/lotes/', {
          headers: authHeader()
        })
        // Pega o primeiro lote ainda não lançado
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
        // Atualiza localmente os recursos afetados para 'respondido'
        recursos.value = recursos.value.map(r => {
          const temResposta = r.respostas && r.respostas.some(
            resp => resp.lote_resposta === pendingLote.value.id
          )
          return temResposta ? { ...r, status: 'respondido' } : r
        })
        pendingLote.value = null
        showBatchModal.value = false
        // Refetch completo para garantir consistência
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
        const response = await apiClient.get('/recursos/admin/todos/', {
          headers: authHeader()
        })
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
        const response = await apiClient.get('/auth/staff-users/', {
          headers: authHeader()
        })
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

    const activeStatusColorClass = computed(() => {
      const colorMap = {
        blue: 'bg-[#6fa3ef]', purple: 'bg-[#6668d4]',
        pink: 'bg-[#f16d91]', orange: 'bg-[#ff8051]',
        teal: 'bg-[#6cc69d]', gray: 'bg-gray-500'
      }
      return colorMap[activeStatusStyle.value.colorKey] || colorMap['gray']
    })

    return {
      recursos, isLoading, selectedStatus, filteredRecursos,
      countByStatus, setStatusFilter, handleStatusUpdate,
      navigateToAnnualReports, navigateToVersionManager, navigateToTemplateBuilder,
      activeStatusStyle, activeStatusColorClass,
      STATUS_DEFINITIONS, MOTIVOS_RECURSO,
      filterMotivo, filterResponsavel, staffList,
      pendingLote, isLoadingLote, showBatchModal, isLaunching,
      openBatchModal, closeBatchModal, confirmBatchRelease, formatDate, showLimitConfig, 
      isLoadingConfig, isSavingConfig, configForm,
      openLimitConfig, closeLimitConfig, saveConfig,
    }   
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-fade-enter-from .relative {
  transform: scale(0.95) translateY(-8px);
}
</style>