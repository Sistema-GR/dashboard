import axios from 'axios';
import { getAccessToken } from './token'; // Importa a função que obtém o token

// Função para fazer o download do CSV
export const downloadCSV = async () => {
  try {
    const token = await getAccessToken();  // Obtém o token de acesso

    // Verifica se o token foi obtido com sucesso
    if (!token) {
      console.error('Erro: Token de acesso não encontrado.');
      return;
    }

    // Faz a requisição para a API com o token de acesso
    const response = await axios.get('http://127.0.0.1:8000/csv/process/criterios/', {
      headers: {
        Authorization: `Bearer ${token}`,  // Passando o token no cabeçalho
      },
      responseType: 'json',  // Espera dados em JSON
    });

    // Dados que serão exportados
    const data = response.data; // Supondo que seja um array de objetos com os dados
    const headers = [
      'matricula', 'cpf', 'nome', 'cargo', 'vinculo', 'situacao', 'demissao', 'data_inicio',
      'data_fim', 'percentual_frequencia', 'percentual_frequencia_ajustado', 'tempo_atuacao',
      'formacoes', 'percentual_formacao', 'recebe_atividade', 'percentual_atividade',
      'percentual_total', 'valor_bruto', 'valor_total'
    ];

    // Converte os dados em formato CSV
    const csvRows = [];
    
    // Adiciona o cabeçalho
    csvRows.push(headers.join(','));

    // Adiciona os dados das linhas
    data.forEach(row => {
      const rowValues = headers.map(header => row[header] || ''); // Preenche com '' caso algum valor esteja ausente
      csvRows.push(rowValues.join(','));
    });

    // Cria um blob com o CSV e gera um link para download
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'criterios.csv');  // Nome do arquivo
    document.body.appendChild(link);
    link.click();

    // Libera o objeto URL depois do download
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erro ao baixar o arquivo CSV:', error);
  }
};
