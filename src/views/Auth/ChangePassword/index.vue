<template>
  <div class="flex-1 h-screen bg-gradient-to-r from-[#003965] to-95%0% to-[#0073CB]">
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex flex-col h-screen items-center justify-center">
          <img src="@/assets/images/logo.png" alt="Logo" class="w-3/12 scale-75 drop-shadow-lg py-0" />
          <div class="w-full max-w-md space-y-3 px-5">
            
            <!-- Campo Nova Senha -->
            <TextInput
              type="password"
              label="Nova Senha"
              placeholder="Nova Senha"
              v-model="novaSenha"
              :aria-label="'Campo de nova senha'"
              :error="errors.novaSenha"
            />

            <!-- Campo Confirmar Senha -->
            <TextInput
              type="password"
              label="Confirmar Senha"
              placeholder="Confirmar Senha"
              v-model="confirmarSenha"
              :aria-label="'Campo de confirmar senha'"
              :error="errors.confirmarSenha"
            />

            <div class="pt-0.5"></div>
            <!-- Botão Confirmar -->
            <PrimaryButton
              class="mt-8"
              :value="loading ? 'Carregando...' : 'Confirmar'"
              custom-color="bg-azure-500"
              @click="handleSubmit"
              :disabled="loading"
              aria-label="Botão de confirmar nova senha"
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
import TextInput from "@/components/Inputs/TextInput.vue";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";

export default {
  name: 'ChangePassword',
  components: { PrimaryButton, TextInput },

  data() {
    return {
      novaSenha: '',
      confirmarSenha: '',
      loading: false,
      errors: {
        novaSenha: null,
        confirmarSenha: null,
        global: null,
      },
    };
  },

  methods: {
    validateForm() {
      this.errors.novaSenha = null;
      this.errors.confirmarSenha = null;
      this.errors.global = null;

      let valid = true;

      // Validação da nova senha
      if (!this.novaSenha) {
        this.errors.novaSenha = 'A nova senha é obrigatória.';
        valid = false;
      }

      // Validação da confirmação de senha
      if (!this.confirmarSenha) {
        this.errors.confirmarSenha = 'A confirmação de senha é obrigatória.';
        valid = false;
      } else if (this.novaSenha !== this.confirmarSenha) {
        this.errors.confirmarSenha = 'As senhas não coincidem.';
        valid = false;
      }

      return valid;
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;

      try {
        // Simulação de requisição ao servidor
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // Simulação de sucesso
            resolve();
          }, 2000);
        });

        // Redirecionar após o sucesso
        this.$router.push('/');
      } catch (error) {
        this.errors.global = 'Erro ao tentar alterar a senha. Tente novamente.';
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
