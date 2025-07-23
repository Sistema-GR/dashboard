<template>
    <Whiteboard title="Configurações" :isSidebarMinimized="isSidebarMinimized">
        <div class="flex w-full gap-4 p-4 mb-4 bg-white rounded-lg shadow-sm, shadow-none">
            <div class="flex p-1 bg-gray-100 rounded-full shadow-md">
                <img class="w-24 object-cover h-auto rounded-lg" src="@/assets/images/profile-pattern.png" />

            </div>
  
            <div class="flex flex-row justify-between w-full items-center">
                <div class="flex flex-col gap-1">
                    <p class="text-lg font-semibold text-gray-800">{{ userFullName }}</p>
                    <p class="text-sm text-gray-600">{{ userRole }}</p>
                </div>
    
                <SecondaryButton label="Editar" class="mt-2 w-full lg:w-1/12"/>
            </div>
        </div>
  
        <div class="flex flex-col w-full gap-6 border-t-2 pt-6">
            <p class="text-xl font-semibold text-gray-800">Dados Cadastrais</p>
  
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5">
                <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">Nome</p>
                    <input type="text" v-model="userFullName" disabled class="w-full p-2 border rounded-lg bg-gray-100" />
                </div>
    
                <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">CPF</p>
                    <input type="text" v-model="userCpf" disabled class="w-full p-2 border rounded-lg bg-gray-100" />
                </div>
    
                <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">E-mail</p>
                    <input type="email" v-model="userEmail" disabled class="w-full p-2 border rounded-lg bg-gray-100" />
                </div>
    
                <div>
                    <p class="text-sm font-medium text-gray-700 mb-2">Senha</p>
                    <input type="password" v-model="userPassword" disabled class="w-full p-2 border rounded-lg bg-gray-100" />
                </div>
            </div>
        </div>
    </Whiteboard>
</template>

<script>
import SecondaryButton from '@/components/Buttons/SecondaryButton.vue';
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';
import { inject, onMounted, ref } from 'vue';

export default {
    name: "Config",
    components: { Whiteboard, SecondaryButton },

    setup() {
        const isSidebarMinimized = inject('isSidebarMinimized');
        
        const userFullName = ref('');
        const userRole = ref('');
        const userCpf = ref('');
        const userEmail = ref('');
        const userPassword = ref('*****'); // Adicionado para a senha

        const fetchUserInfo = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                console.error("Token de autenticação não encontrado");
                return;
            }

            try {
                const response = await fetch("http://127.0.0.1:8000/auth/user-info/", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Erro ao buscar informações do usuário");
                }

                const data = await response.json();
                
                // Verifique os dados recebidos
                console.log("Dados recebidos da API:", data);

                // Garantir que os dados estão sendo atribuídos corretamente
                const firstName = data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1).toLowerCase();
                const lastName = data.last_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');

                userFullName.value = `${firstName} ${lastName}`;
                userRole.value = data.role || 'Cargo não disponível';
                userCpf.value = data.cpf || 'Não disponível';
                userEmail.value = data.email || 'Não disponível';

                // Verifique o valor das variáveis
                console.log("userFullName:", userFullName.value);
                console.log("userRole:", userRole.value);
                console.log("userCpf:", userCpf.value);
                console.log("userEmail:", userEmail.value);

            } catch (error) {
                console.error("Erro ao obter dados:", error);
            }
        };

        onMounted(() => {
            fetchUserInfo();
        });

        return {
            isSidebarMinimized,
            userFullName,
            userRole,
            userCpf,
            userEmail,
            userPassword // Retornar a variável para a senha
        };
    }
};
</script>
