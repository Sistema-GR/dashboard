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

                        <!-- Senha Atual -->
                        <div>
                            <label for="senhaAtual" class="block text-sm font-medium text-gray-700 mb-2">
                                Senha Atual
                            </label>
                            <input
                                id="senhaAtual"
                                v-model="formData.senhaAtual"
                                type="password"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="Digite sua senha atual"
                            />
                        </div>

                        <!-- Nova Senha -->
                        <div>
                            <label for="novaSenha" class="block text-sm font-medium text-gray-700 mb-2">
                                Nova Senha
                            </label>
                            <input
                                id="novaSenha"
                                v-model="formData.novaSenha"
                                type="password"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="Digite sua nova senha"
                                @input="validarSenhas"
                            />
                            <p v-if="formData.novaSenha && formData.novaSenha.length < 6" class="text-red-500 text-sm mt-1">
                                A senha deve ter pelo menos 6 caracteres
                            </p>
                        </div>

                        <!-- Confirmar Nova Senha -->
                        <div>
                            <label for="confirmarSenha" class="block text-sm font-medium text-gray-700 mb-2">
                                Confirmar Nova Senha
                            </label>
                            <input
                                id="confirmarSenha"
                                v-model="formData.confirmarSenha"
                                type="password"
                                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                :class="{ 'border-red-500': senhasNaoConferem }"
                                placeholder="Confirme sua nova senha"
                                @input="validarSenhas"
                            />
                            <p v-if="senhasNaoConferem" class="text-red-500 text-sm mt-1">
                                As senhas não conferem
                            </p>
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
            senhaAtual: '',
            novaSenha: '',
            confirmarSenha: ''
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

        // Validar senhas
        const validarSenhas = () => {
            senhasNaoConferem.value = formData.value.novaSenha !== formData.value.confirmarSenha
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
                    senhaAtual: '',
                    novaSenha: '',
                    confirmarSenha: ''
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
