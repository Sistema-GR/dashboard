<template>
  <Whiteboard title="PERMISSÕES PARA ADMINISTRADORES" :isSidebarMinimized="isSidebarMinimized">
    <!-- Bloco 1 -->
    <section class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#c2ddfd] text-black px-4 lg:px-10 p-5">
      <h2 class="text-25 font-semibold text-black">Perfil de ...</h2>
    </section>

    <!-- Tabela de Perfil -->
    <div class="mb-10 px-4 lg:px-10 w-full">
      <div class="w-full mx-auto overflow-x-auto bg-white rounded-[10px] shadow">
        <table class="w-full table-fixed">
          <thead class="bg-[#3459a2] text-white">
            <tr>
              <th class="text-left px-5 py-3 w-[33%]">Nome</th>
              <th class="text-left px-5 py-3 w-[25%]">CPF</th>
              <th class="text-left px-5 py-3 w-[33%]">Setor</th>
              <th class="text-center px-5 py-3 w-[%]"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(usuario, index) in usuariosPerfil" :key="usuario.cpf" class="border-t">
              <td class="px-5 py-3 truncate">{{ usuario.nome }}</td>
              <td class="px-5 py-3 truncate">{{ usuario.cpf }}</td>
              <td class="px-5 py-3 truncate">{{ usuario.setor }}</td>
              <td class="px-5 py-3 text-center">
                <button @click="confirmarRemocao('perfil', index)" class="text-gray-600 hover:text-red-600">
                  <TrashIcon class="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Campo para adicionar ao Perfil -->
    <div class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#e3f0ff] text-black px-4 lg:px-10 p-4">
      <label class="text-20 font-semibold">Adicionar ao Perfil</label>
      <div class="relative flex flex-row items-center w-full max-w-80 gap-3">
        <div class="relative w-full">
          <input
            v-model="novoCPFPerfil"
            @input="filtrarSugestoes('perfil')"
            @focus="mostrarSugestoesPerfil = true"
            @blur="() => setTimeout(() => mostrarSugestoesPerfil = false, 150)"
            type="text"
            class="w-full p-2 pl-4 border border-gray-300 rounded-[10px] focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar usuário por CPF"/>
          <ul v-if="mostrarSugestoesPerfil && sugestoesFiltradasPerfil.length" class="absolute z-10 bg-white border rounded-[10px] shadow w-full max-h-40 overflow-y-auto">
            <li
              v-for="(sugestao, index) in sugestoesFiltradasPerfil"
              :key="index"
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              @mousedown.prevent="selecionarSugestao('perfil', sugestao)"
            >
              {{ sugestao }}
            </li>
          </ul>
        </div>
        <button
          @click="adicionarUsuario('perfil')"
          class="bg-transparent border-2 rounded-full border-black text-black m-2 hover:border-[#003965]">
          <PlusIcon class="w-6 h-6 inline text-black hover:text-[#003965]" />
        </button>
      </div>
    </div>

    <!-- Bloco 2 -->
    <div class="mb-10 px-4 lg:px-10 w-full">
      <div class="w-full mx-auto overflow-x-auto bg-white rounded-[10px] shadow">
        <table class="w-full table-fixed">
          <thead class="bg-[#3459a2] text-white">
            <tr>
              <th class="text-left px-5 py-3 w-[33%]">Nome</th>
              <th class="text-left px-5 py-3 w-[25%]">CPF</th>
              <th class="text-left px-5 py-3 w-[33%]">Setor</th>
              <th class="text-center px-5 py-3 w-[9%]"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(usuario, index) in usuariosExemplo" :key="usuario.cpf" class="border-t">
              <td class="px-5 py-3 truncate">{{ usuario.nome }}</td>
              <td class="px-5 py-3 truncate">{{ usuario.cpf }}</td>
              <td class="px-5 py-3 truncate">{{ usuario.setor }}</td>
              <td class="px-5 py-3 text-center">
                <button @click="confirmarRemocao('exemplo', index)" class="text-gray-600 hover:text-red-600">
                  <TrashIcon class="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Campo para adicionar ao Exemplo -->
    <div class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#e3f0ff] text-black px-4 lg:px-10 p-4">
      <label class="text-20 font-semibold">Adicionar ao Exemplo</label>
      <div class="relative flex flex-row items-center w-full max-w-80 gap-3">
        <div class="relative w-full">
          <input
            v-model="novoCPFExemplo"
            @input="filtrarSugestoes('exemplo')"
            @focus="mostrarSugestoesExemplo = true"
            @blur="() => setTimeout(() => mostrarSugestoesExemplo = false, 150)"
            type="text"
            class="w-full p-2 pl-4 border border-gray-300 rounded-[10px] focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar usuário por CPF"/>
          <ul v-if="mostrarSugestoesExemplo && sugestoesFiltradasExemplo.length" class="absolute z-10 bg-white border rounded-[10px] shadow w-full max-h-40 overflow-y-auto">
            <li
              v-for="(sugestao, index) in sugestoesFiltradasExemplo"
              :key="index"
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              @mousedown.prevent="selecionarSugestao('exemplo', sugestao)"
            >
              {{ sugestao }}
            </li>
          </ul>
        </div>
        <button
          @click="adicionarUsuario('exemplo')"
          class="bg-transparent border-2 rounded-full border-black text-black m-2 hover:border-[#003965]">
          <PlusIcon class="w-6 h-6 inline text-black hover:text-[#003965]" />
        </button>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <div v-if="modalAberto" class="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
      <div class="bg-white p-6 rounded-[10px] shadow-lg w-full max-w-md">
        <h2 class="text-lg font-semibold mb-4">Tem certeza que deseja remover este servidor?</h2>
        <div class="flex justify-end gap-3">
          <button @click="modalAberto = false" class="px-4 py-2 bg-gray-300 rounded-[10px] hover:bg-gray-400">Cancelar</button>
          <button @click="removerUsuarioConfirmado" class="px-4 py-2 bg-red-600 text-white rounded-[10px] hover:bg-red-700">Remover</button>
        </div>
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

    const novoCPFPerfil = ref('')
    const novoCPFExemplo = ref('')
    const mostrarSugestoesPerfil = ref(false)
    const mostrarSugestoesExemplo = ref(false)

    const sugestoes = ref([
      '111.111.111-11 - servidor 1',
      '222.222.222-22 - servidor 2',
      '333.333.333-33 - servidor 3'
    ])

    const sugestoesFiltradasPerfil = ref([])
    const sugestoesFiltradasExemplo = ref([])

    const usuariosPerfil = ref([
      { nome: 'Servidor 1', cpf: '111.111.111-11', setor: 'Setor 1' },
      { nome: 'Servidor 2', cpf: '222.222.222-22', setor: 'Setor 2' }
    ])

    const usuariosExemplo = ref([
      { nome: 'Servidor 3', cpf: '333.333.333-33', setor: 'Setor 3' },
      { nome: 'Servidor 4', cpf: '444.444.444-44', setor: 'Setor 4' }
    ])

    const tipoRemocao = ref(null)
    const indexRemocao = ref(null)
    const modalAberto = ref(false)

    const confirmarRemocao = (tipo, index) => {
      tipoRemocao.value = tipo
      indexRemocao.value = index
      modalAberto.value = true
    }

    const removerUsuarioConfirmado = () => {
      if (tipoRemocao.value === 'perfil') {
        usuariosPerfil.value.splice(indexRemocao.value, 1)
      } else if (tipoRemocao.value === 'exemplo') {
        usuariosExemplo.value.splice(indexRemocao.value, 1)
      }
      modalAberto.value = false
    }

    const filtrarSugestoes = (tipo) => {
      const busca = (tipo === 'perfil' ? novoCPFPerfil.value : novoCPFExemplo.value).toLowerCase()
      const filtradas = sugestoes.value.filter(s => s.toLowerCase().includes(busca))
      if (tipo === 'perfil') sugestoesFiltradasPerfil.value = filtradas
      if (tipo === 'exemplo') sugestoesFiltradasExemplo.value = filtradas
    }

    const selecionarSugestao = (tipo, valor) => {
      if (tipo === 'perfil') {
        novoCPFPerfil.value = valor
        mostrarSugestoesPerfil.value = false
      } else {
        novoCPFExemplo.value = valor
        mostrarSugestoesExemplo.value = false
      }
    }

    const adicionarUsuario = (tipo) => {
      const raw = tipo === 'perfil' ? novoCPFPerfil.value : novoCPFExemplo.value
      const [cpf, ...resto] = raw.split(' - ')
      const nome = resto.join(' - ')
      if (cpf && nome) {
        const novo = { nome, cpf, setor: nome }
        if (tipo === 'perfil') usuariosPerfil.value.push(novo)
        if (tipo === 'exemplo') usuariosExemplo.value.push(novo)
        if (tipo === 'perfil') novoCPFPerfil.value = ''
        if (tipo === 'exemplo') novoCPFExemplo.value = ''
        if (tipo === 'perfil') sugestoesFiltradasPerfil.value = []
        if (tipo === 'exemplo') sugestoesFiltradasExemplo.value = []
      }
    }

    return {
      isSidebarMinimized,
      novoCPFPerfil,
      novoCPFExemplo,
      mostrarSugestoesPerfil,
      mostrarSugestoesExemplo,
      sugestoes,
      sugestoesFiltradasPerfil,
      sugestoesFiltradasExemplo,
      filtrarSugestoes,
      selecionarSugestao,
      usuariosPerfil,
      usuariosExemplo,
      adicionarUsuario,
      confirmarRemocao,
      removerUsuarioConfirmado,
      modalAberto
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