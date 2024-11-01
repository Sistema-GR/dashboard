<template>
  <Whiteboard title="Novo Cálculo" :isSidebarMinimized="isSidebarMinimized">
    <div class="flex flex-col w-full lg:flex-row">
      <div class="flex-1 flex items-center justify-center py-12">
        <div class="text-start space-y-5 w-4/6">
          <div class="space-y-2">
            <p>Nome Da Versão</p>
            <TextInput
              placeholder="Primeira versão..."
              v-model="textValue"
              :error="errorMessage"
              :success="isSuccess"
              :info="isInfo"
              :warning="isWarning"
              :disabled="isDisabled"
              type="text"
            />
          </div>

          <div class="space-y-2">
            <p>Selecione o Ano do Pagamento</p>
            <TextInput
              v-model="yearValue"
              :error="errorMessage"
              :success="isSuccess"
              :info="isInfo"
              :warning="isWarning"
              :disabled="isDisabled"
              type="date"
            />
          </div>

          <div class="space-y-2">
            <p>Selecione a Data Inícial a considerar</p>
            <TextInput
              v-model="startDate"
              :error="errorMessage"
              :success="isSuccess"
              :info="isInfo"
              :warning="isWarning"
              :disabled="isDisabled"
              type="date"
            />
          </div>

          <div class="space-y-2">
            <p>Selecione a Data Final a considerar</p>
            <TextInput
              v-model="endDate"
              :error="errorMessage"
              :success="isSuccess"
              :info="isInfo"
              :warning="isWarning"
              :disabled="isDisabled"
              type="date"
            />
          </div>
        </div>
      </div>

      <div class="border lg:py-5 my-5"></div>

      <div class="flex-1 flex items-center justify-center py-12">
        <div class="text-start space-y-5 w-4/6">
          <div class="flex flex-col w-full gap-y-2">
            <p>Etapa 1</p>
            <TextInput
              placeholder="%:"
              v-model="stage1Value"
              :error="errorMessage"
              :success="isSuccess"
              :info="isInfo"
              :warning="isWarning"
              :disabled="false"
              type="text"
            />
          </div>

          <div class="flex flex-col w-full gap-y-2">
            <p>Etapa 2</p>
            <TextInput
              placeholder="%"
              v-model="stage2Value"
              :error="errorMessage"
              :success="isSuccess"
              :info="isInfo"
              :warning="isWarning"
              :disabled="false"
              type="text"
            />
          </div>

          <div class="flex flex-col w-full gap-y-2">
            <p>Etapa 3</p>
            <TextInput
              placeholder="%"
              v-model="stage3Value"
              :error="errorMessage"
              :success="isSuccess"
              :info="isInfo"
              :warning="isWarning"
              :disabled="false"
              type="text"
            />
          </div>

          <div class="space-y-2">
            <p>Valor Global</p>
            <TextInput
              placeholder="R$"
              v-model="globalValue"
              :error="errorMessage"
              :success="isSuccess"
              :info="isInfo"
              :warning="isWarning"
              :disabled="isDisabled"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex w-full items-end justify-end">
      <div class="w-4/12 lg:w-2/12">
        <PrimaryButton
          class="bg-blue-500 py-2 px-3 text-sm"
          value="Continuar"
          @click="handleClick"
        />
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import { inject, ref } from 'vue';
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import TextInput from "@/components/Inputs/TextInput.vue";
import Whiteboard from "@/components/Whiteboard/Whiteboard.vue";
import { useRouter } from 'vue-router';

export default {
  name: "NewCal",
  components: { TextInput, Whiteboard, PrimaryButton },

  setup() {
    const router = useRouter();
    const isSidebarMinimized = inject('isSidebarMinimized');

    const textValue = ref('');
    const yearValue = ref('');
    const startDate = ref('');
    const endDate = ref('');
    const globalValue = ref('');
    const stage1Value = ref('');
    const stage2Value = ref('');
    const stage3Value = ref('');
    const errorMessage = ref('');
    const isSuccess = ref(false);
    const isInfo = ref(false);
    const isWarning = ref(false);
    const isDisabled = ref(false);

    const handleClick = () => {
      // Reset error messages
      errorMessage.value = '';

      // Validação dos inputs
      if (!textValue.value) {
        errorMessage.value = 'O nome da versão é obrigatório.';
        return;
      }

      if (!yearValue.value) {
        errorMessage.value = 'O ano é obrigatório.';
        return;
      }

      if (!startDate.value) {
        errorMessage.value = 'A data inicial é obrigatória.';
        return;
      }

      if (!endDate.value) {
        errorMessage.value = 'A data final é obrigatória.';
        return;
      }

      if (!globalValue.value) {
        errorMessage.value = 'O valor global é obrigatório.';
        return;
      }

      if (!stage1Value.value) {
        errorMessage.value = 'A Etapa 1 é obrigatória.';
        return;
      }

      if (!stage2Value.value) {
        errorMessage.value = 'A Etapa 2 é obrigatória.';
        return;
      }

      if (!stage3Value.value) {
        errorMessage.value = 'A Etapa 3 é obrigatória.';
        return;
      }

      // Se todos os campos estiverem preenchidos, redirecionar
      router.push('/home/imports');
    };

    return {
      isSidebarMinimized,
      textValue,
      yearValue,
      startDate,
      endDate,
      globalValue,
      stage1Value,
      stage2Value,
      stage3Value,
      errorMessage,
      isSuccess,
      isInfo,
      isWarning,
      isDisabled,
      handleClick,
    };
  },
}
</script>
