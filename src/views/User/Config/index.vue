<template>
  <Whiteboard title="Configurações" :isSidebarMinimized="isSidebarMinimized">
        <div class="flex flex-col w-full lg:flex-row">
            <div class="flex-1 rounded-[10px] shadow-lg">
                <div class="bg-white p-8 rounded-[10px]">
                    <form @submit.prevent="salvarConfiguracoes" class="space-y-6 max-w-2xl mx-auto">
                        <!-- Nome completo -->
                        <div>
                            <label for="nomeCompleto" class="block text-15 font-medium text-gray-700 mb-2">
                                Nome completo
                            </label>
                            <input
                                disabled
                                id="nomeCompleto"
                                v-model="formData.nomeCompleto"
                                type="text"
                                class="w-full px-4 py-3 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="Digite seu nome completo"
                            />
                        </div>

                        <!-- CPF -->
                        <div>
                            <label for="cpf" class="block text-15 font-medium text-gray-700 mb-2">
                                CPF
                            </label>
                            <input
                                disabled
                                id="cpf"
                                v-model="formData.cpf"
                                type="text"
                                class="w-full px-4 py-3 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="000.000.000-00"
                                @input="formatarCPF"
                            />
                        </div>

                        <!-- E-mail -->
                        <div>
                            <label for="email" class="block text-15 font-medium text-gray-700 mb-2">
                                E-mail
                            </label>
                            <input
                                disabled
                                id="email"
                                v-model="formData.email"
                                type="email"
                                class="w-full px-4 py-3 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                placeholder="seuemail@exemplo.com"
                            />
                        </div>

                        <!-- Senha atual -->
                        <div>
                            <label class="block text-15 font-medium text-gray-700 mb-2">Senha Atual</label>
                            <input v-model="formData.senhaAtual" type="password" class="w-full p-3 border rounded-[10px]" placeholder="Digite sua senha atual" />
                        </div>

                        <!-- Nova senha -->
                        <div>
                            <label class="block text-15 font-medium text-gray-700 mb-2">Nova Senha</label>
                            <input v-model="formData.novaSenha" type="password" class="w-full p-3 border rounded-[10px]" placeholder="Digite sua nova senha" @input="validarSenhas" />
                            <p v-if="formData.novaSenha && formData.novaSenha.length < 6" class="text-red-500 text-15 mt-1">
                                A senha deve ter pelo menos 6 caracteres
                            </p>
                        </div>

                        <!-- Confirmar nova senha -->
                        <div>
                            <label class="block text-15 font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
                            <input v-model="formData.confirmarSenha" type="password" class="w-full p-3 border rounded-[10px]" placeholder="Confirme sua nova senha" :class="{ 'border-red-500': senhasNaoConferem }" @input="validarSenhas" />
                            <p v-if="senhasNaoConferem" class="text-red-500 text-15 mt-1">
                                As senhas não conferem
                            </p>
                        </div>

                        <!-- Botão -->
                        <div class="flex justify-end pt-6">
                            <button type="submit" class="bg-[#3459a2] hover:bg-blue-700 text-white px-8 py-3 rounded-[10px]" :disabled="salvando">
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
import { ref, onMounted, reactive } from 'vue'
import Sidebar from '@/components/Sidebar/Sidebar.vue'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import { UserIcon } from '@heroicons/vue/24/outline'
import { getAccessToken } from '@/service/token'

export default {
    name: 'Configuracoes',
    components: { Whiteboard },
    setup() {
        // Injetar o valor ou usar false como fallback
        const isSidebarMinimized = inject('isSidebarMinimized', ref(false))
        
        const salvando = ref(false)
        const senhasNaoConferem = ref(false)

        // Dados do formulário
        const formData = reactive({
            nomeCompleto: '',
            cpf: '',
            email: '',
            senhaAtual: '',
            novaSenha: '',
            confirmarSenha: ''
        })

        const formatarCPF = (event) => {
            let valor = event.target.value.replace(/\D/g, '')
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            formData.value.cpf = valor
        }

        const validarSenhas = () => {
            senhasNaoConferem.value = formData.value.novaSenha !== formData.value.confirmarSenha
        }

        // Carregar dados do usuário
        const carregarDadosUsuario = async () => {
            
            const token = await getAccessToken();
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
                
                // Garantir que os dados estão sendo atribuídos corretamente
                const firstName = data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1).toLowerCase();
                const lastName = data.last_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
                
                formData.nomeCompleto = `${firstName} ${lastName}`;
                //userRole.value = data.role || 'Cargo não disponível';
                formData.cpf = data.cpf || 'Não disponível';
                formData.email = data.email || 'Não disponível';

                console.error('Erro ao carregar dados:', error)
            }
            catch (error) {
                console.error("Erro ao obter dados:", error);
                console.error('Erro ao salvar:', error)
                alert(`Erro ao salvar configurações: ${error.message}`)
            } finally {
                salvando.value = false
            }
        }

        const salvarConfiguracoes = async () => {
            salvando.value = true
            const token = localStorage.getItem('accessToken')

            try {
                const response = await fetch('http://10.203.2.98:8000/auth/user-update/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        cpf: formData.value.cpf,
                        email: formData.value.email,
                        password: formData.value.novaSenha,
                        current_password: formData.value.senhaAtual
                    })
                })

                if (!response.ok) {
                    const errData = await response.json()
                    console.error('Erro:', errData)
                    throw new Error(errData.message || 'Erro ao salvar')
                }

                alert('Configurações salvas com sucesso!')
            } catch (error) {
                console.error("Erro ao obter dados:", error);
                alert(`Erro ao salvar configurações: ${error.message}`)
            } finally {
                salvando.value = false
            }
        }
        const capitalize = (str) => str.split(' ').map(capitalize).join(' ')

        onMounted(() => {
            carregarDadosUsuario()
        })

        return {
            isSidebarMinimized,
            formData,
            formatarCPF,
            validarSenhas,
            senhasNaoConferem,
            salvarConfiguracoes,
            salvando
        }
    }
}
</script>
