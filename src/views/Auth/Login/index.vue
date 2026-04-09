<template>
  <div class="flex-1 h-screen bg-gradient-to-r from-[#003965] to-[#0073CB]">
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex flex-col h-screen items-center justify-center">
          <img src="@/assets/images/logo.png" alt="Logo" class="w-3/12 scale-90 drop-shadow-lg py-0" />
          
          <!-- LOADING: exibido durante o callback do Google -->
          <div v-if="loading" class="flex flex-col items-center gap-4 mt-8">
            <svg class="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span class="text-white text-lg font-medium">Autenticando...</span>
          </div>

          <!-- BOTÃO: exibido somente quando não está em callback -->
          <div v-else class="w-full max-w-md space-y-3 px-5">
            <button
              @click="loginWithGoogle"
              class="flex w-full items-center justify-center gap-3 px-4 py-3 text-white font-bold rounded-lg bg-[#1a73e8] hover:bg-[#1558b0] transition mt-8"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" class="w-5 h-5 bg-white rounded-full p-0.5" />
              Fazer Login com o Google
            </button>

            <div class="flex items-center justify-center mt-4">
              <span class="text-gray-300 text-sm">@2026 SED-APT, All rights reserved.</span>
            </div>

            <p v-if="errors.global" class="text-red-500 text-sm mt-1">{{ errors.global }}</p>
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
import { setUserType, getDashboardRoute } from "@/service/userType";
import { apiClient } from "@/service/apiService";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

export default {
  name: 'Login',

  data() {
    return {
      // ✅ começa true se vier com ?code= na URL
      loading: new URLSearchParams(window.location.search).has('code'),
      errors: { global: null },
    };
  },

  mounted() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      this.handleGoogleCallback(code);
    }
  },

  methods: {
    loginWithGoogle() {
      const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account',
      });
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    },

    async handleGoogleCallback(code) {
      // loading já está true desde o data()
      this.errors.global = null;
      window.history.replaceState({}, document.title, window.location.pathname);

      try {
        const axiosResponse = await apiClient.post('/auth/googleauth/', {
          code,
          redirect_uri: REDIRECT_URI,
        });
        const data = axiosResponse.data;

        if (data.action === 'require_cpf') {
          localStorage.setItem('googlePendingToken', data.id_token);
          if (data.email) localStorage.setItem('googlePendingEmail', data.email);
          if (data.first_name) localStorage.setItem('googlePendingFirstName', data.first_name);
          if (data.last_name) localStorage.setItem('googlePendingLastName', data.last_name);
          this.$router.push({ name: 'signup', query: { google: 1 } });
          return;
        }

        if (!data.access || !data.refresh) {
          this.errors.global = 'Erro ao processar autenticação. Resposta inválida do servidor.';
          this.loading = false;
          return;
        }

        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        localStorage.setItem('isAuthenticated', 'true');

        if (data.user) setUserType(data.user);
        const redirectTo = this.$route.query.redirect || getDashboardRoute();
        
        this.$router.push(redirectTo);

      } catch (error) {
        console.error('Google sign-in error:', error);
        this.errors.global = error.response?.data?.error || 'Falha no login com Google. Tente novamente.';
        this.loading = false; // ✅ só esconde o loading se der erro
      }
    },
  },
};
</script>