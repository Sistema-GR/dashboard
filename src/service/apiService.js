import axios from 'axios';
import { getAccessToken, setupAxiosInterceptors } from './token';

// Configuração do axios
const apiClient = axios.create({
  baseURL: 'http://10.203.3.46:8000/',  
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configuração dos interceptores de requisição
setupAxiosInterceptors(apiClient);

// Função genérica para tratamento de erross
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
    const token = await getAccessToken();
    const formData = new FormData();
    formData.append('funcionarios', funcionariosFile);
    formData.append('demissoes', demissoesFile);
    formData.append('frequencia', frequenciaFile);
    formData.append('atividades', atividadesFile);
    formData.append('tipoLocal', tipoLocalFile);
    formData.append('dadosGerais', atividadesFile);
    formData.append('funcoesGruposEtapas', funcoesGruposEtapasFile);
    formData.append('aprenderMais', aprenderMaisFile);
    formData.append('etapasMetas', etapasMetasFile);
    formData.append('uesPercGr', uesPercGrFile);
    formData.append('definicaoEtapas', definicaoEtapasFile);
    formData.append('formacoes', formacoesFile);
    formData.append('motivosInfrequencia', motivosInfrequenciaFile);
    formData.append('dias_nao_contabilizados', diasNaoContabilizadosFile);

    fetch('/csv/process/unified-upload/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
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


export const getActiveCalculusFiles = () => {
  return apiClient.get('/csv/api/calculus/active/files/');
};

export const downloadFileById = (fileId) => {
  const downloadUrl = `${apiClient.defaults.baseURL}/csv/api/data-files/${fileId}/download/`;
  const link = document.createElement('a');
  link.href = downloadUrl;

  apiClient.get(`/csv/api/data-files/${fileId}/download/`, {
    responseType: 'blob',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    }
  }).then(response => {
    const headerLine = response.headers['content-disposition'];
    let filename = 'downloaded_file.csv';
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
  }).catch(error => {
    console.error('Erro no download do arquivo:', error);
    alert('Não foi possível baixar o arquivo.');
  });
};