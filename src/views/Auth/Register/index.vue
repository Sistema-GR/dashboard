<template>
  <div class="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-[#003965] to-[#0073CB]">
    <div class="flex-1 flex flex-col justify-center items-center px-4 lg:px-0 py-8 lg:py-0">
      <img src="@/assets/images/logo.png" alt="Logo" class="w-1/4 lg:w-2/12 drop-shadow-lg mb-8" />
      <div class="w-full max-w-md space-y-3 px-5">
        <template v-if="googleFlow">

          <TextInput
            type="text"
            label="Matrícula"
            placeholder="00000"
            v-model="matricula"
            @keydown.enter="handleSubmit"
            :aria-label="'Campo de matrícula'"
            :error="errors.matricula"
          />

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
        </template>

        <template v-else>
          <TextInput
            type="text"
            label="Matrícula"
            placeholder="00000"
            v-model="matricula"
            @keydown.enter="handleSubmit"
            :aria-label="'Campo de matrícula'"
            :error="errors.matricula"
          />

          <TextInput
            type="text"
            label="Email"
            placeholder="E-mail"
            v-model="email"
            @keydown.enter="handleSubmit"
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

          <TextInput
            type="password"
            label="Senha"
            placeholder="Senha"
            v-model="senha"
            @keydown.enter="handleSubmit"
            :aria-label="'Campo de senha'"
            :error="errors.senha"
          />

          <TextInput
            type="password"
            label="Confirmar Senha"
            placeholder="Confirmar Senha"
            v-model="confirmarSenha"
            @keydown.enter="handleSubmit"
            :aria-label="'Campo de confirmar senha'"
            :error="errors.confirmarSenha"
          />

          <div class="pt-0.5"></div>

          <PrimaryButton
            class="w-full mt-8 bg-azure-500"
            :value="loading ? 'Carregando...' : 'Registrar'"
            @click="handleSubmit"
            :disabled="loading"
            aria-label="Botão de registrar"
          />

          <p v-if="errors.global" class="text-red-500 text-15 mt-1">{{ errors.global }}</p>

          <div class="w-full flex justify-center pt-3">
            <router-link to="/" class="text-15 text-amber-50 hover:underline -translate-y-5 mt-3">Possui login? Clique aqui</router-link>
          </div>
        </template>
      </div>
    </div>

    <div class="flex-1 hidden lg:block">
      <img src="@/assets/images/prefeitura.png" alt="Prefeitura" class="w-full h-full object-cover" />
    </div>
  </div>
</template>

<script>
import { register, apiClient } from "@/service/apiService"; // Importa a função register
import { setUserType, getDashboardRoute } from "@/service/userType";
import TextInput from "@/components/Inputs/TextInput.vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";  

export default {
  name: 'Register',
  components: { PrimaryButton, TextInput },

  data() {
    return {
      matricula: '',
      email: '',
      cpf: '',
      senha: '',
      confirmarSenha: '',
      googleFlow: false,
      pendingGoogleToken: null,
      prefilledFirstName: '',
      prefilledLastName: '',
      loading: false,
      errors: {
        matricula: null,
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
      this.googleFlow = true;
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
        matricula: null,
        email: null,
        cpf: null,
        senha: null,
        confirmarSenha: null,
        global: null,
      };

      let valid = true;

      if (this.googleFlow) {
        // Only CPF required for Google completion
        const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!this.cpf) {
          this.errors.cpf = 'O CPF é obrigatório.';
          valid = false;
        } else if (!cpfPattern.test(this.cpf)) {
          this.errors.cpf = 'Formato de CPF inválido.';
          valid = false;
        }
        return valid;
      }

      if (!this.matricula) {
        this.errors.matricula = 'Matrícula é obrigatória.';
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

      const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!this.cpf) {
        this.errors.cpf = 'O CPF é obrigatório.';
        valid = false;
      } else if (!cpfPattern.test(this.cpf)) {
        this.errors.cpf = 'Formato de CPF inválido.';
        valid = false;
      }

      if (!this.senha) {
        this.errors.senha = 'A senha é obrigatória.';
        valid = false;
      }

      if (!this.confirmarSenha) {
        this.errors.confirmarSenha = 'A confirmação de senha é obrigatória.';
        valid = false;
      } else if (this.senha !== this.confirmarSenha) {
        this.errors.confirmarSenha = 'As senhas não coincidem.';
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
        if (this.googleFlow) {
          // Complete Google registration
          const payload = { token: this.pendingGoogleToken, cpf: this.cpf, matricula: this.matricula };
          const resp = await apiClient.post('/auth/google-complete/', payload);
          const data = resp.data;
          if (!data.access || !data.refresh) {
            this.errors.global = 'Erro ao completar cadastro. Resposta inválida do servidor.';
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

          this.$router.push(getDashboardRoute());
          return;
        }

        const data = await register(this.email, this.senha, this.confirmarSenha, this.matricula, this.cpf);
        alert('Registro concluído com sucesso!');
        this.$router.push('/');  // Redireciona para a página de login
      } catch (error) {
        this.errors.global = error.message || error.response?.data?.error || 'Erro ao registrar.';
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
