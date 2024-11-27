import { getAccessToken } from './token';

export default function usePersonService() {
  const BASE_URL = "http://10.203.2.158:8000/csv";

  const routeJsonMapping = {
    'Results': `${BASE_URL}/process/percentual-gratificacao/`,
    'Calendar': `${BASE_URL}/process/dias-nao-contabilizados/`,       
    'Profissional': `${BASE_URL}/process/funcionarios/`,              
    'Groups': `${BASE_URL}/process/aprender-mais/`,
    'Steps': `${BASE_URL}/process/etapas-metas/`,
    'StageGroup': `${BASE_URL}/process/funcoes-grupo/`,
    'Frequency': `${BASE_URL}/process/frequencia/`,                   
    'Infrequency': `${BASE_URL}/process/motivos-infrequencia/`,       
    'Resignation': `${BASE_URL}/process/demissoes/`,                  
    'Activities': `${BASE_URL}/process/atividades/`,                  
    'Service': `${BASE_URL}/process/formacoes/`, 
    'Training': `${BASE_URL}/process/atividades/`,                     
    'General': `${BASE_URL}/process/dados-gerais/`,
    'Local': `${BASE_URL}/process/tipo-local/`,
    'Report': `${BASE_URL}/process/criterios/`
  };

  const loadPeopleData = async (route) => {
    try {
      const jsonUrl = routeJsonMapping[route];
      if (!jsonUrl) {
        throw new Error('URL não encontrada para a rota');
      }

      // Obtém o token de acesso
      const accessToken = await getAccessToken();
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado ou expirado');
      }

      // Adiciona o token de acesso nos headers da requisição
      const response = await fetch(jsonUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        console.error(`Erro HTTP: ${response.status} ao tentar acessar ${jsonUrl}`);
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();

      console.log(`Dados carregados da rota ${route}:`, data);

      if (!Array.isArray(data)) {
        console.error('Erro: Formato inesperado de dados. Esperado um array de objetos.', data);
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

  const saveRowDataToStorage = async (person) => {
    try {
      if (!person.cpf) {
        throw new Error('CPF não encontrado nos dados da pessoa');
      }

      console.log(`Salvando dados do usuário com CPF: ${person.cpf} no localStorage`);

      const savedRowData = JSON.parse(localStorage.getItem('rowSave')) || {};

      // Usa o CPF como chave para armazenar os dados da pessoa
      savedRowData[person.cpf] = person;

      // Salva os dados atualizados de volta no localStorage
      localStorage.setItem('rowSave', JSON.stringify(savedRowData));

      console.log('Dados salvos com sucesso no localStorage:', person);
    } catch (error) {
      console.error('Erro ao salvar os dados no localStorage:', error);
      throw error;
    }
  };

  return {
    loadPeopleData,
    saveRowDataToStorage,
    routeJsonMapping
  };
}
