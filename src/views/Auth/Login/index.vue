<template>
  <div class="flex-1 h-screen bg-gradient-to-r from-[#003965] to-[#0073CB]">
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex flex-col h-screen items-center justify-center">
          <img src="@/assets/images/logo.png" alt="Logo" class="w-3/12 scale-90 drop-shadow-lg py-0" />
          <div class="w-full max-w-md space-y-3 px-5">
            <TextInput 
              type="email" 
              label="E-mail" 
              placeholder="Digite seu e-mail" 
              v-model="email" 
              @keydown.enter="login"
              :aria-label="'Campo de e-mail'" 
              :error="errors.email"
            />
            
            <div class="relative">
              <TextInput 
                :type="showPassword ? 'text' : 'password'" 
                label="Senha" 
                placeholder="Senha" 
                v-model="senha" 
                @keydown.enter="login"
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
              <router-link to="/auth/forgotpassword" class="text-15 text-amber-50 hover:underline mt-0">Esqueceu sua senha?</router-link>
            </div>

            <PrimaryButton
              class="mt-8 bg-azure-500"
              :value="loading ? 'Carregando...' : 'Login'"
              custom-color="bg-azure-500"
              @click="login"
              :disabled="loading"
              aria-label="Botão de login"
            />

            <p v-if="errors.global" class="text-red-500 text-15 mt-1">{{ errors.global }}</p>

            <div class="w-full flex justify-center pt-3">
              <router-link to="/auth/register" class="text-15 text-amber-50 hover:underline mt-0 -translate-y-5">Não possui cadastro? Clique aqui</router-link>
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
import { login } from "@/service/apiService";  
import { setUserType, getDashboardRoute } from "@/service/userType";

export default {
  name: 'Login',
  components: { PrimaryButton, TextInput, EyeIcon, EyeSlashIcon },

  data() {
    return {
      email: '',
      senha: '',
      loading: false,
      showPassword: false,
      errors: {
        email: null,
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
      this.errors.email = null;
      this.errors.senha = null;
      this.errors.global = null;

      let valid = true;

      if (!this.email) {
        this.errors.email = 'E-mail é obrigatório.';
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

        const data = await login(this.email, this.senha);


        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Store user type information using the service
        if (data.user) {
          setUserType(data.user);
        }
        

        // Determine redirect based on user type
        let redirectTo = this.$route.query.redirect;
        if (!redirectTo) {
          redirectTo = getDashboardRoute();
        }
        
        this.$router.push(redirectTo);
      } catch (error) {
        this.errors.global = error.message || 'Erro desconhecido. Tente novamente.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
