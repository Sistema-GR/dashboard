<template>
  <div class="flex-1 h-screen bg-gradient-to-r from-[#003965] to-[#0073CB]">
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex flex-col h-screen items-center justify-center">
          <img src="@/assets/images/logo.png" alt="Logo" class="w-3/12 scale-90 drop-shadow-lg py-0" />
          <div class="w-full max-w-md space-y-3 px-5">

            <!-- Google Sign-In Button -->
            <div id="google-signin-button" ></div>

            <!-- OLD BUTTONS

            <div 
            class="flex w-full items-center justify-center px-2 py-4 text-white rounded-[10px] font-bold bg-azure-500 mt-8 mb-4">
            </div>

            <PrimaryButton
              class="mt-8 bg-azure-500"
              :value="loading ? 'Carregando...' : 'Login'"
              custom-color="bg-azure-500"
              @click="login"
              :disabled="loading"
              aria-label="Botão de login"
            />

            -->

            <p v-if="errors.global" class="text-red-500 text-15 mt-1">{{ errors.global }}</p>

            <div class="w-full flex justify-center pt-3">
              <router-link to="/auth/signup" class="text-15 text-amber-50 hover:underline mt-0 -translate-y-5">Não possui cadastro? Clique aqui</router-link>
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
import { setUserType, getDashboardRoute } from "@/service/userType";
import { apiClient } from "@/service/apiService";


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

  mounted() {
    // Load Google Identity Services script
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // Initialize Google Sign-In after script loads
    script.onload = () => {
      google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: this.handleGoogleSignIn
      });
      
      google.accounts.id.renderButton(
        document.getElementById('google-signin-button'),
        { theme: 'filled_blue', size: 'large' }
      );
    };
  },

  methods: {
    async handleGoogleSignIn(response) {
      this.loading = true;
      this.errors.global = null;

      try {
        const token = response.credential;
        console.log('Google token received, sending to backend...');
      
        // Send to backend
        const axiosResponse = await apiClient.post('/auth/googleauth/', { token });
        const data = axiosResponse.data;  // Extract the actual response data from axios wrapper
        
        // Check if response contains tokens
        if (!data.access || !data.refresh) {
          console.error('Backend did not return tokens. Response:', data);
          this.errors.global = 'Erro ao processar autenticação. Resposta inválida do servidor.';
          return;
        }
        
        // Store JWT tokens (same as traditional login)
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
        console.error('Google sign-in error:', error);
        console.error('Error response:', error.response?.data);
        this.errors.global = error.response?.data?.error || 'Falha no login com Google. Tente novamente.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
