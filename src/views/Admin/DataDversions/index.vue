<template>
  <Whiteboard title="Ativação de Versão para Usuários" :hideBreadcrumbs="false">
    <div class="flex w-full p-8">
      <h1 class="text-center w-full font-semibold text-15 text-gray-800">
        Selecione a versão que será exibida no painel para todos os usuários. Apenas uma versão pode estar ativa.
      </h1>
    </div>

    <div class="flex flex-col gap-6 w-full pb-10 px-4 sm:px-10">
      <!-- Loop sobre as "Famílias" de Cálculos -->
      <div v-for="family in calculusFamilies" :key="family.parent_id" class="border rounded-lg bg-white shadow-sm">
        <Disclosure v-slot="{ open }">
          <!-- Cabeçalho da Família -->
          <DisclosureButton class="w-full flex justify-between items-center bg-gray-50 text-gray-800 px-4 py-3 text-lg font-semibold rounded-t-lg">
            <span>{{ family.description }}</span>
            <ChevronDownIcon class="w-6 h-6 transition-transform" :class="{ 'rotate-180': open }" />
          </DisclosureButton>
          
          <!-- Lista de Versões Publicadas -->
          <DisclosurePanel class="text-gray-900">
            <div v-for="versao in family.versions" :key="versao.id" class="border-t border-gray-200 px-4 py-3">
              <div class="flex justify-between items-center">
                <div class="flex flex-col gap-1">
                  <span class="font-medium">{{ versao.descricao }}</span>
                </div>
                <div class="flex items-center space-x-4">
                   <span class="text-sm text-gray-500">{{ versao.data }}</span>
                  <Toggle
                    class="scale-90"
                    :modelValue="versao.ativa"
                    @update:modelValue="() => handleToggle(versao)"
                  />
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </Disclosure>
      </div>
    </div>

    <!-- Modal de Confirmação (inalterado) -->
    <div v-if="showConfirmation" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
        <h3 class="text-lg font-semibold mb-4">Deseja realmente alterar a versão ativa?</h3>
        <p class="text-sm text-gray-600 mb-6">A versão atualmente ativa será desativada.</p>
        <div class="flex justify-center gap-4">
          <button @click="confirmToggle" class="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Sim, Ativar
          </button>
          <button @click="cancelToggle" class="px-6 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Não
          </button>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import { ref, onMounted } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Toggle from '@/components/Toggle/Toggle.vue';
import axios from 'axios';
import { getAccessToken } from '@/service/token';

export default {
  name: 'DataVersions',
  components: { Whiteboard, Toggle, ChevronDownIcon, Disclosure, DisclosureButton, DisclosurePanel },
  setup() {
    const calculusFamilies = ref([]);
    const showConfirmation = ref(false);
    const pendingVersion = ref(null);

    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get('http://10.203.3.46:8000/csv/opencalc/list-opencalc/', {
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

      const idParaAtivar = pendingVersion.value.id;
      
        try {
          const token = await getAccessToken();
          
          const response = await axios.post('http://10.203.3.46:8000/csv/opencalc/activate-opencalc/', 
            { calc_id: idParaAtivar },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {
          // Atualiza o estado local para refletir a mudança imediatamente
          calculusFamilies.value.forEach(family => {
            family.versions.forEach(version => {
              version.ativa = (version.id === idParaAtivar);
            });
          });
        }
      } catch (error) {
        console.error("Erro detalhado ao ativar a versão:", error.response || error);
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

    return { calculusFamilies, showConfirmation, handleToggle, confirmToggle, cancelToggle };
  }
}
</script>