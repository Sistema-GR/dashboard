
<template>
  <Whiteboard title="Painel do Usuário" :isSidebarMinimized="isSidebarMinimized" :hideBreadcrumbs="false">
    <div class="flex w-full p-5">
      <h1 class="text-center w-full font-semibold text-15 text-gray-800">
        Selecione a versão que será exibida no painel para todos os usuários
      </h1>
    </div>

    <div class="flex flex-col gap-1 w-full pb-10">
      <!-- Cálculo -->
      <Disclosure v-slot="{ open }">
        <div>
          <DisclosureButton class="w-full flex justify-left items-center bg-[#4168b5] text-white px-4 py-4 pl-8 text-lg font-semibold gap-2">
            <span class="text-20">Cálculo</span>
            <ChevronDownIcon class="w-8 h-8 transition-transform" :class="{ 'rotate-180': open }" />
          </DisclosureButton>
          <DisclosurePanel class="bg-white px-8 py-4">
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
                    @update:modelValue="() => handleToggle('calculo', index)"
                  />
                  <span class="text-15">{{ versao.data }}</span>
                </div>
              </div>
            </div>
          </DisclosurePanel>
        </div>
      </Disclosure>

      <!-- Recurso -->
      <Disclosure v-slot="{ open }">
        <div>
          <DisclosureButton class="w-full flex justify-left items-center bg-[#4168b5] text-white px-4 py-4 pl-8 text-20 font-semibold gap-2">
            <span class="text-20">Recurso</span>
            <ChevronDownIcon class="w-8 h-8 transition-transform" :class="{ 'rotate-180': open }" />
          </DisclosureButton>
          <DisclosurePanel class="bg-white px-8 py-4">
            <div
              v-for="(versao, index) in versoesRecurso"
              :key="versao.id"
              class="border-b last:border-b-0 border-black py-3"
            >
              <div class="flex justify-between items-center">
                <div class="flex flex-col">
                  <span class="font-semibold text-15">{{ versao.nome }}</span>
                  <span class="text-15 leading-4">{{ versao.descricao }}</span>
                </div>
                <div class="flex flex-col items-end space-y-1">
                  <Toggle
                    class="scale-75"
                    :modelValue="versao.ativa"
                    @update:modelValue="() => handleToggle('recurso', index)"
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
      <div class="bg-white p-5 rounded-md shadow-lg max-w-sm w-full text-center">
        <h3 class="text-lg font-semibold mb-4">Deseja realmente alterar a versão ativa?</h3>
        <div class="flex justify-around">
          <button
            @click="confirmToggle"
            class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Sim
          </button>
          <button
            @click="cancelToggle"
            class="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
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
import { FolderIcon } from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import Toggle from '@/components/Toggle/Toggle.vue'
// import axios from 'axios' // Descomente quando for usar a API real

export default {
  name: 'Ativos',
  components: {
    Whiteboard,
    Toggle,
    FolderIcon,
    ChevronDownIcon,
    Disclosure,
    DisclosureButton,
    DisclosurePanel
  },
  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')
    const versoesCalculo = ref([])
    const versoesRecurso = ref([])

    const showConfirmation = ref(false)
    const pendingVersion = ref({ type: null, index: null })

    // 🔹 MOCK: Dados locais para visualização (remova quando tiver a API)
    const dadosMockados = {
      calculo: [
        { id: 1, nome: 'Versão 1', descricao: 'Cálculo de janeiro', data: '01/01/2025', ativa: false },
        { id: 2, nome: 'Versão 2', descricao: 'Cálculo de fevereiro', data: '01/02/2025', ativa: true },
        { id: 3, nome: 'Versão 3', descricao: 'Cálculo de março', data: '01/03/2025', ativa: false }
      ],
      recurso: [
        { id: 11, nome: 'Recurso A', descricao: 'Recurso de avaliação', ativa: false },
        { id: 12, nome: 'Recurso B', descricao: 'Recurso de revisão', ativa: true }
      ]
    }

    const carregarMock = () => {
      versoesCalculo.value = dadosMockados.calculo
      versoesRecurso.value = dadosMockados.recurso
    }

    // 🔗 Quando tiver a API, substitua por esta função:
    /*
    const fetchData = async () => {
      const [respCalculo, respRecurso] = await Promise.all([
        axios.get('/api/versoes/calculo'),
        axios.get('/api/versoes/recurso')
      ])
      versoesCalculo.value = respCalculo.data
      versoesRecurso.value = respRecurso.data
    }
    */

    const handleToggle = (type, index) => {
      const lista = type === 'calculo' ? versoesCalculo : versoesRecurso
      if (!lista.value[index].ativa) {
        pendingVersion.value = { type, index }
        showConfirmation.value = true
      }
    }

    const confirmToggle = async () => {
      const { type, index } = pendingVersion.value
      const lista = type === 'calculo' ? versoesCalculo : versoesRecurso
      const id = lista.value[index].id

      // 🔗 Quando for usar API:
      // await axios.patch(`/api/versoes/${id}/ativar`)

      lista.value.forEach((v, i) => (v.ativa = i === index))
      showConfirmation.value = false
    }

    const cancelToggle = () => {
      showConfirmation.value = false
      pendingVersion.value = { type: null, index: null }
    }

    onMounted(() => {
      carregarMock() // ➕ Troque para fetchData() quando conectar API
    })

    return {
      isSidebarMinimized,
      versoesCalculo,
      versoesRecurso,
      showConfirmation,
      handleToggle,
      confirmToggle,
      cancelToggle
    }
  }
}
</script>
