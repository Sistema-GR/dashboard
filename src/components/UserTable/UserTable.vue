<template>
    <!-- Campo para adicionar perfis -->
    <div class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#e3f0ff] text-black px-4 lg:px-10 p-4">
      <label class="text-20 font-semibold">{{titulo}}</label>
      <div class="relative flex flex-row items-center w-full max-w-80 gap-3">
        <div class="relative w-full">
          <input
            v-model="searchCpf"
            @focus="mostrarSugestoes = true"
            @click="mostrarSugestoes = true"
            @blur="handleBlur"
            type="text"
            class="w-full p-2 pl-4 border border-gray-300 rounded-[10px] focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar usuário por CPF"/>
          <ul v-if="mostrarSugestoes && usuarios.length" class="absolute z-10 bg-white border rounded-[10px] shadow w-full max-h-40 overflow-y-auto">
            <li
              v-for="(sugestao, index) in filteredSugestoes.filter(u => u.staff === (type == 'unset'))"
              :key="index"
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              @mousedown.prevent="selecionarSugestao(sugestao)"
            >
              {{ sugestao.nome }} - {{ sugestao.cpf }}
            </li>
          </ul>
        </div>
        <button
          @click="adicionarUsuario(targetUser)"
          class="bg-transparent text-black m-2 hover:text-[#003965]">
          <PlusCircleIcon class="w-8 h-8 inline text-black hover:text-[#003965]" />
        </button>
      </div>
    </div>
    
    <!-- Tabela de perfis -->
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
            <tr v-for="(usuario) in usuarios.filter(u => u.staff === (type === 'set'))" :key="usuario.cpf" class="border-t">
              <td class="px-5 py-3 truncate">{{ usuario.nome }}</td>
              <td class="px-5 py-3 truncate">{{ usuario.cpf }}</td>
              <td class="px-5 py-3 truncate">{{ usuario.setor }}</td>
              <td class="px-5 py-3 text-center">
                <button @click="confirmarRemocao(usuario)" class="text-gray-600 hover:text-red-600">
                  <TrashIcon class="w-5 h-5 inline" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
</template>

<script setup>
import { computed, ref, onBeforeUnmount, onMounted } from 'vue'
import axios from 'axios'
import { getAccessToken } from '@/service/token'
import { TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline'

const { usuarios, type, titulo } = defineProps({
  titulo: String,
  type: String,
  usuarios: Array
})

const emit = defineEmits(['update']);
const mostrarSugestoes = ref(false)
const searchCpf = ref('')

const targetUser = ref([])

const indexRemocao = ref(null)
const modalAberto = ref(false)
    
const filteredSugestoes = computed(() =>
    usuarios.filter(
        u => u.cpf.includes(searchCpf.value.trim())
    )
)
// FUNCOES DE REMOÇÃO SEM UTILIDADE
const confirmarRemocao = (usuario) => {
    indexRemocao.value = usuarios.findIndex(u => u.cpf === usuario.cpf)
    modalAberto.value = true
}

const removerUsuarioConfirmado = () => {    
    usuarios.splice(indexRemocao.value, 1)   
    modalAberto.value = false
}

const selecionarSugestao = (valor) => {  
    targetUser.value = valor    
    mostrarSugestoes.value = false
    searchCpf.value = valor.nome
}

const adicionarUsuario = async(user) => { 
    if (!user) return
    const url = type === 'set'
        ?`/auth/users/${user.id}/set-user-staff/`
        :`/auth/users/${user.id}/unset-user-staff/`
    try {
        const token = await getAccessToken()          
        const response = await axios.post(url, {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        targetUser.value = ''
        emit('update')
    } catch (error) {
        console.error('Erro ao definir permissões:', error)
    }
}

const handleClickOutside = (event) => {
    // If the click is not inside an input or the ul, close suggestions
    if (
        !event.target.closest('.input-sugestao') &&
        !(event.type === 'mousedown' && event.target.closest('li')) &&
        !event.target.closest('.ul-sugestoes')
    ) {
        mostrarSugestoes.value = false
    }
}

const handleBlur = () => {
  setTimeout(() => {
    mostrarSugestoes.value = false
  }, 150)
}

onMounted(() => {
    document.addEventListener('mousedown', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('mousedown', handleClickOutside)
})

</script>