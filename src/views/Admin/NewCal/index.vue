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
              type="text"
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

          <div class="space-y-2">
            <p>Carga Horaria</p>
            <TextInput
              v-model="workloadValue"
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
          @click="submitData"
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
    const workloadValue = ref(''); 
    const stage1Value = ref('');
    const stage2Value = ref('');
    const stage3Value = ref('');
    const errorMessage = ref('');
    const isSuccess = ref(false);
    const isInfo = ref(false);
    const isWarning = ref(false);
    const isDisabled = ref(false);

    const submitData = async () => {
  try {
    const payload = {
      name: textValue.value,
      year: parseInt(yearValue.value),
      start_date: startDate.value,
      end_date: endDate.value,
      max_value: parseFloat(globalValue.value),
      max_workload: parseInt(workloadValue.value),
      idem_rede_etapa_1: parseFloat(stage1Value.value),
      idem_rede_etapa_2: parseFloat(stage2Value.value),
      idem_rede_etapa_3: parseFloat(stage3Value.value)
    };

    // Primeira requisição
    const response = await fetch("http://localhost:8000/csv/api/general-data/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error("Erro ao enviar os dados para general-data");
    }

    const data = await response.json();
    console.log("Dados recebidos da API general-data:", data);

    if (!data.general_data_id) {
      throw new Error("Erro: general_data_id inválido.");
    }

    console.log("general_data_id obtido:", data.general_data_id);

    // Segunda requisição - Create Dataset
    const datasetResponse = await fetch("http://localhost:8000/csv/api/create-dataset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ general_data_id: data.general_data_id })
    });

    if (!datasetResponse.ok) {
      const errorData = await datasetResponse.json();
      throw new Error(`Erro ao criar o dataset: ${errorData.error || 'Erro desconhecido'}`);
    }

    console.log("Dataset criado com sucesso.");

    // Redirecionar após sucesso
    router.push('/home/imports');
  } catch (error) {
    console.error("Erro ao enviar os dados:", error);
    errorMessage.value = error.message;
  }
};


    return {
      isSidebarMinimized,
      textValue,
      yearValue,
      startDate,
      endDate,
      globalValue,
      workloadValue, 
      stage1Value,
      stage2Value,
      stage3Value,
      errorMessage,
      isSuccess,
      isInfo,
      isWarning,
      isDisabled,
      submitData,
    };
  },
};
</script>




