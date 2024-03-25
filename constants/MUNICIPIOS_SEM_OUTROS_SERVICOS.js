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
  '261390'
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
  '150680'
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
  '261390'
];
