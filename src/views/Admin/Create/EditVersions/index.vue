<template>
  <Whiteboard>
    <div>
      <button @click="fetchData">Buscar Dados do Funcionário</button>
      <div v-if="employeeData.length > 0">
        <ul>
          <li v-for="(item, index) in employeeData" :key="index">{{ item.name }}</li>
          <!-- Exemplo de exibição de outros dados -->
        </ul>
      </div>
      <div v-else>
        <p v-if="errorMessage">{{ errorMessage }}</p>
        <p v-else>Nenhum dado encontrado.</p>
      </div>
    </div>
  </Whiteboard>
</template>

<script>
import { ref } from 'vue';
import { fetchEmployeeData } from '@/service/apiService';  // Ajuste o caminho conforme necessário
import Whiteboard from '@/components/Whiteboard/Whiteboard.vue';

export default {
  components: { Whiteboard },
  setup() {
    const employeeData = ref([]);
    const errorMessage = ref(null);

    const fetchData = async () => {
      try {
        errorMessage.value = null;  // Limpa a mensagem de erro antes de buscar os dados
        const data = await fetchEmployeeData();  // Puxa os dados da API
        if (Array.isArray(data)) {
          employeeData.value = data;
          console.log('Dados recebidos:', data);  // Exibe os dados no console
        } else {
          employeeData.value = [];  // Limpa os dados se não for um array
          errorMessage.value = 'Os dados recebidos não estão no formato esperado.';
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);  // Exibe o erro no console
        errorMessage.value = 'Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.';  // Mensagem de erro para o usuário
      }
    };

    return {
      fetchData,
      employeeData,
      errorMessage
    };
  }
};
</script>
