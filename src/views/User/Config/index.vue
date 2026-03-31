<template>
  <Whiteboard title="Configurações" >
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

                    </form>
                </div>
            </div>
        </div>
    </Whiteboard>
</template>

<script>
import { ref, onMounted, reactive } from 'vue'
import { apiClient } from '@/service/apiService'
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue'
import { getAccessToken } from '@/service/token'

export default {
    name: 'Configuracoes',
    components: { Whiteboard },
    setup() {
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

        const formatarCPF = (cpf) => {
            let valor = cpf.replace(/\D/g, '')
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2')
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
            return valor
        }

        const validarSenhas = () => {
            senhasNaoConferem.value = formData.novaSenha !== formData.confirmarSenha
        }

        // Carregar dados do usuário
        const carregarDadosUsuario = async () => {
            const token = await getAccessToken();
            if (!token) {
                console.error('Token de autenticação não encontrado');
                return;
            }

            try {
                const response = await apiClient.get('/auth/user-info/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status < 200 || response.status >= 300) {
                    throw new Error('Erro ao buscar informações do usuário');
                }

                const data = response.data || {};

                const firstName = data.first_name ? data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1).toLowerCase() : '';
                const lastName = data.last_name ? data.last_name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : '';

                formData.nomeCompleto = `${firstName} ${lastName}`.trim();
                formData.cpf = data.cpf || 'Não disponível';
                formData.cpf = formatarCPF(formData.cpf);
                formData.email = data.email || 'Não disponível';
            }
            catch (error) {
                console.error('Erro ao obter dados:', error);
                alert(`Erro ao carregar configurações: ${error.message}`)
            } finally {
                salvando.value = false
            }
        }

        const salvarConfiguracoes = async () => {
            salvando.value = true
            const token = await getAccessToken()

            try {
                const payload = {
                    cpf: formData.cpf,
                    email: formData.email,
                    password: formData.novaSenha,
                    current_password: formData.senhaAtual
                }

                const response = await apiClient.put('/auth/user-update/', payload, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                })

                if (response.status < 200 || response.status >= 300) {
                    const errData = response.data
                    console.error('Erro:', errData)
                    throw new Error(errData?.message || 'Erro ao salvar')
                }

                alert('Configurações salvas com sucesso!')
            } catch (error) {
                console.error('Erro ao salvar dados:', error)
                alert(`Erro ao salvar configurações: ${error.message || error}`)
            } finally {
                salvando.value = false
            }
        }
        const capitalize = (str) => str.split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()).join(' ')

        onMounted(() => {
            carregarDadosUsuario()
        })

        return {
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
