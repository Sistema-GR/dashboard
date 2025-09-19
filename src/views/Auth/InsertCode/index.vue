<template>
  <div class="flex-1 h-screen bg-gradient-to-r from-[#003965] to-95%0% to-[#0073CB]">
    <div class="flex flex-row">
      <div class="flex-1">
        <div class="flex flex-col h-screen items-center justify-center">
          <img src="@/assets/images/logo.png" alt="Logo" class="w-3/12 scale-75 drop-shadow-lg py-0" />
          <div class="w-full max-w-md space-y-3 px-5">
            <p class="text-15 text-amber-50">
              Foi enviado um código de 5 dígitos para o e-mail digitado no passo anterior. Por favor, digite o código abaixo.
            </p>
            
            <!-- Campo Código -->
            <TextInput
              type="text"
              label="Código"
              placeholder="00000"
              v-model="codigo"
              :aria-label="'Campo de código de verificação'"
              :error="errors.codigo"
            />
            
            <div class="pt-0.5"></div>

            <PrimaryButton
              class="mt-8"
              :value="loading ? 'Carregando...' : 'Enviar'"
              custom-color="bg-azure-500"
              @click="handleSubmit"
              :disabled="loading"
              aria-label="Botão de enviar"
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
  name: 'InsertCode',
  components: { PrimaryButton, TextInput },

  data() {
    return {
      codigo: '',
      loading: false,
      errors: {
        codigo: null,
        global: null,
      },
    };
  },

  methods: {
    validateForm() {
      this.errors.codigo = null;
      this.errors.global = null;

      let valid = true;

      // Validação do código (verifica se tem 5 dígitos)
      const codigoPattern = /^\d{5}$/;
      if (!this.codigo) {
        this.errors.codigo = 'O código é obrigatório.';
        valid = false;
      } else if (!codigoPattern.test(this.codigo)) {
        this.errors.codigo = 'O código deve ter exatamente 5 dígitos.';
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
            // Simulando erro de código inválido
            if (this.codigo !== '12345') {
              reject(new Error('Código incorreto. Tente novamente.'));
            } else {
              resolve();
            }
          }, 2000);
        });

        // Se o código for correto, redireciona para a página de alteração de senha
        this.$router.push('/auth/changepassword');
      } catch (error) {
        // Exibir erro global caso o código esteja incorreto
        this.errors.global = error.message;
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
