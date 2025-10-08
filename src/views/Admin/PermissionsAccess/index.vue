<template>
  <Whiteboard title="PERMISSÕES PARA ADMINISTRADORES" >
    <!-- Bloco 1 -->
    <section class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#c2ddfd] text-black px-4 lg:px-10 p-5">
      <h2 class="text-25 font-semibold text-black">Perfil do administrador</h2>
    </section>
    <!-- Campo para adicionar ao Perfil de alteração -->
    <div class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#e3f0ff] text-black px-4 lg:px-10 p-4">
      <label class="text-20 font-semibold">Perfil de alteração</label>
      <div class="relative flex flex-row items-center w-full max-w-80 gap-3">
        <div class="relative w-full">
          <input
            v-model="targetUserSet.nome"
            @click="mostrarSugestoes = true; activeInput = 'set'"
            @blur="() => setTimeout(() => mostrarSugestoes = false, 150)"
            type="text"
            class="w-full p-2 pl-4 border border-gray-300 rounded-[10px] focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar usuário por CPF"/>
          <ul v-if="mostrarSugestoes && activeInput=== 'set' && usuarios.length" class="absolute z-10 bg-white border rounded-[10px] shadow w-full max-h-40 overflow-y-auto">
            <li
              v-for="(sugestao, index) in usuarios.filter(u => u.staff === false)"
              :key="index"
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              @mousedown.prevent="selecionarSugestao('set', sugestao)"
            >
              {{ sugestao.nome }} - {{ sugestao.cpf }}
            </li>
          </ul>
        </div>
        <button
          @click="adicionarUsuario('set', targetUserSet)"
          class="bg-transparent text-black m-2 hover:text-[#003965]">
          <PlusCircleIcon class="w-8 h-8 inline text-black hover:text-[#003965]" />
        </button>
      </div>
    </div>
    
    <!-- Tabela de perfil de alteração -->
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
            <tr v-for="(usuario, index) in usuarios.filter(u => u.staff === true)" :key="usuario.cpf" class="border-t">
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

    <!-- Campo para adicionar perfil de visualização -->
    <div class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#e3f0ff] text-black px-4 lg:px-10 p-4">
      <label class="text-20 font-semibold">Perfil de visualização</label>
      <div class="relative flex flex-row items-center w-full max-w-80 gap-3">
        <div class="relative w-full">
          <input
            v-model="targetUserUnset.nome"
            @focus="mostrarSugestoes = true; activeInput = 'unset'"
            @blur="() => setTimeout(() => mostrarSugestoes = false, 150)"
            type="text"
            class="w-full p-2 pl-4 border border-gray-300 rounded-[10px] focus:ring-blue-500 focus:border-blue-500"
            placeholder="Buscar usuário por CPF"/>
          <ul v-if="mostrarSugestoes && activeInput=== 'unset' && usuarios.length" class="absolute z-10 bg-white border rounded-[10px] shadow w-full max-h-40 overflow-y-auto">
            <li
              v-for="(sugestao, index) in usuarios.filter(u => u.staff === true)"
              :key="index"
              class="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              @mousedown.prevent="selecionarSugestao('unset', sugestao)"
            >
              {{ sugestao.nome }} - {{ sugestao.cpf }}
            </li>
          </ul>
        </div>
        <button
          @click="adicionarUsuario('unset', targetUserUnset)"
          class="bg-transparent text-black m-2 hover:text-[#003965]">
          <PlusCircleIcon class="w-8 h-8 inline text-black hover:text-[#003965]" />
        </button>
      </div>
    </div>

    <!-- Perfil de visualização -->
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
            <tr v-for="(usuario, index) in usuarios.filter(u => u.staff === false)" :key="usuario.cpf" class="border-t">
              <td class="px-5 py</tr>-3 truncate">{{ usuario.nome }}</td>
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
import { onMounted, ref, onBeforeUnmount, watch } from 'vue'
import axios from 'axios'
import { getAccessToken } from '@/service/token'
import { TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'

export default {
  name: 'PermissionsAccess',
  components: { Whiteboard, TrashIcon, PlusCircleIcon },
  setup() {
    const mostrarSugestoes = ref(false)
    const activeInput = ref(null)

    const targetUserSet = ref([])
    const targetUserUnset = ref([])
    const usuarios = ref([])

    const tipoRemocao = ref(null)
    const indexRemocao = ref(null)
    const modalAberto = ref(false)
    
    // FUNCOES DE REMOÇÃO SEM UTILIDADE
    const confirmarRemocao = (tipo, index) => {
      tipoRemocao.value = tipo
      indexRemocao.value = index
      modalAberto.value = true
    }

    const removerUsuarioConfirmado = () => {
      if (tipoRemocao.value === 'perfil') {
        usuarios.value.splice(indexRemocao.value, 1)
      } else if (tipoRemocao.value === 'exemplo') {
        usuarios.value.splice(indexRemocao.value, 1)
      }
      modalAberto.value = false
    }

    const selecionarSugestao = (tipo, valor) => {      
      if (tipo === 'set'){
        targetUserSet.value = valor
        targetUserUnset.value = ''
      }else{
        targetUserUnset.value = valor
        targetUserSet.value = ''
      }
      mostrarSugestoes.value = false
      activeInput.value = null
    }

    const adicionarUsuario = async(tipo, user) => { 
      if (!user) return
      const url = tipo === 'set'
        ?`/auth/users/${user.id}/set-user-staff/`
        :`/auth/users/${user.id}/unset-user-staff/`
      try {
          const token = await getAccessToken()          
          const response = await axios.post(url, {}, {
              headers: {
                        'Authorization': `Bearer ${token}`
                      }
          })
          targetUserSet.value = ''
          targetUserUnset.value = ''
          await fetchUsers()
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
        activeInput.value = null
      }
    }

    const fetchUsers = async () => {
      try {
        const token = await getAccessToken()
        const response = await axios.get('/auth/users/', {
          headers: {
                        'Authorization': `Bearer ${token}`
                    }
        })
        usuarios.value = response.data.users.map(user => ({
        nome: user.full_name,
        cpf: user.cpf,
        staff: user.is_staff,
        id: user.id,
        }))

      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
      }
    }
    
    onMounted(() => {
      fetchUsers()
      document.addEventListener('mousedown', handleClickOutside)
    })
    onBeforeUnmount(() => {
      document.removeEventListener('mousedown', handleClickOutside)
    })

    return {
      activeInput,
      targetUserSet,
      targetUserUnset,
      mostrarSugestoes,
      selecionarSugestao,
      usuarios,
      adicionarUsuario,
      confirmarRemocao,
      removerUsuarioConfirmado,
      modalAberto
    }
  }
}
</script>