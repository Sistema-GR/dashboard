<template>
  <Whiteboard title="Ativação de Versão para Usuários" :hideBreadcrumbs="false">
    <div class="flex w-full p-8">
      <h1 class="text-center w-full font-semibold text-15 text-gray-800">
        Selecione a versão que será exibida no painel para todos os usuários. Apenas uma versão pode estar ativa.
      </h1>
    </div>

    <div class="flex flex-col gap-8 w-full pb-10 px-4 sm:px-10">
      <!-- Loop sobre as "Famílias" de Cálculos -->
      <div v-for="family in processedFamilies" :key="family.parent_id" class="border rounded-lg bg-white shadow-sm overflow-hidden">
        <!-- Cabeçalho da Família -->
        <div class="bg-[#c2ddfd] px-6 py-4 rounded-t-lg border-b">
          <h2 class="text-lg font-semibold text-gray-800">{{ family.description }}</h2>
        </div>
        
        <!-- Renderização da Árvore de Versões -->
        <div>
          <ActivationItem
            v-for="rootVersion in family.versionTree"
            :key="rootVersion.id"
            :version="rootVersion"
            @toggle-version="handleToggle"
          />
        </div>
      </div>
    </div>

    <!-- Modal de Confirmação -->
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
import { ref, onMounted, computed } from 'vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import Toggle from '@/components/Toggle/Toggle.vue';
import ActivationItem from '@/components/ActivationItem/ActivationItem.vue';
import axios from 'axios';
import { getAccessToken } from '@/service/token';

export default {
  name: 'DataVersions',
  components: { Whiteboard, Toggle, ActivationItem },
  setup() {
    const calculusFamilies = ref([]);
    const showConfirmation = ref(false);
    const pendingVersion = ref(null);

     const processedFamilies = computed(() => {
      return calculusFamilies.value.map(family => {
        const versions = family.versions;
        const versionMap = new Map(versions.map(v => [v.id, { ...v, children: [] }]));
        const tree = [];

        for (const version of versionMap.values()) {
          if (version.created_from_id && versionMap.has(version.created_from_id)) {
            versionMap.get(version.created_from_id).children.push(version);
          } else {
            tree.push(version);
          }
        }
        tree.sort((a,b) => a.version_number - b.version_number);
        return { ...family, versionTree: tree };
      });
    });

    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get('/csv/opencalc/list-versions/', {
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
        
        const response = await axios.post('/csv/opencalc/activate-opencalc/', 
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