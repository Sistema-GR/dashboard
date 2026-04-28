<template>
    <!-- Seção do título -->
    <div class="flex flex-row items-center shadow-ms w-full mb-5 bg-[#e3f0ff] text-black px-4 lg:px-10 p-4">
      <label class="text-20 font-semibold">{{titulo}}</label>
    </div>
    
    <!-- Tabela de perfis -->
    <div class="mb-10 px-4 lg:px-10 w-full">
      <div class="w-full mx-auto overflow-x-auto bg-white rounded-[10px] shadow">
        <table class="w-full table-fixed">
          <thead class="bg-[#3459a2] text-white">
            <tr>
              <th class="text-left px-5 py-3 w-[33%]">Nome</th>
              <th class="text-left px-5 py-3 w-[25%]">CPF</th>
              <th class="text-left px-5 py-3 w-[33%]">Status</th>
              <th class="text-center px-5 py-3 w-[%]"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(usuario) in [...usuarios].sort((a, b) => a.nome.localeCompare(b.nome))" :key="usuario.cpf" class="border-t">
                <td class="px-5 py-3 truncate">{{ usuario.nome.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') }}</td>
              <td class="px-5 py-3 truncate">{{ usuario.cpf }}</td>
              <td class="px-5 py-3">
              <div class="relative inline-block w-full select-wrapper">
                <select
                :disabled="usuario.id === currentUserId"
                :value="usuario.admin ? 'administrador' : usuario.staff ? 'analista' : 'usuario'"
                @change="(e) => mudarStatusUsuario(usuario, e.target.value)"
                class="custom-select w-full px-3 py-2 border border-gray-300 rounded-[10px] appearance-none"
                >
                <option value="usuario">Usuário</option>
                <option value="administrador">Administrador</option>
                <option value="analista">Analista</option>
                </select>
                <svg class="select-arrow" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M6 8L10 12L14 8" stroke="#1F2937" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </div>
              </td>
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
import { ref, onBeforeUnmount, onMounted } from 'vue'
import { apiClient } from '@/service/apiService'
import { getAccessToken } from '@/service/token'
import { TrashIcon } from '@heroicons/vue/24/outline'

const { usuarios, type, titulo } = defineProps({
  titulo: String,
  type: String,
  usuarios: Array
})

const emit = defineEmits(['update']);

const indexRemocao = ref(null)
const modalAberto = ref(false)
const currentUserId = ref(null)

// Função para mudar o status do usuário
const mudarStatusUsuario = async (usuario, novoStatus) => {

  const url = novoStatus === 'administrador' ? `/auth/users/${usuario.id}/set-user-admin/`
    : novoStatus === 'analista' ?  `/auth/users/${usuario.id}/set-user-staff/`
    : `/auth/users/${usuario.id}/set-user-regular/`


  try {
    const token = await getAccessToken()
    await apiClient.post(url, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    emit('update')
  } catch (error) {
    console.error('Erro ao alterar status:', error)
  }
}

const fetchCurrentUserId = async () => {
  try {
    const token = await getAccessToken()
    const response = await apiClient.get('/auth/users/me/', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    currentUserId.value = response.data.id
  } catch (error) {
    console.error('Erro ao buscar usuário atual:', error)
  }
}

const confirmarRemocao = (usuario) => {
    indexRemocao.value = usuarios.findIndex(u => u.cpf === usuario.cpf)
    modalAberto.value = true
}

const removerUsuarioConfirmado = () => {    
    usuarios.splice(indexRemocao.value, 1)   
    modalAberto.value = false
}


onMounted(() => {
    fetchCurrentUserId()
})

onBeforeUnmount(() => {
    // Limpeza se necessária
})

</script>

<style scoped>
/* Smooth select focus and arrow animation */
.custom-select{
  transition: box-shadow 160ms ease, transform 120ms ease, border-color 160ms ease;
  background-color: white;
}
.select-wrapper:focus-within .custom-select{
  box-shadow: 0 8px 20px rgba(52,89,162,0.12);
  transform: translateY(-2px);
  border-color: #2b63a8;
}
.select-wrapper{ position: relative; }
.select-arrow{
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  transition: transform 160ms ease, opacity 160ms ease;
  opacity: 0.9;
}
.select-wrapper:focus-within .select-arrow{
  transform: translateY(-50%) rotate(180deg) translateY(1px);
}
</style>