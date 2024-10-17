<template>
  <div class="flex-1 h-screen bg-gradient-to-r from-[#003965] to-95%0% to-[#0073CB]">
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex flex-col h-screen items-center justify-center">
          <img src="@/assets/images/logo.png" alt="Logo" class="w-3/12 scale-90 drop-shadow-lg py-0" />
          <div class="w-full max-w-md space-y-3 px-5">
            <!-- Matrícula Input -->
            <TextInput 
              type="text" 
              label="Matrícula" 
              placeholder="00000" 
              v-model="matricula" 
              :aria-label="'Campo de matrícula'" 
              :error="errors.matricula"
            />
            <!-- Senha Input -->
            <TextInput 
              type="password" 
              label="Senha" 
              placeholder="Senha" 
              v-model="senha" 
              :aria-label="'Campo de senha'" 
              :error="errors.senha"
            />

            <!-- Esqueci a Senha -->
            <div class="w-full flex justify-end mt-2">
              <router-link to="/forgotpassword" class="text-sm text-amber-50 hover:underline mt-0">Esqueceu sua senha?</router-link>
            </div>

            <!-- Botão de Login -->
            <PrimaryButton
              class="mt-8 bg-azure-500"
              :value="loading ? 'Carregando...' : 'Login'"
              custom-color="bg-azure-500"
              @click="login"
              :disabled="loading"
              aria-label="Botão de login"
            />

            <!-- Mensagem de erro -->
            <p v-if="errors.global" class="text-red-500 text-sm mt-1">{{ errors.global }}</p>

            <!-- Cadastro -->
            <div class="w-full flex justify-center pt-3">
              <router-link to="/register" class="text-sm text-amber-50 hover:underline mt-0 -translate-y-5">Não possui cadastro? Clique aqui</router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Imagem de fundo para telas grandes -->
      <div class="flex-1 relative hidden lg:block">
        <img src="@/assets/images/prefeitura.png" alt="Imagem prefeitura" class="w-full h-screen" />
      </div>
    </div>
  </div>
</template>

<script>
import TextInput from "@/components/Inputs/TextInput.vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";

export default {
  name: 'Login',
  components: { PrimaryButton, TextInput },
  
  data() {
    return {
      matricula: '',
      senha: '',
      loading: false,
      errors: {
        matricula: null,
        senha: null,
        global: null,
      },
    };
  },

  methods: {
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
      // Limpar erros antes de iniciar
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      try {
        // Simulação de autenticação
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulando falha de login para demonstrar mensagens de erro
            if (this.matricula !== '00000' || this.senha !== '123456') {
              reject(new Error('Matrícula ou senha incorretos.'));
            } else {
              resolve();
            }
          }, 2000);
        });

        // Se o login for bem-sucedido
        this.$router.push('/home/overview');
      } catch (error) {
        // Exibir mensagem de erro global
        this.errors.global = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
