const columnRenamingMap = {
    Results: {
      nome_local: 'Nome Unidade',
      gratificacao_bruto_etapa_1: 'Esperada Etapa 1',
      gratificacao_final_etapa_1: 'Atingido',
      gratificacao_bruto_etapa_2: 'Esperada Etapa 2',
      gratificacao_final_etapa_2: 'Atingido',
      gratificacao_bruto_etapa_3: 'Esperada Etapa 3',
      gratificacao_final_etapa_3: 'Atingido',
      
    },
    Calendar: {
      descricao: 'Descrição',
      dia: 'Dias Não Contabilizados',
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
      hora_aula: 'Carga Horária Aula',
      hora_atividade: 'Carga Horária Atividade',
      hora_termo: 'Carga Horária Termo',
      disciplinas_atualizadas: 'Disciplinas Atualizadas',
      tipo_unidade_funcao: 'Tipo de Unidade - Função',
      tipo_unidade: 'Tipo de Unidade',
      descricao_tipo_unidade: 'Descrição Tipo Local',
      data_inicial_trabalho: 'Data Inicial a Considerar',
      data_final_trabalho: 'Data Final a Considerar',
      dias_de_atuacao_ue: 'Dias de Atuação / UE',
      total_dias_de_atuacao: 'Dias de Atuação Total',
      percentual_carga_horaria_ue: 'Percentual Carga Horária',
      grupo_gr: 'Grupo',
      gr_unidade_max: 'Valor Máximo Unidade',
      gr_rede_max: 'Valor Máximo Rede',
      tem_gratificacao_unidade: 'Tem Gratificação Unidade',
      atua_na_etapa_1: 'Atua na Etapa 1',
      atua_na_etapa_2: 'Atua na Etapa 2',
      atua_na_etapa_3: 'Atua na Etapa 3',
      percentual_idem_rede_1: 'IDEM Rede Etapa 1',
      percentual_idem_rede_2: 'IDEM Rede Etapa 2',
      percentual_idem_rede_3: 'IDEM Rede Etapa 3',
      percentual_idem_etapa_1: 'IDEM Unidade Etapa 1',
      percentual_idem_etapa_2: 'IDEM Unidade Etapa 2',
      percentual_idem_etapa_3: 'IDEM Unidade Etapa 3',
      valor_gr_unidade: 'Valor Gratificação Unidade',
      valor_gr_rede: 'Valor Gratificação Rede',
      valor_total: 'Valor Gratificação Total',
  },
  
  Groups: {
      turma: 'Turma',
      etapa_1: 'Etapa 1',
      etapa_2: 'Etapa 2',
      etapa_3: 'Etapa 3',
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
      etapa_1: 'Atua na Etapa 1',
      etapa_2: 'Atua na Etapa 2',
      etapa_3: 'Atua na Etapa 3'

      // classe_local: 'Tipo Local',
      // disciplinas_atualizadas: 'Função',
      // funcao_tipo_local: 'Tipo Unidade Função',
      // grupo: 'Grupo',
      // atua_na_etapa_1: 'Atua na Etapa 1',
      // atua_na_etapa_2: 'Atua na Etapa 2',
      // atua_na_etapa_3: 'Atua na Etapa 3'
  },
  Frequency: {
      matricula: 'Matrícula',
      nome: 'Nome',
      admissao: 'Admissão',
      vinculo: 'Vínculo',
      motivo: 'Motivo',
      local: 'Local',
      descricao_local: 'Descrição Local',
      inicio_afastamento: 'Início Afastamento',
      fim_afastamento: 'Fim Afastamento',
      codigo_cargo: 'Código Cargo',
      cargo: 'Cargo',
      funcao: 'Função',
      documento_legal: 'Documento Legal',
      ano: 'Ano',
      dias_afastado: 'Quantidade Dias Afastados',
      dias_ausentes: 'Dias Ausentes',
      dias_trabalho: 'Dias Úteis',
      contabiliza: 'Contabiliza',
      dias_para_bonus: 'Dias para Bônus',
      percentual_frequencia: 'Percentual de Frequência',
      percentual_criterios: 'Percentual Críterios',
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
      unidade: 'Nome Unidade',
      sim: 'Sim',
      nao: 'Não',
      observacao: 'Observação',
      cumpriu_atividades: 'Cumpriu Atividades?',
      mais_malvado: 'Mais Malvado',
      percentual_atividades: 'Percentual Atividades'
  },
  Service: {
    matricula: 'Matrícula',
    unidade_escolar: 'Unidade Escolar',
    servidor: 'Servidor',
    area: 'Área',
    horas_mensai: 'Horas Mensais',
    recebe_gratificacao: 'Recebe Gratificação',
    matricula_servidor: 'Matrícula do Servidor',
    sera_corrigido: 'Será Corrigido',
    valor_original: 'Valor Original',
    percentual_formacoes: 'Percentual de Formações',
  },
  Training: {
      matricula: 'Matrícula',
      nome: 'Nome',
      unidade: 'Nome Unidade',
      sim: 'Sim',
      nao: 'Não',
      observacao: 'Observação',
      cumpriu_atividades: 'Cumpriu Atividades?',
      mais_malvado: 'Mais Malvado',
      percentual_atividades: 'Percentual Atividades'
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
      valor_total: 'Valor Total',
      motivo_nao_recebimento: 'Motivo não recebimento',
      recebe_gratificacao: 'Recebe?',
      motivo: 'Motivo', 
      faixa_pagamento: 'Faixa Pagamento',
      desconto: 'Desconto'
  }
};

const currencyKeys = ['valor_total', 'valor_bruto', 'gr_unidade_max', 'gr_rede_max', 'valor_gr_unidade', 'valor_gr_rede', 'valor_etapa', 'valor_rede', 'valor_unidade_maximo', 'valor_rede_maximo', 'valor_gratificacao_unidade', 'valor_gratificacao_rede', 'valor_gratificacao_registro', 'valor_bruto_total', 'valor_a_pagar_criterios', 'desconto'];
const dateKeys = ['dia', 'data_inicio', 'data_fim', 'admissao', 'demissao', 'inicio_afastamento', 'fim_afastamento', 'dias_nao_contabilizados', 'inicio_atividade_local', 'fim_atividade_local', 'data_inicial_trabalho', 'data_final_trabalho', 'demissoes', 'inicio_ajustado', 'fim_ajustado', 'inicio_considerar', 'final_considerar'];
const boleanKeys = ['contabiliza', 'tem_gratificacao_unidade', 'atua_na_etapa_1', 'atua_na_etapa_2', 'atua_na_etapa_3', 'tem_anos_iniciais_1', 'tem_anos_iniciais_2', 'tem_anos_finais', 'sim', 'nao', 'exerceu_suas_atividades_na_unidade', 'recebe_atividade', 'recebe_formacao', 'percentual_atividade', 'atividades', 'formacoes','tempo_atuacao', 'criterio_tempo_atuacao', 'cumpriu_atividades', 'mais_malvado', 'recebe_gratificacao'];  

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function formatDate(value) {
  if (!value) return '';
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
}

// Função para formatar booleanos como 'Sim' ou 'Não'
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

    // Aplica formatação de booleano para 'Sim' ou 'Não'
    if (boleanKeys.includes(newColumn.key)) {
      newColumn.format = (value) => formatBoolean(value);
    }

    return newColumn;
  });
}
