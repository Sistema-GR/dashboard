<template>
  <Whiteboard title="Novo Cálculo" :isSidebarMinimized="isSidebarMinimized">
    <div class="flex flex-col w-full lg:flex-row">
      <!-- Primeira coluna -->
      <div class="flex-1 flex items-center justify-center py-12">
        <div class="text-start space-y-5 w-4/6">
          <div class="space-y-2">
            <p>Nome Da Versão</p>
            <TextInput placeholder="Primeira versão..." v-model="formData.name" :error="errorMessage" type="text" />
          </div>

          <div class="space-y-2">
            <p>Selecione o Ano do Pagamento</p>
            <TextInput v-model="formData.yearValue" :error="errorMessage" type="text" />
          </div>

          <div class="space-y-2">
            <p>Selecione a Data Inícial a considerar</p>
            <TextInput v-model="formData.start_date" :error="errorMessage" type="date" />
          </div>

          <div class="space-y-2">
            <p>Selecione a Data Final a considerar</p>
            <TextInput v-model="formData.end_date" :error="errorMessage" type="date" />
          </div>

          <div class="space-y-2">
            <p>Carga Horária</p>
            <TextInput v-model="formData.max_workload" :error="errorMessage" type="text" />
          </div>
        </div>
      </div>

      <div class="border lg:py-5 my-5"></div>

      <!-- Segunda coluna -->
      <div class="flex-1 flex items-center justify-center py-12">
        <div class="text-start space-y-5 w-4/6">
          <div class="space-y-2">
            <p>Etapa 1</p>
            <TextInput placeholder="%" v-model="formData.idem_network_step_1" :error="errorMessage" type="text" />
          </div>
          <div class="space-y-2">
            <p>Etapa 2</p>
            <TextInput placeholder="%" v-model="formData.idem_network_step_2" :error="errorMessage" type="text" />
          </div>
          <div class="space-y-2">
            <p>Etapa 3</p>
            <TextInput placeholder="%" v-model="formData.idem_network_step_3" :error="errorMessage" type="text" />
          </div>
          <div class="space-y-2">
            <p>Valor Global</p>
            <TextInput placeholder="R$" v-model="formData.max_value" :error="errorMessage" type="text" />
          </div>
        </div>
      </div>
    </div>

    <!-- Botão de enviar -->
    <div class="flex w-full items-end justify-end">
      <div class="w-4/12 lg:w-2/12">
        <PrimaryButton class="bg-blue-500 py-2 px-3 text-sm" value="Continuar" @click="submitData" />
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import { inject, ref, reactive } from 'vue';
import { useRouter } from 'vue-router'; // Importa o useRouter
import PrimaryButton from "@/components/Buttons/PrimaryButton.vue";
import TextInput from "@/components/Inputs/TextInput.vue";
import Whiteboard from "@/components/Whiteboard/Whiteboard.vue";
import { getAccessToken } from "../../../service/token.js";

export default {
  name: "NewCal",
  components: { TextInput, Whiteboard, PrimaryButton },

  setup() {
    const router = useRouter(); // Inicializa o router
    const isSidebarMinimized = inject('isSidebarMinimized');  // Certifique-se de fornecer esse valor no componente pai
    const errorMessage = ref('');

    // Dados do formulário reativos
    const formData = reactive({
      name: '',
      yearValue: '',
      start_date: '',
      end_date: '',
      max_value: '',
      max_workload: '',
      idem_network_step_1: '',
      idem_network_step_2: '',
      idem_network_step_3: ''
    });

    // URL da API
    const API_URL = "http://localhost:8000/csv/api/general-data/";

    // Função para validar os inputs
    const validateInputs = () => {
      const { 
        name, 
        yearValue, 
        start_date, 
        end_date, 
        max_value, 
        max_workload, 
        idem_network_step_1, 
        idem_network_step_2, 
        idem_network_step_3 
      } = formData;

      // Verificar se todos os campos estão preenchidos
      if (
        !name || 
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

      // Validação do ano
      if (isNaN(yearValue) || yearValue.length !== 4) {
        errorMessage.value = "Ano inválido.";
        return false;
      }

      // Validação de datas
      if (new Date(start_date) > new Date(end_date)) {
        errorMessage.value = "A data inicial deve ser anterior à data final.";
        return false;
      }

      // Validações para campos numéricos
      if (isNaN(max_value) || isNaN(max_workload)) {
        errorMessage.value = "Os campos 'Valor Máximo' e 'Carga Horária Máxima' devem ser números.";
        return false;
      }

      return true;
    };

    // Função para enviar os dados
 // Função para enviar os dados
const submitData = async () => {
  // Limpa a mensagem de erro antes de tentar enviar
  errorMessage.value = '';

  // Verifica se os inputs são válidos antes de continuar
  if (!validateInputs()) return;

  try {
    // Obtém um token válido antes de fazer a requisição
    const token = await getAccessToken();

    if (!token) {
      errorMessage.value = "Erro ao obter ou renovar o token de acesso.";
      return;
    }

    // Preparar o payload com os dados que estamos criando
    const payload = {
      name: formData.name,
      year_value: formData.yearValue,
      start_date: formData.start_date,
      end_date: formData.end_date,
      max_value: formData.max_value,
      max_workload: formData.max_workload,
      idem_network_step_1: formData.idem_network_step_1,
      idem_network_step_2: formData.idem_network_step_2,
      idem_network_step_3: formData.idem_network_step_3
    };

    console.log("Payload enviado:", payload);

    // Primeira requisição para obter os dados de general-data
    const generalDataResponse = await fetch("http://localhost:8000/csv/api/general-data/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!generalDataResponse.ok) {
      throw new Error("Erro ao obter os dados de general-data.");
    }

    const generalData = await generalDataResponse.json();
    console.log("Dados obtidos de general-data:", generalData);

    // Filtra e pega o primeiro general_data_id dentro de data
    const generalDataId = generalData.data && generalData.data.length > 0 ? generalData.data[0].general_data_id : null;

    if (!generalDataId) {
      errorMessage.value = "Nenhum dado encontrado ou o general_data_id não está presente.";
      return;
    }

    // Enviar os dados para create-dataset, agora incluindo apenas o `general_data_id`
    const response = await fetch("http://localhost:8000/csv/api/create-dataset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        ...payload,
        general_data_id: generalDataId // Envia apenas o `general_data_id` do primeiro item
      })
    });

    const responseData = await response.json();
    console.log("Resposta da API create-dataset:", responseData);

    if (response.ok) {
      console.log("Dados enviados com sucesso!");
      router.push({ path: '/home/imports' });
    } else {
      errorMessage.value = `Erro ao enviar dados: ${responseData.message || 'Erro desconhecido'}`;
    }
  } catch (error) {
    console.error("Erro ao enviar dados:", error);
    errorMessage.value = "Ocorreu um erro ao enviar os dados.";
  }
};



    return {
      isSidebarMinimized,
      formData,
      errorMessage,
      validateInputs,
      submitData
    };
  }
};
</script>


