<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-[#003965] to-[#0073CB]">
    <div class="flex-1 flex flex-col justify-center items-center px-4 lg:px-0 py-8 lg:py-0">
      <img src="@/assets/images/logo.png" alt="Logo" class="w-1/4 lg:w-2/12 drop-shadow-lg mb-8" />
      <div class="w-full max-w-md space-y-3 px-5">
        <p class="align-center text-18 text-amber-50 -translate-y-5 mt-2">Preencha abaixo suas informações de usuário para completar o cadastro.</p>
      </div>
      <div class="w-full max-w-md space-y-3 px-5">

          <TextInput
            type="text"
            label="Email"
            placeholder="E-mail"
            v-model="email"
            :readonly="true"
            :aria-label="'Campo de e-mail'"
            :error="errors.email"
          />

          <TextInput
            type="text"
            label="CPF"
            placeholder="CPF"
            v-model="cpf"
            @keydown.enter="handleSubmit"
            :aria-label="'Campo de CPF'"
            :error="errors.cpf"
            @input="formatCPF"
          />

          <div class="pt-0.5"></div>

          <PrimaryButton
            class="w-full mt-8 bg-azure-500"
            :value="loading ? 'Carregando...' : 'Completar cadastro'"
            @click="handleSubmit"
            :disabled="loading"
            aria-label="Botão de completar cadastro"
          />

          <p v-if="errors.global" class="text-red-500 text-15 mt-1">{{ errors.global }}</p>

          <div class="w-full flex justify-center pt-3">
            <router-link to="/" class="text-15 text-amber-50 hover:underline -translate-y-5 mt-3">Possui login? Clique aqui</router-link>
          </div>
      </div>
    </div>

    <div class="flex-1 hidden lg:block">
      <img src="@/assets/images/prefeitura.png" alt="Prefeitura" class="w-full h-full object-cover" />
    </div>
  </div>
</template>

<script>
import { apiClient } from "@/service/apiService";
import { setUserType, getDashboardRoute } from "@/service/userType";
import TextInput from "@/components/Inputs/TextInput.vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";  
import { warn } from "vue";

export default {
  name: 'Register',
  components: { PrimaryButton, TextInput },

  data() {
    return {
      email: '',
      cpf: '',
      senha: '',
      confirmarSenha: '',
      pendingGoogleToken: null,
      prefilledFirstName: '',
      prefilledLastName: '',
      loading: false,
      errors: {
        email: null,
        cpf: null,
        senha: null,
        confirmarSenha: null,
        global: null,
      },
    };
  },

  mounted() {
    // Detect Google pending token saved by Login flow
    const token = localStorage.getItem('googlePendingToken');
    if (token) {
      this.pendingGoogleToken = token;
      const email = localStorage.getItem('googlePendingEmail');
      const first = localStorage.getItem('googlePendingFirstName');
      const last = localStorage.getItem('googlePendingLastName');
      if (email) this.email = email;
      if (first) this.prefilledFirstName = first;
      if (last) this.prefilledLastName = last;
    }
  },

  methods: {
    validateForm() {
      this.errors = {
        email: null,
        cpf: null,
        global: null,
      };

      let valid = true;

      const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!this.cpf) {
        this.errors.cpf = 'O CPF é obrigatório.';
        valid = false;
      } else if (!cpfPattern.test(this.cpf)) {
        this.errors.cpf = 'Formato de CPF inválido.';
        valid = false;
      }    

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.email) {
        this.errors.email = 'O e-mail é obrigatório.';
        valid = false;
      } else if (!emailPattern.test(this.email)) {
        this.errors.email = 'Formato de e-mail inválido.';
        valid = false;
      }

      return valid;
    },

    // Formatar CPF automaticamente
    formatCPF() {
      let cpf = this.cpf.replace(/\D/g, ''); // Remove qualquer coisa que não seja número
      if (cpf.length <= 11) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'); // Aplica a formatação
      }
      this.cpf = cpf; // Atualiza o valor do campo CPF
    },

    async handleSubmit() {
      if (!this.validateForm()) return;

      this.loading = true;

      try {
          // Complete Google registration
          const payload = { token: this.pendingGoogleToken, cpf: this.cpf };
          const resp = await apiClient.post('/auth/google-complete/', payload);
          const data = resp.data;
          if (!data.access || !data.refresh) {
            this.errors.global = error.response?.data?.message || 'Erro ao completar cadastro. Resposta inválida do servidor.';
            return;
          }

          localStorage.setItem('accessToken', data.access);
          localStorage.setItem('refreshToken', data.refresh);
          localStorage.setItem('isAuthenticated', 'true');
          // clear pending tokens
          localStorage.removeItem('googlePendingToken');
          localStorage.removeItem('googlePendingEmail');
          localStorage.removeItem('googlePendingFirstName');
          localStorage.removeItem('googlePendingLastName');

          if (data.user) setUserType(data.user);

          alert('Cadastro concluído com sucesso!');
          this.$router.push("/");
          return;
      } catch (error) {
        this.errors.global =  error.response?.data?.error || 'Erro ao registrar.';
      } finally {
        this.loading = false;
      }
    }
  },

  watch: {
    // Watch CPF para formatar automaticamente
    cpf(newVal) {
      this.formatCPF();
    }
  }
};
</script>
