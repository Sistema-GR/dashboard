<template>
  <div 
    :class="[
      'relative flex flex-col md:flex-row items-center w-full bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group',
      { 'ring-2 ring-blue-500/20 border-blue-200': isMenuOpen }
    ]"
  >
    <!-- Barra lateral de Status/Urgência -->
    <div 
      :class="recurso.is_overdue ? 'bg-red-500' : 'bg-blue-500'" 
      class="absolute left-0 top-4 bottom-4 w-1.5 rounded-r-full"
    ></div>
    
    <!-- Link Principal: Identificação -->
    <router-link :to="`/resource/info/${recurso.id}`" class="flex flex-1 items-center gap-4 w-full md:w-auto">
      <div class="relative">
        <div class="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
          <UserIcon class="w-8 h-8" />
        </div>
        <div v-if="recurso.is_overdue" class="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
          <ExclamationTriangleIcon class="w-6 h-6 text-red-500" />
        </div>
      </div>

      <div class="flex flex-col">
        <h3 class="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {{ recurso.nome_completo.toLowerCase() }}
        </h3>
        <div class="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
          <span class="bg-gray-100 px-2 py-0.5 rounded font-mono font-medium">Mat: {{ recurso.matriculas[0] }}</span>
          <span v-if="recurso.matriculas.length > 1" class="text-[10px] text-blue-500 font-bold">+{{ recurso.matriculas.length - 1 }}</span>
        </div>
      </div>
    </router-link>

    <!-- Info Grid -->
    <div class="flex-grow flex flex-wrap md:flex-nowrap items-center justify-between gap-6 mt-6 md:mt-0 w-full md:w-auto px-2">
      
      <!-- Motivo -->
      <div class="flex flex-col min-w-[120px]">
        <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Motivo</span>
        <div 
          v-if="recurso.criterios_selecionados?.length"
          class="relative flex items-center gap-2 cursor-help"
          @mouseenter="isHoveringBadges = true" 
          @mouseleave="isHoveringBadges = false"
        >
          <div class="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg border border-blue-100 truncate max-w-[140px]">
            {{ recurso.criterios_selecionados[0] }}
          </div>
          <div v-if="remainingBadgesCount > 0" class="flex items-center justify-center h-6 w-6 bg-gray-100 text-gray-600 text-[10px] font-black rounded-full border border-white">
            +{{ remainingBadgesCount }}
          </div>
          
          <!-- Tooltip Moderno -->
          <Transition name="fade">
            <div v-if="isHoveringBadges" class="absolute bottom-full left-0 mb-2 w-64 p-3 bg-gray-900 text-white rounded-xl shadow-xl z-50 text-xs">
              <p class="font-bold mb-2 border-b border-gray-700 pb-1 italic text-blue-300">Critérios Selecionados:</p>
              <ul class="space-y-1">
                <li v-for="criterio in recurso.criterios_selecionados" :key="criterio" class="flex items-center gap-2">
                  <div class="w-1 h-1 bg-blue-400 rounded-full"></div> {{ criterio }}
                </li>
              </ul>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Responsável (Select Estilizado) -->
      <div class="flex flex-col min-w-[160px]">
        <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Responsável</span>
        <div class="relative group/select">
          <select 
            v-model="selectedResponsavelId" 
            @change="updateResponsavel" 
            @click.stop
            class="w-full pl-3 pr-8 py-1.5 bg-gray-50 border border-transparent hover:border-blue-300 hover:bg-white text-gray-700 text-xs font-semibold rounded-lg appearance-none transition-all cursor-pointer focus:ring-2 focus:ring-blue-100 outline-none"
          >
            <option :value="null">Não atribuído</option>
            <option v-for="staff in staffList" :key="staff.id" :value="staff.id">
              {{ staff.full_name }}
            </option>
          </select>
          <ChevronDownIcon class="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      <!-- Datas e Status -->
      <div class="flex items-center gap-6">
        <div class="flex flex-col items-center">
          <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Abertura</span>
          <span class="text-sm text-gray-700 font-medium">{{ new Date(recurso.created_at).toLocaleDateString() }}</span>
        </div>

        <div class="flex flex-col items-end">
          <span class="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Status</span>
          <div 
            :class="statusStyle.bg + ' ' + statusStyle.text"
            class="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-tight shadow-sm border border-black/5"
          >
            {{ recurso.status }}
          </div>
        </div>
      </div>
    </div>

    <!-- Menu de Ações -->
    <div class="relative ml-4 flex-shrink-0">
      <button 
        @click="isMenuOpen = !isMenuOpen" 
        class="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all"
        :class="{ 'bg-gray-100 text-gray-900': isMenuOpen }"
      >
        <EllipsisVerticalIcon class="w-6 h-6" />
      </button>
      
      <Transition name="pop">
        <div v-if="isMenuOpen" class="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl z-[60] border border-gray-100 overflow-hidden">
          <div class="px-4 py-3 bg-gray-50 border-b">
            <p class="text-[10px] font-black uppercase text-gray-400 tracking-widest">Alterar Status</p>
          </div>
          <ul class="py-1">
            <li 
              v-for="status in possibleStatuses" 
              :key="status.key" 
              @click="changeStatus(status.key)" 
              class="px-4 py-2.5 hover:bg-blue-50 hover:text-blue-700 cursor-pointer text-sm font-medium transition-colors flex items-center gap-2"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              {{ status.label }}
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { 
  UserIcon, 
  ExclamationTriangleIcon, 
  EllipsisVerticalIcon,
  ChevronDownIcon 
} from "@heroicons/vue/24/outline";
import { STATUS_DEFINITIONS } from '@/config/resourceConstants.js';
import { apiClient } from '@/service/apiService';

export default {
  name: "infoCard",
  components: { UserIcon, ExclamationTriangleIcon, EllipsisVerticalIcon, ChevronDownIcon },
  props: {
    recurso: { type: Object, required: true },
    staffList: { type: Array, required: true }
  },
  emits: ['status-updated'],
  setup(props, { emit }) {
    const isMenuOpen = ref(false);
    const isHoveringBadges = ref(false);
    const selectedResponsavelId = ref(props.recurso.responsavel);

    const remainingBadgesCount = computed(() => {
      return (props.recurso.criterios_selecionados?.length || 0) > 1 
        ? props.recurso.criterios_selecionados.length - 1 
        : 0;
    });

    const statusStyle = computed(() => {
        // Estilização dinâmica baseada no status
        const s = props.recurso.status?.toLowerCase();
        if (s.includes('pendente')) return { bg: 'bg-amber-100', text: 'text-amber-700' };
        if (s.includes('concluido') || s.includes('deferido')) return { bg: 'bg-emerald-100', text: 'text-emerald-700' };
        return { bg: 'bg-gray-100', text: 'text-gray-600' };
    });

    const possibleStatuses = computed(() => {
      const all = Object.entries(STATUS_DEFINITIONS).map(([key, value]) => ({ key, label: value.label }));
      return all.filter(s => s.label !== props.recurso.status && s.label !== 'Todos os Recursos');
    });

    watch(() => props.recurso.responsavel, (newId) => {
      selectedResponsavelId.value = newId;
    });

    async function updateResponsavel() {
      try {
        const response = await apiClient.patch(`/recursos/${props.recurso.id}/`, 
          { responsavel: selectedResponsavelId.value },
          { headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` } }
        );
        props.recurso.responsavel = response.data.responsavel;
        props.recurso.responsavel_nome = response.data.responsavel_nome;
      } catch (err) {
        selectedResponsavelId.value = props.recurso.responsavel;
      }
    }

    function changeStatus(newStatus) {
      emit('status-updated', { recursoId: props.recurso.id, newStatus });
      isMenuOpen.value = false;
    }

    return {
      isMenuOpen, possibleStatuses, changeStatus,
      isHoveringBadges, remainingBadgesCount,
      selectedResponsavelId, updateResponsavel,
      statusStyle
    };
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.pop-enter-active { transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.pop-leave-active { transition: all 0.1s ease; }
.pop-enter-from { opacity: 0; transform: translateY(-10px) scale(0.95); }

.capitalize { text-transform: capitalize; }
</style>