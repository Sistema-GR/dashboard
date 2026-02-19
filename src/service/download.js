import { apiClient } from './apiService';
import { getAccessToken } from './token'; // Importa a função que obtém o token


// Função genérica para fazer o download do CSV
export const downloadCSV = async (endpoint, filename) => {
  try {
    const token = await getAccessToken();  // Obtém o token de acesso

    // Verifica se o token foi obtido com sucesso
    if (!token) {
      console.error('Erro: Token de acesso não encontrado.');
      return;
    }

    // Faz a requisição para a API com o token de acesso
    const response = await apiClient.get(endpoint, {
      headers: {
        Authorization: `Bearer ${token}`,  // Passando o token no cabeçalho
      },
      responseType: 'json',  // Espera dados em JSON
    });

    // Dados que serão exportados
    const data = response.data; // Supondo que seja um array de objetos com os dados
    const headers = Object.keys(data[0] || {}); // Usa as chaves do primeiro item como cabeçalhos, se existir

    // Converte os dados em formato CSV
    const csvRows = [];
    
    // Adiciona o cabeçalho
    csvRows.push(headers.join(','));

    // Adiciona os dados das linhas
    data.forEach(row => {
      const rowValues = headers.map(header => 
        row[header] === 0 || row[header] === false ? row[header] : (row[header] || '')
      );
       // Preenche com '' caso algum valor esteja ausente
      csvRows.push(rowValues.join(','));
    });

    // Cria um blob com o CSV e gera um link para download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const urlObject = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = urlObject;
    link.setAttribute('download', filename);  // Nome do arquivo
    document.body.appendChild(link);
    link.click();

    // Libera o objeto URL depois do download
    document.body.removeChild(link);
    window.URL.revokeObjectURL(urlObject);
  } catch (error) {
    console.error('Erro ao baixar o arquivo CSV:', error);
  }
};

// Funções específicas para cada endpoint
export const downloadCriteriosCSV = () => {
  downloadCSV('csv/process/criterios/', 'criterios.csv');
};

export const downloadTipoLocalCSV = () => {
  downloadCSV('csv/process/tipo-local/', 'tipo-local.csv');
};

export const downloadDadosGeraisCSV = () => {
  downloadCSV('csv/process/dados-gerais/', 'dados-gerais.csv');
};

export const downloadFuncoesGrupoCSV = () => {
  downloadCSV('csv/process/funcoes-grupo/', 'funcoes-grupo.csv');
};

export const downloadAprenderMaisCSV = () => {
  downloadCSV('csv/process/aprender-mais/', 'aprender-mais.csv');
};

export const downloadAtividadesCSV = () => {
  downloadCSV('csv/process/atividades/', 'atividades.csv');
};


export const downloadEtapasMetasCSV = () => {
  downloadCSV('csv/process/etapas-metas/', 'etapas-metas.csv');
};

export const downloadPercentualGratificacaoCSV = () => {
  downloadCSV('csv/process/percentual-gratificacao/', 'percentual-gratificacao.csv');
};

export const downloadDefinicaoEtapasCSV = () => {
  downloadCSV('csv/process/definicao-etapas/', 'definicao-etapas.csv');
};

export const downloadDiasNaoContabilizadosCSV = () => {
  downloadCSV('csv/process/dias-nao-contabilizados/', 'dias-nao-contabilizados.csv');
};

export const downloadDemissoesCSV = () => {
  downloadCSV('csv/process/demissoes/', 'demissoes.csv');
};

export const downloadFormacoesCSV = () => {
  downloadCSV('csv/process/formacoes/', 'formacoes.csv');
};

export const downloadFuncionariosCSV = () => {
  downloadCSV('csv/process/funcionarios/', 'funcionarios.csv');
};


export const downloadMotivosInfrequenciaCSV = () => {
  downloadCSV('csv/process/motivos-infrequencia/', 'motivos-infrequencia.csv');
};

export const downloadFrequenciaCSV = () => {
  downloadCSV('csv/process/frequencia/', 'frequencia.csv');
};

export const downloadGruposAtualizadoCSV = () => {
  downloadCSV('csv/process/grupos-atualizado/', 'grupos-atualizado.csv');
};

export const downloadTempoAtuacaoCSV = () => {
  downloadCSV('csv/process/tempo-atuacao/', 'tempo-atuacao.csv');
};

export const downloadFilteredFuncionariosCSV = () => {
  downloadCSV('csv/process/filtered-funcionarios/', 'filtered-funcionarios.csv');
};

export const downloadErrosGruposCSV = () => {
  downloadCSV('csv/process/erros-grupos/', 'erros-grupos.csv');
};
