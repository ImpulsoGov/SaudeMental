import { API_URL } from "../constants/API_URL";

const getRequestOptions = { method: 'GET', redirect: 'follow' };

export const getAtendimentosConsultorioNaRua = async (municipioIdSus) => {
  try {
    const url = API_URL
      + "saude-mental/consultorionarua?municipio_id_sus="
      + municipioIdSus;

    const response = await fetch(url, getRequestOptions);
    const atendimentos = await response.json();

    return atendimentos;
  } catch (error) {
    console.log('error', error);
  }
};

export const getAtendimentosConsultorioNaRua12meses = async (municipioIdSus) => {
  try {
    const url = API_URL
      + "saude-mental/consultorionarua12meses?municipio_id_sus="
      + municipioIdSus;

    const response = await fetch(url, getRequestOptions);
    const atendimentos12meses = await response.json();

    return atendimentos12meses;
  } catch (error) {
    console.log('error', error);
  }
};

export const getAcoesReducaoDeDanos = async (municipioIdSus) => {
  try {
    const url = API_URL
      + "saude-mental/reducaodedanos?municipio_id_sus="
      + municipioIdSus;

    const response = await fetch(url, getRequestOptions);
    const acoes = await response.json();

    return acoes;
  } catch (error) {
    console.log('error', error);
  }
};

export const getAcoesReducaoDeDanos12meses = async (municipioIdSus) => {
  try {
    const url = API_URL
      + "saude-mental/reducaodedanos12meses?municipio_id_sus="
      + municipioIdSus;

    const response = await fetch(url, getRequestOptions);
    const acoes12meses = await response.json();

    return acoes12meses;
  } catch (error) {
    console.log('error', error);
  }
};
