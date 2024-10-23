const columnRenamingMap = {
    Results: {
      nome_unidade: 'Nome Unidade',
      gr_bruto_etapa_1: 'Esperada Etapa 1',
      gr_final_etapa_1: 'Atingido',
      gr_bruto_etapa_2: 'Esperada Etapa 2',
      gr_final_etapa_2: 'Atingido',
      gr_bruto_etapa_3: 'Esperada Etapa 3',
      gr_final_etapa_3: 'Atingido',
      
    },
    Calendar: {
      descricao_dia: 'Descrição',
      dias_nao_contabilizados: 'Dias Não Contabilizados',
    },
    Profissional: {
      matricula: 'Matrícula',
      nome: 'Nome',
      admissao: 'Admissão',
      cpf: 'CPF',
      cod_local_alocacao: 'Código Local Alocação',
      nome_local_alocacao: 'Nome Local Alocação',
      cargo: 'Cargo',
      vinculo: 'Vínculo',
      situacao: 'Situação',
      inicio_atividade_local: 'Início Atividade Local',
      cod_unidade: 'Código Unidade',
      nome_unidade: 'Nome Unidade',
      cod_disciplina: 'Código Disciplina',
      nome_disciplina: 'Nome Disciplina',
      fim_atividade_local: 'Fim Atividade Local',
      hora_aula: 'Hora Aula',
      hora_atividade: 'Hora Atividade',
      hora_termo: 'Hora Termo',
      data_inicial_trabalho: 'Data Inicial Trabalho',
      data_final_trabalho: 'Data Final Trabalho',
      percentual_idem_rede_1: 'Percentual Idem Rede 1',
      percentual_idem_rede_2: 'Percentual Idem Rede 2',
      percentual_idem_rede_3: 'Percentual Idem Rede 3',
      dias_de_atuacao_ue: 'Dias de Atuação UE',
      total_dias_de_atuacao: 'Total Dias de Atuação',
      percentual_carga_horaria_ue: 'Percentual Carga Horária UE',
      tipo_unidade: 'Tipo Unidade',
      descricao_tipo_unidade: 'Descrição Tipo Unidade',
      tipo_unidade_funcao: 'Tipo Unidade Função',
      grupo_gr: 'Grupo GR',
      gr_unidade_max: 'GR Unidade Máximo',
      gr_rede_max: 'GR Rede Máximo',
      tem_gratificacao_unidade: 'Tem Gratificação Unidade',
      atua_na_etapa_1: 'Atua na Etapa 1',
      atua_na_etapa_2: 'Atua na Etapa 2',
      atua_na_etapa_3: 'Atua na Etapa 3',
      percentual_idem_etapa_1: 'Percentual Idem Etapa 1',
      percentual_idem_etapa_2: 'Percentual Idem Etapa 2',
      percentual_idem_etapa_3: 'Percentual Idem Etapa 3',
      valor_gr_unidade: 'Valor GR Unidade',
      valor_gr_rede: 'Valor GR Rede',
      valor_total: 'Valor Total'
  },
  Groups: {
      grupo: 'Grupo',
      gr_unidade_max: 'GR Unidade Máximo',
      gr_rede_max: 'GR Rede Máximo',
      etapa_1: 'Etapa 1',
      etapa_2: 'Etapa 2',
      etapa_3: 'Etapa 3',
      valor_etapa: 'Valor Etapa',
      valor_rede: 'Valor Rede'
  },
  Steps: {
      nome_unidade: 'Nome Unidade',
      nome_unidade_bi: 'Nome Unidade BI',
      tem_anos_iniciais_1: 'Tem Anos Iniciais 1',
      tem_anos_iniciais_2: 'Tem Anos Iniciais 2',
      tem_anos_finais: 'Tem Anos Finais',
      tipo: 'Tipo'
  },
  StageGroup: {
      tipo_unidade: 'Tipo Unidade',
      funcao: 'Função',
      tipo_unidade_funcao: 'Tipo Unidade Função',
      grupo: 'Grupo',
      atua_na_etapa_1: 'Atua na Etapa 1',
      atua_na_etapa_2: 'Atua na Etapa 2',
      atua_na_etapa_3: 'Atua na Etapa 3'
  },
  Frequency: {
      matricula: 'Matrícula',
      nome: 'Nome',
      admissao: 'Admissão',
      vinculo: 'Vínculo',
      motivo: 'Motivo',
      local: 'Local',
      desc_local: 'Descrição Local',
      inicio_afastamento: 'Início Afastamento',
      fim_afastamento: 'Fim Afastamento',
      cd_cargo: 'Código Cargo',
      cargo: 'Cargo',
      doc_legal: 'Documento Legal',
      ano_de_inicio: 'Ano de Início',
      qtd_dias_afastados: 'Quantidade Dias Afastados',
      dias_uteis_ausentes_na_licenca: 'Dias Úteis Ausentes na Licença',
      dias_uteis: 'Dias Úteis',
      contabiliza: 'Contabiliza',
      total_dias_afastados_por_profissional_ano: 'Total Dias Afastados por Profissional no Ano',
      percentual_frequencia: 'Percentual de Frequência',
      percentual_frequencia_ajustado: 'Percentual de Frequência Ajustado',
      cpf: 'CPF'
  },
  Infrequency: {
    motivo: 'Motivo',
    contabiliza: 'Conabiliza?',
},
  Resignation: {
      matricula: 'Matrícula',
      nome: 'Nome',
      admissao: 'Admissão',
      demissao: 'Demissão',
      cpf: 'CPF',
      causa: 'Causa',
      cargo: 'Cargo',
      vinculo: 'Vínculo',
      situacao: 'Situação',
      documento_decreto: 'Documento Decreto'
  },
  Activities: {
      matricula: 'Matrícula',
      nome: 'Nome',
      nome_unidade: 'Nome Unidade',
      sim: 'Sim',
      nao: 'Não',
      observacao: 'Observação',
      exerceu_suas_atividades_na_unidade: 'Exerceu suas atividades na unidade?',
      recebe_atividade: 'Recebe Atividade',
      percentual_atividade: 'Percentual Atividade'
  },
  Service: {
      matricula: 'Matrícula',
      servidor: 'Servidor',
      recebe_formacao: 'Recebe Formação?'
  },
  Training: {
      matricula: 'Matrícula',
      nome: 'Nome',
      nome_unidade: 'Nome Unidade',
      sim: 'Sim',
      nao: 'Não',
      observacao: 'Observação',
      exerceu_suas_atividades_na_unidade: 'Exerceu suas atividades na unidade?',
      recebe_atividade: 'Recebe Atividade',
      percentual_atividade: 'Percentual de Atividade'
  },
  Report: {
      matricula: 'Matrícula',
      cpf: 'CPF',
      nome: 'Nome',
      cargo: 'Cargo',
      vinculo: 'Vínculo',
      situacao: 'Situação',
      demissao: 'Demissão',
      data_inicio: 'Data Início',
      data_fim: 'Data Fim',
      percentual_frequencia: 'Percentual de Frequência',
      percentual_frequencia_ajustado: 'Percentual de Frequência Ajustado',
      tempo_atuacao: 'Tempo de Atuação',
      formacoes: 'Formações',
      percentual_formacao: 'Percentual de Formação',
      recebe_atividade: 'Recebe Atividade',
      percentual_atividade: 'Percentual de Atividade',
      percentual_total: 'Percentual Total',
      valor_bruto: 'Valor Bruto',
      valor_total: 'Valor Total'
  }
};

const currencyKeys = ['valor_total', 'valor_bruto', 'gr_unidade_max', 'gr_rede_max', 'valor_gr_unidade', 'valor_gr_rede'];
const dateKeys = ['data_inicio', 'data_fim', 'admissao', 'demissao', 'inicio_afastamento', 'fim_afastamento', 'dias_nao_contabilizados', 'inicio_atividade_local', 'fim_atividade_local', 'data_inicial_trabalho', 'data_final_trabalho'];
const boleanKeys = ['contabiliza', 'tem_gratificacao_unidade', 'atua_na_etapa_1', 'atua_na_etapa_2', 'atua_na_etapa_3', 'tem_anos_iniciais_1', 'tem_anos_iniciais_2', 'tem_anos_finais', 'sim', 'nao', 'exerceu_suas_atividades_na_unidade', 'recebe_atividade', 'recebe_formacao', 'percentual_atividade'  ];  

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

// Função para formatar booleanos como "Sim" ou "Não"
function formatBoolean(value) {
  return value ? 'Sim' : 'Não';
}

export function renameColumns(columns, route) {
  const renamingMap = columnRenamingMap[route] || {};
  return columns.map(column => {
    const newColumn = {
      ...column,
      label: renamingMap[column.key] || column.label,
    };

    // Aplica formatação de moeda
    if (currencyKeys.includes(newColumn.key)) {
      newColumn.format = (value) => formatCurrency(value);
    }

    // Aplica formatação de data
    if (dateKeys.includes(newColumn.key)) {
      newColumn.format = (value) => formatDate(value);
    }

    // Aplica formatação de booleano para "Sim" ou "Não"
    if (boleanKeys.includes(newColumn.key)) {
      newColumn.format = (value) => formatBoolean(value);
    }

    return newColumn;
  });
}
