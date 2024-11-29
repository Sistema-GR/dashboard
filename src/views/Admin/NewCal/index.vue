<template>
  <Whiteboard title="Novo Cálculo" :isSidebarMinimized="isSidebarMinimized">
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

          <div class="space-y-2">
            <p>Carga Horária</p>
            <TextInput
              v-model="formData.max_workload"
              :error="errorMessage"
              type="text"
            />
          </div>
        </div>
      </div>

      <div class="border lg:py-5 my-5"></div>

      <!-- Segunda coluna -->
      <div class="flex-1 flex items-center justify-center py-12">
        <div class="text-start space-y-5 w-4/6">
          <div class="space-y-2">
            <p>Etapa 1</p>
            <TextInput
              placeholder="%"
              v-model="formData.idem_network_step_1"
              :error="errorMessage"
              type="text"
            />
          </div>
          <div class="space-y-2">
            <p>Etapa 2</p>
            <TextInput
              placeholder="%"
              v-model="formData.idem_network_step_2"
              :error="errorMessage"
              type="text"
            />
          </div>
          <div class="space-y-2">
            <p>Etapa 3</p>
            <TextInput
              placeholder="%"
              v-model="formData.idem_network_step_3"
              :error="errorMessage"
              type="text"
            />
          </div>
          <div class="space-y-2">
            <p>Valor Global</p>
            <TextInput
              placeholder="R$"
              v-model="formData.max_value"
              :error="errorMessage"
              type="text"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Botão de enviar -->
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
import { inject, ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { createGeneralData, createDataset } from "../../../service/apiService"; 
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import TextInput from "@/components/Inputs/TextInput.vue";
import Whiteboard from "@/components/Whiteboard/Whiteboard.vue";


export default {
  name: "NewCal",
  components: { TextInput, Whiteboard, PrimaryButton },

  setup() {
    const router = useRouter();
    const isSidebarMinimized = inject("isSidebarMinimized");
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
    });

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
      } = formData;

      if (
        !name ||
        !description ||
        !yearValue ||
        !start_date ||
        !end_date ||
        !max_value ||
        !max_workload ||
        !idem_network_step_1 ||
        !idem_network_step_2 ||
        !idem_network_step_3
      ) {
        errorMessage.value = "Todos os campos são obrigatórios.";
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

      return true;
    };

    // Função para enviar os dados
    const submitData = async () => {
      errorMessage.value = "";

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

        console.log("Payload enviado para general-data:", payload);

        // Enviar para criar o general data
        const generalData = await createGeneralData(payload);

        const generalDataId = generalData.general_data?.general_data_id;

        if (!generalDataId) {
          throw new Error(
            `Nenhum general_data_id foi retornado pela API. Resposta completa: ${JSON.stringify(
              generalData
            )}`
          );
        }

        console.log("General Data ID retornado:", generalDataId);

        // Criar dataset
        await createDataset(generalDataId);

        // Redirecionar após o sucesso
        router.push({ path: "/home/imports" });
      } catch (error) {
        console.error("Erro ao enviar os dados:", error);
        errorMessage.value = "Ocorreu um erro ao enviar os dados.";
      }
    };

    return {
      isSidebarMinimized,
      formData,
      errorMessage,
      validateInputs,
      submitData,
    };
  },
};
</script>
