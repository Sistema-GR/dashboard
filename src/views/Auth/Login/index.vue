<template>
  <div class="flex-1 h-screen bg-gradient-to-r from-[#003965] to-[#0073CB]">
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex flex-col h-screen items-center justify-center">
          <img src="@/assets/images/logo.png" alt="Logo" class="w-3/12 scale-90 drop-shadow-lg py-0" />
          <div class="w-full max-w-md space-y-3 px-5">

            <!-- Google Sign-In Button -->
            <div id="google-signin-button" class="pt-4"></div>
            <div class="flex items-center justify-center mt-4">
              <span class="text-gray-300 text-sm">@2026 SED-APT, All rights reserved.</span>
            </div>

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
        cpf: null,
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
        this.pendingGoogleToken = token;
        console.log('Google token received, sending to backend...');
      
        // Send to backend
        const axiosResponse = await apiClient.post('/auth/googleauth/', { token });
        const data = axiosResponse.data;  // Extract the actual response data from axios wrapper
        console.log('Backend response:', data);
        // If backend asks for CPF completion, save token and redirect to signup
        if (data.action === 'require_cpf') {
          // save token and optional prefill info
          localStorage.setItem('googlePendingToken', token);
          if (data.email) localStorage.setItem('googlePendingEmail', data.email);
          if (data.first_name) localStorage.setItem('googlePendingFirstName', data.first_name);
          if (data.last_name) localStorage.setItem('googlePendingLastName', data.last_name);
          console.log('Backend requires CPF completion. Redirecting to signup with Google flow...');
          this.$router.push({ name: 'signup', query: { google: 1 } });
          return;
        }

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
        localStorage.setItem('tempTargetCpf', data.user.cpf);
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
