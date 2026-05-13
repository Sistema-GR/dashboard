<template>
  <div class="flex flex-col w-full">
    <!-- Seção do título integrada -->
    <div class="flex items-center justify-between px-6 py-5 bg-white">
      <h2 class="text-lg font-bold text-gray-800">{{ titulo }}</h2>
      <span class="text-xs font-medium text-gray-400 uppercase tracking-widest">{{ filteredUsuarios.length }} de {{ usuarios.length }} Usuários</span>
    </div>
    
    <!-- Barra de Pesquisa e Filtros -->
    <div class="px-6 pt-6 pb-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <!-- Search Bar -->
        <div class="flex-1 relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Buscar por nome..."
            class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Filter Dropdown -->
        <div class="relative select-wrapper">
          <select
            v-model="selectedRole"
            class="px-4 py-2.5 text-sm border border-gray-200 rounded-lg appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer hover:border-gray-300 min-w-[180px]"
          >
            <option value="">Todos os Papéis</option>
            <option value="usuario">Usuário Comum</option>
            <option value="analista">Analista (Staff)</option>
            <option value="administrador">Administrador</option>
          </select>
          <ChevronDownIcon class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none text-gray-400" />
        </div>
      </div>
    </div>
    
    <!-- Tabela de perfis -->
    <div class="px-6 pb-6">
      <div class="overflow-hidden border border-gray-100 rounded-xl shadow-sm bg-white">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-gray-100">
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[40%]">Usuário</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[20%]">CPF</th>
              <th class="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[30%]">Nível de Acesso</th>
              <th class="px-6 py-4 text-center w-[10%]"></th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-50">
            <tr 
              v-for="(usuario) in [...filteredUsuarios].sort((a, b) => a.nome.localeCompare(b.nome))" 
              :key="usuario.cpf" 
              class="hover:bg-blue-50/30 transition-colors group"
            >
              <!-- Nome com Avatar -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs shrink-0">
                    {{ usuario.nome.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() }}
                  </div>
                  <span class="font-medium text-gray-700 truncate capitalize">
                    {{ usuario.nome.toLowerCase() }}
                  </span>
                </div>
              </td>

              <!-- CPF -->
              <td class="px-6 py-4 text-sm text-gray-500 font-mono">
                {{ usuario.cpf }}
              </td>

              <!-- Seletor de Status -->
              <td class="px-6 py-4">
                <div class="relative select-wrapper max-w-[200px]">
                  <select
                    :disabled="usuario.id === currentUserId"
                    :value="usuario.admin ? 'administrador' : usuario.staff ? 'analista' : 'usuario'"
                    @change="(e) => mudarStatusUsuario(usuario, e.target.value)"
                    :class="[
                      'w-full pl-3 pr-8 py-1.5 text-sm font-medium border rounded-lg appearance-none transition-all outline-none',
                      usuario.admin ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 
                      usuario.staff ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 
                      'bg-gray-50 border-gray-200 text-gray-700'
                    ]"
                  >
                    <option value="usuario">Usuário Comum</option>
                    <option value="analista">Analista (Staff)</option>
                    <option value="administrador">Administrador</option>
                  </select>
                  <ChevronDownIcon class="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none opacity-60" />
                </div>
              </td>

              <!-- Ações -->
              <td class="px-6 py-4 text-right">
                <button 
                  v-if="usuario.id !== currentUserId"
                  @click="confirmarRemocao(usuario)" 
                  class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  title="Remover usuário"
                >
                  <TrashIcon class="w-5 h-5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmação (Modernizado com Backdrop Blur) -->
    <transition name="fade">
      <div v-if="modalAberto" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" @click="modalAberto = false"></div>
        <div class="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <TrashIcon class="h-6 w-6 text-red-600" />
          </div>
          <h2 class="text-xl font-bold text-gray-900 mb-2">Remover Usuário?</h2>
          <p class="text-gray-500 mb-6 text-sm">Esta ação não pode ser desfeita. O acesso do servidor será revogado imediatamente.</p>
          
          <div class="flex flex-col gap-2">
            <button @click="removerUsuarioConfirmado" class="w-full py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200">
              Confirmar Remoção
            </button>
            <button @click="modalAberto = false" class="w-full py-2.5 bg-gray-100 text-gray-600 font-semibold rounded-xl hover:bg-gray-200 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { apiClient } from '@/service/apiService'
import { getAccessToken } from '@/service/token'
import { TrashIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const { usuarios, titulo } = defineProps({
  titulo: String,
  usuarios: Array
})

const emit = defineEmits(['update']);

const indexRemocao = ref(null)
const modalAberto = ref(false)
const currentUserId = ref(null)
const searchTerm = ref('')
const selectedRole = ref('')

// Computed property para filtrar usuários baseado em busca e papel
const filteredUsuarios = computed(() => {
  return usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    let matchesRole = true
    if (selectedRole.value) {
      const userRole = usuario.admin ? 'administrador' : usuario.staff ? 'analista' : 'usuario'
      matchesRole = userRole === selectedRole.value
    }
    
    return matchesSearch && matchesRole
  })
})

const mudarStatusUsuario = async (usuario, novoStatus) => {
  const url = novoStatus === 'administrador' ? `/auth/users/${usuario.id}/set-user-admin/`
    : novoStatus === 'analista' ?  `/auth/users/${usuario.id}/set-user-staff/`
    : `/auth/users/${usuario.id}/set-user-regular/`

  try {
    const token = await getAccessToken()
    await apiClient.post(url, {}, {
      headers: { 'Authorization': `Bearer ${token}` }
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
      headers: { 'Authorization': `Bearer ${token}` }
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
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Custom select styling */
.select-wrapper select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25em 1.25em;
  padding-right: 2.5rem;
}

/* Custom scrollbar untuk tabel jika diperlukan */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}
.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}
</style>