import axios from 'axios';
import { getAccessToken, setupAxiosInterceptors } from './token';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Configuração do axios
export const apiClient = axios.create({
  baseURL: API_BASE,  
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
    const response = await apiClient.get('/csv/general-data/', {
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
export const createDataset = async (generalDataId) => {
  try {
    const token = await getAccessToken();
    const payload = {
      general_data_id: generalDataId
    };

    const response = await apiClient.post('/csv/create-dataset/', payload, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

//Obter dataset com base no calculus_id
export const getDatasetByCalculusId = async (calculusId) => {
  try {
    const token = await getAccessToken();
    const response = await apiClient.get(`/csv/get-dataset/${calculusId}/`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
}

export const createGeneralData = async (data) => {
  try {
    const token = await getAccessToken();
    const response = await apiClient.post('/csv/general-data/', data, {
      headers: {
        Authorization: `Bearer ${token}`,
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

export const fetchEmployeeData = async () => {
  try {
    const token = await getAccessToken();
    const response = await apiClient.get('/csv/user-get/', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data || [];
  } catch (error) {
    console.error("Erro ao buscar dados do funcionário:", error);
    throw error;
  }
};


export const getActiveOpenCalcFiles = async () => {
  try {
    const response = await apiClient.get('/csv/opencalc/active/files/');
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const downloadFileById = async (fileId) => {
  try {
    const response = await apiClient.get(`/csv/data-files/${fileId}/download/`, {
      responseType: 'blob',
    });

    const headerLine = response.headers['content-disposition'];
    let filename = 'arquivo_baixado.csv';
    if (headerLine) {
        const filenameMatch = headerLine.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch.length > 1) {
            filename = filenameMatch[1];
        }
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Erro no download do arquivo:', error);
    alert('Não foi possível baixar o arquivo.');
    handleApiError(error);
  }
};

export function base64ToFile(base64String, fileName) {
      const byteString = atob(base64String);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const int8Array = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < byteString.length; i++) {
        int8Array[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([int8Array], { type: 'text/csv' });
      return new File([blob], fileName, { type: 'text/csv' });
    }
