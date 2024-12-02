import axios from 'axios';
import { setupAxiosInterceptors } from './token';  
import { getAccessToken } from './token';

// Configuração do axios
const apiClient = axios.create({
  baseURL: 'http://10.203.2.185:8000', 
  // baseURL: 'http://127.0.0.1:8000', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuração dos interceptores de requisição
setupAxiosInterceptors(apiClient);

// Função genérica para tratamento de erros
const handleApiError = (error) => {
  console.error("Erro na requisição:", error.response || error.message);
  throw error.response ? error.response.data : error.message;
};

// Função para login
export const login = async (email, senha) => {
  try {
    const response = await apiClient.post('/auth/login/', { email, password: senha });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Função para registro de novo usuário
export const register = async (email, senha, confirmarSenha, matricula, cpf) => {
  try {
    const response = await apiClient.post('/auth/register/', {
      email,
      password: senha,
      confirm_password: confirmarSenha,
      employeeCode: matricula,
      cpf,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Função para buscar versões
export const fetchVersions = async () => {
  try {
    const token = await getAccessToken();
    const response = await apiClient.get('/csv/api/general-data/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data.data || [];
  } catch (error) {
    handleApiError(error);
  }
};

// Função para criar um dataset
export const createDataset = async (generalDataId, datasetName) => {
  try {
    const token = await getAccessToken();
    const response = await apiClient.post('/csv/api/create-dataset/', {
      general_data_id: generalDataId,
      name: datasetName
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createGeneralData = async (data) => {
  try {
    const token = await getAccessToken();
    const response = await apiClient.post('/csv/api/general-data/', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const uploadFile = async (file, endpoint) => {
  try {
    const token = await getAccessToken();
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(endpoint, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Função para processar todos os arquivos
export const processAllFiles = async () => {
  try {
    const token = await getAccessToken();
    const response = await apiClient.get('/process/all-files/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};