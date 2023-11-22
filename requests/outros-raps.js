import axios from 'axios';
import { API_SAUDE_MENTAL_URL } from '../constants/API_URL';
import { addQueryParamSeExiste } from '../utils/addQueryParamSeExiste';

const axiosInstance = axios.create({
  baseURL: `${API_SAUDE_MENTAL_URL}saude-mental`,
});

export const getAtendimentosConsultorioNaRua = async (municipioIdSus) => {
  try {
    const endpoint = '/consultorionarua?municipio_id_sus=' + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAtendimentosConsultorioNaRua12meses = async (municipioIdSus) => {
  try {
    const endpoint = '/consultorionarua12meses?municipio_id_sus=' + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAcoesReducaoDeDanos12meses = async (municipioIdSus) => {
  try {
    const endpoint = '/reducaodedanos12meses?municipio_id_sus=' + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAtendimentosAmbulatorioResumoUltimoMes = async (municipioIdSus) => {
  try {
    const endpoint = '/ambulatorio/atendimento-resumo-ultimomes?municipio_id_sus=' + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getPerfilAtendimentosAmbulatorio = async ({
  municipioIdSus,
  periodos
}) => {
  try {
    let endpoint = '/ambulatorio/usuario_perfil?municipio_id_sus=' + municipioIdSus;

    endpoint = addQueryParamSeExiste(endpoint, 'periodos', periodos);

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAtendimentosPorProfissional = async (municipioIdSus) => {
  try {
    const endpoint = '/ambulatorio/procedimento-por-profissional?municipio_id_sus=' + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAtendimentosTotal = async (municipioIdSus) => {
  try {
    let endpoint = '/ambulatorio/atendimento_resumo?municipio_id_sus=' + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const obterAcoesReducaoDeDanos = async ({
  municipioIdSus,
  estabelecimentos,
  periodos,
  ocupacoes
}) => {
  try {
    let endpoint = '/reducao-de-danos?municipio_id_sus=' + municipioIdSus;

    if (estabelecimentos !== undefined) {
      endpoint += `&estabelecimentos=${estabelecimentos}`;
    }

    if (periodos !== undefined) {
      endpoint += `&periodos=${periodos}`;
    }

    if (ocupacoes !== undefined) {
      endpoint += `&ocupacoes=${ocupacoes}`;
    }

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const obterOcupacoesReducaoDeDanos = async (municipioIdSus) => {
  try {
    const endpoint = `/reducao-de-danos/ocupacoes?municipio_id_sus=${municipioIdSus}`;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};
