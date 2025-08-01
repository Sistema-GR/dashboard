<template>
  <Whiteboard title="PERMISSÕES PARA ADMINISTRADORES" :isSidebarMinimized="isSidebarMinimized">
      <!-- Bloco 1 -->
      <section class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#c2ddfd] text-black px-4 sm:px-10 p-5">
        <h2 class="text-25 font-semibold text-black">Perfil de ...</h2>
      </section>

      <div class="mt-1 my-5 space-y-4 shadow mb-10 px-4 sm:px-10">
        <table class=" w-full max-w-[1360.8px] bg-white rounded shadows mx-10">
          <thead class="bg-blue-600 text-white">
            <tr>
              <th class="text-left px-4 py-2">Nome</th>
              <th class="text-left px-4 py-2">CPF</th>
              <th class="text-left px-4 py-2">Setor</th>
              <th class="text-center px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuariosPerfil" :key="usuario.cpf" class="border-t">
              <td class="px-4 py-2">{{ usuario.nome }}</td>
              <td class="px-4 py-2">{{ usuario.cpf }}</td>
              <td class="px-4 py-2">{{ usuario.setor }}</td>
              <td class="px-4 py-2 text-center">
                <button class="text-gray-600 hover:text-red-600">
                  <TrashIcon class="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Campo para adicionar usuário -->
      <div class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#e3f0ff] text-black px-4 sm:px-10 p-4">
        <label class="text-20 font-semibold">Alteração de ...</label>
        <div class="relative flex flex-row items-center w-full max-w-80 gap-3">
            <div class="relative w-full">
              <input
              v-model="searchQuery"
              @input="emitSearch"
              type="text"
              class="w-full p-2 pl-4 border border-gray-300 rounded-[10px] focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar usuário por CPF"/>
              <ul v-if="mostrarSugestoes && sugestoesFiltradas.length" class="absolute z-10 bg-white border rounded shadow w-full max-h-40 overflow-y-auto">
                <li
                  v-for="(sugestao, index) in sugestoesFiltradas"
                  :key="index"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  @mousedown.prevent="selecionarSugestao(sugestao)"
                >
                  {{ sugestao }}
                </li>
              </ul>
            </div>
          <button class="bg-tranparent border-2 rounded-full border-black text-black m-2  hover:bg-blue-600">
            <PlusIcon class="w-6 h-6 inline text-black" />
          </button>
        </div>
      </div>

      <!-- Bloco 2 (exemplo adicional) -->
      <div class="overflow-x-auto bg-white rounded shadow mb-10">
        <table class="min-w-full">
          <thead class="bg-blue-600 text-white">
            <tr>
              <th class="text-left px-4 py-2">Nome</th>
              <th class="text-left px-4 py-2">CPF</th>
              <th class="text-left px-4 py-2">Setor</th>
              <th class="text-center px-4 py-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuariosExemplo" :key="usuario.cpf" class="border-t">
              <td class="px-4 py-2">{{ usuario.nome }}</td>
              <td class="px-4 py-2">{{ usuario.cpf }}</td>
              <td class="px-4 py-2">{{ usuario.setor }}</td>
              <td class="px-4 py-2 text-center">
                <button class="text-gray-600 hover:text-red-600">
                  <TrashIcon class="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

            <!-- Campo para adicionar usuário -->
      <div class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#e3f0ff] text-black px-4 sm:px-10 p-4">
        <label class="text-20 font-semibold">Alteração de ...</label>
        <div class="relative flex flex-row items-center w-full max-w-80 gap-3">
            <div class="relative w-full">
              <input
              v-model="searchQuery"
              @input="emitSearch"
              type="text"
              class="w-full p-2 pl-4 border border-gray-300 rounded-[10px] focus:ring-blue-500 focus:border-blue-500"
              placeholder="Buscar usuário por CPF"/>
              <ul v-if="mostrarSugestoes && sugestoesFiltradas.length" class="absolute z-10 bg-white border rounded shadow w-full max-h-40 overflow-y-auto">
                <li
                  v-for="(sugestao, index) in sugestoesFiltradas"
                  :key="index"
                  class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  @mousedown.prevent="selecionarSugestao(sugestao)"
                >
                  {{ sugestao }}
                </li>
              </ul>
            </div>
          <button class="bg-tranparent border-2 rounded-full border-black text-black m-2  hover:bg-blue-600">
            <PlusIcon class="w-6 h-6 inline text-black" />
          </button>
        </div>
      </div>

  </Whiteboard>
</template>

<script>
import { ref, inject } from 'vue'
import { TrashIcon, PlusIcon } from '@heroicons/vue/24/outline'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'

export default {
  name: 'PermissionsAccess',
  components: { Whiteboard, TrashIcon, PlusIcon },
  setup() {
    const isSidebarMinimized = inject('isSidebarMinimized')
    const novoCPF = ref('')
    const mostrarSugestoes = ref(false)
    const sugestoes = ref([
      '111.111.111-11 - Fulana de tal não sei o que lá',
      '222.222.222-22 - Fulana de tal não sei o que lá',
      '333.333.333-33 - Fulana de tal não sei o que lá'
    ])
    const sugestoesFiltradas = ref([])

    const filtrarSugestoes = () => {
      const busca = novoCPF.value.toLowerCase()
      sugestoesFiltradas.value = sugestoes.value.filter(s => s.toLowerCase().includes(busca))
    }

    const selecionarSugestao = (valor) => {
      novoCPF.value = valor
      mostrarSugestoes.value = false
    }

    const usuariosPerfil = ref([
      { nome: 'Fulano Fulaninho', cpf: 'XXXXX', setor: 'Fulano Fulaninho' },
      { nome: 'Fulano Fulaninho', cpf: 'XXXXX', setor: 'Fulano Fulaninho' }
    ])

    const usuariosExemplo = ref([
      { nome: 'Fulana de tal não sei o que lá', cpf: '111.111.111-11', setor: 'Fulana de tal não sei o que lá' },
      { nome: 'Fulana de tal não sei o que lá', cpf: '111.111.111-11', setor: 'Fulana de tal não sei o que lá' }
    ])

    return {
      isSidebarMinimized,
      novoCPF,
      mostrarSugestoes,
      sugestoes,
      sugestoesFiltradas,
      filtrarSugestoes,
      selecionarSugestao,
      usuariosPerfil,
      usuariosExemplo
    }
  }
}
</script>

<style scoped>
th,
td {
  white-space: nowrap;
}
</style>