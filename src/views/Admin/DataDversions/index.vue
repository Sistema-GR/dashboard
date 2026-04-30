<template>
  <Whiteboard title="Ativação de Versão para Usuários" :hideBreadcrumbs="false">

    <!-- Header -->
    <div class="flex items-start justify-between flex-wrap gap-3 px-10 pt-6 pb-4">
      <div>
        <h1 class="text-xl font-semibold text-gray-900 leading-tight">Versões de cálculo</h1>
        <p class="text-sm text-gray-400 mt-1 max-w-xl">
          Apenas uma versão pode estar ativa por família. A versão ativa é exibida no painel de todos os usuários.
        </p>
      </div>
    </div>

    <!-- Famílias -->
    <div class="flex flex-col gap-3 px-10 pb-10 pt-2">
      <div
        v-for="family in processedFamilies"
        :key="family.parent_id"
        class="bg-white border border-gray-200 rounded-xl overflow-hidden"
      >
        <!-- Cabeçalho da família -->
        <div class="flex items-center gap-3 px-5 py-3.5 bg-[#e8f2ff] border-b border-[#d0e4fa]">
          <div class="flex items-center justify-center w-7 h-7 rounded-lg bg-[#3459A2]/10 text-[#3459A2] shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <span class="text-sm font-semibold text-[#1e3a6e]">{{ family.description }}</span>
        </div>

        <!-- Lista de versões -->
        <div class="flex flex-col divide-y divide-gray-100">
          <ActivationItem
            v-for="rootVersion in family.versionTree"
            :key="rootVersion.id"
            :version="rootVersion"
            @toggle-version="handleToggle"
          />
        </div>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <Teleport to="body">
      <Transition name="modal-fade">
        <div
          v-if="showConfirmation"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-sm"
          @click.self="cancelToggle"
        >
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">

            <!-- Header do modal -->
            <div class="flex items-center gap-3 px-6 py-4 bg-[#3459A2]">
              <div class="flex items-center justify-center bg-white/20 rounded-full p-2 shrink-0 text-white">
                <ArrowPathIcon class="w-5 h-5" />
              </div>
              <div>
                <p class="text-white font-semibold text-base leading-tight">Alterar versão ativa?</p>
                <p class="text-white/60 text-xs mt-0.5">A versão atual será desativada</p>
              </div>
            </div>

            <!-- Corpo -->
            <div class="px-6 py-5">
              <p class="text-sm text-gray-500 leading-relaxed">
                A versão selecionada será ativada e passará a ser exibida no painel de todos os usuários imediatamente.
              </p>
            </div>

            <!-- Rodapé -->
            <div class="flex justify-end gap-2 px-6 pb-5">
              <button
                @click="cancelToggle"
                class="px-5 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                @click="confirmToggle"
                class="px-5 py-2 rounded-lg bg-[#3459A2] hover:bg-[#2a4a8a] text-white text-sm font-semibold transition-colors"
              >
                Sim, ativar versão
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </Whiteboard>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Toggle from '@/components/Toggle/Toggle.vue';
import ActivationItem from '@/components/ActivationItem/ActivationItem.vue';
import { apiClient } from '@/service/apiService';
import { getAccessToken } from '@/service/token';
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

export default {
  name: 'DataVersions',
  components: { Whiteboard, Toggle, ActivationItem, ArrowPathIcon },
  setup() {
    const calculusFamilies = ref([]);
    const showConfirmation = ref(false);
    const pendingVersion = ref(null);

    const processedFamilies = computed(() => {
      return calculusFamilies.value.map(family => {
        const versions = family.versions;
        const versionMap = new Map(versions.map(v => [v.calculus_id, { ...v, children: [] }]));
        const tree = [];
        for (const version of versionMap.values()) {
          if (version.created_from_id && versionMap.has(version.created_from_id)) {
            versionMap.get(version.created_from_id).children.push(version);
          } else {
            tree.push(version);
          }
        }
        tree.sort((a, b) => a.version_number - b.version_number);
        return { ...family, versionTree: tree };
      });
    });

    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const response = await apiClient.get('/csv/opencalc/list-versions/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        calculusFamilies.value = response.data;
      } catch (error) {
        console.error("Erro ao buscar as famílias de cálculo:", error);
      }
    };

    const handleToggle = (versionToActivate) => {
      if (!versionToActivate.ativa) {
        pendingVersion.value = versionToActivate;
        showConfirmation.value = true;
      }
    };

    const confirmToggle = async () => {
      if (!pendingVersion.value) return;
      const idParaAtivar = pendingVersion.value.calculus_id;
      try {
        const token = await getAccessToken();
        const response = await apiClient.post(
          '/csv/opencalc/activate-opencalc/',
          { calc_id: idParaAtivar },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.status === 200) {
          calculusFamilies.value.forEach(family => {
            family.versions.forEach(version => {
              version.ativa = (version.calculus_id === idParaAtivar);
            });
          });
        }
      } catch (error) {
        console.error("Erro ao ativar a versão:", error.response || error);
        alert("Falha ao ativar a versão.");
      } finally {
        showConfirmation.value = false;
        pendingVersion.value = null;
      }
    };

    const cancelToggle = () => {
      showConfirmation.value = false;
      pendingVersion.value = null;
    };

    onMounted(fetchData);

    return {
      calculusFamilies,
      processedFamilies,
      showConfirmation,
      handleToggle,
      confirmToggle,
      cancelToggle,
    };
  }
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }
.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative { transition: transform 0.2s ease; }
.modal-fade-enter-from .relative { transform: scale(0.96) translateY(-6px); }
</style>