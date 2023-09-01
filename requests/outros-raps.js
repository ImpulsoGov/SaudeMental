import axios from "axios";
import { API_SAUDE_MENTAL_URL } from "../constants/API_URL";

const axiosInstance = axios.create({
  baseURL: `${API_SAUDE_MENTAL_URL}saude-mental`,
});

export const getAtendimentosConsultorioNaRua = async (municipioIdSus) => {
  try {
    const endpoint = "/consultorionarua?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAtendimentosConsultorioNaRua12meses = async (municipioIdSus) => {
  try {
    const endpoint = "/consultorionarua12meses?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAcoesReducaoDeDanos = async (municipioIdSus) => {
  try {
    const endpoint = "/reducaodedanos?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAcoesReducaoDeDanos12meses = async (municipioIdSus) => {
  try {
    const endpoint = "/reducaodedanos12meses?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};

export const getAtendimentosAmbulatorioResumoUltimoMes = async (municipioIdSus) => {
  try {
    const endpoint = "/ambulatorio/atendimento-resumo-ultimomes?municipio_id_sus=" + municipioIdSus;

    const { data } = await axiosInstance.get(endpoint);

    return data;
  } catch (error) {
    console.log('error', error.response.data);
  }
};
