import axios from 'axios';
import { getAccessToken, setupAxiosInterceptors } from './token';

// Configuração do axios
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/',  
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
  try {
    const token = await getAccessToken();
    const formData = new FormData();
    formData.append('funcionarios', funcionariosFile);
    formData.append('demissoes', demissoesFile);
    formData.append('frequencia', frequenciaFile);
    formData.append('atividades', atividadesFile);
    formData.append('tipoLocal', tipoLocalFile);
    formData.append('dadosGerais', atividadesFile);
    formData.append('funcoesGruposEtapas', funcoesGruposEtapasFile);
    /*  process/funcionarios/",
        atividades: "/process/atividades/",
        tipoLocal: "/process/tipo-local/",
        dadosGerais: "/process/dados-gerais/",
        funcoesGruposEtapas: "/process/funcoes-grupo/",
        aprenderMais: "/process/aprender-mais/",
        etapasMetas: "/process/etapas-metas/",
        uesPercGr: "/process/percentual-gratificacao/",
        definicaoEtapas: "/process/definicao-etapas/",
        diasNaoContabilizados: "/process/dias-nao-contabilizados/",
        demissoes: "/process/demissoes/",
        formacoes: "/process/formacoes/",
        motivosInfrequencia: "/process/motivos-infrequencia/",
        frequencia: "/process/frequencia/"*/
    // ... append all other required files
    formData.append('dias_nao_contabilizados', diasNaoContabilizadosFile);

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