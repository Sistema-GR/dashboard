export default function usePersonService() {
  const BASE_URL = "http://localhost:8000/csv";

  const routeJsonMapping = {
    'Results': `${BASE_URL}/process/percentual-gratificacao/`,
    'Calendar': `${BASE_URL}/process/dias-nao-contabilizados/`,       
    'Profissional': `${BASE_URL}/process/funcionarios/`,              
    'Groups': `${BASE_URL}/process/valores-grupo/`,
    'Steps': `${BASE_URL}/process/etapas-metas/`,
    'StageGroup': `${BASE_URL}/process/funcoes-grupo/`,
    'Frequency': `${BASE_URL}/process/frequencia/`,                   
    'Infrequency': `${BASE_URL}/process/motivos-infrequencia/`,       
    'Resignation': `${BASE_URL}/process/demissoes/`,                  
    'Activities': `${BASE_URL}/process/atividades/`,                  
    'Service': `${BASE_URL}/process/formacoes/`, 
    'Training': `${BASE_URL}/process/formacoes/`,                     
    'General': `${BASE_URL}/process/dados-gerais/`,
    'Local': `${BASE_URL}/process/tipo-local/`,
    'Report': `${BASE_URL}/process/criterios/`
  };

  const loadPeopleData = async (route) => {
    try {
      console.log(`Iniciando o carregamento de dados para a rota: ${route}`);

      const jsonUrl = routeJsonMapping[route];
      if (!jsonUrl) {
        console.error(`Erro: URL não encontrada para a rota ${route}`);
        throw new Error('URL não encontrada para a rota');
      }

      console.log(`Fazendo requisição para a URL: ${jsonUrl}`);
      const response = await fetch(jsonUrl);

      if (!response.ok) {
        console.error(`Erro HTTP: ${response.status} ao tentar acessar ${jsonUrl}`);
        throw new Error(`Erro HTTP: ${response.status}`);
      }

      const data = await response.json();
      console.log('Dados recebidos com sucesso:', data);

      // Verifica se os dados são um array
      if (!Array.isArray(data)) {
        console.error('Erro: Formato inesperado de dados. Esperado um array de objetos.', data);
        throw new Error('Formato inesperado de dados');
      }

      // Mapeia as colunas dinamicamente com base nas chaves do primeiro objeto do array
      const columns = Object.keys(data[0]).map(key => ({ key, label: key }));

      // Processa os dados recebidos
      const people = data.map(item => ({ ...item, matricula: item.matricula }));

      console.log('Dados processados com sucesso:', { people, columns });

      return { people, columns };
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
      throw error; // Re-throw para que a chamada original lide com o erro
    }
  };

  const saveRowDataToStorage = async (person) => {
    try {
      console.log(`Salvando dados do usuário com matrícula: ${person.matricula} no localStorage`);
      const savedRowData = JSON.parse(localStorage.getItem('rowSave')) || {};
      savedRowData[person.matricula] = person;
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
