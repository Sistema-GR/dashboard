<template>
  <div class="flex-1 h-screen bg-gradient-to-r from-[#003965] to-95%0% to-[#0073CB]">
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex flex-col h-screen items-center justify-center">
          <img src="@/assets/images/logo.png" alt="Logo" class="w-3/12 scale-90 drop-shadow-lg py-0" />
          <div class="w-full max-w-md space-y-3 px-5">
            <TextInput 
              type="text" 
              label="Matrícula" 
              placeholder="00000" 
              v-model="matricula" 
              :aria-label="'Campo de matrícula'" 
              :error="errors.matricula"
            />
            
            <div class="relative">
              <TextInput 
                :type="showPassword ? 'text' : 'password'" 
                label="Senha" 
                placeholder="Senha" 
                v-model="senha" 
                :aria-label="'Campo de senha'" 
                :error="errors.senha"
              />
              <button
                type="button"
                class="absolute right-3 top-14 transform -translate-y-1/2 text-gray-500"
                @click="togglePasswordVisibility"
                aria-label="Mostrar ou ocultar senha"
              >
                <span v-if="showPassword">
                  <EyeSlashIcon class="w-5 h-5" />
                </span>
                <span v-else>
                  <EyeIcon class="w-5 h-5" />
                </span>
              </button>
            </div>

            <div class="w-full flex justify-end mt-2">
              <router-link to="/forgotpassword" class="text-sm text-amber-50 hover:underline mt-0">Esqueceu sua senha?</router-link>
            </div>

            <PrimaryButton
              class="mt-8 bg-azure-500"
              :value="loading ? 'Carregando...' : 'Login'"
              custom-color="bg-azure-500"
              @click="login"
              :disabled="loading"
              aria-label="Botão de login"
            />

            <p v-if="errors.global" class="text-red-500 text-sm mt-1">{{ errors.global }}</p>

            <div class="w-full flex justify-center pt-3">
              <router-link to="/register" class="text-sm text-amber-50 hover:underline mt-0 -translate-y-5">Não possui cadastro? Clique aqui</router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-1 relative hidden lg:block">
        <img src="@/assets/images/prefeitura.png" alt="Imagem prefeitura" class="w-full h-screen" />
      </div>
    </div>
  </div>
</template>

<script>
import TextInput from "@/components/Inputs/TextInput.vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import { EyeSlashIcon, EyeIcon } from "@heroicons/vue/24/outline";

export default {
  name: 'Login',
  components: { PrimaryButton, TextInput, EyeIcon, EyeSlashIcon },

  data() {
    return {
      matricula: '',
      senha: '',
      loading: false,
      showPassword: false,
      errors: {
        matricula: null,
        senha: null,
        global: null,
      },
    };
  },

  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },

    validateForm() {
      this.errors.matricula = null;
      this.errors.senha = null;
      this.errors.global = null;

      let valid = true;

      if (!this.matricula) {
        this.errors.matricula = 'Matrícula é obrigatória.';
        valid = false;
      }

      if (!this.senha) {
        this.errors.senha = 'Senha é obrigatória.';
        valid = false;
      }

      return valid;
    },

    async login() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.errors.global = null;

      try {
        console.log('Enviando dados de login:', { username: this.matricula, password: this.senha });
        const response = await fetch('http://localhost:8000/auth/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: this.matricula,
            password: this.senha,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log('Erro ao autenticar:', errorData);
          throw new Error(errorData.detail || 'Erro ao autenticar.');
        }

        const data = await response.json();
        console.log('Resposta de login:', data);

        // Armazenar os tokens no localStorage e marcar como autenticado
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('isAuthenticated', 'true'); // Adicionando este item no localStorage
        console.log('Tokens armazenados:', {
          accessToken: localStorage.getItem('accessToken'),
          refreshToken: localStorage.getItem('refreshToken'),
        });

        // Redirecionar após login bem-sucedido
        const redirectTo = this.$route.query.redirect || '/home/overview';  // Certifique-se de que o redirect é válido
        console.log('Redirecionando para:', redirectTo);
        this.$router.push(redirectTo); // Alterar para this.$router.push
      } catch (error) {
        console.log('Erro no login:', error);
        this.errors.global = error.message || 'Erro desconhecido. Tente novamente.';
      } finally {
        this.loading = false;
      }
    },

    isAuthenticated() {
      const token = localStorage.getItem('accessToken');
      console.log('Verificando se o usuário está autenticado. Token:', token);
      if (!token) {
        this.$router.push('/');
        return false;
      }
      return true;
    },

    // Método para obter o token
    getAuthToken() {
      const token = localStorage.getItem('accessToken');
      console.log('Obtendo token:', token);
      return token;
    },

    // Método para fazer requisições autenticadas
    async fetchWithAuth(url, options = {}) {
      const token = this.getAuthToken();
      if (!token) {
        this.$router.push('/login');
        return;
      }

      console.log('Fazendo requisição autenticada para:', url);
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        console.log('Token expirado. Tentando renovar...');
        const newToken = await this.refreshAccessToken();
        if (newToken) {
          return this.fetchWithAuth(url, options); // Reenvia a requisição com o novo token
        }
      }

      return response;
    },

    async refreshAccessToken() {
      const refreshToken = localStorage.getItem('refreshToken');
      console.log('Tentando renovar o token com refreshToken:', refreshToken);
      if (!refreshToken) {
        this.$router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:8000/auth/refresh/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('accessToken', data.access);
        console.log('Novo token de acesso recebido:', data.access);
        return data.access;
      } else {
        this.$router.push('/login');
      }
    },
  },

  created() {
    console.log('Verificando autenticação...');
    if (this.isAuthenticated()) {
      console.log('Usuário autenticado, redirecionando...');
      this.$router.push('/home/overview');  // Redireciona para a home
    }
  },
};
</script>
