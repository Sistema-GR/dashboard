<template>
    <div class="min-h-screen flex flex-col lg:flex-row bg-gradient-to-r from-[#003965] to-[#0073CB]">
      <div class="flex-1 flex flex-col justify-center items-center px-4 lg:px-0 py-8 lg:py-0">
        <img src="@/assets/images/logo.png" alt="Logo" class="w-1/4 lg:w-2/12 drop-shadow-lg mb-8" />
        <div class="w-full max-w-md space-y-3 px-5">
          <!-- Matrícula -->
          <TextInput
            type="text"
            label="Matrícula"
            placeholder="00000"
            v-model="matricula"
            :aria-label="'Campo de matrícula'"
            :error="errors.matricula"
          />
  
          <!-- Email -->
          <TextInput
            type="text"
            label="Email"
            placeholder="E-mail"
            v-model="email"
            :aria-label="'Campo de e-mail'"
            :error="errors.email"
          />
  
          <!-- CPF -->
          <TextInput
            type="text"
            label="CPF"
            placeholder="CPF"
            v-model="cpf"
            :aria-label="'Campo de CPF'"
            :error="errors.cpf"
          />
  
          <!-- Senha -->
          <TextInput
            type="password"
            label="Senha"
            placeholder="Senha"
            v-model="senha"
            :aria-label="'Campo de senha'"
            :error="errors.senha"
          />
  
          <!-- Confirmar Senha -->
          <TextInput
            type="password"
            label="Confirmar Senha"
            placeholder="Confirmar Senha"
            v-model="confirmarSenha"
            :aria-label="'Campo de confirmar senha'"
            :error="errors.confirmarSenha"
          />
  
          <!-- Botão Registrar -->
          <div class="pt-0.5"></div>

          <PrimaryButton
            class="w-full mt-8 bg-azure-500"
            :value="loading ? 'Carregando...' : 'Registrar'"
            @click="handleSubmit"
            :disabled="loading"
            aria-label="Botão de registrar"
          />
  
          <!-- Mensagem de erro global -->
          <p v-if="errors.global" class="text-red-500 text-sm mt-1">{{ errors.global }}</p>
  
          <!-- Link para Login -->
          <div class="w-full flex justify-center pt-3">
            <router-link to="/" class="text-sm text-amber-50 hover:underline -translate-y-5 mt-3">Possui login? Clique aqui</router-link>
          </div>
        </div>
      </div>
  
      <!-- Imagem de Fundo -->
      <div class="flex-1 hidden lg:block">
        <img src="@/assets/images/prefeitura.png" alt="Prefeitura" class="w-full h-full object-cover" />
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import TextInput from "@/components/Inputs/TextInput.vue";
  import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
  import Loading from "@/components/Loading/Loading.vue";  // Import the loading component
  
  export default {
    name: 'Register',
    components: { PrimaryButton, TextInput, Loading }, // Include Loading in components
  
    data() {
      return {
        matricula: '',
        email: '',
        cpf: '',
        senha: '',
        confirmarSenha: '',
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
  
        // Validação da matrícula
        if (!this.matricula) {
          this.errors.matricula = 'Matrícula é obrigatória.';
          valid = false;
        }
  
        // Validação do email
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!this.email) {
          this.errors.email = 'O e-mail é obrigatório.';
          valid = false;
        } else if (!emailPattern.test(this.email)) {
          this.errors.email = 'Formato de e-mail inválido.';
          valid = false;
        }
  
        // Validação do CPF
        const cpfPattern = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        if (!this.cpf) {
          this.errors.cpf = 'O CPF é obrigatório.';
          valid = false;
        } else if (!cpfPattern.test(this.cpf)) {
          this.errors.cpf = 'Formato de CPF inválido.';
          valid = false;
        }
  
        // Validação da senha
        if (!this.senha) {
          this.errors.senha = 'A senha é obrigatória.';
          valid = false;
        }
  
        // Validação da confirmação de senha
        if (!this.confirmarSenha) {
          this.errors.confirmarSenha = 'A confirmação de senha é obrigatória.';
          valid = false;
        } else if (this.senha !== this.confirmarSenha) {
          this.errors.confirmarSenha = 'As senhas não coincidem.';
          valid = false;
        }
  
        return valid;
      },
  
      // CPF Formatting
      formatCPF() {
        let cpf = this.cpf.replace(/\D/g, '').slice(0, 11); // Remove non-digit characters
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
        cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        this.cpf = cpf;
      },
  
      async handleSubmit() {
        if (!this.validateForm()) {
          return;
        }
  
        this.loading = true;
  
        try {
          const response = await axios.post('http://localhost:8000/auth/register/', {
            username: this.matricula,
            email: this.email,
            employeeCode: this.matricula,
            password: this.senha,
          });
  
          alert('Registro concluído com sucesso!');  // Success notification
          this.$router.push('/');  // Redirect to login page
        } catch (error) {
          if (error.response && error.response.data) {
            const data = error.response.data;
            this.errors.global = data.message || 'Erro ao registrar.';
          } else {
            this.errors.global = 'Erro de conexão. Tente novamente mais tarde.';
          }
        } finally {
          this.loading = false;
        }
      }
    },
  
    watch: {
      // Watch CPF for formatting
      cpf(newVal) {
        this.formatCPF();
      }
    }
  };
  </script>
  