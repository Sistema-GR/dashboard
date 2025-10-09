<template>
  <Whiteboard title="PERMISSÕES PARA ADMINISTRADORES" >
    <!-- Bloco 1 -->
    <section class="flex flex-row items-center justify-between shadow-ms w-full mb-5 bg-[#c2ddfd] text-black px-4 lg:px-10 p-5">
      <h2 class="text-25 font-semibold text-black">Perfil do administrador</h2>
    </section>

    <!-- Alteração -->
    <UserTable 
      titulo="Perfil de Alteração"
      type="set"
      @update="fetchUsers"
      :usuarios="usuarios">
    </UserTable>

    <!-- Visualização -->
    <UserTable 
    titulo="Perfil de Visualização"
    type="unset"
    @update="fetchUsers"
    :usuarios="usuarios">
    </UserTable>

  </Whiteboard>
</template>

<script>
import { onMounted, ref } from 'vue'
import axios from 'axios'
import { getAccessToken } from '@/service/token'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import UserTable from '@/components/UserTable/UserTable.vue'

export default {
  name: 'PermissionsAccess',
  components: { Whiteboard, UserTable },
  setup() {
    const usuarios = ref([])

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
    })

    return {
      usuarios,
      fetchUsers
    }
  }
}
</script>