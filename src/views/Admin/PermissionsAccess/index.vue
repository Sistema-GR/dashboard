<template>
  <Whiteboard title="Controle de Acessos">
    <!-- Container da Tabela com espaçamento aprimorado -->
    <div class="p-6 bg-white">
      <div class="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
        <UserTable 
          titulo="Lista de Usuários e Cargos"
          @update="fetchUsers"
          :usuarios="usuarios"
          class="min-w-full"
        />
      </div>
    </div>

  </Whiteboard>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { apiClient } from '@/service/apiService'
import { getAccessToken } from '@/service/token'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import UserTable from '@/components/UserTable/UserTable.vue'
import { InformationCircleIcon } from '@heroicons/vue/24/outline'

export default {
  name: 'PermissionsAccess',
  components: { Whiteboard, UserTable, InformationCircleIcon },
  
  setup() {
    const usuarios = ref([])

    // Estatísticas computadas para o header moderno
    const totalAdmins = computed(() => usuarios.value.filter(u => u.admin).length)
    const totalStaff = computed(() => usuarios.value.filter(u => u.staff).length)

    const fetchUsers = async () => {
      try {
        const token = await getAccessToken()
        const response = await apiClient.get('/auth/users/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        // Mapeamento mantido conforme original
        usuarios.value = response.data.users.map(user => ({
          nome: user.full_name,
          cpf: user.cpf,
          staff: user.is_staff,
          admin: user.is_superuser,
          id: user.id,
        }))

      } catch (error) {
        console.error('Erro ao buscar usuários:', error)
      }
    }
    
    onMounted(() => {
      fetchUsers()
    })

    return {
      usuarios,
      fetchUsers,
      totalAdmins,
      totalStaff
    }
  }
}
</script>

<style scoped>
/* Estilização opcional para suavizar a entrada da tabela */
.min-w-full {
  transition: all 0.3s ease-in-out;
}
</style>