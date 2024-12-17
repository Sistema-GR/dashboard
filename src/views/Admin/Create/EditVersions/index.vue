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
          <p>Nenhum dado encontrado.</p>
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
  
      const fetchData = async () => {
        try {
          const data = await fetchEmployeeData();  // Puxa os dados da API
          employeeData.value = data;
          console.log('Dados recebidos:', data);  // Exibe os dados no console
        } catch (error) {
          console.error('Erro ao buscar dados:', error);  // Exibe o erro no console
        }
      };
  
      return {
        fetchData,
        employeeData
      };
    }
  };
  </script>
  
  