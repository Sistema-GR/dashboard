import { getAccessToken } from './token';
import { apiClient } from './apiService';

export default function usePersonService(){

  const routeJsonMapping = {
    'Results': `${apiClient.defaults.baseURL}/csv/process/percentual-gratificacao/`,
    'Calendar': `${apiClient.defaults.baseURL}/csv/process/dias-nao-contabilizados/`,
    'Profissional': `${apiClient.defaults.baseURL}/csv/process/filtered-funcionarios/`,
    'Groups': `${apiClient.defaults.baseURL}/csv/process/aprender-mais/`,
    'Steps': `${apiClient.defaults.baseURL}/csv/process/etapas-metas/`,
    'StageGroup': `${apiClient.defaults.baseURL}/csv/process/grupos-atualizado/`,
    'Frequency': `${apiClient.defaults.baseURL}/csv/process/frequencia/`,
    'Infrequency': `${apiClient.defaults.baseURL}/csv/process/motivos-infrequencia/`,
    'Resignation': `${apiClient.defaults.baseURL}/csv/process/demissoes/`,
    'Activities': `${apiClient.defaults.baseURL}/csv/process/atividades/`,
    'Service': `${apiClient.defaults.baseURL}/csv/process/tempo-atuacao/`,
    'Training': `${apiClient.defaults.baseURL}/csv/process/atividades/`,
    'General': `${apiClient.defaults.baseURL}/csv/process/dados-gerais/`,
    'Local': `${apiClient.defaults.baseURL}/csv/process/tipo-local/`,
    'Report': `${apiClient.defaults.baseURL}/csv/process/criterios/`
  };

  const loadPeopleData = async (route) => {
    try {
      const jsonUrl = routeJsonMapping[route];
      if (!jsonUrl) {
        throw new Error('URL não encontrada para a rota');
      }

      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado ou expirado');
      }

      const response = await fetch(jsonUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error('Formato inesperado de dados');
      }

      const columns = Object.keys(data[0]).map(key => ({ key, label: key }));
      const people = data.map(item => ({ ...item, matricula: item.matricula }));
      

      return { people, columns };
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      throw error;
    }
  };

  const saveRowData = async (person) => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado ou expirado');
      }

      if (!person.cpf) {
        throw new Error('CPF não encontrado nos dados da pessoa');
      }


      const response = await fetch(routeJsonMapping['Profissional'], {
        method: 'POST',  // Supondo que seja uma operação POST para salvar
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(person),
      });

      if (!response.ok) {
        console.error(`Erro HTTP: ${response.status} ao tentar salvar os dados`);
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const savedData = await response.json();



      return savedData;
    } catch (error) {
      console.error('Erro ao salvar os dados:', error);
      throw error;
    }
  };

  const saveRowDataToStorage = async (person) => {
    try {
      if (!person.cpf) {
        throw new Error('CPF não encontrado nos dados da pessoa');
      }


      const savedRowData = JSON.parse(localStorage.getItem('rowSave')) || {};

      savedRowData[person.cpf] = person;

      localStorage.setItem('rowSave', JSON.stringify(savedRowData));

    } catch (error) {
      console.error('Erro ao salvar os dados no localStorage:', error);
      throw error;
    }
  };

  const getMatriculasPorCPF = async (cpf, year) => {
    try {
        const jsonUrl = `${apiClient.defaults.baseURL}/csv/process/matriculas/${year}/${cpf}/`;
        const accessToken = await getAccessToken();
        if (!accessToken) throw new Error('Token de acesso não encontrado');

        const response = await fetch(jsonUrl, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Erro HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Erro ao buscar matrículas por CPF:', error);
        throw error;
    }
  };


  return {
    loadPeopleData,
    saveRowData,
    saveRowDataToStorage,
    routeJsonMapping,
    getMatriculasPorCPF
  };
}