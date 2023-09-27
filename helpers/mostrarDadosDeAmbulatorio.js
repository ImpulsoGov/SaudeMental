const MUNICIPIOS_ID_SUS_SEM_AMBULATORIO = [
  '230190',
  '352590',
  '320500'
];

const MUNICIPIOS_ID_SUS_SEM_DADOS_AMBULATORIO = [
  '150140',
  '351640',
  '431440',
  '292740',
  '315780',
  '320520',
  '230440'
];

export const mostrarCardsDeResumoAmbulatorio = (municipioIdSus) => {
  const MUNICIPIOS_ID_SUS_SEM_CARD_AMBULATORIO_RESUMO = [
    ...MUNICIPIOS_ID_SUS_SEM_AMBULATORIO,
    ...MUNICIPIOS_ID_SUS_SEM_DADOS_AMBULATORIO
  ];

  return !MUNICIPIOS_ID_SUS_SEM_CARD_AMBULATORIO_RESUMO.includes(municipioIdSus);
};

export const mostrarMensagemSemAmbulatorio = (municipioIdSus) => {
  return MUNICIPIOS_ID_SUS_SEM_AMBULATORIO.includes(municipioIdSus);
};

export const mostrarMensagemSemDadosAmbulatorio = (municipioIdSus) => {
  return MUNICIPIOS_ID_SUS_SEM_DADOS_AMBULATORIO.includes(municipioIdSus);
};
