
<template>
  <Whiteboard title="Painel do Usuário" :isSidebarMinimized="isSidebarMinimized" :hideBreadcrumbs="false">
    <div class="flex w-full p-8">
      <h1 class="text-center w-full font-semibold text-15 text-gray-800">
        Selecione a versão que será exibida no painel para todos os usuários
      </h1>
    </div>

    <div class="flex flex-col gap-4 w-full pb-10">
      <!-- Cálculo -->
      <Disclosure v-slot="{ open }">
        <div>
          <DisclosureButton class="w-full flex justify-left items-center bg-[#4168b5] text-white px-4 py-4 sm:pl-8 text-20 font-semibold gap-2">
            <span class="text-20">Cálculo</span>
            <ChevronDownIcon class="w-8 h-8 transition-transform" :class="{ 'rotate-180': open }" />
          </DisclosureButton>
          <DisclosurePanel class="bg-white px-4 sm:px-10 py-4">
            <div
              v-for="(versao, index) in versoesCalculo"
              :key="versao.id"
              class="border-b last:border-b-0 border-black py-3"
            >
              <div class="flex justify-between items-center">
                <div class="flex flex-col gap-1">
                  <span class="font-semibold text-15">{{ versao.nome }}</span>
                  <span class="text-15 leading-4">{{ versao.descricao }}</span>
                </div>
                <div class="flex flex-col items-end space-y-1">
                  <Toggle
                    class="scale-75"
                    :modelValue="versao.ativa"
                    @update:modelValue="() => handleToggle(index)"
                  />
                  <span class="text-15">{{ versao.data }}</span>
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </div>
      </Disclosure>

      
    </div>

    <!-- Modal de Confirmação -->
    <div
      v-if="showConfirmation"
      class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center"
    >
      <div class="bg-white p-5 rounded-[10px] shadow-lg max-w-sm w-full text-center">
        <h3 class="text-20 font-semibold mb-4">Deseja realmente alterar a versão ativa?</h3>
        <div class="flex justify-around">
          <button
            @click="confirmToggle"
            class="px-4 py-2 bg-blue-500 text-white rounded-[10px] hover:bg-blue-600"
          >
            Sim
          </button>
          <button
            @click="cancelToggle"
            class="px-4 py-2 bg-gray-300 rounded-[10px] hover:bg-gray-400"
          >
            Não
          </button>
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import { ref, inject, onMounted } from 'vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import Toggle from '@/components/Toggle/Toggle.vue'
import axios from 'axios'
import { getAccessToken } from '@/service/token'

export default {
  name: 'Ativos',
  components: {
    Whiteboard,
    Toggle,
    ChevronDownIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel
  },
  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')
    const versoesCalculo = ref([]) // Apenas uma lista é necessária agora

    const showConfirmation = ref(false)
    const pendingVersion = ref({ index: null }) // Estado de pendência simplificado

    // Busca os dados da API
    const fetchData = async () => {
      try {
        const token = await getAccessToken();
        const response = await axios.get('http://127.0.0.1:8000/csv/opencalc/list-opencalc/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        // A resposta da API agora é uma lista direta
        versoesCalculo.value = response.data;

      } catch (error) {
        console.error("Erro ao buscar as versões de cálculo:", error);
      }
    };

    // Manipula o clique no toggle (sem o parâmetro 'type')
    const handleToggle = (index) => {

      
      if (!versoesCalculo.value[index].ativa) {

        pendingVersion.value = { index };
        showConfirmation.value = true;
      } 
    };

    // Confirma a mudança e chama a API
    const confirmToggle = async () => {
        const { index } = pendingVersion.value;
        if (index === null || versoesCalculo.value[index] === undefined) {
          console.error("Tentativa de confirmar sem uma versão pendente válida.");
          showConfirmation.value = false;
          pendingVersion.value = { index: null };
          return;
        }

        const idParaAtivar = versoesCalculo.value[index].id;

        try {
          const token = await getAccessToken();
          
          const response = await axios.post('http://127.0.0.1:8000/csv/opencalc/activate-opencalc/', 
            { calc_id: idParaAtivar },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (response.status === 200) {


            versoesCalculo.value = versoesCalculo.value.map((versao, i) => {
              return {
                ...versao,
                ativa: i === index 
              };
            });
          } else {
            console.warn(`API retornou um status inesperado: ${response.status}`);
            alert("A operação foi concluída, mas com um status inesperado.");
          }

        } catch (error) {
          console.error("Erro detalhado ao ativar a versão:", error.response || error);
          alert("Falha ao ativar a versão. A interface não foi alterada. Verifique o console para mais detalhes.");
          
        } finally {
          showConfirmation.value = false;
          pendingVersion.value = { index: null };
        }
      };

    const cancelToggle = () => {
      showConfirmation.value = false;
      pendingVersion.value = { index: null };
    };

    onMounted(fetchData);

    return {
      isSidebarMinimized,
      versoesCalculo,
      showConfirmation,
      handleToggle,
      confirmToggle,
      cancelToggle
    }
  }
}
</script>