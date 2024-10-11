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
      'Report': `${BASE_URL}/data/criterios.json`

      
    };
  
    const loadPeopleData = async (route) => {
      const jsonUrl = routeJsonMapping[route];
      if (!jsonUrl) throw new Error('URL não encontrada para a rota');
  
      const response = await fetch(jsonUrl);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
  
      const data = await response.json();
      if (!Array.isArray(data.data)) throw new Error('Formato inesperado de dados');
  
      const columns = Object.keys(data.data[0]).map(key => ({ key, label: key }));
      const people = data.data.map(item => ({ ...item, matricula: item.matricula }));
  
      return { people, columns };
    };
  
    const saveRowDataToStorage = async (person) => {
      const savedRowData = JSON.parse(localStorage.getItem('rowSave')) || {};
      savedRowData[person.matricula] = person;
      localStorage.setItem('rowSave', JSON.stringify(savedRowData));
    };
  
    return {
      loadPeopleData,
      saveRowDataToStorage
    };
  }
  