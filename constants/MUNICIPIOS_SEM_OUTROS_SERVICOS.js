// Municípios onde não há ambulatório
export const MUNICIPIOS_ID_SUS_SEM_AMBULATORIO = [
  '230190',
  '352590',
  '320500',
  '231130',
  '150680',
  '251230'
];

// Municípios onde tem ambulatório, mas não conseguimos mostrar os dados
export const MUNICIPIOS_ID_SUS_SEM_DADOS_AMBULATORIO = [
  '150140',
  '351640',
  '431440',
  '292740',
  '315780',
  '320520',
  '261390',
  '250970',
  '220840'
];

// Municípios sem cards de ambulatório exibidos na página de resumo
export const MUNICIPIOS_ID_SUS_SEM_CARDS_AMBULATORIO = [
  ...MUNICIPIOS_ID_SUS_SEM_AMBULATORIO,
  ...MUNICIPIOS_ID_SUS_SEM_DADOS_AMBULATORIO
];

export const MUNICIPIOS_ID_SUS_SEM_REDUCAO_DE_DANOS = [
  '231130',
  '351640',
  '150140',
  '150680',
  '250970'
];

export const MUNICIPIOS_ID_SUS_SEM_CONSULTORIO_NA_RUA = [
  '230190',
  '351640',
  '231130',
  '315780',
  '280350',
  '231140',
  '270630',
  '230970',
  '251230',
  '261390',
  '250970'
];
export const MUNICIPIOS_ID_SUS_COM_OUTROS_RAPS_SEM_DADOS = [// Municípios que indicaram que possuem algum dos 3 serviços de Outros Serviços RAPS, mas não conseguimos mostrar
  '250970'
];