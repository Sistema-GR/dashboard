<template>
  <div class="flex-1 h-screen bg-gradient-to-r from-[#003965] to-95%0% to-[#0073CB]">
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex flex-col h-screen items-center justify-center">
          <img src="@/assets/images/logo.png" alt="Logo" class="w-3/12 scale-75 drop-shadow-lg py-0" />
          <div class="w-full max-w-md space-y-3 px-5">
            <p class="text-15 text-amber-50">Digite seu e-mail abaixo. Se existir um usuário cadastrado com essa credencial, enviaremos um código para o e-mail digitado.</p>
            
            <!-- Campo de E-mail -->
            <TextInput
              type="email"
              label="Email"
              placeholder="E-mail"
              v-model="email"
              :aria-label="'Campo de e-mail'"
              :error="errors.email"
            />

            <div class="py-0.5"></div>
            <!-- Botão Continuar -->
            <PrimaryButton
              
              :value="loading ? 'Carregando...' : 'Continuar'"
              custom-color="bg-azure-500"
              @click="handleSubmit"
              :disabled="loading"
              aria-label="Botão de continuar"
            />

            <!-- Mensagem de Erro -->
            <p v-if="errors.global" class="text-red-500 text-15 mt-1">{{ errors.global }}</p>

            <!-- Link para Login -->
            <div class="w-full flex justify-center pt-3">
              <router-link to="/" class="text-15 text-amber-50 hover:underline -translate-y-5">Possui login? Clique aqui</router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Imagem de Fundo -->
      <div class="flex-1 relative hidden lg:block">
        <img src="@/assets/images/prefeitura.png" alt="Imagem prefeitura" class="w-full h-screen" />
      </div>
    </div>
  </div>
</template>

<script>
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import TextInput from "@/components/Inputs/TextInput.vue";

export default {
  name: "ForgotPassword",
  components: {
    PrimaryButton,
    TextInput,
  },
  data() {
    return {
      email: "",
      loading: false,
      errors: {
        email: null,
        global: null,
      },
    };
  },
  methods: {
    // Validação do campo de e-mail
    validateEmail() {
      this.errors.email = null;
      this.errors.global = null;

      if (!this.email) {
        this.errors.email = "O e-mail é obrigatório.";
        return false;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.email)) {
        this.errors.email = "Formato de e-mail inválido.";
        return false;
      }

      return true;
    },

    // Submissão do formulário
    async handleSubmit() {
      if (!this.validateEmail()) {
        return;
      }

      this.loading = true;

      try {
        const response = await fetch(
          "http://127.0.0.1:8000/auth/forgot-password/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: this.email }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || "Erro ao enviar solicitação.");
        }

        // Redireciona para a próxima etapa em caso de sucesso
        this.$router.push("/auth/insertcode");
      } catch (error) {
        // Exibe a mensagem de erro global
        this.errors.global = error.message;
      } finally {
        // Finaliza o estado de carregamento
        this.loading = false;
      }
    },
  },
};
</script>
