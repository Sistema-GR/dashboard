import axios from 'axios';
import { setupAxiosInterceptors } from './services/token';  // Certifique-se de importar corretamente

// Criação da instância do Axios
const apiClient = axios.create({
  baseURL: 'http://10.203.2.185:8000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configura os interceptores do Axios
setupAxiosInterceptors(apiClient);

export const uploadCsv = async (file, endpoint) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};
