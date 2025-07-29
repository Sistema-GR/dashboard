<template>
    <Sidebar :route="'admin'" @update:isSidebarMinimized="handleSidebarMinimized" class="z-50"/>
    <Whiteboard title="Configurações" class="overflow-auto z-40 relative" :isSidebarMinimized="isSidebarMinimized">
        
        <div class="flex flex-col w-full lg:flex-row">
            <div class="flex-1 rounded-lg shadow-lg">
                
                <!-- Formulário (sem header duplicado) -->
                <div class="bg-white p-8 rounded-lg">
                    <form @submit.prevent="salvarConfiguracoes" class="space-y-6 max-w-2xl mx-auto">
                        
                        <!-- Nome completo -->
                        <div>
                            <label for="nomeCompleto" class="block text-sm font-medium text-gray-700 mb-2">
                                Nome completo
                            </label>
                            <input
                                id="nomeCompleto"
                                v-model="formData.nomeCompleto"
                                type="text"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="Digite seu nome completo"
                            />
                        </div>

                        <!-- CPF -->
                        <div>
                            <label for="cpf" class="block text-sm font-medium text-gray-700 mb-2">
                                CPF
                            </label>
                            <input
                                id="cpf"
                                v-model="formData.cpf"
                                type="text"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="000.000.000-00"
                                @input="formatarCPF"
                            />
                        </div>

                        <!-- E-mail -->
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                                E-mail
                            </label>
                            <input
                                id="email"
                                v-model="formData.email"
                                type="email"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="seuemail@exemplo.com"
                            />
                        </div>

                        <!-- Senha -->
                        <div>
                            <label for="senha" class="block text-sm font-medium text-gray-700 mb-2">
                                Senha
                            </label>
                            <input
                                id="senha"
                                v-model="formData.senha"
                                type="password"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="Digite sua senha"
                            />
                        </div>

                        <!-- Botão Salvar e Avatar -->
                        <div class="flex items-center justify-between pt-6">
                            <button
                                type="submit"
                                class="bg-[#3459a2] hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                :disabled="salvando"
                            >
                                {{ salvando ? 'Salvando...' : 'Salvar' }}
                            </button>
                            
                            <!-- Avatar do usuário -->
                            <div class="relative">
                                <div class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border-2 border-gray-300">
                                    <img 
                                        v-if="userAvatar" 
                                        :src="userAvatar" 
                                        alt="Avatar do usuário" 
                                        class="w-full h-full object-cover"
                                    />
                                    <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                                        <UserIcon class="w-6 h-6 text-gray-500" />
                                    </div>
                                </div>
                                <!-- Indicador de notificação -->
                                <div class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        </div>

    </Whiteboard>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import { UserIcon } from '@heroicons/vue/24/outline'

export default {
    name: "Configuracoes",
    components: {
        Sidebar,
        Whiteboard,
        UserIcon
    },
    setup() {
        const router = useRouter()
        const isSidebarMinimized = ref(false)
        const salvando = ref(false)
        const userAvatar = ref(null)

        // Dados do formulário
        const formData = ref({
            nomeCompleto: '',
            cpf: '',
            email: '',
            senha: ''
        })

        // Gerenciar estado da sidebar
        const handleSidebarMinimized = (value) => {
            isSidebarMinimized.value = value
        }

        // Formatar CPF
        const formatarCPF = (event) => {
            let valor = event.target.value.replace(/\D/g, '')
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            formData.value.cpf = valor
        }

        // Salvar configurações
        const salvarConfiguracoes = async () => {
            salvando.value = true
            
            try {
                // AQUI: Manter a lógica existente de integração com backend
                console.log('Salvando configurações:', formData.value)
                
                setTimeout(() => {
                    salvando.value = false
                    alert('Configurações salvas com sucesso!')
                }, 1000)
                
            } catch (error) {
                salvando.value = false
                console.error('Erro ao salvar:', error)
                alert('Erro ao salvar configurações')
            }
        }

        // Carregar dados do usuário
        const carregarDadosUsuario = async () => {
            try {
                // AQUI: Manter a lógica existente de busca do backend
                formData.value = {
                    nomeCompleto: '',
                    cpf: '',
                    email: '',
                    senha: ''
                }
                
            } catch (error) {
                console.error('Erro ao carregar dados:', error)
            }
        }

        onMounted(() => {
            carregarDadosUsuario()
        })

        return {
            isSidebarMinimized,
            handleSidebarMinimized,
            formData,
            formatarCPF,
            salvarConfiguracoes,
            salvando,
            userAvatar
        }
    }
}
</script>
