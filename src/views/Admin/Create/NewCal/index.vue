<template>
  <Whiteboard title="Novo Cálculo">
    <div class="w-full px-10 py-8">
      <div v-if="globalErrorMessage" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <span class="block sm:inline">{{ globalErrorMessage }}</span>
      </div>

      <div class="flex flex-col py-5 border border-gray-200 rounded-[10px] bg-white shadow-md w-full">
        <div class="flex flex-col w-full lg:flex-row">
          <div class="flex-1 flex items-center justify-center py-12">
            <div class="text-start space-y-5 w-4/6">
              <div class="space-y-2">
                <p>Nome Da Versão</p>
                <TextInput placeholder="Primeira versão..." v-model="formData.name" :error="errors.name" type="text" />
              </div>

              <div class="space-y-2">
                <p>Descrição</p>
                <TextInput v-model="formData.description" :error="errors.description" type="text" />
              </div>

              <div class="space-y-2">
                <p>Selecione o Ano do Pagamento</p>
                <TextInput v-model="formData.yearValue" :error="errors.yearValue" type="text" />
              </div>

              <div class="space-y-2">
                <p>Selecione a Data Inícial a considerar</p>
                <TextInput v-model="formData.start_date" :error="errors.start_date" type="date" />
              </div>

              <div class="space-y-2">
                <p>Selecione a Data Final a considerar</p>
                <TextInput v-model="formData.end_date" :error="errors.end_date" type="date" />
              </div>
            </div>
          </div>

          <div class="border lg:py-5 my-5"></div>

          <div class="flex-1 flex items-center justify-center py-12">
            <div class="text-start space-y-5 w-4/6">
              <div class="space-y-2">
                <p>Carga Horária Padrão</p>
                <TextInput v-model="formData.max_workload" :error="errors.max_workload" type="number" />
              </div>
              <div class="space-y-2">
                <p>IDEM Rede - Etapa 1</p>
                <TextInput placeholder="%" v-model="formData.idem_network_step_1" :error="errors.idem_network_step_1" type="number" />
              </div>
              <div class="space-y-2">
                <p>IDEM Rede - Etapa 2</p>
                <TextInput placeholder="%" v-model="formData.idem_network_step_2" :error="errors.idem_network_step_2" type="number" />
              </div>
              <div class="space-y-2">
                <p>IDEM Rede - Etapa 3</p>
                <TextInput placeholder="%" v-model="formData.idem_network_step_3" :error="errors.idem_network_step_3" type="number" />
              </div>
              <div class="space-y-2">
                <p>Valor Teto da Gratificação</p>
                <TextInput placeholder="R$" v-model="formData.max_value" :error="errors.max_value" type="number" />
              </div>
            </div>
          </div>
        </div>

        <div class="border-t mx-10 my-5"></div>

        <div class="px-10 py-5">
          <h3 class="text-lg font-semibold mb-4 text-gray-700">Configuração dos Períodos de Frequência</h3>
          <div class="space-y-2 mb-6 max-w-xs">
            <p>Número de Períodos para Apuração</p>
            <select v-model="formData.numPeriods" class="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="1">1 Período (Padrão)</option>
              <option value="2">2 Períodos</option>
              <option value="3">3 Períodos</option>
              <option value="4">4 Períodos</option>
            </select>
          </div>

          <div v-if="formData.numPeriods > 1" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div v-for="(period, index) in formData.frequencyPeriods" :key="index" class="p-4 border rounded-md">
              <p class="font-semibold mb-3 text-gray-600">Período {{ index + 1 }}</p>
              <div class="space-y-4">
                <div class="space-y-2">
                  <p>Data de Início</p>
                  <TextInput v-model="period.start_date" :error="errors.frequencyPeriods[index]?.start_date" type="date" />
                </div>
                <div class="space-y-2">
                  <p>Data de Fim</p>
                  <TextInput v-model="period.end_date" :error="errors.frequencyPeriods[index]?.end_date" type="date" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex w-full items-end justify-end pr-10 my-5">
        <div class="w-4/12 lg:w-2/12">
          <PrimaryButton class="bg-blue-500 py-2 px-3 text-15" value="Continuar" @click="submitData" />
        </div>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { createGeneralData, createDataset } from "../../../../service/apiService";
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import TextInput from "@/components/Inputs/TextInput.vue";
import Whiteboard from "@/components/Whiteboard/Whiteboard.vue";

export default {
  name: "NewCal",
  components: { TextInput, Whiteboard, PrimaryButton },

  setup() {
    const router = useRouter();
    const errors = reactive({
      name: "",
      description: "",
      yearValue: "",
      start_date: "",
      end_date: "",
      max_value: "",
      max_workload: "",
      idem_network_step_1: "",
      idem_network_step_2: "",
      idem_network_step_3: "",
      frequencyPeriods: [],
    });
    
    const globalErrorMessage = ref("");

    const formData = reactive({
      name: "",
      description: "",
      yearValue: "",
      start_date: "",
      end_date: "",
      max_value: "",
      max_workload: "",
      idem_network_step_1: "",
      idem_network_step_2: "",
      idem_network_step_3: "",
      numPeriods: 1,
      frequencyPeriods: [],
    });

    watch(() => formData.numPeriods, (newVal) => {
      const newCount = parseInt(newVal, 10);
      const currentCount = formData.frequencyPeriods.length;

      if (newCount > currentCount) {
        for (let i = currentCount; i < newCount; i++) {
          formData.frequencyPeriods.push({ start_date: '', end_date: '' });
          errors.frequencyPeriods.push({ start_date: '', end_date: '' });
        }
      } else if (newCount < currentCount) {
        formData.frequencyPeriods.splice(newCount);
        errors.frequencyPeriods.splice(newCount);
      }
    }, { immediate: true });
    
    const validateInputs = () => {
      Object.keys(errors).forEach(key => {
        if (key === 'frequencyPeriods') {
          errors.frequencyPeriods.forEach(p => {
            p.start_date = '';
            p.end_date = '';
          });
        } else {
          errors[key] = "";
        }
      });
      globalErrorMessage.value = "";
      
      let isValid = true;

      if (!formData.name) {
        errors.name = "O nome da versão é obrigatório.";
        isValid = false;
      }
      if (!formData.description) {
        errors.description = "A descrição é obrigatória.";
        isValid = false;
      }
      if (!formData.yearValue) {
        errors.yearValue = "O ano do pagamento é obrigatório.";
        isValid = false;
      } else if (isNaN(formData.yearValue) || formData.yearValue.length !== 4) {
        errors.yearValue = "Ano inválido. Deve ser um número com 4 dígitos.";
        isValid = false;
      }
      if (!formData.start_date) {
        errors.start_date = "A data inicial é obrigatória.";
        isValid = false;
      }
      if (!formData.end_date) {
        errors.end_date = "A data final é obrigatória.";
        isValid = false;
      }
      if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
        errors.start_date = "A data inicial deve ser anterior à data final.";
        errors.end_date = "A data final deve ser posterior à data inicial.";
        isValid = false;
      }
      if (!formData.max_workload) {
        errors.max_workload = "A carga horária é obrigatória.";
        isValid = false;
      }
      /*if (!formData.idem_network_step_1) {
        errors.idem_network_step_1 = "O valor para a Etapa 1 é obrigatório.";
        isValid = false;
      }
      if (!formData.idem_network_step_2) {
        errors.idem_network_step_2 = "O valor para a Etapa 2 é obrigatório.";
        isValid = false;
      }
      if (!formData.idem_network_step_3) {
        errors.idem_network_step_3 = "O valor para a Etapa 3 é obrigatório.";
        isValid = false;
      }*/
      if (!formData.max_value) {
        errors.max_value = "O valor teto da gratificação é obrigatório.";
        isValid = false;
      }

      if (formData.numPeriods > 1) {
        const globalStartDate = new Date(formData.start_date);
        const globalEndDate = new Date(formData.end_date);

        formData.frequencyPeriods.forEach((period, index) => {
          if (!period.start_date) {
            errors.frequencyPeriods[index].start_date = `Data de início é obrigatória para o Período ${index + 1}.`;
            isValid = false;
          }
          if (!period.end_date) {
            errors.frequencyPeriods[index].end_date = `Data de fim é obrigatória para o Período ${index + 1}.`;
            isValid = false;
          }

          if (period.start_date && period.end_date) {
            const periodStart = new Date(period.start_date);
            const periodEnd = new Date(period.end_date);

            if (periodStart > periodEnd) {
              errors.frequencyPeriods[index].start_date = `No Período ${index + 1}, a data de início deve ser anterior à data de fim.`;
              isValid = false;
            }
            if (periodStart < globalStartDate || periodEnd > globalEndDate) {
              errors.frequencyPeriods[index].start_date = `O Período ${index + 1} deve estar contido entre as datas gerais do cálculo.`;
              errors.frequencyPeriods[index].end_date = `O Período ${index + 1} deve estar contido entre as datas gerais do cálculo.`;
              isValid = false;
            }
          }
        });
      }
      
      return isValid;
    };

    const submitData = async () => {
      if (!validateInputs()) return;

      try {
        const payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          year_value: parseInt(formData.yearValue, 10),
          start_date: new Date(formData.start_date).toISOString().split("T")[0],
          end_date: new Date(formData.end_date).toISOString().split("T")[0],
          max_value: parseFloat(formData.max_value),
          max_workload: parseFloat(formData.max_workload),
          idem_network_step_1: parseFloat(formData.idem_network_step_1),
          idem_network_step_2: parseFloat(formData.idem_network_step_2),
          idem_network_step_3: parseFloat(formData.idem_network_step_3),
        };

        if (formData.numPeriods > 1) {
          payload.frequency_periods = formData.frequencyPeriods.map((period, index) => ({
            period_number: index + 1,
            start_date: new Date(period.start_date).toISOString().split("T")[0],
            end_date: new Date(period.end_date).toISOString().split("T")[0],
          }));
        }

        const generalDataResponse = await createGeneralData(payload);
        const generalDataId = generalDataResponse.general_data?.general_data_id;

        if (!generalDataId) {
          throw new Error("ID do GeneralData não retornado pela API.");
        }

        await createDataset(generalDataId);

        router.push({ name: 'create-imports' });
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        globalErrorMessage.value = "Ocorreu um erro ao enviar os dados. Por favor, tente novamente.";
      }
    };

    return {
      formData,
      errors,
      globalErrorMessage,
      submitData,
    };
  },
};
</script>
