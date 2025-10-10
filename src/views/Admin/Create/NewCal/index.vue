<template>
  <Whiteboard title="Novo Cálculo" >
    <div class="w-full px-10 py-8">
      <div class="flex flex-col py-5 border border-gray-200 rounded-[10px] bg-white shadow-md w-full">
        <div class="flex flex-col w-full lg:flex-row">
          <!-- Primeira coluna -->
          <div class="flex-1 flex items-center justify-center py-12">
            <div class="text-start space-y-5 w-4/6">
              <div class="space-y-2">
                <p>Nome Da Versão</p>
                <TextInput
                  placeholder="Primeira versão..."
                  v-model="formData.name"
                  :error="errorMessage"
                  type="text"
                />
              </div>

              <div class="space-y-2">
                <p>Descrição</p>
                <TextInput
                  v-model="formData.description"
                  :error="errorMessage"
                  type="text"
                />
              </div>

              <div class="space-y-2">
                <p>Selecione o Ano do Pagamento</p>
                <TextInput
                  v-model="formData.yearValue"
                  :error="errorMessage"
                  type="text"
                />
              </div>

              <div class="space-y-2">
                <p>Selecione a Data Inícial a considerar</p>
                <TextInput
                  v-model="formData.start_date"
                  :error="errorMessage"
                  type="date"
                />
              </div>

              <div class="space-y-2">
                <p>Selecione a Data Final a considerar</p>
                <TextInput
                  v-model="formData.end_date"
                  :error="errorMessage"
                  type="date"
                />
              </div>


            </div>
          </div>

          <div class="border lg:py-5 my-5"></div>

          <!-- Segunda coluna -->
          <div class="flex-1 flex items-center justify-center py-12">
            <div class="text-start space-y-5 w-4/6">
              <div class="space-y-2">
                <p>Carga Horária Padrão</p>
                <TextInput v-model="formData.max_workload" :error="errorMessage" type="number" />
              </div>
              <div class="space-y-2">
                <p>IDEM Rede - Etapa 1</p>
                <TextInput placeholder="%" v-model="formData.idem_network_step_1" :error="errorMessage" type="number" />
              </div>
              <div class="space-y-2">
                <p>IDEM Rede - Etapa 2</p>
                <TextInput placeholder="%" v-model="formData.idem_network_step_2" :error="errorMessage" type="number" />
              </div>
              <div class="space-y-2">
                <p>IDEM Rede - Etapa 3</p>
                <TextInput placeholder="%" v-model="formData.idem_network_step_3" :error="errorMessage" type="number" />
              </div>
              <div class="space-y-2">
                <p>Valor Teto da Gratificação</p>
                <TextInput placeholder="R$" v-model="formData.max_value" :error="errorMessage" type="number" />
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

            <!-- Inputs de data gerados dinamicamente -->
            <div v-if="formData.numPeriods > 1" class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div v-for="(period, index) in formData.frequencyPeriods" :key="index" class="p-4 border rounded-md">
                <p class="font-semibold mb-3 text-gray-600">Período {{ index + 1 }}</p>
                <div class="space-y-4">
                  <div class="space-y-2">
                    <p>Data de Início</p>
                    <TextInput v-model="period.start_date" :error="errorMessage" type="date" />
                  </div>
                  <div class="space-y-2">
                    <p>Data de Fim</p>
                    <TextInput v-model="period.end_date" :error="errorMessage" type="date" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Botão de enviar -->
        <div class="flex w-full items-end justify-end pr-10 mb-5">
          <div class="w-4/12 lg:w-2/12">
            <PrimaryButton
              class="bg-blue-500 py-2 px-3 text-15"
              value="Continuar"
              @click="submitData"
            />
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
    const errorMessage = ref("");

    // Dados do formulário reativos
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

    watch(() => formData.numPeriods, (newVal, oldVal) => {
      const newCount = parseInt(newVal, 10);
      const currentCount = formData.frequencyPeriods.length;

      if (newCount > currentCount) {
        for (let i = currentCount; i < newCount; i++) {
          formData.frequencyPeriods.push({ start_date: '', end_date: '' });
        }
      } else if (newCount < currentCount) {
        formData.frequencyPeriods.splice(newCount);
      }
    }, { immediate: true });

    // Função para validar os inputs
    const validateInputs = () => {
      const {
        name,
        yearValue,
        description,
        start_date,
        end_date,
        max_value,
        max_workload,
        idem_network_step_1,
        idem_network_step_2,
        idem_network_step_3,
        numPeriods,
        frequencyPeriods,
      } = formData;

      if (!description || !yearValue || !start_date || !end_date || !max_value || !max_workload || !idem_network_step_1 || !idem_network_step_2 || !idem_network_step_3) {
        errorMessage.value = "Todos os campos de dados gerais são obrigatórios.";
        return false;
      }

      if (isNaN(yearValue) || yearValue.length !== 4) {
        errorMessage.value = "Ano inválido.";
        return false;
      }

      if (new Date(start_date) > new Date(end_date)) {
        errorMessage.value = "A data inicial deve ser anterior à data final.";
        return false;
      }

      if (isNaN(max_value) || isNaN(max_workload)) {
        errorMessage.value =
          "Os campos 'Valor Máximo' e 'Carga Horária Máxima' devem ser números.";
        return false;
      }

      const globalStartDate = new Date(start_date);
      const globalEndDate = new Date(end_date);

      if (globalStartDate > globalEndDate) {
        errorMessage.value = "A data inicial geral deve ser anterior à data final geral.";
        return false;
      }

      // Nova validação para os períodos de frequência
      if (numPeriods > 1) {
        for (let i = 0; i < frequencyPeriods.length; i++) {
          const period = frequencyPeriods[i];
          if (!period.start_date || !period.end_date) {
            errorMessage.value = `As datas de início e fim são obrigatórias para o Período ${i + 1}.`;
            return false;
          }
          const periodStart = new Date(period.start_date);
          const periodEnd = new Date(period.end_date);

          if (periodStart > periodEnd) {
            errorMessage.value = `No Período ${i + 1}, a data de início deve ser anterior à data de fim.`;
            return false;
          }
          if (periodStart < globalStartDate || periodEnd > globalEndDate) {
            errorMessage.value = `O Período ${i + 1} deve estar contido entre as datas gerais do cálculo.`;
            return false;
          }
        }
      }

      return true;
    };

    // Função para enviar os dados
    const submitData = async () => {
      errorMessage.value = "";
      if (!validateInputs()) return;

      try {
        const payload = {
          // name é description no backend
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

        // Adicionar os períodos ao payload apenas se houver mais de um
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

        router.push({ path: "/home/imports" });
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        errorMessage.value = "Ocorreu um erro ao enviar os dados. Verifique o console para mais detalhes.";
      }
    };

    return {
      formData,
      errorMessage,
      submitData,
    };
  },
};
</script>
